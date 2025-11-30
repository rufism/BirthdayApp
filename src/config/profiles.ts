export type CipherMessageType = 0 | 1 | 2 | 3 | 4 | 5;

export interface Profile {
  passcode: string;
  name: string;
  cipherMessage: CipherMessageType;
}

export const PROFILES: Record<string, Profile> = {
  "53712": {
    passcode: "53712",
    name: "GUANSTAUNCHAMO", // david
    cipherMessage: 5,
  },
  "84629": {
    passcode: "84629",
    name: "FOURTHLINE", // ben
    cipherMessage: 3,
  },
  "19456": {
    passcode: "19456",
    name: "JAIMIE", // chambers
    cipherMessage: 2,
  },
  "67238": {
    passcode: "67238",
    name: "MCNASTY", // kyle
    cipherMessage: 4,
  },
  "42891": {
    passcode: "42891",
    name: "FLUFFY CLOUD", // jordan
    cipherMessage: 4,
  },
  "95314": {
    passcode: "95314",
    name: "SNEAKY FART",
    cipherMessage: 5,
  },
  "28765": {
    passcode: "28765",
    name: "HOTTIE", // josh
    cipherMessage: 4,
  },
  "71043": {
    passcode: "71043",
    name: "CO-CAN-E", // brendan
    cipherMessage: 3,
  },
  "36582": {
    passcode: "36582",
    name: "Agent India",
    cipherMessage: 2,
  },
  "50927": {
    passcode: "50927",
    name: "Agent Juliet",
    cipherMessage: 3,
  },
  "63148": {
    passcode: "63148",
    name: "Agent Kilo",
    cipherMessage: 4,
  },
  "89271": {
    passcode: "89271",
    name: "Agent Lima",
    cipherMessage: 5,
  },
  "14536": {
    passcode: "14536",
    name: "Agent Mike",
    cipherMessage: 0,
  },
  "72904": {
    passcode: "72904",
    name: "Agent November",
    cipherMessage: 1,
  },
  "48165": {
    passcode: "48165",
    name: "Agent Oscar",
    cipherMessage: 2,
  },
  "91738": {
    passcode: "91738",
    name: "Agent Papa",
    cipherMessage: 3,
  },
  "25649": {
    passcode: "25649",
    name: "Agent Quebec",
    cipherMessage: 4,
  },
  "67823": {
    passcode: "67823",
    name: "Agent Romeo",
    cipherMessage: 5,
  },
  "30587": {
    passcode: "30587",
    name: "Agent Sierra",
    cipherMessage: 0,
  },
  "74293": {
    passcode: "74293",
    name: "Agent Tango",
    cipherMessage: 1,
  },
};

export const getProfile = (passcode: string): Profile | null => {
  return PROFILES[passcode] || null;
};

export const isValidPasscode = (passcode: string): boolean => {
  return passcode in PROFILES;
};
