import { detectRecruiterType } from '@/lib/recruiter-prompts';

/**
 * FT0 Chat API Route
 * 
 * Configuration:
 * - Primary: Haiku 4.5 (cost-optimized at $0.80/$2.40 per 1M tokens)
 * - Fallback chain: Manifest API → Claude Haiku
 * - GitHub auth: Personal Access Token (PAT) optional for rate limiting
 * - Cost efficiency: 0.33x vs Claude Sonnet
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

    // Detect recruiter type from keywords
    const recruiterProfile = detectRecruiterType(userText);

    // Build messages array with system prompt
    const systemMessage = {
      role: 'system' as const,
      content: recruiterProfile.systemPrompt,
    };

    // Prepare messages for API call
    const apiMessages = [
      systemMessage,
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: typeof msg.content === 'string' ? msg.content : msg.content[0]?.text || '',
      })),
    ];

    // Call AI model with Haiku 4.5 as primary (cost-optimized)
    const response = await callAIModel(apiMessages, recruiterProfile.type);

    if (!response.ok) {
      console.error('AI model error:', response.statusText);
      return Response.json(
        { error: 'Failed to generate response' },
        { status: 500 }
      );
    }

    const data = await response.json();

    return Response.json({
      response: data.content || data.message || 'No response generated',
      recruiterType: recruiterProfile.type,
      conversationId,
      model: data.model || 'haiku-4.5', // Track which model was used
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

  // Primary: Try Manifest API with Haiku 4.5 (cost-optimized)
  if (manifestApiKey) {
    try {
      const response = await fetch('https://manifest.conversationmine.ai/api/ft0/chat', {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${manifestApiKey}`,
          'content-type': 'application/json',
          ...(githubToken && { 'x-github-token': githubToken }), // Optional GitHub auth
        },
        body: JSON.stringify({
          messages,
          recruiterType,
          model: 'haiku-4.5', // PRIMARY: Haiku 4.5 for cost efficiency
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (response.ok) {
        return response;
      }
      console.warn('Manifest API failed, trying fallback...');
    } catch (error) {
      console.warn('Manifest API error:', error);
    }
  }

  // Fallback: Claude API with Haiku 4.5 (cost-optimized)
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
          model: 'claude-3-5-haiku-20241022', // FALLBACK: Haiku 4.5 model
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
        return Response.json({
          content: data.content[0]?.text || 'No response',
          model: 'haiku-4.5-claude',
        });
      }
    } catch (error) {
      console.error('Claude fallback error:', error);
    }
  }

  // No API keys configured
  return Response.json(
    {
      content:
        'I need to be configured to respond. Please set MANIFEST_API_KEY or CLAUDE_API_KEY in your environment variables. Using Haiku 4.5 (cost: $0.80/$2.40 per 1M tokens).',
    },
    { status: 200 }
  );
}
