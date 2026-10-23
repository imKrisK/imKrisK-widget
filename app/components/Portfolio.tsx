'use client';

import { useEffect, useState } from 'react';
import styles from './Portfolio.module.css';

interface ProfileData {
  profile: {
    name: string;
    title: string;
    location: string;
    summary: string;
  };
  business_operations?: {
    headline: string;
    cover_letter: string;
    core_competencies: Array<{
      area: string;
      examples: string;
    }>;
    career_path: {
      current: {
        level: string;
        description: string;
      };
      progression: Array<{
        level: string;
        description: string;
      }>;
    };
    csep_value: string;
  };
  velocity_metrics?: Array<{
    label: string;
    value: string;
    detail: string;
  }>;
  portfolio: Array<{
    name: string;
    scope: string;
    isVisualized?: boolean;
    link?: string;
  }>;
  experience: {
    operations: Array<{
      role: string;
      company: string;
      duration: string;
      companyContext?: string;
      companyLanguage?: string;
      bullets: string[];
    }>;
    technical: Array<{
      area: string;
      items: string;
    }>;
  };
  technical_projects?: Array<{
    name: string;
    tagline: string;
    description: string;
    technologies: string[];
    impact: string;
    link?: string;
  }>;
  ai_ml_capabilities?: Array<{
    capability: string;
    description: string;
  }>;
  innovation_metrics?: {
    patents_filed: number;
    patents_description: string;
    open_source_repos: string;
    github_followers: number;
    github_following: number;
    contributions_last_year: string;
    creator_credits: string[];
  };
}

interface Props {
  profileType?: 'operations' | 'technical';
}

export default function Portfolio({ profileType = 'operations' }: Props) {
  const [data, setData] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState(profileType === 'technical' ? 'innovation' : 'business');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/telemetry-safe.json');
        if (!response.ok) throw new Error('Failed to load profile data');
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.error}>
        <p>Unable to load profile data</p>
      </div>
    );
  }

  return (
    <div className={styles.portfolio}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>{data.profile.name}</h1>
          <p className={styles.title}>{data.profile.title}</p>
          <p className={styles.location}>{data.profile.location}</p>
          <p className={styles.summary}>{data.profile.summary}</p>
        </div>
      </header>

      {/* Velocity Metrics - Only show if present */}
      {data.velocity_metrics && data.velocity_metrics.length > 0 && (
        <section className={styles.metrics}>
          <h2>Velocity Metrics</h2>
          <div className={styles.metricsGrid}>
            {data.velocity_metrics.map((metric, idx) => (
              <div key={idx} className={styles.metricCard}>
                <p className={styles.metricLabel}>{metric.label}</p>
                <p className={styles.metricValue}>{metric.value}</p>
                <p className={styles.metricDetail}>{metric.detail}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tabs */}
      <div className={styles.tabContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'business' ? styles.active : ''}`}
            onClick={() => setActiveTab('business')}
          >
            Business Operations
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'technical' ? styles.active : ''}`}
            onClick={() => setActiveTab('technical')}
          >
            Technical Credentials
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'innovation' ? styles.active : ''}`}
            onClick={() => setActiveTab('innovation')}
          >
            Technical Innovation
          </button>
          {data.ai_ml_capabilities && (
            <button
              className={`${styles.tab} ${activeTab === 'ai' ? styles.active : ''}`}
              onClick={() => setActiveTab('ai')}
            >
              AI/ML Capabilities
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {/* Business Operations Tab */}
          {activeTab === 'business' && (
            <div className={styles.contentSection}>
              {data.business_operations ? (() => {
                const bo = data.business_operations;
                return (
                  <>
                    {/* Career Narrative */}
                    <div className={styles.narrativeSection}>
                      <h2>{bo.headline}</h2>
                      <div className={styles.coverLetter}>
                        {bo.cover_letter.split('\n').map((line, idx) => (
                          <p key={idx}>{line}</p>
                        ))}
                      </div>
                    </div>

                    {/* Core Competencies */}
                    <div className={styles.competenciesSection}>
                      <h3>Core Competencies</h3>
                      <div className={styles.competenciesGrid}>
                        {bo.core_competencies.map((comp, idx) => (
                          <div key={idx} className={styles.competencyCard}>
                            <h4>{comp.area}</h4>
                            <p>{comp.examples}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Career Path */}
                    <div className={styles.careerPathSection}>
                      <h3>Career Progression Path</h3>
                      
                      <div className={styles.currentRoleCard}>
                        <div className={styles.roleMarker}>Current Foundation</div>
                        <h4>{bo.career_path.current.level}</h4>
                        <p>{bo.career_path.current.description}</p>
                      </div>

                      <div className={styles.progressionArrow}>↓</div>

                      <div className={styles.progressionSteps}>
                        {bo.career_path.progression.map((step, idx) => (
                          <div key={idx} className={styles.progressionCard}>
                            <div className={styles.stepNumber}>{idx + 1}</div>
                            <div className={styles.stepContent}>
                              <h4>{step.level}</h4>
                              <p>{step.description}</p>
                            </div>
                            {idx < bo.career_path.progression.length - 1 && (
                              <div className={styles.stepArrow}>↓</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CSEP Value */}
                    <div className={styles.csepSection}>
                      <h3>Why CSEP Matters</h3>
                      <div className={styles.csepCard}>
                        <p>{bo.csep_value}</p>
                      </div>
                    </div>

                    {/* Experience History */}
                    <div className={styles.experienceHistorySection}>
                      <h3 style={{ marginTop: '40px' }}>Professional Background</h3>
                      {data.experience.operations.map((exp, idx) => (
                        <div key={idx} className={styles.experienceCard}>
                          <div className={styles.expHeader}>
                            <h4>{exp.role}</h4>
                            <span className={styles.company}>{exp.company}</span>
                          </div>
                          <p className={styles.duration}>{exp.duration}</p>
                          <ul className={styles.bullets}>
                            {exp.bullets.map((bullet, bidx) => (
                              <li key={bidx}>{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })() : (
                <>
                  <h2>Professional Experience</h2>
                  {data.experience.operations.map((exp, idx) => (
                    <div key={idx} className={styles.experienceCard}>
                      <div className={styles.expHeader}>
                        <h3>{exp.role}</h3>
                        <span className={styles.company}>{exp.company}</span>
                      </div>
                      <p className={styles.duration}>{exp.duration}</p>
                      <ul className={styles.bullets}>
                        {exp.bullets.map((bullet, bidx) => (
                          <li key={bidx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Technical Credentials Tab */}
          {activeTab === 'technical' && (
            <div className={styles.contentSection}>
              <h2>Technical Skills & Credentials</h2>
              <div className={styles.skillsGrid}>
                {data.experience.technical.map((tech, idx) => (
                  <div key={idx} className={styles.skillCard}>
                    <h3>{tech.area}</h3>
                    <p>{tech.items}</p>
                  </div>
                ))}
              </div>

              <h3 style={{ marginTop: '32px', marginBottom: '16px' }}>
                Notable Projects & Systems
              </h3>
              <div className={styles.projectsGrid}>
                {data.portfolio.map((project, idx) => (
                  <div key={idx} className={styles.projectCard}>
                    <h4>{project.name}</h4>
                    <p className={styles.projectScope}>{project.scope}</p>
                    {project.isVisualized && (
                      <p className={styles.projectNote}>📊 Pipeline Architecture Visualization</p>
                    )}
                    {project.link && project.link !== '#' && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.projectCardLink}>
                        Visit →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Innovation Tab */}
          {activeTab === 'innovation' && data.technical_projects && (
            <div className={styles.contentSection}>
              <h2>Technical Innovation Projects</h2>
              <div className={styles.projectsDetailGrid}>
                {data.technical_projects.map((project, idx) => (
                  <div key={idx} className={styles.projectDetailCard}>
                    <h3>{project.name}</h3>
                    <p className={styles.projectTagline}>{project.tagline}</p>
                    <p className={styles.projectDescription}>{project.description}</p>
                    
                    <div className={styles.technologies}>
                      {project.technologies.map((tech, tidx) => (
                        <span key={tidx} className={styles.techTag}>{tech}</span>
                      ))}
                    </div>
                    
                    <p className={styles.projectImpact}>
                      <strong>Impact:</strong> {project.impact}
                    </p>
                    
                    {project.link && project.link !== '#' && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                        View Project →
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {data.innovation_metrics && (
                <div className={styles.metricsSection}>
                  <h3 style={{ marginTop: '32px' }}>Innovation Metrics</h3>
                  <div className={styles.metricsCards}>
                    <div className={styles.metricBox}>
                      <p className={styles.metricNumber}>{data.innovation_metrics.patents_filed}</p>
                      <p className={styles.metricLabel}>Patents Filed</p>
                      <p className={styles.metricSub}>{data.innovation_metrics.patents_description}</p>
                    </div>
                    <div className={styles.metricBox}>
                      <p className={styles.metricNumber}>{data.innovation_metrics.open_source_repos}</p>
                      <p className={styles.metricLabel}>Open Source</p>
                      <p className={styles.metricSub}>Public repositories on GitHub</p>
                    </div>
                    <div className={styles.metricBox}>
                      <p className={styles.metricNumber}>{data.innovation_metrics.contributions_last_year}</p>
                      <p className={styles.metricLabel}>Contributions</p>
                      <p className={styles.metricSub}>Past 12 months of activity</p>
                    </div>
                    <div className={styles.metricBox}>
                      <p className={styles.metricNumber}>{data.innovation_metrics.github_followers}</p>
                      <p className={styles.metricLabel}>Community</p>
                      <p className={styles.metricSub}>GitHub followers & supporters</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI/ML Capabilities Tab */}
          {activeTab === 'ai' && data.ai_ml_capabilities && (
            <div className={styles.contentSection}>
              <h2>AI/ML Capabilities & Expertise</h2>
              <div className={styles.capabilitiesGrid}>
                {data.ai_ml_capabilities.map((cap, idx) => (
                  <div key={idx} className={styles.capabilityCard}>
                    <h3>{cap.capability}</h3>
                    <p>{cap.description}</p>
                  </div>
                ))}
              </div>

              <div className={styles.aiNoteSection}>
                <h3 style={{ marginTop: '32px' }}>About FT0</h3>
                <p>
                  This portfolio site demonstrates real-time AI personalization through the FT0 widget on the right side. 
                  FT0 is trained on this background and adapts responses based on recruiter type (operations vs technical) 
                  and conversation context. It showcases practical AI implementation in a business context.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>This is my resume. I am a human who is open to work. Explore my technical background, operations expertise, and AI innovation work above.</p>
      </footer>
    </div>
  );
}
