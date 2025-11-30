"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useGameStore } from "@/store/useGameStore";

export default function Challenge2() {
  const router = useRouter();
  const { isAuthenticated, completeChallenge2, challenge2Complete } =
    useGameStore();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Initialize 3x3 grid - all lights off (false)
  const [grid, setGrid] = useState<boolean[][]>([
    [false, false, false],
    [false, false, false],
    [false, false, false],
  ]);
  const [isComplete, setIsComplete] = useState(false);

  // Check if all lights are on
  useEffect(() => {
    const allOn = grid.every((row) => row.every((cell) => cell === true));
    if (allOn && !isComplete) {
      setIsComplete(true);
      completeChallenge2();
      // Navigate back to main after a short delay
      setTimeout(() => {
        router.back();
      }, 2000);
    }
  }, [grid, isComplete, completeChallenge2, router]);

  // Toggle a light and its neighbors
  const toggleLight = (row: number, col: number) => {
    if (isComplete) return; // Don't allow changes after completion

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) => [...r]);

      // Toggle the clicked cell
      newGrid[row][col] = !newGrid[row][col];

      // Toggle neighbors (up, down, left, right)
      // Up
      if (row > 0) {
        newGrid[row - 1][col] = !newGrid[row - 1][col];
      }
      // Down
      if (row < 2) {
        newGrid[row + 1][col] = !newGrid[row + 1][col];
      }
      // Left
      if (col > 0) {
        newGrid[row][col - 1] = !newGrid[row][col - 1];
      }
      // Right
      if (col < 2) {
        newGrid[row][col + 1] = !newGrid[row][col + 1];
      }

      return newGrid;
    });
  };

  // Reset the game
  const resetGame = () => {
    setGrid([
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ]);
    setIsComplete(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>CHALLENGE 2: LIGHTS OUT</h1>
          <button className={styles.backButton} onClick={() => router.back()}>
            ←
          </button>
        </div>
        <p className={styles.subtitle}>
          TAP A LIGHT TO TOGGLE IT AND NEIGHBORS
        </p>
      </div>

      <div className={styles.activeContent}>
        <div className={styles.gridContainer}>
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.row}>
              {row.map((isOn, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`${styles.light} ${isOn ? styles.on : styles.off}`}
                  onClick={() => toggleLight(rowIndex, colIndex)}
                  aria-label={`Light ${rowIndex + 1}, ${colIndex + 1}`}
                />
              ))}
            </div>
          ))}
        </div>

        {isComplete && (
          <div className={styles.celebration}>
            <h2 className={styles.celebrationText}>SUCCESS</h2>
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <button className={styles.resetButton} onClick={resetGame}>
          {isComplete ? "PLAY AGAIN" : "RESET"}
        </button>
      </div>
    </div>
  );
}
