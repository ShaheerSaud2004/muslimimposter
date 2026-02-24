import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  withRepeat,
  withSequence,
  FadeIn,
  FadeInDown,
  SlideInRight,
} from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import * as Haptics from 'expo-haptics';
import { getMaxContentWidth, getResponsivePadding } from '../utils/responsive';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Menu'>;

export default function MenuScreen() {
  const navigation = useNavigation<MenuScreenNavigationProp>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const maxWidth = getMaxContentWidth();
  const responsivePadding = getResponsivePadding();
  
  const [showResetButton, setShowResetButton] = useState(false);
  const [showStatsHint, setShowStatsHint] = useState(false);
  const [forceRender, setForceRender] = useState(0);
  const buttonsRenderedRef = useRef(false);
  const buttonContainerRef = useRef<View | null>(null);
  const checkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const titleScale = useSharedValue(0.9);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const statsHintPulse = useSharedValue(1);

  useFocusEffect(
    React.useCallback(() => {
      setShowStatsHint(true);
    }, [])
  );

  useEffect(() => {
    // Animate title
    titleScale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });
    titleOpacity.value = withTiming(1, { duration: 400 });
    
    // Animate subtitle with delay
    subtitleOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
    
    // Animate tagline with delay
    taglineOpacity.value = withDelay(400, withTiming(1, { duration: 400 }));

    // Check if Get Started button is visible after 5 seconds
    checkTimeoutRef.current = setTimeout(() => {
      if (!buttonsRenderedRef.current) {
        // Buttons haven't rendered yet, show reset button
        setShowResetButton(true);
      }
    }, 5000);

    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, [forceRender]);

  useEffect(() => {
    if (showStatsHint) {
      statsHintPulse.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 600 }),
          withTiming(1, { duration: 600 })
        ),
        -1,
        true
      );
    }
    return () => {
      statsHintPulse.value = 1;
    };
  }, [showStatsHint]);

  const statsHintAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: statsHintPulse.value }],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
    opacity: titleOpacity.value,
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const handleSettingsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Settings');
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowResetButton(false);
    buttonsRenderedRef.current = false;
    setForceRender(prev => prev + 1); // Force re-render
    // Clear and restart animations
    titleScale.value = 0.9;
    titleOpacity.value = 0;
    subtitleOpacity.value = 0;
    taglineOpacity.value = 0;
    setTimeout(() => {
      titleScale.value = withSpring(1, { damping: 10, stiffness: 100 });
      titleOpacity.value = withTiming(1, { duration: 400 });
      subtitleOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
      taglineOpacity.value = withDelay(400, withTiming(1, { duration: 400 }));
      // Restart the 5-second check
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
      checkTimeoutRef.current = setTimeout(() => {
        if (!buttonsRenderedRef.current) {
          setShowResetButton(true);
        }
      }, 5000);
    }, 100);
  };

  // Calculate responsive logo size for smaller screens
  const logoSize = SCREEN_HEIGHT < 700 ? 280 : 360;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <PatternBackground />
      
      {/* Header area: stats hint badge + settings button */}
      <View
        style={[
          styles.header,
          {
            top: Math.max(insets.top, spacing.md) + spacing.sm,
            right: Math.max(insets.right, spacing.md) + spacing.sm,
          },
        ]}
      >
        {showStatsHint && (
          <Animated.View
            entering={SlideInRight.delay(1000).springify()}
            style={[styles.statsHintWrapper, statsHintAnimatedStyle]}
          >
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                navigation.navigate('Statistics');
              }}
              style={({ pressed }) => [
                styles.statsHintCircle,
                {
                  backgroundColor: colors.accent,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={[styles.statsHintText, { color: '#FFFFFF' }]}>
                View Statistics!
              </Text>
            </Pressable>
          </Animated.View>
        )}
        <Pressable
          onPress={handleSettingsPress}
          style={({ pressed }) => [
            styles.settingsButton,
            { opacity: pressed ? 0.6 : 1 },
          ]}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <View style={[styles.settingsIconContainer, { backgroundColor: colors.border }]}>
            <Image
              source={require('../settings.png')}
              style={[styles.settingsIcon, { tintColor: colors.textSecondary }]}
              resizeMode="contain"
            />
          </View>
        </Pressable>
      </View>

      {/* ScrollView ensures buttons are always accessible */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { 
            maxWidth, 
            paddingHorizontal: responsivePadding.horizontal,
            paddingTop: Math.max(insets.top, spacing.md) + 60, // Space for settings button
            paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.lg,
            minHeight: SCREEN_HEIGHT - Math.max(insets.top, spacing.md) - Math.max(insets.bottom, spacing.lg),
          }
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Animated.View style={titleAnimatedStyle}>
              <Logo width={logoSize} height={logoSize} style={[styles.logo, { width: logoSize, height: logoSize }]} />
            </Animated.View>
            <View style={styles.taglineOverlay}>
              <Animated.View style={taglineAnimatedStyle}>
                <View style={[styles.taglineContainer, { borderTopColor: colors.border }]}>
                  <Text
                    style={[styles.tagline, { color: colors.textSecondary }]}
                  >
                    {t('menu.tagline')}
                  </Text>
                </View>
              </Animated.View>
            </View>
          </View>

          {/* Buttons - always rendered with animations */}
          <View 
            ref={buttonContainerRef} 
            style={styles.buttonContainer} 
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              // Button container rendered with actual dimensions
              if (width > 0 && height > 0) {
                buttonsRenderedRef.current = true;
                if (showResetButton) {
                  setShowResetButton(false);
                }
              }
            }}
          >
            {/* Get Started button - animated but always clickable */}
            <Animated.View 
              entering={FadeInDown.delay(300).springify()}
              style={styles.buttonWrapper}
            >
              <Button
                title={t('menu.getStarted')}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  navigation.navigate('GameSetup');
                }}
                style={styles.button}
              />
            </Animated.View>
            {/* How to Play button - animated but always clickable */}
            <Animated.View 
              entering={FadeInDown.delay(400).springify()}
              style={styles.buttonWrapper}
            >
              <Button
                title={t('menu.howToPlay')}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  navigation.navigate('HowToPlay');
                }}
                variant="secondary"
                style={styles.button}
              />
            </Animated.View>
            
            {/* Fallback reset button if Get Started doesn't appear after 5 seconds */}
            {showResetButton && (
              <Animated.View entering={FadeIn.delay(0).springify()} style={styles.resetContainer}>
                <Button
                  title="Reset Screen"
                  onPress={handleReset}
                  variant="secondary"
                  style={styles.resetButton}
                />
                <Text style={[styles.resetText, { color: colors.textSecondary }]}>
                  Buttons didn't load. Tap to reload.
                </Text>
              </Animated.View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  statsHintWrapper: {
    marginRight: spacing.xs,
  },
  statsHintCircle: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  statsHintText: {
    ...typography.bodyBold,
    fontSize: 13,
    fontWeight: '700',
  },
  settingsButton: {
    padding: spacing.xs,
  },
  settingsIconContainer: {
    width: 44, // iOS accessibility minimum
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    opacity: 1, // Fully visible
    minWidth: 44,
    minHeight: 44,
  },
  settingsIcon: {
    width: 20,
    height: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    marginBottom: 0,
  },
  taglineOverlay: {
    position: 'absolute',
    bottom: spacing.xl,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    ...typography.heading,
    fontSize: 36,
    marginBottom: spacing.lg,
    letterSpacing: 2,
  },
  taglineContainer: {
    borderTopWidth: 1,
    paddingTop: spacing.xs / 4,
    marginTop: 0,
    marginBottom: 0,
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
  },
  tagline: {
    ...typography.body,
    fontSize: 15,
    textAlign: 'center',
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    gap: spacing.md,
    marginTop: spacing.lg,
    paddingBottom: spacing.md,
    minHeight: 140, // Ensure container has height even if buttons don't render
  },
  buttonWrapper: {
    width: '100%',
    opacity: 1, // Always visible
    zIndex: 10, // Ensure it's above other elements
    // Ensure buttons are clickable even during animation
    pointerEvents: 'auto',
  },
  button: {
    width: '100%',
    minHeight: 56, // Ensure button is always visible
  },
  resetContainer: {
    width: '100%',
    marginTop: spacing.md,
    alignItems: 'center',
  },
  resetButton: {
    width: '100%',
    minHeight: 56,
  },
  resetText: {
    ...typography.caption,
    fontSize: 12,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});