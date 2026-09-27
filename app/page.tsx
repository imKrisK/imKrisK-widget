import Portfolio from './components/Portfolio';
import FT0ChatWidget from './components/FT0ChatWidget';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.portfolioSection}>
        <Portfolio />
      </div>

      <div className={styles.widgetSection}>
        <div className={styles.widgetContainer}>
          <FT0ChatWidget />
        </div>
      </div>
    </main>
  );
}
