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
