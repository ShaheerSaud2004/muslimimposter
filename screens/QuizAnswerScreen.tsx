import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, ViewStyle, TextStyle } from 'react-native';
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

type QuizAnswerScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'QuizAnswer'
>;

export default function QuizAnswerScreen() {
  const navigation = useNavigation<QuizAnswerScreenNavigationProp>();
  const { colors } = useTheme();
  const { players, settings, updatePlayer } = useGame();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    // Initialize answers object
    const initialAnswers: Record<string, string> = {};
    players.forEach(player => {
      initialAnswers[player.id] = player.quizAnswer || '';
    });
    setAnswers(initialAnswers);
  }, [players]);

  if (!settings || players.length === 0) {
    return null;
  }

  const currentPlayer = players[currentPlayerIndex];
  const isImposter = currentPlayer.role === 'imposter';
  const question = isImposter 
    ? settings.imposterQuizQuestion || settings.quizQuestion 
    : settings.quizQuestion;

  const handleAnswerChange = (text: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentPlayer.id]: text,
    }));
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Save answer to player
    if (updatePlayer) {
      updatePlayer(currentPlayer.id, {
        ...currentPlayer,
        quizAnswer: answers[currentPlayer.id] || '',
      });
    }

    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    } else {
      // All players have answered, navigate to review screen
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      navigation.navigate('QuizAnswersReview');
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentPlayerIndex > 0) {
      setCurrentPlayerIndex(currentPlayerIndex - 1);
    } else {
      navigation.goBack();
    }
  };

  const progress = ((currentPlayerIndex + 1) / players.length) * 100;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <PatternBackground />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.delay(0).springify()}>
            <View style={styles.header}>
              <Text style={[styles.heading, { color: colors.text }]}>
                Answer the Question
              </Text>
              <Text style={[styles.subheading, { color: colors.textSecondary }]}>
                {currentPlayerIndex + 1} of {players.length}
              </Text>
            </View>

            {/* Progress Bar */}
            <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
              <Animated.View
                style={[
                  styles.progressBar,
                  { backgroundColor: colors.accent, width: `${progress}%` },
                ]}
              />
            </View>

            <Card style={[
              styles.card,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
                shadowColor: colors.shadow,
              },
            ]}>
              {/* Player Name */}
              <View style={styles.playerSection}>
                <Text style={[styles.playerLabel, { color: colors.textSecondary }]}>
                  {isImposter ? 'IMPOSTER' : 'Player'}
                </Text>
                <Text style={[styles.playerName, { color: isImposter ? colors.imposter : colors.accent }]}>
                  {currentPlayer.name}
                </Text>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              {/* Question */}
              <View style={styles.questionSection}>
                <Text style={[styles.questionLabel, { color: colors.textSecondary }]}>
                  Question:
                </Text>
                <View style={[styles.questionBox, { backgroundColor: colors.accentLight + '40', borderColor: colors.accent }]}>
                  <Text style={[styles.questionText, { color: colors.accent }]}>
                    {question}
                  </Text>
                </View>
                {isImposter && (
                  <Text style={[styles.instruction, { color: colors.textSecondary }]}>
                    You have a different question. Answer based on what you think it might be.
                  </Text>
                )}
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border }]} />

              {/* Answer Input */}
              <View style={styles.answerSection}>
                <Text style={[styles.answerLabel, { color: colors.textSecondary }]}>
                  Your Answer:
                </Text>
                <TextInput
                  style={[
                    styles.answerInput,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={answers[currentPlayer.id] || ''}
                  onChangeText={handleAnswerChange}
                  placeholder="Type your answer here..."
                  placeholderTextColor={colors.textSecondary + '80'}
                  autoFocus={true}
                  multiline={false}
                  returnKeyType="done"
                  onSubmitEditing={handleNext}
                />
              </View>
            </Card>

            <Animated.View entering={FadeIn.delay(300)} style={styles.buttonContainer}>
              <View style={styles.buttonRow}>
                {currentPlayerIndex > 0 && (
                  <Button
                    title="Back"
                    onPress={handleBack}
                    style={[styles.backButton, { backgroundColor: colors.border }] as unknown as ViewStyle}
                    textStyle={[styles.buttonText, { color: colors.text }] as unknown as TextStyle}
                  />
                )}
                <Button
                  title={currentPlayerIndex < players.length - 1 ? "Next Player →" : "View All Answers"}
                  onPress={handleNext}
                  style={[
                    styles.nextButton,
                    { 
                      backgroundColor: colors.accent,
                      flex: currentPlayerIndex === 0 ? 1 : undefined,
                    },
                  ] as unknown as ViewStyle}
                  textStyle={styles.buttonText}
                  disabled={!answers[currentPlayer.id]?.trim()}
                />
              </View>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
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
    marginBottom: spacing.md,
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
  },
  progressBarContainer: {
    height: 6,
    borderRadius: 3,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
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
  playerSection: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  playerLabel: {
    ...typography.caption,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    fontWeight: '700',
    opacity: 0.8,
  },
  playerName: {
    ...typography.heading,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    fontFamily: 'Etna Sans Serif',
  },
  divider: {
    height: 1,
    marginVertical: spacing.md,
    opacity: 0.25,
  },
  questionSection: {
    marginBottom: spacing.md,
  },
  questionLabel: {
    ...typography.bodyBold,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  questionBox: {
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: spacing.sm,
  },
  questionText: {
    ...typography.bodyBold,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  instruction: {
    ...typography.body,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  answerSection: {
    marginTop: spacing.md,
  },
  answerLabel: {
    ...typography.bodyBold,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  answerInput: {
    ...typography.body,
    fontSize: 16,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    minHeight: 56,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: spacing.lg,
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
  },
  backButton: {
    flex: 1,
    minHeight: 56,
    paddingVertical: spacing.md,
    borderRadius: 16,
  },
  nextButton: {
    flex: 1,
    minHeight: 56,
    paddingVertical: spacing.md,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
