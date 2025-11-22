'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useGameStore } from "@/store/useGameStore";

// The cipher message - you can customize this
const CIPHER_MESSAGE = "KHOOR DJHQW, BRX KDYH IRXQG WKH ILUVW FKDOOHQJH";
const CORRECT_ANSWER = "HELLO AGENT, YOU HAVE FOUND THE FIRST CHALLENGE";

export default function Challenge1() {
  const router = useRouter();
  const { isAuthenticated, completeChallenge1, challenge1Complete } = useGameStore();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Extract unique cipher letters from the message
  const uniqueCipherLetters = Array.from(
    new Set(CIPHER_MESSAGE.split('').filter(char => /[A-Z]/.test(char)))
  ).sort();

  // State: mapping from cipher letter to decoded letter
  const [substitutions, setSubstitutions] = useState<Record<string, string>>({});

  // State: currently selected cipher letter
  const [selectedCipherLetter, setSelectedCipherLetter] = useState<string | null>(null);

  // All alphabet letters for the button grid
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const handleCipherLetterClick = (cipherLetter: string) => {
    setSelectedCipherLetter(cipherLetter);
  };

  const handleAlphabetClick = (letter: string) => {
    if (selectedCipherLetter) {
      // Set the substitution for the selected cipher letter
      setSubstitutions(prev => ({
        ...prev,
        [selectedCipherLetter]: letter
      }));

      // Move to next unassigned cipher letter
      const nextUnassigned = uniqueCipherLetters.find(
        cl => !substitutions[cl] && cl !== selectedCipherLetter
      );
      setSelectedCipherLetter(nextUnassigned || null);
    }
  };

  const handleClear = () => {
    setSubstitutions({});
    setSelectedCipherLetter(null);
  };

  const handleSubmit = () => {
    // Decode the message
    const decoded = CIPHER_MESSAGE.split('').map(char => {
      if (/[A-Z]/.test(char)) {
        return substitutions[char] || '_';
      }
      return char;
    }).join('');

    // Check if the answer is correct
    if (decoded === CORRECT_ANSWER) {
      completeChallenge1();
      alert('Success! Challenge 1 Complete!');
      router.push('/main');
    } else {
      alert(`Decoded: ${decoded}\n\nNot quite right. Keep trying!`);
    }
  };

  // Render the cipher message with clickable letters
  const renderCipherMessage = () => {
    return CIPHER_MESSAGE.split('').map((char, index) => {
      if (/[A-Z]/.test(char)) {
        const isSelected = char === selectedCipherLetter;
        const decodedLetter = substitutions[char];

        return (
          <div key={index} className={styles.cipherLetterContainer}>
            <button
              className={`${styles.cipherLetter} ${isSelected ? styles.selected : ''}`}
              onClick={() => handleCipherLetterClick(char)}
            >
              {char}
            </button>
            <div className={styles.decodedLetter}>
              {decodedLetter || '_'}
            </div>
          </div>
        );
      } else if (char === ' ') {
        return <div key={index} className={styles.space}></div>;
      } else {
        return (
          <div key={index} className={styles.cipherLetterContainer}>
            <div className={styles.punctuation}>{char}</div>
            <div className={styles.decodedLetter}>{char}</div>
          </div>
        );
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>CHALLENGE 1: DECRYPT</h1>
        <p className={styles.subtitle}>TAP CIPHER LETTER, THEN TAP DECODE</p>
      </div>

      <div className={styles.cipherDisplay}>
        {renderCipherMessage()}
      </div>

      {selectedCipherLetter && (
        <div className={styles.selectionIndicator}>
          DECODING: <span className={styles.highlightLetter}>{selectedCipherLetter}</span>
        </div>
      )}

      <div className={styles.alphabetGrid}>
        {alphabet.map(letter => {
          // Check if this letter is already used
          const isUsed = Object.values(substitutions).includes(letter);

          return (
            <button
              key={letter}
              className={`${styles.alphabetButton} ${isUsed ? styles.used : ''}`}
              onClick={() => handleAlphabetClick(letter)}
              disabled={!selectedCipherLetter}
            >
              {letter}
            </button>
          );
        })}
      </div>

      <div className={styles.controls}>
        <button className={styles.controlButton} onClick={handleClear}>
          CLEAR
        </button>
        <button className={styles.controlButton} onClick={handleSubmit}>
          SUBMIT
        </button>
      </div>
    </div>
  );
}
