"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useGameStore } from "@/store/useGameStore";
import KeypadButton from "@/components/KeypadButton";

type Guess = {
  code: number[];
  correctPosition: number;
  correctDigit: number;
};

export default function Challenge3() {
  const router = useRouter();
  const { isAuthenticated, completeChallenge3, challenge3Complete } =
    useGameStore();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const [secretCode, setSecretCode] = useState<number[]>([]);
  const [currentGuess, setCurrentGuess] = useState<number[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  // Initialize game
  useEffect(() => {
    generateSecretCode();
  }, []);

  const generateSecretCode = () => {
    const code = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 10)
    );
    setSecretCode(code);
    setCurrentGuess([]);
    setGuesses([]);
    setIsComplete(false);
    setHasWon(false);
  };

  const addDigit = (digit: number) => {
    if (currentGuess.length < 4 && !isComplete) {
      setCurrentGuess([...currentGuess, digit]);
    }
  };

  const removeDigit = () => {
    if (currentGuess.length > 0 && !isComplete) {
      setCurrentGuess(currentGuess.slice(0, -1));
    }
  };

  const submitGuess = () => {
    if (currentGuess.length !== 4 || isComplete) return;

    // Calculate feedback
    const feedback = calculateFeedback(currentGuess, secretCode);

    const newGuess: Guess = {
      code: [...currentGuess],
      correctPosition: feedback.correctPosition,
      correctDigit: feedback.correctDigit,
    };

    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    setCurrentGuess([]);

    // Check win condition
    if (feedback.correctPosition === 4) {
      setIsComplete(true);
      setHasWon(true);
      completeChallenge3();
      // Navigate back to main after a short delay
      setTimeout(() => {
        router.back();
      }, 3000);
    } else if (newGuesses.length >= 10) {
      setIsComplete(true);
      setHasWon(false);
    }
  };

  const calculateFeedback = (guess: number[], secret: number[]) => {
    let correctPosition = 0;
    let correctDigit = 0;

    const secretCopy = [...secret];
    const guessCopy = [...guess];

    // First pass: find correct positions
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] === secretCopy[i]) {
        correctPosition++;
        secretCopy[i] = -1; // Mark as used
        guessCopy[i] = -2; // Mark as used
      }
    }

    // Second pass: find correct digits in wrong positions
    for (let i = 0; i < 4; i++) {
      if (guessCopy[i] >= 0) {
        const index = secretCopy.indexOf(guessCopy[i]);
        if (index !== -1) {
          correctDigit++;
          secretCopy[index] = -1; // Mark as used
        }
      }
    }

    return { correctPosition, correctDigit };
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            CHALLENGE 3: SEQUENTIAL CIPHER ANALYSIS
          </h1>
          <button className={styles.backButton} onClick={() => router.back()}>
            ←
          </button>
        </div>
        <p className={styles.subtitle}>CRACK THE 4-DIGIT CODE IN 10 ATTEMPTS</p>
      </div>

      {/* Previous guesses */}
      <div className={styles.guessHistory}>
        {Array.from({ length: 10 }).map((_, index) => {
          const guess = guesses[index];
          const isCurrent = index === guesses.length && !isComplete;

          return (
            <div key={index} className={styles.guessRow}>
              <div className={styles.codeDisplay}>
                {guess ? (
                  guess.code.map((digit, i) => (
                    <div key={i} className={styles.digit}>
                      {digit}
                    </div>
                  ))
                ) : isCurrent ? (
                  <>
                    {currentGuess.map((digit, i) => (
                      <div key={i} className={styles.digit}>
                        {digit}
                      </div>
                    ))}
                    {Array.from({ length: 4 - currentGuess.length }).map(
                      (_, i) => (
                        <div
                          key={`empty-${i}`}
                          className={`${styles.digit} ${styles.empty}`}
                        >
                          _
                        </div>
                      )
                    )}
                  </>
                ) : (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={`${styles.digit} ${styles.empty}`}>
                      _
                    </div>
                  ))
                )}
              </div>

              {guess && (
                <div className={styles.feedback}>
                  <div className={styles.feedbackItem}>
                    <span className={styles.feedbackLabel}>
                      Correct Position:
                    </span>
                    <span className={styles.feedbackValue}>
                      {guess.correctPosition}
                    </span>
                  </div>
                  <div className={styles.feedbackItem}>
                    <span className={styles.feedbackLabel}>Correct Digit:</span>
                    <span className={styles.feedbackValue}>
                      {guess.correctDigit}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Number pad */}
      <div className={styles.controls}>
        {!isComplete && (
          <>
            <div className={styles.numberPad}>
              {Array.from({ length: 10 }).map((_, i) => (
                <KeypadButton
                  key={i}
                  size="medium"
                  onClick={() => addDigit(i)}
                  disabled={currentGuess.length >= 4}
                >
                  {i}
                </KeypadButton>
              ))}
            </div>

            <div className={styles.actionButtons}>
              <button
                className={styles.actionButton}
                onClick={removeDigit}
                disabled={currentGuess.length === 0}
              >
                DELETE
              </button>
              <button
                className={`${styles.actionButton} ${styles.submitButton}`}
                onClick={submitGuess}
                disabled={currentGuess.length !== 4}
              >
                SUBMIT
              </button>
            </div>
          </>
        )}

        {/* Game over */}
        {isComplete && (
          <div className={styles.gameOver}>
            <h2 className={styles.gameOverText}>
              {hasWon ? "SUCCESS" : "Mission Failed"}
            </h2>
            <p className={styles.secretReveal}>
              The code was: {secretCode.join(" ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
