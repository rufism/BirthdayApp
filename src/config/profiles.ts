export type CipherMessageType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

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
    cipherMessage: 2,
  },
  "19456": {
    passcode: "19456",
    name: "JAIMIE", // chambers
    cipherMessage: 6,
  },
  "67238": {
    passcode: "67238",
    name: "MCNASTY", // kyle
    cipherMessage: 4,
  },
  "42891": {
    passcode: "42891",
    name: "WOLL-MAN", // jordan
    cipherMessage: 1,
  },
  "95314": {
    passcode: "95314",
    name: "SMOOCH NASTY",
    cipherMessage: 5,
  },
  "28765": {
    passcode: "28765",
    name: "UPINDERDEEP", // josh
    cipherMessage: 4,
  },
  "71043": {
    passcode: "71043",
    name: "DJ DUNGEON MASTER", // brendan
    cipherMessage: 3,
  },
  "36582": {
    passcode: "36582",
    name: "SNEAKY FART",
    cipherMessage: 6,
  },
  "50927": {
    passcode: "50927",
    name: "SLIP DIGGY",
    cipherMessage: 6,
  },
  "63148": {
    passcode: "63148",
    name: "FREAKY JOE",
    cipherMessage: 6,
  },
  "89271": {
    passcode: "89271",
    name: "WAKA WAKA TOMATO",
    cipherMessage: 6,
  },
  "14536": {
    passcode: "14536",
    name: "MR BIG STUFF",
    cipherMessage: 6,
  },
  "72904": {
    passcode: "72904",
    name: "HOWDY DOODY",
    cipherMessage: 6,
  },
  "48165": {
    passcode: "48165",
    name: "QUICK FLICK",
    cipherMessage: 6,
  },
  "91738": {
    passcode: "91738",
    name: "PAPA SMURF",
    cipherMessage: 6,
  },
  "25649": {
    passcode: "25649",
    name: "COOKIE CRUMBLE",
    cipherMessage: 6,
  },
};

export const getProfile = (passcode: string): Profile | null => {
  return PROFILES[passcode] || null;
};

export const isValidPasscode = (passcode: string): boolean => {
  return passcode in PROFILES;
};
