'use client';

import { useState } from 'react';
import Portfolio from './components/Portfolio';
import FT0ChatWidget from './components/FT0ChatWidget';
import ProfileToggle from './components/ProfileToggle';
import styles from './page.module.css';

export default function Home() {
  const [profileType, setProfileType] = useState<'operations' | 'technical'>('operations');

  const handleProfileChange = (profile: 'operations' | 'technical') => {
    setProfileType(profile);
  };

  return (
    <main className={styles.main}>
      <div className={styles.portfolioSection}>
        <ProfileToggle onProfileChange={handleProfileChange} />
        <Portfolio profileType={profileType} />
      </div>

      <div className={styles.widgetSection}>
        <div className={styles.widgetContainer}>
          <FT0ChatWidget profileType={profileType} />
        </div>
      </div>
    </main>
  );
}
