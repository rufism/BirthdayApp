import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type GameState = {
  isAuthenticated: boolean;
  activePasscode: string | null;
  challenge1Complete: boolean;
  challenge2Complete: boolean;
  challenge3Complete: boolean;
  setAuthenticated: (value: boolean, passcode?: string) => void;
  completeChallenge1: () => void;
  completeChallenge2: () => void;
  completeChallenge3: () => void;
  allChallengesComplete: () => boolean;
  resetProgress: () => void;
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      activePasscode: null,
      challenge1Complete: false,
      challenge2Complete: false,
      challenge3Complete: false,

      setAuthenticated: (value: boolean, passcode?: string) =>
        set({
          isAuthenticated: value,
          activePasscode: passcode || null
        }),
      completeChallenge1: () => set({ challenge1Complete: true }),
      completeChallenge2: () => set({ challenge2Complete: true }),
      completeChallenge3: () => set({ challenge3Complete: true }),

      allChallengesComplete: () => {
        const state = get();
        return (
          state.challenge1Complete &&
          state.challenge2Complete &&
          state.challenge3Complete
        );
      },

      resetProgress: () =>
        set({
          isAuthenticated: false,
          activePasscode: null,
          challenge1Complete: false,
          challenge2Complete: false,
          challenge3Complete: false,
        }),
    }),
    {
      name: 'game-progress', // localStorage key
    }
  )
);
