"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function MainPage() {
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 300);
          return 100;
        }
        return prev + 5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loader}>
          <div className={styles.loaderHeader}>
            <p>AGENT TERMINAL v2.4.1</p>
            <p>INITIALIZING SECURE CONNECTION...</p>
          </div>
          <div className={styles.loadingBar}>
            <div
              className={styles.loadingBarFill}
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className={styles.loadingText}>
            <p>
              {">"} LOADING AGENT DATA... {loadingProgress}%
            </p>
            <p className={styles.blink}>{">"} _</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <div className={styles.scannerGrid}>
          {/* Header status information - full top */}
          <div className={styles.headerBox}>
            <p className={styles.headerText}>SECURE CONNECTION ESTABLISHED</p>
            <p className={styles.headerText}>STATUS: ONLINE</p>
          </div>

          {/* Agent info - full */}
          <div className={styles.agentInfoBox}>
            <p className={styles.agentInfoText}>
              AGENT: JOHN DOE | RANK: OPERATIVE | DIVISION: CYBER OPS
            </p>
          </div>

          {/* Photo placeholder - mid left */}
          <div className={styles.photoBox}>
            <div className={styles.photoPlaceholder}>
              <p>[PHOTO]</p>
              <p>ID SCAN</p>
            </div>
          </div>

          {/* Agent Details - mid right */}
          <div className={styles.infoBox}>
            <p className={styles.infoLabel}>ID:</p>
            <p className={styles.infoValue}>
              A-{Math.floor(Math.random() * 9000) + 1000}
            </p>
          </div>

          {/* Description - full */}
          <div className={styles.descriptionBox}>
            <div className={styles.descriptionText}>
              <p className={styles.welcomeText}>
                Welcome Agent. Your mission to locate CIPHER is underway.
                Progress: 0/5 objectives complete. Time is critical.
              </p>

              <div className={styles.dividerLine}>
                <p>────────────────────────────</p>
              </div>

              <p className={styles.menuHeader}>AVAILABLE MISSIONS:</p>

              <div className={styles.menuOptions}>
                <p className={styles.menuItem}>{'>'} 1. DECRYPT CIPHER FILES</p>
                <p className={styles.menuItem}>{'>'} 2. TRACE NETWORK LOGS</p>
                <p className={styles.menuItem}>{'>'} 3. INVESTIGATE LAST LOCATION</p>
                <p className={styles.menuItem}>{'>'} 4. ANALYZE EVIDENCE</p>
                <p className={styles.menuItem}>{'>'} 5. FINAL CONFRONTATION</p>
              </div>

              <div className={styles.dividerLine}>
                <p>────────────────────────────</p>
              </div>

              <p className={styles.instructionText}>
                Select mission to proceed...
              </p>
            </div>
          </div>

          {/* Footer - bottom full */}
          <div className={styles.footerBox}>
            <p className={styles.footerText}>
              LAST LOGIN: 2024-06-15 14:32:10 | MISSIONS COMPLETED: 27
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
