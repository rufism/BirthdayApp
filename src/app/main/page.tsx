"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useGameStore } from "@/store/useGameStore";

export default function MainPage() {
  const router = useRouter();
  const { isAuthenticated, challenge1Complete, challenge2Complete, challenge3Complete, allChallengesComplete } = useGameStore();
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Simulate loading progress in chunks with a stall
    const chunkSize = 5; // Load in 5% chunks for terminal feel
    const stallPoint = 45; // Stall around 45%
    const normalDelay = 80; // Normal chunk delay in ms
    const stallDelay = 800; // How long to stall in ms

    let currentProgress = 0;
    let isStalling = false;

    const loadNextChunk = () => {
      setLoadingProgress((prev) => {
        currentProgress = prev;

        // If we've reached 100%, finish
        if (currentProgress >= 100) {
          setTimeout(() => setLoading(false), 300);
          return 100;
        }

        // If we've reached the stall point and haven't stalled yet
        if (currentProgress === stallPoint && !isStalling) {
          isStalling = true;
          // Wait longer before next chunk
          setTimeout(loadNextChunk, stallDelay);
          return prev; // Don't increment this time
        }

        // Normal progression
        const nextProgress = Math.min(currentProgress + chunkSize, 100);

        if (nextProgress < 100) {
          setTimeout(loadNextChunk, normalDelay);
        } else {
          // Final chunk
          setTimeout(loadNextChunk, normalDelay);
        }

        return nextProgress;
      });
    };

    // Start the loading
    setTimeout(loadNextChunk, normalDelay);

    // Cleanup function (though not much to clean up with this approach)
    return () => {
      // Any cleanup if needed
    };
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
                Progress: {[challenge1Complete, challenge2Complete, challenge3Complete].filter(Boolean).length}/3 objectives complete. Time is critical.
              </p>

              <div className={styles.dividerLine}>
                <p>────────────────────────────</p>
              </div>

              <p className={styles.menuHeader}>AVAILABLE MISSIONS:</p>

              <div className={styles.menuOptions}>
                <button
                  className={`${styles.menuItem} ${challenge1Complete ? styles.completed : ''}`}
                  onClick={() => router.push('/challenge1')}
                >
                  {'>'} 1. DECRYPT CIPHER FILES {challenge1Complete && '[✓]'}
                </button>
                <button
                  className={`${styles.menuItem} ${challenge2Complete ? styles.completed : ''}`}
                  onClick={() => router.push('/challenge2')}
                >
                  {'>'} 2. TRACE NETWORK LOGS {challenge2Complete && '[✓]'}
                </button>
                <button
                  className={`${styles.menuItem} ${challenge3Complete ? styles.completed : ''}`}
                  onClick={() => router.push('/challenge3')}
                >
                  {'>'} 3. INVESTIGATE LAST LOCATION {challenge3Complete && '[✓]'}
                </button>
                {allChallengesComplete() ? (
                  <button
                    className={styles.menuItem}
                    onClick={() => router.push('/locator')}
                  >
                    {'>'} 4. LOCATE TARGET
                  </button>
                ) : (
                  <p className={`${styles.menuItem} ${styles.locked}`}>
                    {'>'} 4. [LOCKED]
                  </p>
                )}
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
