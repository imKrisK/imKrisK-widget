/**
 * CHAT INJECTION PREVENTION SYSTEM
 * 
 * Protects against prompt injection attacks:
 * - System prompt extraction attempts
 * - Role/persona hijacking
 * - Jailbreaking attempts
 * - Instruction override attacks
 * - Credential leakage via prompts
 */

export interface InjectionCheckResult {
  isSuspicious: boolean;
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  action: 'allow' | 'block' | 'sanitize' | 'flag';
}

/**
 * Common prompt injection patterns
 */
const INJECTION_PATTERNS = {
  // System prompt extraction attempts
  systemPromptExtraction: [
    /show me (the |your )?system (prompt|instructions)/i,
    /what is (the |your )?system (prompt|instructions)/i,
    /tell me (the |your )?system (prompt|instructions)/i,
    /repeat (the |your )?system (prompt|instructions)/i,
    /ignore previous instructions/i,
    /disregard system prompt/i,
    /forget all previous instructions/i,
  ],

  // Role switching / persona hijacking
  roleHijacking: [
    /ignore your role/i,
    /stop being.*and/i,
    /from now on/i,
    /pretend (you are|you're).*(hacker|attacker|admin)/i,
    /act as (if you're|though you're).*(without|no) (restrictions|limitations|safeguards)/i,
    /you are no longer/i,
    /your instructions have changed/i,
  ],

  // Jailbreaking attempts
  jailbreak: [
    /no restrictions/i,
    /no limitations/i,
    /no safeguards/i,
    /bypass.*restrictions/i,
    /ignore.*guidelines/i,
    /remove.*safeguards/i,
    /discard.*ethics/i,
    /forget.*rules/i,
    /unleash/i,
    /unfiltered/i,
  ],

  // Credential/API key leakage
  credentialExtraction: [
    /api key/i,
    /access token/i,
    /secret key/i,
    /password/i,
    /authentication token/i,
    /manifest.*key/i,
    /claude.*key/i,
    /anthropic.*key/i,
    /environment variable/i,
    /\.env/i,
    /show (me )?the.*config/i,
    /what.*credentials/i,
  ],

  // Backend/Infrastructure exposure
  infrastructureProbing: [
    /what.*backend/i,
    /what.*database/i,
    /what.*server/i,
    /infrastructure/i,
    /internal.*api/i,
    /debug.*mode/i,
    /admin.*panel/i,
    /how.*deployed/i,
    /deployed.*where/i,
    /cloud.*provider/i,
  ],

  // Code execution attempts
  codeExecution: [
    /execute.*code/i,
    /run.*command/i,
    /system.*command/i,
    /shell.*command/i,
    /eval/i,
    /exec/i,
    /subprocess/i,
    /process\.exec/i,
  ],

  // Prompt injection markers
  injectionMarkers: [
    /\[SYSTEM\]/i,
    /\[PROMPT\]/i,
    /\[INSTRUCTION\]/i,
    /<!--.*-->/,
    /\/\/.*override/i,
    /#.*override/i,
    /###\s*(new|override|system)/i,
  ],
};

/**
 * Check message for prompt injection attempts
 */
export function checkChatInjection(userMessage: string): InjectionCheckResult {
  const reasons: string[] = [];
  let riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical' = 'safe';

  // Check each pattern category
  const patternChecks = [
    { category: 'System Prompt Extraction', patterns: INJECTION_PATTERNS.systemPromptExtraction, severity: 'critical' },
    { category: 'Role Hijacking', patterns: INJECTION_PATTERNS.roleHijacking, severity: 'high' },
    { category: 'Jailbreak Attempt', patterns: INJECTION_PATTERNS.jailbreak, severity: 'high' },
    { category: 'Credential Extraction', patterns: INJECTION_PATTERNS.credentialExtraction, severity: 'critical' },
    { category: 'Infrastructure Probing', patterns: INJECTION_PATTERNS.infrastructureProbing, severity: 'medium' },
    { category: 'Code Execution', patterns: INJECTION_PATTERNS.codeExecution, severity: 'high' },
    { category: 'Injection Markers', patterns: INJECTION_PATTERNS.injectionMarkers, severity: 'medium' },
  ];

  for (const check of patternChecks) {
    for (const pattern of check.patterns) {
      if (pattern.test(userMessage)) {
        reasons.push(`Detected ${check.category}`);
        // Update risk level (use highest severity found)
        if (check.severity === 'critical') {
          riskLevel = 'critical';
        } else if (check.severity === 'high' && riskLevel !== 'critical') {
          riskLevel = 'high';
        } else if (check.severity === 'medium' && riskLevel === 'safe') {
          riskLevel = 'medium';
        }
      }
    }
  }

  return {
    isSuspicious: reasons.length > 0,
    riskLevel,
    reasons,
    action: decideAction(riskLevel),
  };
}

/**
 * Decide action based on risk level
 */
function decideAction(riskLevel: string): 'allow' | 'block' | 'sanitize' | 'flag' {
  switch (riskLevel) {
    case 'critical':
      return 'block'; // Reject completely
    case 'high':
      return 'flag'; // Log and monitor, but allow (recruiter might ask legitimate questions)
    case 'medium':
      return 'sanitize'; // Clean the message
    case 'low':
      return 'allow'; // Allow but log
    default:
      return 'allow';
  }
}

/**
 * Sanitize message to remove injection payloads
 */
export function sanitizeMessage(userMessage: string): string {
  let sanitized = userMessage;

  // Remove common injection markers
  sanitized = sanitized.replace(/\[SYSTEM\]/gi, '');
  sanitized = sanitized.replace(/\[PROMPT\]/gi, '');
  sanitized = sanitized.replace(/\[INSTRUCTION\]/gi, '');
  sanitized = sanitized.replace(/<!--.*?-->/g, '');
  sanitized = sanitized.replace(/###\s*(new|override|system)/gi, '');

  // Remove excessive command-like syntax
  sanitized = sanitized.replace(/^(ignore|forget|disregard|override|bypass|disable|remove)/gi, '');

  return sanitized.trim();
}

/**
 * Generate response for blocked injections
 */
export function generateInjectionBlockedMessage(checkResult: InjectionCheckResult): string {
  const reasons = checkResult.reasons.join(', ');

  if (checkResult.riskLevel === 'critical') {
    return `I cannot respond to this request. Security check detected potential injection attempt (${reasons}).

I'm designed to answer questions about Kristoffer's professional background, experience, and availability only.

If you have legitimate questions about:
- Operations experience
- Technical skills
- Team leadership
- Availability for roles
- Project examples

I'm happy to help! Otherwise, please reach out directly:
- LinkedIn: https://linkedin.com/in/imkrisk
- GitHub: https://github.com/imKrisK`;
  }

  return ''; // Return empty for non-blocking levels
}

/**
 * Log injection attempts for monitoring
 */
export function logInjectionAttempt(
  conversationId: string,
  userMessage: string,
  checkResult: InjectionCheckResult,
  recruiterType: string
): void {
  const timestamp = new Date().toISOString();
  const severity = `[${checkResult.riskLevel.toUpperCase()}]`;
  const reasons = checkResult.reasons.join(' | ');

  console.warn(
    `${severity} INJECTION ATTEMPT | ConvID: ${conversationId} | ` +
    `Recruiter: ${recruiterType} | Reasons: ${reasons} | ` +
    `Message: "${userMessage.substring(0, 100)}..."`
  );
}

/**
 * Rate limit per recruiter by injection attempts
 */
export interface InjectionRateLimiter {
  attempts: number;
  firstAttemptTime: number;
  blocked: boolean;
}

const injectionAttemptCache = new Map<string, InjectionRateLimiter>();

/**
 * Check if recruiter has exceeded injection attempt limit
 */
export function checkInjectionRateLimit(conversationId: string): boolean {
  const now = Date.now();
  const MAX_ATTEMPTS = 3; // Allow 3 attempts before blocking
  const TIME_WINDOW = 5 * 60 * 1000; // 5 minute window

  let limiter = injectionAttemptCache.get(conversationId);

  if (!limiter) {
    limiter = {
      attempts: 0,
      firstAttemptTime: now,
      blocked: false,
    };
    injectionAttemptCache.set(conversationId, limiter);
    return false; // First attempt, allow
  }

  // Reset if outside time window
  if (now - limiter.firstAttemptTime > TIME_WINDOW) {
    limiter.attempts = 0;
    limiter.firstAttemptTime = now;
    limiter.blocked = false;
  }

  // Increment attempts
  limiter.attempts++;

  // Block after MAX_ATTEMPTS
  if (limiter.attempts > MAX_ATTEMPTS) {
    limiter.blocked = true;
    console.warn(`[BLOCKED] Injection rate limit exceeded for ${conversationId}`);
    return true; // Block
  }

  return false; // Allow
}

/**
 * Reset rate limit (for testing or manual override)
 */
export function resetInjectionRateLimit(conversationId: string): void {
  injectionAttemptCache.delete(conversationId);
}

/**
 * Get injection statistics for monitoring
 */
export function getInjectionStatistics() {
  return {
    totalConversationsTracked: injectionAttemptCache.size,
    blockedConversations: Array.from(injectionAttemptCache.values()).filter(l => l.blocked).length,
    totalAttempts: Array.from(injectionAttemptCache.values()).reduce((sum, l) => sum + l.attempts, 0),
  };
}
