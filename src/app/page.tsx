"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";
import { useGameStore } from "@/store/useGameStore";
import KeypadButton from "@/components/KeypadButton";

// Valid passcodes
const VALID_PASSCODES = [
  "53712",
  "84629",
  "19456",
  "67238",
  "42891",
  "95314",
  "28765",
  "71043",
  "36582",
  "50927",
  "63148",
  "89271",
  "14536",
  "72904",
  "48165",
  "91738",
  "25649",
  "67823",
  "30587",
  "74293",
];

export default function Home() {
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const { setAuthenticated } = useGameStore();

  const handleKeyPress = (digit: string) => {
    if (code.length < 5) {
      setCode(code + digit);
      setError(false); // Clear error when typing
    }
  };

  const handleClear = () => {
    setCode("");
    setError(false);
  };

  const handleSubmit = () => {
    if (code.length === 5) {
      // Check if the code is valid
      if (VALID_PASSCODES.includes(code)) {
        setAuthenticated(true);
        router.push("/main");
      } else {
        setError(true);
        // Clear code after a delay
        setTimeout(() => {
          setCode("");
          setError(false);
        }, 1000);
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* P.E.N.1.5 logo at top */}
      <div className={styles.logoSection}>
        <p>PROTECTIVE</p>
        <p>ELECTRONIC</p>
        <p>NETWORK</p>
        <p>1.5</p>
      </div>

      {/* Five-digit code display in center */}
      <div className={`${styles.codeDisplay} ${error ? styles.error : ""}`}>
        <div>
          {[0, 1, 2, 3, 4].map((index) => (
            <div key={index} className={styles.codeDigit}>
              {code[index] || "_"}
            </div>
          ))}
        </div>
        {error && <div className={styles.errorMessage}>INVALID PASSCODE</div>}
      </div>

      {/* Keypad at bottom */}
      <div className={styles.keypad}>
        <div className={styles.keypadGrid}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <KeypadButton
              key={digit}
              size="large"
              onClick={() => handleKeyPress(digit.toString())}
            >
              {digit}
            </KeypadButton>
          ))}
          <KeypadButton size="large" onClick={handleClear}>
            CLR
          </KeypadButton>
          <KeypadButton size="large" onClick={() => handleKeyPress("0")}>
            0
          </KeypadButton>
          <KeypadButton size="large" onClick={handleSubmit}>
            OK
          </KeypadButton>
        </div>
      </div>
    </div>
  );
}
