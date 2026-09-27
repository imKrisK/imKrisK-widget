/**
 * ABUSE PREVENTION SYSTEM
 * 
 * Protects FT0 widget from recruiter over-engagement:
 * - Prevents unlimited consulting/support requests
 * - Enforces conversation depth limits
 * - Distinguishes "Open to work" (light Q&A) vs "Hiring" (interview mode)
 * - Tracks session cost and enforces API spend limits
 */

export interface ConversationLimits {
  questionLimit: number; // Max questions per conversation
  mode: 'open_to_work' | 'hiring';
  costCap: number; // Max tokens before hard stop
}

export interface AbuseCheckResult {
  allowed: boolean;
  reason?: string;
  questionCount: number;
  mode: 'open_to_work' | 'hiring';
  remainingQuestions?: number;
  costRemaining?: number;
}

/**
 * Detect conversation mode from message content
 * "Open to work" = light Q&A about availability/background
 * "Hiring" = deeper technical/behavioral interview questions
 */
export function detectConversationMode(userMessage: string): 'open_to_work' | 'hiring' {
  const message = userMessage.toLowerCase();

  // Keywords indicating "Hiring" mode (deeper engagement)
  const hiringKeywords = [
    'interview',
    'position',
    'role',
    'challenge',
    'problem solve',
    'project',
    'team',
    'experience',
    'case study',
    'how would',
    'what would',
    'why do you',
    'tell me about',
    'describe',
    'walk me through',
    'conflict',
    'failure',
    'decision',
    'technical',
    'architecture',
    'design',
    'system',
    'process',
    'metric',
    'result',
    'impact',
  ];

  // Keywords indicating "Open to work" mode (light engagement)
  const openToWorkKeywords = [
    'open to work',
    'available',
    'start date',
    'location',
    'remote',
    'salary',
    'benefits',
    'when can you',
    'are you',
    'do you have',
    'background',
    'overview',
    'summary',
    'what do you',
    'who are you',
    'tell me about yourself',
  ];

  let openToWorkScore = 0;
  let hiringScore = 0;

  openToWorkKeywords.forEach(keyword => {
    if (message.includes(keyword)) openToWorkScore++;
  });

  hiringKeywords.forEach(keyword => {
    if (message.includes(keyword)) hiringScore++;
  });

  return hiringScore > openToWorkScore ? 'hiring' : 'open_to_work';
}

/**
 * Check if conversation has exceeded abuse limits
 * 
 * Limits per mode:
 * - "open_to_work": Max 5 questions (light Q&A)
 * - "hiring": Max 10 questions (deeper interview)
 */
export function checkAbuseLimit(
  messages: Array<{ role: string; content: string }>,
  conversationMode: 'open_to_work' | 'hiring'
): AbuseCheckResult {
  // Count user messages (questions)
  const questionCount = messages.filter(msg => msg.role === 'user').length;

  // Set limits based on conversation mode
  const limits = getConversationLimits(conversationMode);
  const isExceeded = questionCount > limits.questionLimit;

  return {
    allowed: !isExceeded,
    reason: isExceeded
      ? `Conversation limit reached (${limits.questionLimit} questions for ${conversationMode} mode). This ensures fair access to the widget for other recruiters.`
      : undefined,
    questionCount,
    mode: conversationMode,
    remainingQuestions: Math.max(0, limits.questionLimit - questionCount),
  };
}

/**
 * Get conversation limits based on mode
 */
function getConversationLimits(mode: 'open_to_work' | 'hiring'): ConversationLimits {
  if (mode === 'hiring') {
    return {
      questionLimit: 10, // Deeper interview mode
      mode: 'hiring',
      costCap: 15000, // ~$0.036 per conversation max
    };
  }
  return {
    questionLimit: 5, // Light Q&A only
    mode: 'open_to_work',
    costCap: 5000, // ~$0.012 per conversation max
  };
}

/**
 * Estimate token usage to prevent API cost explosions
 * 
 * Rough estimates:
 * - User message: 50-150 tokens
 * - Assistant response: 200-500 tokens
 * - Average per exchange: ~400 tokens
 */
export function estimateTokens(
  messages: Array<{ role: string; content: string }>
): number {
  return messages.reduce((total, msg) => {
    // Rough token estimation: ~4 chars per token
    const tokens = Math.ceil(msg.content.length / 4);
    return total + tokens;
  }, 0);
}

/**
 * Generate abuse prevention warning message
 */
export function generateAbuseLimitMessage(
  checkResult: AbuseCheckResult
): string {
  if (checkResult.allowed) {
    return '';
  }

  const mode = checkResult.mode === 'hiring'
    ? 'interview-style conversation'
    : 'quick Q&A';

  return `
This is a ${mode}. For fair access to the widget, conversations are limited to ${checkResult.questionCount - 1} questions.

If you'd like a deeper discussion, please reach out to Kristoffer directly:
- LinkedIn: https://linkedin.com/in/imkrisk
- GitHub: https://github.com/imKrisK
- Email: [Available in portfolio]

Thank you for understanding!
  `.trim();
}

/**
 * Track API spending per conversation to prevent cost explosions
 */
export function calculateConversationCost(tokenCount: number): number {
  // Haiku 4.5 pricing: $0.80 input / $2.40 output per 1M tokens
  // Conservative estimate: 40% input, 60% output
  const inputTokens = tokenCount * 0.4;
  const outputTokens = tokenCount * 0.6;

  const inputCost = (inputTokens / 1_000_000) * 0.80;
  const outputCost = (outputTokens / 1_000_000) * 2.40;

  return inputCost + outputCost;
}
