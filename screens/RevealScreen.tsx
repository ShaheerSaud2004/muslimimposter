import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInDown,
  SlideOutDown,
  ZoomIn,
  ZoomInRotate,
  FlipInEasyX,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Logo } from '../components/Logo';
import { useTheme } from '../contexts/ThemeContext';
import { useGame } from '../contexts/GameContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import * as Haptics from 'expo-haptics';
import { getCategoryName, createPlayers, selectRandomWord, selectDifferentCategory, selectImposterQuizQuestion } from '../utils/game';
import { defaultCategories } from '../data/categories';
import { getCustomCategories, getUsedWords, addUsedWord, clearUsedWords, getSessionUsedQuestionIds, addSessionUsedQuestionId, clearSessionUsedQuestionIds, saveGameResult, GameResult } from '../utils/storage';
import { getEnglishTranslation } from '../utils/translations';
import { GameSettings } from '../types';
import { getMaxContentWidth } from '../utils/responsive';

type RevealScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Reveal'
>;

export default function RevealScreen() {
  const navigation = useNavigation<RevealScreenNavigationProp>();
  const { colors } = useTheme();
  const { players, settings, setPlayers, setSettings } = useGame();
  const maxWidth = getMaxContentWidth();
  const [customCategories, setCustomCategories] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [hasAnsweredCorrect, setHasAnsweredCorrect] = useState(false);

  // Animation values for reveal
  const secretWordScale = useSharedValue(0);
  const secretWordRotation = useSharedValue(-180);
  
  // Animation values for New Game transition - simple fade
  const screenOpacity = useSharedValue(1);
  const screenScale = useSharedValue(1);

  useEffect(() => {
    loadCustomCategories();
    if (!showResults) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  useEffect(() => {
    if (showResults) {
      // Dramatic reveal animations
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Secret word animation - dramatic scale and rotation
      secretWordScale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withDelay(400, withSpring(1.3, { damping: 6, stiffness: 150 })),
        withSpring(1, { damping: 12, stiffness: 180 })
      );
      
      secretWordRotation.value = withSequence(
        withTiming(-180, { duration: 0 }),
        withDelay(400, withSpring(0, { damping: 12, stiffness: 200 }))
      );
    } else {
      // Reset animations when hiding results
      secretWordScale.value = 0;
      secretWordRotation.value = -180;
    }
  }, [showResults]);

  const loadCustomCategories = async () => {
    const custom = await getCustomCategories();
    setCustomCategories(custom);
  };

  // Animated styles for secret word reveal - MUST be called before early return
  const secretWordAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: secretWordScale.value },
      { rotateY: `${secretWordRotation.value}deg` },
    ],
  }));

  // Animated style for screen transition - smooth fade
  const screenAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: screenOpacity.value,
    };
  });

  if (!settings || players.length === 0) {
    return null;
  }

  const imposters = players.filter(p => p.role === 'imposter');
  const doubleAgents = players.filter(p => p.role === 'doubleAgent');
  const allCategories = [...defaultCategories, ...customCategories];

  const handleReveal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setShowResults(true);
    setHasAnsweredCorrect(false); // Reset when revealing
  };

  const handleCorrectAnswer = async (wasCorrect: boolean) => {
    if (!settings) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setHasAnsweredCorrect(true);
    
    try {
      const allCategories = [...defaultCategories, ...customCategories];
      const categoryName = getCategoryName(settings.secretCategory, allCategories);
      
      const result: GameResult = {
        word: settings.secretWord,
        category: categoryName,
        wasCorrect,
        timestamp: Date.now(),
        numPlayers: settings.numPlayers,
        numImposters: settings.numImposters,
        mode: settings.mode,
      };
      
      await saveGameResult(result);
    } catch (error) {
      console.error('Error saving game result:', error);
    }
  };


  const handlePlayAgain = async () => {
    if (!settings) {
      console.log('No settings available for Play Again');
      return;
    }

    console.log('Play Again button pressed');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      const allCategories = [...defaultCategories, ...customCategories];
      const newCategoryId = selectDifferentCategory(
        settings.selectedCategories.length > 0 ? settings.selectedCategories : allCategories.map(c => c.id),
        allCategories,
        settings.secretCategory
      );
      const chosenCategory = allCategories.find(c => c.id === newCategoryId);
      
      if (!chosenCategory) {
        console.log('No valid category found, navigating to GameSetup');
        navigation.navigate('GameSetup');
        return;
      }

      let newSecretWord: string;
      let newQuizQuestion: string | undefined;
      let newImposterQuizQuestion: string | undefined;

      if (settings.mode === 'quiz') {
        const { getRandomQuizQuestion } = require('../data/quizQuestions');
        const usedQuestionIds = getSessionUsedQuestionIds();
        const difficulty = settings.difficulty === 'all' ? undefined : (settings.difficulty as 'easy' | 'medium' | 'hard');
        const normalQuestion = getRandomQuizQuestion(newCategoryId, difficulty, usedQuestionIds);
        if (!normalQuestion) {
          console.log('No unused quiz questions for this category, navigating to GameSetup');
          navigation.navigate('GameSetup');
          return;
        }
        addSessionUsedQuestionId(normalQuestion.id);
        newSecretWord = normalQuestion.answer;
        newQuizQuestion = normalQuestion.question;
        const imposterQ = selectImposterQuizQuestion(
          newCategoryId,
          normalQuestion.id,
          difficulty,
          normalQuestion.answer,
          normalQuestion.question
        );
        newImposterQuizQuestion = imposterQ?.question ?? newQuizQuestion;
        await addUsedWord(newSecretWord);
      } else {
        if (chosenCategory.words.length === 0) {
          navigation.navigate('GameSetup');
          return;
        }
        const usedWords = await getUsedWords();
        newSecretWord = selectRandomWord(chosenCategory.words, usedWords);
        await addUsedWord(newSecretWord);
      }

      // Re-randomize imposter(s) and starting player every Play Again (different people when possible)
      const playerNamesOrdered = settings.playerNames?.length === settings.numPlayers
        ? settings.playerNames
        : Array.from({ length: settings.numPlayers }, (_, i) => {
            const p = players.find(pl => pl.id === `player-${i}`);
            return p?.name ?? `Player ${i + 1}`;
          });
      const randomStartIndex = Math.floor(Math.random() * settings.numPlayers);
      const newStartingPlayerId = `player-${randomStartIndex}`;
      const previousImposterIds = players.filter(p => p.role === 'imposter').map(p => p.id);
      const newPlayers = createPlayers(
        settings.numPlayers,
        settings.numImposters,
        settings.specialModes.doubleAgent,
        newStartingPlayerId,
        playerNamesOrdered,
        previousImposterIds
      );

      const newSettings: GameSettings = {
        ...settings,
        startingPlayerId: newStartingPlayerId,
        secretWord: newSecretWord,
        secretCategory: newCategoryId,
        quizQuestion: newQuizQuestion,
        imposterQuizQuestion: newImposterQuizQuestion,
        playerNames: playerNamesOrdered,
      };

      setPlayers(newPlayers);
      setSettings(newSettings);
      // Defer navigation so context updates before PassAndPlay reads players
      console.log('Navigating to PassAndPlay');
      setTimeout(() => navigation.navigate('PassAndPlay'), 0);
    } catch (error) {
      console.error('Error in Play Again:', error);
      navigation.navigate('GameSetup');
    }
  };

  const handleNewGame = async () => {
    console.log('New Game button pressed');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Clear used words and session-used questions so new game doesn't repeat
    await clearUsedWords();
    clearSessionUsedQuestionIds();
    
    // Don't reset game state - keep players/settings so GameSetup can pre-fill
    console.log('Navigating to GameSetup');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'Menu' },
          { name: 'GameSetup' },
        ],
      })
    );
  };

  return (
    <Animated.View style={[StyleSheet.absoluteFill, screenAnimatedStyle]}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top', 'bottom']}
      >
        <PatternBackground />

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        {!showResults ? (
          <View style={styles.centeredContainer}>
            <Animated.View
              entering={FadeIn.delay(50).springify()}
              style={styles.logoContainer}
            >
              <Logo width={240} height={240} />
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(200).springify()}
              style={styles.centeredCardWrapper}
            >
              <Card style={[
                styles.card,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                }
              ]}>
                <Text style={[styles.heading, { color: colors.text }]}>
                  Ready to Reveal?
                </Text>
                <Text
                  style={[styles.instruction, { color: colors.textSecondary }]}
                >
                  Make sure all voting is complete, then tap to reveal the results.
                </Text>
                <View style={{ marginTop: spacing.lg }}>
                  <Button
                    title="Reveal Results"
                    onPress={handleReveal}
                    style={styles.button}
                  />
                </View>
              </Card>
            </Animated.View>
          </View>
        ) : (
          <>
            <Animated.View
              entering={ZoomIn.delay(100).springify()}
            >
              <Card style={[
                styles.revealCard,
                {
                  backgroundColor: colors.accentLight,
                  borderColor: colors.accent,
                  borderWidth: 2,
                }
              ]}>
                <Animated.View
                  entering={FadeInDown.delay(200).springify()}
                >
                  {settings.mode === 'quiz' && settings.quizQuestion ? (
                    <>
                      <View style={[styles.quizQuestionBox, { backgroundColor: colors.accentLight + '40', borderColor: colors.accent }]}>
                        <Text style={[styles.quizQuestionLabel, { color: colors.textSecondary }]}>
                          Question:
                        </Text>
                        <Text style={[styles.quizQuestion, { color: colors.accent }]}>
                          {settings.quizQuestion}
                        </Text>
                      </View>
                      <Text style={[styles.heading, { color: colors.text, marginTop: spacing.md }]}>
                        The Answer Was...
                      </Text>
                    </>
                  ) : (
                    <Text style={[styles.heading, { color: colors.text }]}>
                      The Secret Word Was...
                    </Text>
                  )}
                </Animated.View>
                <Animated.View 
                  style={[
                    styles.secretWordContainer,
                    secretWordAnimatedStyle
                  ]}
                >
                  <Text
                    style={[styles.secretWord, { color: colors.accent }]}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.5}
                  >
                    {settings.secretWord}
                  </Text>
                </Animated.View>
                {getEnglishTranslation(settings.secretWord) && (
                  <Animated.View
                    entering={FadeIn.delay(800).springify()}
                  >
                    <Text
                      style={[styles.wordTranslation, { color: colors.textSecondary }]}
                    >
                      {getEnglishTranslation(settings.secretWord)}
                    </Text>
                  </Animated.View>
                )}
                <Animated.View
                  entering={FadeIn.delay(900).springify()}
                >
                  <Text
                    style={[styles.categoryLabel, { color: colors.textSecondary }]}
                  >
                    Category: {getCategoryName(settings.secretCategory, allCategories)}
                  </Text>
                </Animated.View>
              </Card>
            </Animated.View>

            <Animated.View
              entering={FlipInEasyX.delay(1000).springify()}
            >
              <Card style={[
                styles.card,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.imposter,
                  borderWidth: 2,
                }
              ]}>
                <Animated.View
                  entering={FadeInDown.delay(1100).springify()}
                >
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    The Imposter(s) Were...
                  </Text>
                </Animated.View>
                {imposters.map((imposter, index) => (
                  <Animated.View
                    key={imposter.id}
                    entering={ZoomInRotate.delay(1200 + index * 200).springify()}
                    style={[
                      styles.roleContainer,
                      {
                        backgroundColor: colors.imposter + '15',
                        borderWidth: 1,
                        borderColor: colors.imposter + '40',
                      }
                    ]}
                  >
                    <Text
                      style={[styles.imposterName, { color: colors.imposter }]}
                    >
                      {imposter.name}
                    </Text>
                    <Text
                      style={[styles.roleLabel, { color: colors.imposter }]}
                    >
                      IMPOSTER
                    </Text>
                  </Animated.View>
                ))}
              </Card>
            </Animated.View>

            {doubleAgents.length > 0 && (
              <Animated.View
                entering={FlipInEasyX.delay(1400).springify()}
              >
                <Card style={[
                  styles.card,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.doubleAgent,
                    borderWidth: 2,
                  }
                ]}>
                  <Animated.View
                    entering={FadeInDown.delay(1500).springify()}
                  >
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                      The Double Agent(s) Were...
                    </Text>
                  </Animated.View>
                  {doubleAgents.map((agent, index) => (
                    <Animated.View
                      key={agent.id}
                      entering={ZoomInRotate.delay(1600 + index * 200).springify()}
                      style={[
                        styles.roleContainer,
                        {
                          backgroundColor: colors.doubleAgent + '15',
                          borderWidth: 1,
                          borderColor: colors.doubleAgent + '40',
                        }
                      ]}
                    >
                      <Text
                        style={[styles.agentName, { color: colors.doubleAgent }]}
                      >
                        {agent.name}
                      </Text>
                      <Text
                        style={[styles.roleLabel, { color: colors.doubleAgent }]}
                      >
                        DOUBLE AGENT
                      </Text>
                    </Animated.View>
                  ))}
                </Card>
              </Animated.View>
            )}

            <Animated.View
              entering={SlideInDown.delay(1800).springify()}
              style={styles.correctButtonContainer}
            >
              <Text style={[styles.correctQuestionText, { color: colors.text }]}>
                Did you get it correct?
              </Text>
              {!hasAnsweredCorrect ? (
                <View style={styles.correctButtonRow}>
                  <View style={styles.correctButtonWrapper}>
                    <Button
                      title="Yes ✓"
                      onPress={() => handleCorrectAnswer(true)}
                      style={styles.correctButton}
                      variant="primary"
                    />
                  </View>
                  <View style={{ width: spacing.sm }} />
                  <View style={styles.correctButtonWrapper}>
                    <Button
                      title="No ✗"
                      onPress={() => handleCorrectAnswer(false)}
                      style={styles.correctButton}
                      variant="secondary"
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.answeredContainer}>
                  <Text style={[styles.answeredText, { color: colors.textSecondary }]}>
                    ✓ Answered
                  </Text>
                </View>
              )}
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(1800).springify()} style={styles.buttonContainer}>
              <Button
                title="Play Again"
                onPress={handlePlayAgain}
                style={styles.button}
              />
              <Button
                title="New Game"
                onPress={handleNewGame}
                variant="secondary"
                style={styles.button}
              />
            </Animated.View>
          </>
        )}
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
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
    padding: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.sm,
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  centeredCardWrapper: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  card: {
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 20,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  heading: {
    ...typography.heading,
    fontSize: 18,
    marginBottom: spacing.sm,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.8,
    opacity: 0.9,
  },
  instruction: {
    ...typography.body,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  revealCard: {
    padding: spacing.md,
    paddingVertical: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  secretWordContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
    minHeight: 50,
    paddingVertical: spacing.xs,
  },
  secretWord: {
    ...typography.heading,
    fontSize: 38,
    textAlign: 'center',
    marginBottom: spacing.xs,
    fontWeight: '800',
    letterSpacing: 1.5,
    lineHeight: 46,
    flexShrink: 1,
  },
  wordTranslation: {
    ...typography.caption,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontStyle: 'italic',
    lineHeight: 22,
    opacity: 0.85,
    fontWeight: '500',
  },
  categoryLabel: {
    ...typography.body,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 0,
    opacity: 0.8,
    fontWeight: '600',
  },
  sectionTitle: {
    ...typography.bodyBold,
    fontSize: 17,
    marginBottom: spacing.sm,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  roleContainer: {
    alignItems: 'center',
    marginBottom: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
    marginHorizontal: spacing.xs,
  },
  imposterName: {
    ...typography.heading,
    fontSize: 26,
    marginBottom: spacing.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontFamily: 'Etna Sans Serif',
  },
  agentName: {
    ...typography.heading,
    fontSize: 26,
    marginBottom: spacing.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontFamily: 'Etna Sans Serif',
  },
  roleLabel: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  correctButtonContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: spacing.md,
  },
  correctQuestionText: {
    ...typography.bodyBold,
    fontSize: 17,
    marginBottom: spacing.sm,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  correctButtonRow: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 400,
    gap: spacing.md,
  },
  correctButtonWrapper: {
    flex: 1,
  },
  correctButton: {
    minHeight: 48,
    width: '100%',
    borderRadius: 12,
  },
  answeredContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  quizQuestionBox: {
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: spacing.sm,
  },
  quizQuestionLabel: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  quizQuestion: {
    ...typography.bodyBold,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'center',
  },
  answeredText: {
    ...typography.body,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: spacing.sm,
    gap: spacing.sm,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    zIndex: 10,
  },
  button: {
    width: '100%',
    maxWidth: 400,
    minHeight: 56,
    paddingVertical: spacing.md,
    borderRadius: 16,
  },
});