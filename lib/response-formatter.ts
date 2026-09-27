/**
 * Parse markdown-formatted response into structured format
 * Converts text with markdown sections into JSON structure for rendering
 */

export interface StructuredResponse {
  summary: string;
  sections: Array<{
    title: string;
    icon?: string;
    type: 'achievements' | 'skills' | 'experience' | 'philosophy' | 'faq';
    items?: string[];
    description?: string;
  }>;
  closingStatement?: string;
}

export function parseMarkdownResponse(text: string): StructuredResponse {
  // Extract summary (first sentence before any sections)
  const lines = text.split('\n').filter(l => l.trim());
  let summary = '';
  let contentStart = 0;

  // Find summary
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/^#+\s/)) {
      // Found first heading, use everything before as summary
      summary = lines.slice(0, i).join(' ').trim();
      contentStart = i;
      break;
    }
  }

  if (!summary && lines.length > 0) {
    // No headings, use first line as summary
    summary = lines[0].trim();
    contentStart = 1;
  }

  // Parse sections from content
  const sections: StructuredResponse['sections'] = [];
  const typeMapping: Record<string, StructuredResponse['sections'][0]['type']> = {
    skills: 'skills',
    skill: 'skills',
    achievement: 'achievements',
    achievements: 'achievements',
    proof: 'achievements',
    'proof points': 'achievements',
    experience: 'experience',
    exp: 'experience',
    philosophy: 'philosophy',
    approach: 'philosophy',
    mindset: 'philosophy',
    faq: 'faq',
    'common': 'faq',
    'questions': 'faq',
  };

  const iconMapping: Record<string, string> = {
    skills: '⚡',
    achievements: '⭐',
    experience: '📈',
    philosophy: '🎯',
    faq: '❓',
  };

  let currentSection: (StructuredResponse['sections'][0]) | null = null;

  for (let i = contentStart; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for section heading
    const headingMatch = line.match(/^#+\s+(.+)$/);
    if (headingMatch) {
      // Save previous section
      if (currentSection) {
        sections.push(currentSection);
      }

      const title = headingMatch[1];
      const lowerTitle = title.toLowerCase();
      
      // Detect type from title
      let type: StructuredResponse['sections'][0]['type'] = 'skills';
      for (const [keyword, detectedType] of Object.entries(typeMapping)) {
        if (lowerTitle.includes(keyword)) {
          type = detectedType;
          break;
        }
      }

      currentSection = {
        title,
        type,
        icon: iconMapping[type],
        items: [],
      };
      continue;
    }

    // Check for bullet points
    const bulletMatch = line.match(/^[-•*]\s+(.+)$/);
    if (bulletMatch && currentSection) {
      const item = bulletMatch[1].trim();
      currentSection.items?.push(item);
      continue;
    }

    // Check for numbered lists
    const numberedMatch = line.match(/^\d+\.\s+(.+)$/);
    if (numberedMatch && currentSection) {
      const item = numberedMatch[1].trim();
      currentSection.items?.push(item);
      continue;
    }

    // If line has content and no current section, add to summary
    if (line && !currentSection && !summary) {
      summary += ' ' + line;
    }
  }

  // Save last section
  if (currentSection) {
    sections.push(currentSection);
  }

  // If no sections were found, create one from the text
  if (sections.length === 0) {
    sections.push({
      title: 'Professional Profile',
      type: 'philosophy',
      icon: '📋',
      items: [summary],
    });
  }

  const closingStatement = lines[lines.length - 1]?.includes('?') 
    ? undefined 
    : lines[lines.length - 1];

  return {
    summary: summary.substring(0, 200), // Limit to 200 chars
    sections,
    closingStatement: closingStatement && closingStatement !== summary ? closingStatement : undefined,
  };
}
