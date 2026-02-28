import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { RootStackParamList } from '../App';
import { Button } from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import * as Haptics from 'expo-haptics';
import { getMaxContentWidth, getResponsivePadding } from '../utils/responsive';

type HowToPlayScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HowToPlay'
>;

const STEPS = [
  {
    title: 'Setup Your Game',
    description: 'Players, categories, and options',
    lines: [
      {
        text: 'Choose 3–20 players and how many imposters (about 1 per 3 players works best).',
        example: 'e.g. 6 players → 2 imposters',
      },
      {
        text: 'Pick categories or leave empty to use all. Tap "See More" to browse and read descriptions.',
        example: 'Prophets, Seerah, Ramadan, Worship, and more.',
      },
      {
        text: 'Optional: Blind Imposter (imposter doesn’t see the category), Double Agent (one player knows the word but isn’t the imposter).',
        example: null,
      },
      {
        text: 'Tap "Start Game" when you’re ready.',
        example: null,
      },
    ],
  },
  {
    title: 'Reveal Your Cards',
    description: 'Pass the phone; everyone sees their role in secret',
    lines: [
      {
        text: 'The app shows who goes first. Pass the phone to that player.',
        example: null,
      },
      {
        text: 'Each player taps their name to reveal their card. Only they look—keep the screen private.',
        example: null,
      },
      {
        text: 'Normal players see the secret word (and category). Imposters see "IMPOSTER" (or nothing if Blind Imposter is on).',
        example: null,
      },
      {
        text: 'When everyone has seen their card, tap "Continue to Round".',
        example: null,
      },
    ],
  },
  {
    title: 'Play the Round',
    description: 'Give clues, discuss, vote, then reveal',
    lines: [
      {
        text: 'Word mode: Each player gives one clue related to the secret word. Quiz mode: Answer a question, then give clues.',
        example: 'Word "Masjid" → clues like "Prayer", "Dome", "Friday".',
      },
      {
        text: 'Discuss as a group who you think is the imposter. Vote in person (raise hands or agree together).',
        example: null,
      },
      {
        text: 'Tap "Proceed to Timer" to start the discussion timer (time scales with group size; use "+30 sec" if needed).',
        example: null,
      },
      {
        text: 'When you’re ready, tap "Reveal When Ready" to see the results.',
        example: null,
      },
    ],
  },
  {
    title: 'Reveal the Results',
    description: 'See the word and imposters, then play again',
    lines: [
      {
        text: 'Tap "Reveal Results" to see the secret word and who the imposters were.',
        example: null,
      },
      {
        text: 'Voted out an imposter? Normal players win. Otherwise, imposters win.',
        example: null,
      },
      {
        text: '"Play Again" = new round (new word, new imposter). "New Game" = change players or settings.',
        example: null,
      },
    ],
  },
];

function StepIcon({ stepIndex, fill }: { stepIndex: number; fill: string }) {
  const size = 28;
  const vb = '0 0 24 24';
  const vb960 = '0 -960 960 960';
  if (stepIndex === 0) {
    return (
      <Svg width={size} height={size} viewBox={vb} fill={fill}>
        <Path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.04.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
      </Svg>
    );
  }
  if (stepIndex === 1) {
    return (
      <Svg width={size} height={size} viewBox={vb960} fill={fill}>
        <Path d="M320-120q-33 0-56.5-23.5T240-200v-560q0-33 23.5-56.5T320-840h320q33 0 56.5 23.5T720-760v560q0 33-23.5 56.5T640-120H320Zm320-80v-560H320v560h320ZM508.5-651.5Q520-663 520-680t-11.5-28.5Q497-720 480-720t-28.5 11.5Q440-697 440-680t11.5 28.5Q463-640 480-640t28.5-11.5ZM0-360v-240h80v240H0Zm120 80v-400h80v400h-80Zm760-80v-240h80v240h-80Zm-120 80v-400h80v400h-80Zm-440 80v-560 560Z" />
      </Svg>
    );
  }
  if (stepIndex === 2) {
    return (
      <Svg width={size} height={size} viewBox={vb} fill={fill}>
        <Path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox={vb} fill={fill}>
      <Path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C18.08 14.63 20 12.55 20 10V7c0-1.1-.9-2-2-2zM5 10V7h2v3H5zm14 0h-2V7h2v3z" />
    </Svg>
  );
}

export default function HowToPlayScreen() {
  const navigation = useNavigation<HowToPlayScreenNavigationProp>();
  const { colors } = useTheme();
  const maxWidth = getMaxContentWidth();
  const responsivePadding = getResponsivePadding();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <PatternBackground />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { maxWidth, alignSelf: 'center', width: '100%' },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(0).springify()}>
          <View style={styles.header}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.goBack();
              }}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <Text style={[styles.backButton, { color: colors.accent }]}>← Back</Text>
            </Pressable>
            <View style={styles.titleBlock}>
              <View style={[styles.titleAccentLine, { backgroundColor: colors.accent }]} />
              <View style={styles.titleContent}>
                <Text style={[styles.title, { color: colors.text }]}>How to Play</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  خفي — the hidden word game
                </Text>
                <Text style={[styles.introText, { color: colors.textSecondary }]}>
                  Four simple steps to get started. Great for family, Islamic events, and game night.
                </Text>
              </View>
            </View>
          </View>

          {STEPS.map((step, i) => (
            <Animated.View
              key={i}
              entering={FadeInDown.delay(120 + i * 80).springify()}
              style={[styles.stepCard, { backgroundColor: colors.cardBackground, borderColor: colors.border, shadowColor: colors.shadow }]}
            >
              <View style={[styles.stepHeader, { borderBottomColor: colors.border }]}>
                <View style={[styles.stepIconWrap, { backgroundColor: colors.accentLight }]}>
                  <StepIcon stepIndex={i} fill={colors.accent} />
                </View>
                <View style={styles.stepTitleContainer}>
                  <View style={[styles.stepNumberBadge, { borderColor: colors.accent }]}>
                    <Text style={[styles.stepNumber, { color: colors.accent }]}>{i + 1}</Text>
                  </View>
                  <View style={styles.stepTitleTextContainer}>
                    <Text style={[styles.stepTitle, { color: colors.text }]}>{step.title}</Text>
                    <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>{step.description}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.stepBody}>
                {step.lines.map((line, j) => (
                  <View key={j} style={styles.stepLineContainer}>
                    <View style={styles.stepLine}>
                      <View style={[styles.bullet, { backgroundColor: colors.accent }]} />
                      <Text style={[styles.stepText, { color: colors.text }]}>{line.text}</Text>
                    </View>
                    {line.example && (
                      <View style={[styles.exampleBox, { backgroundColor: colors.accentLight, borderLeftColor: colors.accent }]}>
                        <Text style={[styles.exampleLabel, { color: colors.accent }]}>Example:</Text>
                        <Text style={[styles.exampleText, { color: colors.textSecondary }]}>{line.example}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </Animated.View>
          ))}

          <Animated.View entering={FadeIn.delay(500)} style={styles.cta}>
            <Button
              title="Got it!"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                navigation.goBack();
              }}
              style={styles.ctaButton}
            />
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    width: '100%',
  },
  header: {
    marginBottom: spacing.xl,
  },
  backButton: {
    ...typography.bodyBold,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  titleBlock: {
    position: 'relative',
    paddingLeft: spacing.lg,
  },
  titleAccentLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderRadius: 2,
  },
  titleContent: {
    paddingLeft: spacing.md,
  },
  title: {
    ...typography.heading,
    fontSize: 32,
    marginBottom: spacing.xs,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    ...typography.body,
    fontSize: 16,
    marginBottom: spacing.md,
    opacity: 0.9,
    fontWeight: '500',
  },
  introText: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
  },
  stepCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.lg,
    borderBottomWidth: 1,
    gap: spacing.md,
  },
  stepIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  stepTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  stepNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'transparent',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  stepNumber: {
    ...typography.bodyBold,
    fontSize: 16,
    fontWeight: '700',
  },
  stepTitleTextContainer: {
    flex: 1,
  },
  stepTitle: {
    ...typography.bodyBold,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: spacing.xs / 2,
  },
  stepDescription: {
    ...typography.caption,
    fontSize: 13,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  stepBody: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  stepLineContainer: {
    marginBottom: spacing.sm,
  },
  stepLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    flexShrink: 0,
  },
  stepText: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 24,
    flex: 1,
    fontWeight: '500',
  },
  exampleBox: {
    marginLeft: spacing.md + 8,
    marginTop: spacing.xs,
    padding: spacing.md,
    borderRadius: 12,
    borderLeftWidth: 3,
  },
  exampleLabel: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: spacing.xs / 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exampleText: {
    ...typography.body,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  cta: {
    marginTop: spacing.lg,
  },
  ctaButton: {
    width: '100%',
  },
});
