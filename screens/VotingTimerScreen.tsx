import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { Button } from '../components/Button';
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

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleAdd30 = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeUp(false);
    setTimeRemaining((prev) => Math.min(300, prev + 30));
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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
            <Button
              title="Reveal When Ready ✨"
              onPress={handleReveal}
              style={styles.button}
              textStyle={styles.buttonText}
            />
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
    maxWidth: 400,
    alignItems: 'center',
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
