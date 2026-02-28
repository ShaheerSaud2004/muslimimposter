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

/**
 * Get responsive font size. On small screens (< 375px), scales UP so text is never tiny.
 * Aggressive scaling ensures readable text on all device sizes.
 */
export const getResponsiveFontSize = (baseSize: number, _minSize?: number): number => {
  const scale =
    SCREEN_WIDTH < FONT_REF_WIDTH
      ? Math.min(FONT_REF_WIDTH / SCREEN_WIDTH, 1.4) // scale up on small phones (max 40% larger)
      : Math.min(SCREEN_WIDTH / FONT_REF_WIDTH, 1.35); // scale up on large screens
  return Math.round(baseSize * scale);
};

/**
 * Get responsive font size for the cue/secret word. Aggressive scaling so it's
 * never small on any device. Hard floor of 80px.
 */
export const getResponsiveCueWordFontSize = (): number => {
  const scale =
    SCREEN_WIDTH < CUE_WORD_REF_WIDTH
      ? Math.min(CUE_WORD_REF_WIDTH / SCREEN_WIDTH, 1.35) // scale up on small phones
      : Math.min(SCREEN_WIDTH / CUE_WORD_REF_WIDTH, 1.3);
  const scaled = Math.round(CUE_WORD_BASE_FONT_SIZE * scale);
  return Math.max(CUE_WORD_MIN_FONT_SIZE, Math.min(CUE_WORD_MAX_FONT_SIZE, scaled));
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
  return getResponsiveFontSize(64);
};
