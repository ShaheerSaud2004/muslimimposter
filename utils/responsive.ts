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

// Reference width for cue word scaling (e.g. standard iPhone)
const CUE_WORD_REF_WIDTH = 390;
const CUE_WORD_BASE_FONT_SIZE = 56;
const CUE_WORD_MIN_FONT_SIZE = 28;

/**
 * Get responsive font size for the cue/secret word so it stays readable on
 * small devices (e.g. iPhone mini) and doesn't get oversized on large screens.
 */
export const getResponsiveCueWordFontSize = (): number => {
  const scale = SCREEN_WIDTH / CUE_WORD_REF_WIDTH;
  const scaled = Math.round(CUE_WORD_BASE_FONT_SIZE * scale);
  return Math.max(CUE_WORD_MIN_FONT_SIZE, Math.min(CUE_WORD_BASE_FONT_SIZE, scaled));
};

/**
 * Minimum scale factor for cue word when it auto-shrinks (adjustsFontSizeToFit).
 * Higher = text won't shrink as much on small screens, keeping it readable.
 */
export const getResponsiveCueWordMinimumScale = (): number => {
  // On narrow screens, don't allow shrinking below 75% so the word stays readable
  if (SCREEN_WIDTH <= 375) return 0.75;
  return 0.6;
};
