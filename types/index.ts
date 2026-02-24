export type Player = {
  id: string;
  name: string;
  role: 'normal' | 'imposter' | 'doubleAgent';
  hasSeenCard: boolean;
  quizAnswer?: string; // For quiz mode: player's typed answer
};

export type GameMode = 'word' | 'quiz';

export type SpecialModes = {
  blindImposter: boolean;
  doubleAgent: boolean;
};

export type GameSettings = {
  numPlayers: number;
  numImposters: number;
  mode: GameMode;
  specialModes: SpecialModes;
  selectedCategories: string[];
  showCategoryToImposter: boolean;
  showHintToImposter: boolean;
  startingPlayerId: string;
  secretWord: string;
  secretCategory: string;
  secretHint?: string;
  difficulty?: Difficulty | 'all';
  playerNames?: string[]; // Store player names for persistence
  quizQuestion?: string; // For quiz mode: the question shown to normal players
  imposterQuizQuestion?: string; // For quiz mode: the question shown to imposter
};

export type Difficulty = 'easy' | 'medium' | 'hard';

export type Category = {
  id: string;
  name: string;
  description: string;
  words: string[];
  locked: boolean;
  isCustom: boolean;
  difficulty?: Difficulty;
};

export type AppSettings = {
  theme: 'soft' | 'paper' | 'dark';
  unlockedCategories: string[];
  customCategories: Category[];
};