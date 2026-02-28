import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../contexts/ThemeContext';
import { useGame } from '../contexts/GameContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import * as Haptics from 'expo-haptics';
import { getSettings } from '../utils/storage';
import { getVotingTimeSeconds } from '../utils/game';
import { DISCUSSION_TIME_PRESET_SECONDS } from '../constants';

type QuizAnswersReviewScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'QuizAnswersReview'
>;

export default function QuizAnswersReviewScreen() {
  const navigation = useNavigation<QuizAnswersReviewScreenNavigationProp>();
  const { colors } = useTheme();
  const { players, settings } = useGame();

  const handleProceedToTimer = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const s = await getSettings();
    const initialSeconds =
      s.discussionTimePreset != null
        ? DISCUSSION_TIME_PRESET_SECONDS[s.discussionTimePreset]
        : getVotingTimeSeconds(players.length);
    navigation.navigate('VotingTimer', { initialSeconds });
  };

  if (!settings || players.length === 0) {
    return null;
  }

  const normalQuestion = settings.quizQuestion;
  const imposterQuestion = settings.imposterQuizQuestion || settings.quizQuestion;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <PatternBackground />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(0).springify()}>
          <View style={styles.header}>
            <Text style={[styles.heading, { color: colors.text }]}>
              All Answers
            </Text>
            <Text style={[styles.subheading, { color: colors.textSecondary }]}>
              Review everyone's answers before revealing
            </Text>
          </View>

          <Card style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              shadowColor: colors.shadow,
            },
          ]}>
            {players.map((player, index) => {
              const isImposter = player.role === 'imposter';
              const question = isImposter ? imposterQuestion : normalQuestion;
              const answer = player.quizAnswer || '(No answer)';

              return (
                <Animated.View
                  key={player.id}
                  entering={FadeInDown.delay(100 + index * 50).springify()}
                >
                  <View style={[
                    styles.playerAnswerCard,
                    {
                      backgroundColor: isImposter 
                        ? colors.imposter + '15' 
                        : colors.accentLight + '20',
                      borderColor: isImposter 
                        ? colors.imposter + '40' 
                        : colors.accent + '40',
                    },
                  ]}>
                    <View style={styles.playerHeader}>
                      <Text
                        style={[
                          styles.playerName,
                          { color: isImposter ? colors.imposter : colors.accent },
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {player.name}
                      </Text>
                      {isImposter && (
                        <View style={[styles.badge, { backgroundColor: colors.imposter }]}>
                          <Text style={[styles.badgeText, { color: colors.text }]}>
                            IMPOSTER
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <View style={styles.questionRow}>
                      <Text style={[styles.questionLabel, { color: colors.textSecondary }]}>
                        Question:
                      </Text>
                      <Text style={[styles.questionText, { color: colors.text }]}>
                        {question}
                      </Text>
                    </View>

                    <View style={styles.answerRow}>
                      <Text style={[styles.answerLabel, { color: colors.textSecondary }]}>
                        Answer:
                      </Text>
                      <Text 
                        style={[styles.answerText, { color: colors.text }]}
                        numberOfLines={1}
                        adjustsFontSizeToFit={true}
                        minimumFontScale={0.7}
                      >
                        {answer}
                      </Text>
                    </View>
                  </View>

                  {index < players.length - 1 && (
                    <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />
                  )}
                </Animated.View>
              );
            })}
          </Card>

          <Animated.View entering={FadeIn.delay(500)} style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <Button
                title="Proceed to Timer →"
                onPress={handleProceedToTimer}
                style={styles.button}
                textStyle={styles.buttonText}
              />
            </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
    alignItems: 'center',
    paddingTop: spacing.sm,
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
  card: {
    padding: spacing.lg,
    borderRadius: 20,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: spacing.lg,
  },
  playerAnswerCard: {
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: spacing.sm,
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  playerName: {
    ...typography.heading,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Etna Sans Serif',
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  badgeText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    marginVertical: spacing.sm,
    opacity: 0.25,
  },
  cardDivider: {
    height: 1,
    marginVertical: spacing.md,
    opacity: 0.15,
  },
  questionRow: {
    marginBottom: spacing.sm,
  },
  questionLabel: {
    ...typography.caption,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    fontWeight: '700',
  },
  questionText: {
    ...typography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  answerRow: {
    marginTop: spacing.xs,
  },
  answerLabel: {
    ...typography.caption,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    fontWeight: '700',
  },
  answerText: {
    ...typography.bodyBold,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
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
