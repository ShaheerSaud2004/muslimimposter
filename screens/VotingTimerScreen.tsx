import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, AppState, AppStateStatus } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { useTheme } from '../contexts/ThemeContext';
import { useGame } from '../contexts/GameContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import { getVotingTimeSeconds } from '../utils/game';
import * as Haptics from 'expo-haptics';

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

type VotingTimerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'VotingTimer'
>;

export default function VotingTimerScreen() {
  const navigation = useNavigation<VotingTimerScreenNavigationProp>();
  const { colors } = useTheme();
  const { players } = useGame();
  const initialSeconds = getVotingTimeSeconds(players.length);
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [timeUp, setTimeUp] = useState(false);
  // End time (ms) so timer is correct when app reopens or phone was off
  const endTimeRef = useRef<number>(Date.now() + initialSeconds * 1000);

  // Play haptic feedback (and optional sound) when timer ends
  const playTimerEndSound = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 200);
  }, []);

  const tick = useCallback(() => {
    const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
    setTimeRemaining(remaining);
    if (remaining <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimeUp(true);
      playTimerEndSound();
    }
  }, [playTimerEndSound]);

  const startInterval = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(tick, 1000);
  }, [tick]);

  useEffect(() => {
    endTimeRef.current = Date.now() + initialSeconds * 1000;
    startInterval();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startInterval]);

  // When app comes back from background or phone wakes, recalc time and trigger sound if time's up
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState !== 'active') return;
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
      setTimeRemaining(remaining);
      if (remaining <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setTimeUp(true);
        playTimerEndSound();
      } else {
        startInterval();
      }
    });
    return () => sub.remove();
  }, [playTimerEndSound, startInterval]);

  const handleAdd30 = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeUp(false);
    endTimeRef.current += 30 * 1000;
    setTimeRemaining((prev) => Math.min(300, prev + 30));
    if (timerRef.current) clearInterval(timerRef.current);
    startInterval();
  };

  const handleReveal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    navigation.navigate('Reveal');
  };

  if (players.length === 0) {
    return null;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <PatternBackground />
      <Animated.View style={styles.content} entering={FadeInDown.delay(0).springify()}>
        <View style={styles.header}>
          <Text style={[styles.heading, { color: colors.text }]}>
            Discussion & voting
          </Text>
          <Text style={[styles.subheading, { color: colors.textSecondary }]}>
            Discuss and vote in person. Reveal when ready.
          </Text>
        </View>

        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.timerSection}>
          <View style={[styles.timerCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.timerLabel, { color: colors.textSecondary }]}>
              Time remaining
            </Text>
            <Text style={[styles.timerValue, { color: timeUp ? colors.imposter : colors.accent }]}>
              {formatTime(timeRemaining)}
            </Text>
            {timeUp && (
              <Text style={[styles.timeUpText, { color: colors.imposter }]}>Time's up!</Text>
            )}
            <Pressable
              onPress={handleAdd30}
              style={({ pressed }) => [
                styles.add30Button,
                { backgroundColor: colors.accentLight, borderColor: colors.accent, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text style={[styles.add30ButtonText, { color: colors.accent }]}>+30 sec</Text>
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(300)} style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                handleReveal();
              }}
              style={({ pressed }) => [
                styles.revealButton,
                {
                  backgroundColor: colors.accent,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <Text style={[styles.revealButtonText, { color: '#FFFFFF' }]}>
                Reveal When Ready
              </Text>
              <Svg width={20} height={20} viewBox="0 -960 960 960" fill="#FFFFFF" style={styles.revealButtonIcon}>
                <Path d="M480-80q-26 0-47-12.5T400-126q-33 0-56.5-23.5T320-206v-142q-59-39-94.5-103T190-590q0-121 84.5-205.5T480-880q121 0 205.5 84.5T770-590q0 77-35.5 140T640-348v142q0 33-23.5 56.5T560-126q-12 21-33 33.5T480-80Zm-80-126h160v-36H400v36Zm0-76h160v-38H400v38Zm-8-118h58v-108l-88-88 42-42 76 76 76-76 42 42-88 88v108h58q54-26 88-76.5T690-590q0-88-61-149t-149-61q-88 0-149 61t-61 149q0 63 34 113.5t88 76.5Zm88-162Zm0-38Z" />
              </Svg>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  heading: {
    ...typography.heading,
    fontSize: 26,
    textAlign: 'center',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subheading: {
    ...typography.body,
    fontSize: 14,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  timerSection: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  timerCard: {
    padding: spacing.xl,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
  },
  timerLabel: {
    ...typography.caption,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  timerValue: {
    fontSize: 48,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    marginBottom: spacing.xs,
  },
  timeUpText: {
    ...typography.bodyBold,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  add30Button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 2,
  },
  add30ButtonText: {
    ...typography.bodyBold,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  revealButton: {
    width: '100%',
    minHeight: 48,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  revealButtonText: {
    ...typography.bodyBold,
    fontSize: 16,
    fontWeight: '700',
  },
  revealButtonIcon: {
    marginLeft: spacing.xs,
  },
  button: {
    width: '100%',
    minHeight: 56,
    paddingVertical: spacing.md,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
