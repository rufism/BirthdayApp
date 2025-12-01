"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useGameStore } from "@/store/useGameStore";
import KeypadButton from "@/components/KeypadButton";
import { getProfile } from "@/config/profiles";

// Cipher messages array - indexed by profile's cipherMessage setting
const CIPHER_MESSAGES = [
  {
    cipher: "KHOOR DJHQW, BRX KDYH IRXQG WKH ILUVW FKDOOHQJH",
    answer: "HELLO AGENT, YOU HAVE FOUND THE FIRST CHALLENGE",
  },
  {
    cipher: "NY'X WJAJFSFY, NY'X KWJFHM",
    answer: "IT'S REVENANT, IT'S FRENCH",
  },
  {
    cipher: "FVB'YL ALHYDPU TL HWHYA SDZH",
    answer: "YOU'RE TEARING ME APART LISA",
  },
  {
    cipher: "UR JNF N FXNGRE OBL",
    answer: "HE WAS A SKATER BOY",
  },
  {
    cipher: "FQJA? WX VXWNT? QNNNBN",
    answer: "WHAT? NO MONEY? HEEERE",
  },
  {
    cipher: "T OTOW'E... T OTOW'E VTJJ STX",
    answer: "I DIDN'T... I DIDN'T KILL HIM",
  },
  {
    cipher: "AXPL, YTNW, TVQ WATZXHHT NTYX PLOXX",
    answer: "SETH, KAMI, AND ISABELLA MAKE THREE",
  },
];

export default function Challenge1() {
  const router = useRouter();
  const {
    isAuthenticated,
    activePasscode,
    completeChallenge1,
    challenge1Complete,
  } = useGameStore();

  // Get the profile and determine which cipher to use
  const profile = useMemo(() => {
    if (!activePasscode) return null;
    return getProfile(activePasscode);
  }, [activePasscode]);

  const cipherData = useMemo(() => {
    const messageIndex = profile?.cipherMessage ?? 0;
    return CIPHER_MESSAGES[messageIndex];
  }, [profile]);

  const CIPHER_MESSAGE = cipherData.cipher;
  const CORRECT_ANSWER = cipherData.answer;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Extract unique cipher letters from the message
  const uniqueCipherLetters = Array.from(
    new Set(CIPHER_MESSAGE.split("").filter((char) => /[A-Z]/.test(char)))
  ).sort();

  // State: mapping from cipher letter to decoded letter
  const [substitutions, setSubstitutions] = useState<Record<string, string>>(
    {}
  );

  // State: currently selected cipher letter
  const [selectedCipherLetter, setSelectedCipherLetter] = useState<
    string | null
  >(null);

  // State: submission status
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // All alphabet letters for the button grid
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const handleCipherLetterClick = (cipherLetter: string) => {
    setSelectedCipherLetter(cipherLetter);
  };

  const handleAlphabetClick = (letter: string) => {
    if (selectedCipherLetter) {
      // Set the substitution for the selected cipher letter
      setSubstitutions((prev) => ({
        ...prev,
        [selectedCipherLetter]: letter,
      }));

      // Move to next unassigned cipher letter
      const nextUnassigned = uniqueCipherLetters.find(
        (cl) => !substitutions[cl] && cl !== selectedCipherLetter
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
    const decoded = CIPHER_MESSAGE.split("")
      .map((char) => {
        if (/[A-Z]/.test(char)) {
          return substitutions[char] || "_";
        }
        return char;
      })
      .join("");

    // Check if the answer is correct
    if (decoded === CORRECT_ANSWER) {
      completeChallenge1();
      setSubmissionStatus("success");

      // Navigate after showing success message
      setTimeout(() => {
        router.back();
      }, 2000);
    } else {
      setSubmissionStatus("error");

      // Clear error message after delay
      setTimeout(() => {
        setSubmissionStatus("idle");
      }, 2000);
    }
  };

  // Render the cipher message with clickable letters
  const renderCipherMessage = () => {
    // Split the message into words
    const words = CIPHER_MESSAGE.split(" ");

    return words.map((word, wordIndex) => (
      <div key={wordIndex} className={styles.wordRow}>
        {word.split("").map((char, charIndex) => {
          if (/[A-Z]/.test(char)) {
            const isSelected = char === selectedCipherLetter;
            const decodedLetter = substitutions[char];

            return (
              <div key={charIndex} className={styles.cipherLetterContainer}>
                <button
                  className={`${styles.cipherLetter} ${
                    isSelected ? styles.selected : ""
                  }`}
                  onClick={() => handleCipherLetterClick(char)}
                >
                  {char}
                </button>
                <div className={styles.decodedLetter}>
                  {decodedLetter || "_"}
                </div>
              </div>
            );
          } else {
            return (
              <div key={charIndex} className={styles.cipherLetterContainer}>
                <div className={styles.punctuation}>{char}</div>
              </div>
            );
          }
        })}
      </div>
    ));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>CHALLENGE 1: SEMANTIC DECONSTRUCTION</h1>
          <button className={styles.backButton} onClick={() => router.back()}>
            ←
          </button>
        </div>
        <p className={styles.subtitle}>TAP CIPHER LETTER, THEN TAP DECODE</p>
      </div>

      <div className={styles.activeContent}>
        <div className={styles.cipherDisplay}>
          {submissionStatus !== "idle" ? (
            <div className={styles.messageDisplay}>
              {submissionStatus === "success" ? (
                <h2 className={styles.successText}>SUCCESS</h2>
              ) : (
                <h2 className={styles.errorText}>INCORRECT</h2>
              )}
            </div>
          ) : (
            renderCipherMessage()
          )}
        </div>

        {selectedCipherLetter && submissionStatus === "idle" && (
          <div className={styles.selectionIndicator}>
            DECODING:{" "}
            <span className={styles.highlightLetter}>
              {selectedCipherLetter}
            </span>
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <div className={styles.alphabetGrid}>
          {alphabet.map((letter) => {
            // Check if this letter is already used
            const isUsed = Object.values(substitutions).includes(letter);

            return (
              <KeypadButton
                key={letter}
                size="small"
                onClick={() => handleAlphabetClick(letter)}
                disabled={!selectedCipherLetter}
                used={isUsed}
              >
                {letter}
              </KeypadButton>
            );
          })}
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.controlButton} onClick={handleClear}>
            CLEAR
          </button>
          <button className={styles.controlButton} onClick={handleSubmit}>
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
}
