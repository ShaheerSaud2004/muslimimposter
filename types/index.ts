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
  trollMode: boolean;
};

export type GameSettings = {
  numPlayers: number;
  numImposters: number;
  /** User's chosen imposter count from Game Setup; used so Play Again after a troll round resets to this. */
  userChosenNumImposters?: number;
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
  /** When true, this round is a troll round: everyone but one is imposter, and imposters don't see who else is imposter */
  trollRoundActive?: boolean;
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

/** User-created playlist: name + list of category IDs */
export type CustomPlaylist = {
  id: string;
  name: string;
  categoryIds: string[];
};

export type Locale = 'en' | 'ar' | 'ur';

export type DiscussionTimePreset = 'short' | 'medium' | 'long';

export type AppSettings = {
  theme: 'soft' | 'paper' | 'dark' | 'ramadan';
  locale: Locale;
  unlockedCategories: string[];
  customCategories: Category[];
  debugMode?: boolean;
  hapticsEnabled?: boolean;
  soundEnabled?: boolean;
  /** Default discussion (voting) timer: short 1 min, medium 2 min, long 3 min. Omit = use dynamic (base + per player). */
  discussionTimePreset?: DiscussionTimePreset;
};