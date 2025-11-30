"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";
import { useGameStore } from "@/store/useGameStore";

export default function MainPage() {
  const router = useRouter();
  const {
    isAuthenticated,
    challenge1Complete,
    challenge2Complete,
    challenge3Complete,
    allChallengesComplete,
  } = useGameStore();
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [timeSinceLogin, setTimeSinceLogin] = useState("");

  // Calculate countdown to December 19, 2025 at 8:30 PM
  useEffect(() => {
    const calculateCountdown = () => {
      const targetDate = new Date("2025-12-19T20:30:00");
      const now = new Date();
      const diffMs = targetDate.getTime() - now.getTime();

      if (diffMs <= 0) {
        setTimeSinceLogin("TIME EXPIRED");
        return;
      }

      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeSinceLogin(
          `${days} DAY${days !== 1 ? "S" : ""} ${hours} HR${
            hours !== 1 ? "S" : ""
          } ${minutes} MIN`
        );
      } else if (hours > 0) {
        setTimeSinceLogin(
          `${hours} HR${hours !== 1 ? "S" : ""} ${minutes} MIN ${seconds} SEC`
        );
      } else if (minutes > 0) {
        setTimeSinceLogin(`${minutes} MIN ${seconds} SEC`);
      } else {
        setTimeSinceLogin(`${seconds} SEC`);
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
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
            <p>P.E.N.1.5 TERMINAL</p>
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
            <p className={styles.headerText}>
              PROTECTIVE ELECTRONIC NETWORK 1.5 [P.E.N.1.5]
            </p>
            <p className={styles.headerText}>CONNECTION SECURE</p>
          </div>

          {/* Agent info - full */}
          <div className={styles.agentInfoBox}>
            <p className={styles.agentInfoText}>
              OPERATION &quot;MID-LIFE CRISIS&quot;
            </p>
          </div>

          {/* Photo - mid left */}
          <div className={styles.photoBox}>
            <Image
              src="/seth_dithered_phosphor.png"
              alt="Agent ID Photo"
              width={150}
              height={150}
              className={styles.photo}
            />
          </div>

          {/* Agent Details - mid right */}
          <div className={styles.infoBox}>
            <p className={styles.infoLabel}>TARGET:</p>
            <p className={styles.infoValue}>SETHOLEMEW RUF</p>

            <p className={styles.infoLabel}>CODE NAME:</p>
            <p className={styles.infoValue}>THE MOUNTAIN</p>

            <p className={styles.infoLabel}>AGE:</p>
            <p className={styles.infoValue}>34</p>

            <p className={styles.infoLabel}>THREAT LEVEL:</p>
            <p className={styles.infoValue}>INCONVENIENCE</p>
          </div>

          {/* Description - full */}
          <div className={styles.descriptionBox}>
            <div className={styles.descriptionText}>
              <p className={styles.welcomeText}>
                Target has initiated protocol: UNNECESSARY COMPLEXITY.
              </p>

              <p className={styles.welcomeText}>
                Instead of sharing his location like a functioning adult,
                he&apos;s scattered clues across three cryptographic challenges.
              </p>

              <p className={styles.welcomeText}>
                Your mission: Solve these puzzles to unlock his coordinates.
              </p>

              <p className={styles.welcomeText}>
                PROCEED WITH CAUTION (and low expectations)
              </p>

              <p className={styles.menuHeader}>SELECT MISSION:</p>

              <div className={styles.menuOptions}>
                <button
                  className={`${styles.menuItem} ${
                    challenge1Complete ? styles.completed : ""
                  }`}
                  onClick={() => router.push("/challenge1")}
                >
                  1. DECRYPT CIPHER FILES {challenge1Complete && "[✓]"}
                </button>
                <button
                  className={`${styles.menuItem} ${
                    challenge2Complete ? styles.completed : ""
                  }`}
                  onClick={() => router.push("/challenge2")}
                >
                  2. TRACE NETWORK LOGS {challenge2Complete && "[✓]"}
                </button>
                <button
                  className={`${styles.menuItem} ${
                    challenge3Complete ? styles.completed : ""
                  }`}
                  onClick={() => router.push("/challenge3")}
                >
                  3. INVESTIGATE LAST LOCATION {challenge3Complete && "[✓]"}
                </button>
                {allChallengesComplete() ? (
                  <button
                    className={styles.menuItem}
                    onClick={() => router.push("/locator")}
                  >
                    4. LOCATE TARGET
                  </button>
                ) : (
                  <p className={`${styles.menuItem} ${styles.locked}`}>
                    4. [LOCKED]
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer - bottom full */}
          <div className={styles.footerBox}>
            <p className={styles.footerText}>
              TIME REMAINING: {timeSinceLogin || "CALCULATING..."}
            </p>
            <p className={styles.footerText}>
              MISSIONS COMPLETED:{" "}
              {
                [
                  challenge1Complete,
                  challenge2Complete,
                  challenge3Complete,
                ].filter(Boolean).length
              }
              /3
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
