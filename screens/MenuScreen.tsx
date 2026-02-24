import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { useTheme } from '../contexts/ThemeContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import * as Haptics from 'expo-haptics';
import { getMaxContentWidth, getResponsivePadding } from '../utils/responsive';

type MenuScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Menu'>;

export default function MenuScreen() {
  const navigation = useNavigation<MenuScreenNavigationProp>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const maxWidth = getMaxContentWidth();
  const responsivePadding = getResponsivePadding();
  
  const titleScale = useSharedValue(0.9);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);

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
  }, []);

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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <PatternBackground />
      
      <View style={[styles.header, { top: insets.top + spacing.lg, right: insets.right + spacing.lg }]}>
        <Pressable
          onPress={handleSettingsPress}
          style={({ pressed }) => [
            styles.settingsButton,
            {
              opacity: pressed ? 0.6 : 1,
            },
          ]}
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

      <View style={[styles.content, { maxWidth, paddingHorizontal: responsivePadding.horizontal }]}>
        <Animated.View style={[titleAnimatedStyle, styles.logoContainer]}>
          <Logo width={400} height={400} style={styles.logo} />
          <Animated.View style={[taglineAnimatedStyle, styles.taglineOverlay]}>
            <View style={[styles.taglineContainer, { borderTopColor: colors.border }]}>
              <Text
                style={[styles.tagline, { color: colors.textSecondary }]}
              >
                The Islamic Hidden Word Game
              </Text>
            </View>
          </Animated.View>
        </Animated.View>

        <View style={styles.buttonContainer}>
          <View style={{ opacity: 1 }}>
            <Animated.View entering={FadeInDown.delay(300).springify()}>
              <Button
                title="Get Started"
                onPress={() => navigation.navigate('GameSetup')}
                style={styles.button}
              />
            </Animated.View>
          </View>
          <View style={{ opacity: 1 }}>
            <Animated.View entering={FadeInDown.delay(400).springify()}>
              <Button
                title="How to Play"
                onPress={() => navigation.navigate('HowToPlay')}
                variant="secondary"
                style={styles.button}
              />
            </Animated.View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    zIndex: 10,
    padding: spacing.sm,
  },
  settingsButton: {
    padding: spacing.sm,
  },
  settingsIconContainer: {
    width: 44, // iOS accessibility minimum
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    opacity: 0.8, // Slightly more visible
    minWidth: 44,
    minHeight: 44,
  },
  settingsIcon: {
    width: 20,
    height: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 360,
    height: 360,
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
    minHeight: 120, // Ensure container has height even if buttons don't render
  },
  button: {
    width: '100%',
  },
});