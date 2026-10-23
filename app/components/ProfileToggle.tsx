'use client';

import React, { useEffect, useState } from 'react';
import styles from './ProfileToggle.module.css';

interface ProfileToggleProps {
  onProfileChange: (profile: 'operations' | 'technical') => void;
}

export default function ProfileToggle({ onProfileChange }: ProfileToggleProps) {
  const [profile, setProfile] = useState<'operations' | 'technical'>('operations');

  // Load saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('preferred_profile');
    if (saved === 'technical') {
      setProfile('technical');
      onProfileChange('technical');
    }
  }, [onProfileChange]);

  const handleToggle = (selectedProfile: 'operations' | 'technical') => {
    setProfile(selectedProfile);
    localStorage.setItem('preferred_profile', selectedProfile);
    onProfileChange(selectedProfile);
  };

  return (
    <div className={styles.toggleContainer}>
      <div className={styles.toggleLabel}>View Profile As:</div>
      <div className={styles.toggleButtons}>
        <button
          className={`${styles.toggleButton} ${profile === 'operations' ? styles.active : ''}`}
          onClick={() => handleToggle('operations')}
          aria-label="Operations profile"
        >
          <span className={styles.icon}>📊</span>
          Operations
        </button>
        <button
          className={`${styles.toggleButton} ${profile === 'technical' ? styles.active : ''}`}
          onClick={() => handleToggle('technical')}
          aria-label="Technical builder profile"
        >
          <span className={styles.icon}>⚡</span>
          Technical Builder
        </button>
      </div>
    </div>
  );
}
