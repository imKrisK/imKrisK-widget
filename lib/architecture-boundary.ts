/**
 * Architecture Boundary Detector
 * 
 * Catches questions about infrastructure/architecture/deployment
 * and returns an honest boundary response instead of letting Ollama make up details.
 * 
 * This is part of the HONEST PATH: be clear about what you will and won't discuss.
 */

const architectureKeywords = [
  'stack',
  'infrastructure',
  'deploy',
  'deployment',
  'hosting',
  'cloud',
  'aws',
  'azure',
  'gcp',
  'cloudflare',
  'railway',
  'vercel',
  'github pages',
  'database',
  'backend',
  'api',
  'architecture',
  'blueprint',
  'framework',
  'server',
  'dns',
  'cdn',
  'docker',
  'kubernetes',
  'container',
  'mongodb',
  'postgres',
  'supabase',
  'firebase',
  'redis',
  'cache',
  'middleware',
  'proxy',
  'load balance',
  'built with',
  'running on',
  'powered by',
  'technology',
  'tech stack',
  'how is it built',
  'what tools',
];

const architectureResponses = {
  honest: `I don't discuss specific infrastructure details for security and privacy reasons. 

But I'm happy to tell you about the **problems I solved** and the **approach I took**:

- Automated workflow: Compressed a 72-hour manual process into 5 hours of automation
- Published ACIL on VS Code Marketplace: A token budget management tool
- Scaled operations: Built systems that work across multiple locations with 15+ team members
- Focus: Systems design, process automation, and operational efficiency

If you're curious about my technical approach to a specific problem, I'm absolutely happy to discuss that. What operational or technical challenge are you most interested in?`,

  vague: `I keep infrastructure details private, but I can definitely tell you about the operational and technical challenges I've solved.

My real strength is in process automation and systems design - like turning a 72-hour workflow into a 5-hour automated loop. Want to hear more about that, or about how I scaled operations from zero to 15+ people?`,
};

/**
 * Check if question is about architecture/infrastructure
 */
export function isArchitectureQuestion(userMessage: string): boolean {
  const lowerMessage = userMessage.toLowerCase();
  return architectureKeywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Get honest architecture boundary response
 */
export function getArchitectureBoundaryResponse(style: 'honest' | 'vague' = 'honest'): string {
  return architectureResponses[style];
}
