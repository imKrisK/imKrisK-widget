'use client';

import React from 'react';
import styles from './StructuredResponse.module.css';

interface Section {
  title: string;
  icon?: string;
  type: 'achievements' | 'skills' | 'experience' | 'philosophy' | 'faq';
  items?: string[];
  metric?: string;
  description?: string;
}

interface StructuredResponseData {
  summary: string;
  sections: Section[];
  closingStatement?: string;
}

interface Props {
  data: StructuredResponseData;
}

const sectionTypeColors: Record<string, string> = {
  achievements: '#10b981',
  skills: '#3b82f6',
  experience: '#f59e0b',
  philosophy: '#8b5cf6',
  faq: '#ec4899',
};

const sectionTypeEmojis: Record<string, string> = {
  achievements: '⭐',
  skills: '⚡',
  experience: '📈',
  philosophy: '🎯',
  faq: '❓',
};

export default function StructuredResponse({ data }: Props) {
  const renderSection = (section: Section, index: number) => {
    const color = sectionTypeColors[section.type];
    const defaultEmoji = sectionTypeEmojis[section.type];
    const emoji = section.icon || defaultEmoji;

    return (
      <div key={index} className={styles.section} style={{ borderLeftColor: color }}>
        <div className={styles.sectionHeader}>
          <span className={styles.icon}>{emoji}</span>
          <h3 className={styles.sectionTitle}>{section.title}</h3>
          {section.metric && <span className={styles.metric}>{section.metric}</span>}
        </div>

        {section.description && <p className={styles.description}>{section.description}</p>}

        {section.items && section.items.length > 0 && (
          <ul className={styles.itemsList}>
            {section.items.map((item, itemIndex) => (
              <li key={itemIndex} className={styles.item}>
                <span className={styles.bullet}>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Summary Hook */}
      <div className={styles.summary}>{data.summary}</div>

      {/* Sections */}
      <div className={styles.sectionsContainer}>
        {data.sections.map((section, index) => renderSection(section, index))}
      </div>

      {/* Closing Statement */}
      {data.closingStatement && <div className={styles.closing}>{data.closingStatement}</div>}
    </div>
  );
}
