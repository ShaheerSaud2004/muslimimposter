import { Platform, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Check if the device is an iPad
 */
export const isIPad = (): boolean => {
  if (Platform.OS !== 'ios') return false;
  
  // iPad detection: width >= 768 or height >= 1024
  // Also check for iPad-specific identifiers
  const isTablet = 
    SCREEN_WIDTH >= 768 || 
    SCREEN_HEIGHT >= 1024 ||
    (Platform.isPad === true);
  
  return isTablet;
};

/**
 * Get maximum content width for responsive layouts
 * On iPad, constrain to a readable width
 * On iPhone, use full width
 */
export const getMaxContentWidth = (): number => {
  if (isIPad()) {
    // Constrain to a comfortable reading width on iPad (similar to iPhone width)
    return 600;
  }
  return SCREEN_WIDTH;
};

/**
 * Get responsive padding based on device
 */
export const getResponsivePadding = (): { horizontal: number; vertical: number } => {
  if (isIPad()) {
    return {
      horizontal: 48, // More padding on iPad
      vertical: 32,
    };
  }
  return {
    horizontal: 24, // Standard padding on iPhone
    vertical: 24,
  };
};

/**
 * Get screen dimensions
 */
export const getScreenDimensions = () => ({
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isIPad: isIPad(),
});

// Reference width for cue word scaling. Large so the word is the clear focal point.
const CUE_WORD_REF_WIDTH = 390;
const CUE_WORD_BASE_FONT_SIZE = 88;
const CUE_WORD_MIN_FONT_SIZE = 80;
const CUE_WORD_MAX_FONT_SIZE = 110;

/** Reference width for general font scaling (iPhone 14/15 base) */
const FONT_REF_WIDTH = 375;

/** Global minimum – no on-screen text is smaller than this on any device */
export const MIN_FONT_SIZE = 15;

/** Minimum font size for the secret word – always much bigger than category. Never smaller than this on any device. */
export const MIN_WORD_FONT_SIZE = 44;

/**
 * Minimum font size for any text on the card – never smaller than category or player name.
 * Use this to floor all card body text (labels, translation, instruction, etc.).
 */
export const getMinCardTextSize = (): number => {
  return Math.max(getResponsiveFontSize(14), getResponsiveFontSize(18));
};

/**
 * Get responsive font size. On small screens (< 375px), scales UP so text is never tiny.
 * Result is never smaller than MIN_FONT_SIZE so text is never smaller than other UI text.
 */
export const getResponsiveFontSize = (baseSize: number, minSize?: number): number => {
  const scale =
    SCREEN_WIDTH < FONT_REF_WIDTH
      ? Math.min(FONT_REF_WIDTH / SCREEN_WIDTH, 1.4) // scale up on small phones (max 40% larger)
      : Math.min(SCREEN_WIDTH / FONT_REF_WIDTH, 1.35); // scale up on large screens
  const size = Math.round(baseSize * scale);
  const floor = minSize != null ? Math.max(MIN_FONT_SIZE, minSize) : MIN_FONT_SIZE;
  return Math.max(floor, size);
};

/**
 * Get responsive font size for the cue/secret word. Aggressive scaling so it's
 * never small on any device (iPhone 14, 17 Pro, etc.). Scale up on large screens too.
 */
export const getResponsiveCueWordFontSize = (): number => {
  const scale =
    SCREEN_WIDTH < CUE_WORD_REF_WIDTH
      ? Math.min(CUE_WORD_REF_WIDTH / SCREEN_WIDTH, 1.35) // scale up on small phones
      : Math.min(SCREEN_WIDTH / FONT_REF_WIDTH, 1.45); // scale up on large screens (e.g. iPhone 17 Pro)
  const scaled = Math.round(CUE_WORD_BASE_FONT_SIZE * scale);
  const clamped = Math.max(CUE_WORD_MIN_FONT_SIZE, Math.min(CUE_WORD_MAX_FONT_SIZE, scaled));
  const base = Math.max(MIN_WORD_FONT_SIZE, clamped);
  // On large screens ensure word is never small (e.g. 17 Pro): at least 1.2x category-ish size
  const largeScreenMin = getResponsiveFontSize(28);
  return Math.max(base, largeScreenMin);
};

/**
 * Minimum scale factor for cue word when it auto-shrinks (adjustsFontSizeToFit).
 * 0.95 = allow up to 5% shrink so single words like "Khutbah" stay on one line.
 */
export const getResponsiveCueWordMinimumScale = (): number => {
  return 0.95;
};

/**
 * Font size for split phrases (e.g. "The Cow of" / "Bani Israel").
 * Large base so it's never small on any device.
 */
export const getResponsiveSplitPhraseFontSize = (): number => {
  const size = getResponsiveFontSize(64);
  return Math.max(MIN_WORD_FONT_SIZE, size);
};

/**
 * Scale factor for multi-word phrase font so longer phrases fit on fewer lines.
 * 2 words = 0.95, 3 = ~0.7, 4 = ~0.58, 5+ = ~0.52. Result still floored by MIN_WORD_FONT_SIZE at use site.
 */
export const getPhraseFontScaleByWordCount = (wordCount: number): number => {
  if (wordCount <= 1) return 1;
  if (wordCount === 2) return 0.95;
  if (wordCount === 3) return 0.7;
  if (wordCount === 4) return 0.58;
  return Math.max(0.5, 0.7 - (wordCount - 3) * 0.06);
};
