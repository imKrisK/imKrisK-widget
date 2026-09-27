/**
 * Response validation and fallback for recruiter chat
 * 
 * Detects when the model fails to follow instructions and provides
 * intelligent fallbacks with real Kristoffer data
 */

export interface FallbackResponse {
  type: 'tech' | 'legal' | 'startup' | 'finance' | 'founder' | 'default';
  content: string;
}

// Fallback responses with hardcoded Kristoffer data
export const fallbackResponses: Record<string, string> = {
  tech: `Kristoffer brings rare technical depth combined with operations leadership.

## Technical Skills
- TypeScript, React, Next.js, Bash scripting
- Process automation and systems design
- Can read code, debug, and build internal tools

## Key Achievements
- Automated 72-hour workflow down to 5 hours (93% improvement)
- Published ACIL plugin on VS Code Marketplace
- Led cross-functional teams managing millions in operations

## Why Tech Ops Fits
- Understands both engineering and operations
- Bridges the gap between dev and ops teams
- Bias toward automation and systems thinking`,

  legal: `Kristoffer combines litigation expertise with systems thinking for scalable legal operations.

## Litigation & Compliance Track Record
- Managed all discovery and filing work for major legal services firm
- Maintained 99%+ accuracy across millions of litigation documents
- Handled complex regulatory requirements (CERS, Accela, LAFD)

## What I Built
- Department-standard SOPs adopted across all regional sites
- Audit-ready workflows with built-in accuracy controls
- Scaled team from 0→15+ while maintaining quality

## Why I'm Ideal
- Compliance is systems design, not guesswork
- Proven at large-scale litigation operations
- Know how to translate regulations into workable processes`,

  startup: `Kristoffer brings founder-aligned operations—built and scaled from nothing.

## What I've Built
- Grew operations team from 0→15+ people
- Maintained accuracy and quality during rapid scaling
- Designed processes that work across multiple locations

## How I Operate
- Bias to action—solve problems without hand-holding
- Comfortable with ambiguity and wearing multiple hats
- Equity-motivated, think long-term like a founder

## Why Startups Need Me
- I move fast but don't cut corners
- Can hire, train, and scale teams rapidly
- Understand business economics and ROI`,

  finance: `Kristoffer is a business-minded operations leader who measures everything in ROI.

## Cost Optimization Track Record
- Automated workflow: 72 hours→5 hours = 93% time savings
- Built systems preventing audit costs and compliance fines
- Managed budgets for 15+ team across multiple regions

## Financial Operations Skills
- ROI thinking—measure impact in dollars
- Process automation for cost reduction
- Compliance cost avoidance through system design

## Why Finance Ops Fits
- Understands both operations and business economics
- Optimizes for long-term profitability
- Data-driven decision making`,

  founder: `Kristoffer is a non-founder operator who thinks and moves like a founder.

## What I've Built
- Scaled operations from zero to fully staffed team
- Built repeatable processes during growth
- Maintained quality and culture at scale

## Founder Alignment
- Equity-motivated, long-term partnership
- Bias to action—move fast and solve problems
- Understand business economics and ROI

## What I Bring to Your Team
- Execution speed without cutting corners
- Hiring and culture building at scale
- Systems thinking + continuous improvement`,

  default: `Kristoffer is a complete operations leader: strategic thinking meets hands-on execution.

## Core Expertise
- Process design and automation
- Team building and people leadership
- Technical depth (TypeScript, React, Bash)
- Operations at scale

## Proven Results
- Automated workflow: 72 hours→5 hours
- Maintained 99%+ accuracy on complex operations
- Built and scaled team from ground up

## Leadership Philosophy
- Systems thinking for scalability
- Quality and accuracy matter as much as speed
- People-first leadership
- Continuous improvement mindset`,
};

// Patterns that indicate the model failed to follow instructions
const failurePatterns = [
  /i am an ai/i,
  /i\'m an ai/i,
  /as an ai/i,
  /as an artificial intelligence/i,
  /don\'t have access to/i,
  /i don\'t have specific details/i,
  /i don\'t have information about/i,
  /i cannot provide/i,
  /i'm not sure if/i,
  /i'm a language model/i,
  /trained on/i,
  /while i don\'t have/i,
  /i don\'t have [a-z]+ (in|skills|expertise)/i,
  /i can\'t (provide|give|offer) [a-z]+ about/i,
  /i\'m happy to help/i,
  /let me know what you/i,
  /i can guide you/i,
  /feel free to/i,
];

/**
 * Check if response lacks Kristoffer-specific content
 */
function lacksKristofferData(response: string): boolean {
  // Kristoffer's UNIQUE achievements that should appear in responses
  // These are NOT generic business phrases
  const uniqueKristofferAchievements = [
    /72.*?hour.*?5.*?hour/i,  // The specific 72→5 achievement
    /acil/i,                   // The VS Code marketplace project
    /99%.*?accuracy/i,        // The 99%+ accuracy metric
    /litigation.*?discovery/i, // Specific legal domain
    /from\s+0→?\s*15\+/i,     // Scaled team from 0 to 15+
  ];
  
  // Must have at least ONE unique Kristoffer achievement
  const hasUniqueContent = uniqueKristofferAchievements.some(pattern => pattern.test(response));
  
  // If response is substantial but lacks Kristoffer achievements, use fallback
  // "Substantial" means longer than a greeting/short response
  return response.length > 150 && !hasUniqueContent;
}

/**
 * Check if response indicates model failed to role-play as Kristoffer
 */
export function isFailedResponse(response: string): boolean {
  const matchesFailurePattern = failurePatterns.some(pattern => pattern.test(response));
  const missingKristofferData = lacksKristofferData(response);
  return matchesFailurePattern || missingKristofferData;
}

/**
 * Get fallback response for a recruiter type
 */
export function getFallbackResponse(recruiterType: string): string {
  return (
    fallbackResponses[recruiterType as keyof typeof fallbackResponses] ||
    fallbackResponses.default
  );
}

/**
 * Validate and potentially replace response with fallback
 */
export function validateResponse(
  response: string,
  recruiterType: string
): string {
  if (isFailedResponse(response)) {
    console.log(
      `[Response Validation] Detected model failure for "${recruiterType}" type. Using fallback.`
    );
    return getFallbackResponse(recruiterType);
  }
  return response;
}
