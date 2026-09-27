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
  velocity_metrics: Array<{
    label: string;
    value: string;
    detail: string;
  }>;
  portfolio: Array<{
    name: string;
    scope: string;
  }>;
  experience: {
    operations: Array<{
      role: string;
      company: string;
      duration: string;
      bullets: string[];
    }>;
    technical: Array<{
      area: string;
      items: string;
    }>;
  };
}

export default function Portfolio() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState('business');
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

      {/* Velocity Metrics */}
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
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'business' && (
            <div className={styles.contentSection}>
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
            </div>
          )}

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
                Notable Projects
              </h3>
              <div className={styles.projectsGrid}>
                {data.portfolio.map((project, idx) => (
                  <div key={idx} className={styles.projectCard}>
                    <h4>{project.name}</h4>
                    <p className={styles.projectScope}>{project.scope}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>This is my resume. I am a human who is open to work.</p>
      </footer>
    </div>
  );
}
