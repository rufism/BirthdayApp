'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  const [code, setCode] = useState<string>("");
  const router = useRouter();

  const handleKeyPress = (digit: string) => {
    if (code.length < 5) {
      setCode(code + digit);
    }
  };

  const handleClear = () => {
    setCode("");
  };

  const handleSubmit = () => {
    if (code.length === 5) {
      // Navigate to main page
      router.push('/main');
    }
  };

  return (
    <div className={styles.container}>
      {/* Logo/Image at top */}
      <div className={styles.logoSection}>
        <Image
          src="/next.svg"
          alt="Logo"
          width={180}
          height={40}
          priority
        />
      </div>

      {/* Five-digit code display in center */}
      <div className={styles.codeDisplay}>
        {[0, 1, 2, 3, 4].map((index) => (
          <div key={index} className={styles.codeDigit}>
            {code[index] || "_"}
          </div>
        ))}
      </div>

      {/* Keypad at bottom */}
      <div className={styles.keypad}>
        <div className={styles.keypadGrid}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
            <button
              key={digit}
              className={styles.keypadButton}
              onClick={() => handleKeyPress(digit.toString())}
            >
              {digit}
            </button>
          ))}
          <button
            className={styles.keypadButton}
            onClick={handleClear}
          >
            CLR
          </button>
          <button
            className={styles.keypadButton}
            onClick={() => handleKeyPress("0")}
          >
            0
          </button>
          <button
            className={styles.keypadButton}
            onClick={handleSubmit}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
