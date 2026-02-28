/**
 * Game and UI constants used across the app.
 */

/** Word display on cards */
export const WORD_DISPLAY = {
  /** Base font size for split phrases; use getResponsiveSplitPhraseFontSize() at runtime */
  SPLIT_PHRASE_FONT_SIZE_BASE: 54,
  /** Minimum scale for single-word shrink-to-fit so word stays readable (never tiny) */
  WORD_MIN_SCALE: 0.95,
  /** If phrase length ≤ this, show on one line (e.g. "Ibrahim (AS)", "Laylatul Qadr") */
  MAX_SINGLE_LINE_CHARS: 16,
} as const;

/** Game setup limits */
export const GAME_SETUP = {
  /** Max categories shown in selector before "and X more" */
  MAX_VISIBLE_CATEGORIES: 6,
  /** Max length for player name input */
  PLAYER_NAME_MAX_LENGTH: 20,
} as const;

/** Voting timer (seconds) */
export const VOTING_TIMER = {
  BASE_SECONDS: 45,
  PER_PLAYER_SECONDS: 15,
  MIN_SECONDS: 60,
  MAX_SECONDS: 300,
  ADD_30_SECONDS: 30,
} as const;

/** Default discussion time presets (when user chooses in Settings) */
export const DISCUSSION_TIME_PRESET_SECONDS: Record<'short' | 'medium' | 'long', number> = {
  short: 60,
  medium: 120,
  long: 180,
} as const;

/** App branding and links for share / marketing */
export const APP = {
  NAME: 'Khafī',
  TAGLINE: 'The Islamic hidden word game. One phone, pass & play.',
  STORE_URL: 'https://apps.apple.com/us/app/khafi/id6758224320',
} as const;
