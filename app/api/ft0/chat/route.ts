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
 * FT0 Chat API Route - Multi-Backend AI Response System
 * 
 * TIER 1 - LOCAL (FREE):
 * - Ollama (localhost:11434) - $0 ✅
 *   • deepseek-r1:7b (recommended - 7.6B reasoning)
 *   • qwen2.5:32b (powerful - 32.8B, excellent for complex questions)
 *   • llama3.2:3b (lightweight)
 * 
 * TIER 2 - EDGE (STRUCTURED DECISIONS):
 * - Cloudflare Workers AI + Clef ($0.24/M tokens) ← NEW
 *   • clef (2.5x faster, structured yes/no/choice/score answers)
 *   • clef-flash (13x faster, lightweight decision model)
 *   • Perfect for: recruiter type detection, routing decisions, scoring
 * 
 * TIER 3 - CLOUD (FULL RESPONSE):
 * - Manifest API with Haiku 4.5 ($0.80/$2.40 per 1M tokens)
 * - Claude Haiku API (cost-optimized)
 * 
 * Environment Variables:
 * - MANIFEST_API_KEY (production-grade, recommended)
 * - CLAUDE_API_KEY (alternative)
 * - CLOUDFLARE_API_TOKEN (for Workers AI + Clef)
 * - CLOUDFLARE_ACCOUNT_ID (for Workers AI + Clef)
 * - GITHUB_TOKEN (optional, for rate limiting)
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
    const response = await callAIModel(userMessagesOnly, recruiterType, userText);

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
  recruiterType: string,
  userText: string
): Promise<Response> {
  const manifestApiKey = process.env.MANIFEST_API_KEY;
  const claudeApiKey = process.env.CLAUDE_API_KEY;
  const githubToken = process.env.GITHUB_TOKEN;

  // ========== PRIMARY: Try Ollama (ZERO COST, local) ==========
  // Ollama runs on http://localhost:11434 by default
  // Models available: 
  // - qwen2.5:32b (BEST: 32.8B parameters, excellent reasoning for complex questions)
  // - deepseek-r1:7b (recommended: 7.6B reasoning model, balanced)
  // - llama3.2:3b (lightweight - 3.2B, 2.0GB)
  // - qwen:latest (compact - 4B, 2.3GB)
  // - llava:7b (vision-capable - 7B, 4.7GB)
  
  // Try Qwen2.5:32b first (best for recruiter interactions), fall back to deepseek-r1:7b
  const ollamaModels = ['qwen2.5:32b', 'deepseek-r1:7b'];
  
  for (const model of ollamaModels) {
    try {
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
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
        console.log(`[Ollama] Successfully used local Ollama (${model}) for response`);
        return Response.json({
          content: data.message?.content || data.response || 'No response',
          model: `ollama-${model}`,
        });
      }
    } catch (error) {
      console.warn(`[Ollama] Model ${model} not available or connection failed`);
    }
  }
  
  console.warn('[Ollama] No models available on local Ollama');


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

  // ========== FALLBACK 2: Cloudflare Workers AI + Clef (STRUCTURED DECISIONS) ==========
  const cloudflareToken = process.env.CLOUDFLARE_API_TOKEN;
  const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  
  if (cloudflareToken && cloudflareAccountId) {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/ai/run/@cf/meta/clef`,
        {
          method: 'POST',
          headers: {
            'authorization': `Bearer ${cloudflareToken}`,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            state: {
              context: userText,
              conversation_history: messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n'),
            },
            questions: [
              {
                type: 'choice',
                question: 'What is the recruiter asking about?',
                choices: ['operations', 'technical', 'hiring', 'candidate_seeking_advice'],
              },
              {
                type: 'noul',
                question: 'Is this a hiring/recruitment question?',
              },
              {
                type: 'score',
                question: 'Rate the question complexity',
                rubric: ['simple (1-2 words)', 'moderate (short question)', 'complex (multi-part)'],
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('[Cloudflare Clef] Decision model used for routing');
        // Clef returns structured decisions, fall through to Claude/Manifest for full response
        // But we can use Clef's output to optimize the routing
        const clefDecisions = data.result?.output?.[0] || {};
        console.log('[Cloudflare Clef] Decisions:', clefDecisions);
      }
    } catch (error) {
      console.warn('[Cloudflare Clef] Error:', (error as Error).message);
    }
  }

  // ========== FALLBACK 3: Claude API with Haiku 4.5 ==========
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
        '  2. Pull Qwen2.5 (RECOMMENDED): `ollama pull qwen2.5:32b`\n' +
        '  3. Or pull deepseek: `ollama pull deepseek-r1:7b`\n' +
        '  4. Reload the widget\n\n' +
        '☁️ PRODUCTION (Railway):\n' +
        '  OPTION 1 (Recommended):\n' +
        '    Set MANIFEST_API_KEY\n' +
        '  OPTION 2 (Structured Decisions):\n' +
        '    Set CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID\n' +
        '  OPTION 3:\n' +
        '    Set CLAUDE_API_KEY\n\n' +
        '📊 COST COMPARISON:\n' +
        '  • Ollama (local, Qwen2.5): $0.00 ✅ (Best)\n' +
        '  • Cloudflare Clef-flash: $0.09/M tokens (Edge, structured)\n' +
        '  • Cloudflare Clef: $0.24/M tokens (Accurate decisions)\n' +
        '  • Manifest API: $0.80/$2.40 per 1M tokens\n' +
        '  • Claude API: $0.80/$2.40 per 1M tokens\n\n' +
        '❓ Questions? Visit: https://github.com/imKrisK/imKrisK-widget',
    },
    { status: 200 }
  );
}
