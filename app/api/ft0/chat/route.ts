import { detectRecruiterTypeFixed } from '@/lib/recruiter-prompts-fixed';
import { detectRecruiterTypeFT0Direct, getFT0DirectSystemPrompt } from '@/lib/ft0-direct-prompts';
import {
  detectConversationMode,
  checkAbuseLimit,
  estimateTokens,
  calculateConversationCost,
  generateAbuseLimitMessage,
} from '@/lib/abuse-prevention';
import {
  checkChatInjection,
  generateInjectionBlockedMessage,
  logInjectionAttempt,
  checkInjectionRateLimit,
} from '@/lib/chat-injection-prevention';
import { parseMarkdownResponse } from '@/lib/response-formatter';
import { isArchitectureQuestion, getArchitectureBoundaryResponse } from '@/lib/architecture-boundary';

/**
 * FT0 Chat API Route with Ollama Support
 * 
 * Configuration:
 * - Primary: Ollama (localhost:11434) - ZERO COST
 * - Fallback 1: Manifest API with Haiku 4.5 ($0.80/$2.40 per 1M tokens)
 * - Fallback 2: Claude Haiku API (cost-optimized)
 * - GitHub auth: Personal Access Token (PAT) optional for rate limiting
 * 
 * Abuse Prevention:
 * - "open_to_work" mode: Max 5 questions
 * - "hiring" mode: Max 10 questions
 * - Cost tracking per conversation (Ollama = $0, others tracked)
 * 
 * Ollama Models Available:
 * - deepseek-r1:7b (recommended - 7.6B reasoning, 4.6GB)
 * - qwen2.5:32b (powerful - 32.8B parameters, 19.8GB)
 * - llama3.2:3b (lightweight - 3.2B, 2.0GB)
 * - qwen:latest (compact - 4B, 2.3GB)
 * - llava:7b (vision-capable - 7B, 4.7GB)
 * - deepseek-r1:8b (reasoning - 8.2B, 5.2GB)
 */
export async function POST(req: Request) {
  try {
    const { messages, conversationId } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'No messages provided' },
        { status: 400 }
      );
    }

    // Get the latest user message to detect recruiter type
    const latestUserMessage = messages[messages.length - 1];
    const userText = typeof latestUserMessage.content === 'string'
      ? latestUserMessage.content
      : '';

    // ========== SECURITY: Check for chat injection attempts ==========
    const injectionCheck = checkChatInjection(userText);
    if (injectionCheck.isSuspicious) {
      logInjectionAttempt(conversationId, userText, injectionCheck, 'unknown');

      if (injectionCheck.action === 'block') {
        // Block high-risk injections completely
        return Response.json({
          response: generateInjectionBlockedMessage(injectionCheck),
          recruiterType: 'system',
          conversationId,
          model: 'security',
          warning: 'injection_attempt_blocked',
          injectionRiskLevel: injectionCheck.riskLevel,
        });
      }

      // Check rate limit (allow 3 injection attempts in 5 minutes)
      if (checkInjectionRateLimit(conversationId)) {
        return Response.json({
          response: 'Multiple suspicious requests detected. For security, this conversation has been paused. Please start a new conversation or contact: https://github.com/imKrisK',
          recruiterType: 'system',
          conversationId,
          model: 'security',
          warning: 'injection_rate_limit_exceeded',
        });
      }
    }
    // ===================================================================

    // Detect conversation mode (open_to_work vs hiring)
    const conversationMode = detectConversationMode(userText);

    // Check abuse limits
    const abuseCheck = checkAbuseLimit(messages, conversationMode);
    if (!abuseCheck.allowed) {
      // Return friendly error message with contact options
      return Response.json({
        response: generateAbuseLimitMessage(abuseCheck),
        recruiterType: 'system',
        conversationId,
        model: 'haiku-4.5',
        warning: 'conversation_limit_reached',
        questionCount: abuseCheck.questionCount,
        conversationMode: abuseCheck.mode,
      });
    }

    // Estimate token usage for cost tracking
    const estimatedTokens = estimateTokens(messages);
    const estimatedCost = calculateConversationCost(estimatedTokens);

    // Log cost for monitoring (server-side only)
    console.log(`[Cost Tracking] ConversationID: ${conversationId}, Mode: ${conversationMode}, Tokens: ${estimatedTokens}, Cost: $${estimatedCost.toFixed(6)}`);

    // CHECK: Architecture question - return honest boundary response
    if (isArchitectureQuestion(userText)) {
      console.log('[Architecture Boundary] Detected infrastructure/architecture question. Returning honest response.');
      const boundaryResponse = getArchitectureBoundaryResponse('honest');
      const structuredResponse = parseMarkdownResponse(boundaryResponse);
      
      return Response.json({
        response: boundaryResponse,
        structuredResponse: structuredResponse,
        recruiterType: 'architecture-boundary',
        conversationId,
        model: 'ft0-honest-boundary',
        conversationMode,
      });
    }

    // Detect recruiter type from user message (using DIRECT prompts for better Ollama compatibility)
    const recruiterType = detectRecruiterTypeFT0Direct(userText);
    const systemPrompt = getFT0DirectSystemPrompt(recruiterType);

    // For Ollama: Inject system prompt into first user message instead of using system role
    // (deepseek-r1 doesn't respect system role well)
    const userMessagesOnly = messages.map((msg: any) => ({
      role: msg.role,
      content: typeof msg.content === 'string' ? msg.content : msg.content[0]?.text || '',
    }));

    // Inject system prompt into first user message
    if (userMessagesOnly.length > 0 && userMessagesOnly[0].role === 'user') {
      userMessagesOnly[0].content = systemPrompt + '\n\n' + userMessagesOnly[0].content;
    } else {
      // If no user messages yet, create one with just the prompt + instruction
      userMessagesOnly.unshift({
        role: 'user',
        content: systemPrompt + '\n\nQuestion: ' + userText,
      });
    }

    // Call AI model with Ollama as primary (ZERO COST)
    const response = await callAIModel(userMessagesOnly, recruiterType);

    if (!response.ok) {
      console.error('AI model error:', response.statusText);
      return Response.json(
        { error: 'Failed to generate response' },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Get raw response - now let's trust Ollama with the honest prompts
    let rawResponse = data.content || data.message || 'No response generated';
    
    // Try to parse structured response
    let structuredResponse = null;
    try {
      structuredResponse = JSON.parse(rawResponse);
    } catch (e) {
      // If not valid JSON, try to extract JSON from text
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          structuredResponse = JSON.parse(jsonMatch[0]);
        } catch (e2) {
          // JSON parsing failed, use fallback formatter to parse markdown/text response
          console.log('[Fallback] Using markdown formatter for response');
          structuredResponse = parseMarkdownResponse(rawResponse);
        }
      } else {
        // No JSON found, use fallback formatter
        structuredResponse = parseMarkdownResponse(rawResponse);
      }
    }

    return Response.json({
      response: rawResponse,
      structuredResponse: structuredResponse,
      recruiterType: recruiterType,
      conversationId,
      model: data.model || 'ollama-deepseek-r1:7b',
      conversationMode,
      questionCount: abuseCheck.questionCount,
      remainingQuestions: abuseCheck.remainingQuestions,
      estimatedCost: estimatedCost.toFixed(6),
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function callAIModel(
  messages: Array<{ role: string; content: string }>,
  recruiterType: string
): Promise<Response> {
  const manifestApiKey = process.env.MANIFEST_API_KEY;
  const claudeApiKey = process.env.CLAUDE_API_KEY;
  const githubToken = process.env.GITHUB_TOKEN;

  // ========== PRIMARY: Try Ollama (ZERO COST, local) ==========
  // Ollama runs on http://localhost:11434 by default
  // Models available: deepseek-r1:7b (recommended), qwen2.5:32b, llama3.2:3b, qwen:latest, llava:7b, deepseek-r1:8b
  try {
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-r1:7b',
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })).filter(msg => msg.role !== 'system'),
        system: messages.find(msg => msg.role === 'system')?.content || '',
        temperature: 0.7,
        stream: false,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('[Ollama] Successfully used local Ollama for response');
      return Response.json({
        content: data.message?.content || data.response || 'No response',
        model: 'ollama-deepseek-r1:7b',
      });
    }
    console.warn('[Ollama] Connection failed, status:', response.status);
  } catch (error) {
    console.warn('[Ollama] Not available (expected if not running):', (error as Error).message);
  }

  // ========== FALLBACK 1: Try Manifest API with Haiku 4.5 ==========
  if (manifestApiKey) {
    try {
      const response = await fetch('https://manifest.conversationmine.ai/api/ft0/chat', {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${manifestApiKey}`,
          'content-type': 'application/json',
          ...(githubToken && { 'x-github-token': githubToken }),
        },
        body: JSON.stringify({
          messages: messages.filter(msg => msg.role !== 'system').map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          model: 'haiku-4.5',
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[Manifest API] Successfully used Manifest API');
        return Response.json({
          content: data.content || data.message || 'No response',
          model: 'manifest-haiku-4.5',
        });
      }
      console.warn('[Manifest API] Failed, status:', response.status);
    } catch (error) {
      console.warn('[Manifest API] Error:', (error as Error).message);
    }
  }

  // ========== FALLBACK 2: Claude API with Haiku 4.5 ==========
  if (claudeApiKey) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': claudeApiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 1024,
          temperature: 0.7,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
          })).filter(msg => msg.role !== 'system'),
          system: messages.find(msg => msg.role === 'system')?.content || '',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[Claude API] Successfully used Claude API');
        return Response.json({
          content: data.content[0]?.text || 'No response',
          model: 'claude-haiku-4.5',
        });
      }
    } catch (error) {
      console.error('[Claude API] Error:', (error as Error).message);
    }
  }

  // ========== NO API AVAILABLE ==========
  return Response.json(
    {
      content:
        'I need to be configured to respond.\n\n' +
        '🏠 LOCAL DEVELOPMENT:\n' +
        '  1. Start Ollama: `ollama serve`\n' +
        '  2. Pull a model: `ollama pull deepseek-r1:7b`\n' +
        '  3. Reload the widget\n\n' +
        '☁️ PRODUCTION (Railway):\n' +
        '  Set MANIFEST_API_KEY or CLAUDE_API_KEY in environment variables\n\n' +
        '📊 COST COMPARISON:\n' +
        '  • Ollama (local): $0.00 ✅\n' +
        '  • Manifest API: $0.00-0.41/month\n' +
        '  • Claude API: $0.00-0.41/month\n\n' +
        '❓ Questions? Visit: https://github.com/imKrisK/imKrisK-widget',
    },
    { status: 200 }
  );
}
