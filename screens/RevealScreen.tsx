import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as WebBrowser from 'expo-web-browser';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInDown,
  SlideInRight,
  ZoomIn,
  ZoomInRotate,
  FlipInEasyX,
  BounceIn,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Logo } from '../components/Logo';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useGame } from '../contexts/GameContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import * as Haptics from 'expo-haptics';
import { getCategoryName, createPlayers, selectRandomWord, selectImposterQuizQuestion, selectDifferentCategory, selectSingleRandomCategory } from '../utils/game';
import { defaultCategories } from '../data/categories';
import { getCustomCategories, getUsedWords, addUsedWord, clearUsedWords, getSessionUsedQuestionIds, addSessionUsedQuestionId, clearSessionUsedQuestionIds, getSessionUsedWords, addSessionUsedWord, clearSessionUsedWords, saveGameResult, GameResult } from '../utils/storage';
import { GameSettings } from '../types';
import { showAlert } from '../components/Alert';
import { getMaxContentWidth } from '../utils/responsive';
import { getLearnMore } from '../data/learnMore';

type RevealScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Reveal'
>;

// Typewriter effect hook
const useTypewriter = (text: string, speed: number = 30, delay: number = 0) => {
  const [displayedText, setDisplayedText] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current);
    }

    // Reset displayed text
    setDisplayedText('');

    // Start typing after delay
    delayTimeoutRef.current = setTimeout(() => {
      const targetText = text;
      let currentIndex = 0;

      const typeNextChar = () => {
        if (currentIndex < targetText.length) {
          setDisplayedText(targetText.substring(0, currentIndex + 1));
          currentIndex++;
          timeoutRef.current = setTimeout(typeNextChar, speed);
        }
      };

      typeNextChar();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
      }
    };
  }, [text, speed, delay]);

  return displayedText;
};

export default function RevealScreen() {
  const navigation = useNavigation<RevealScreenNavigationProp>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { players, settings, setPlayers, setSettings } = useGame();
  const insets = useSafeAreaInsets();
  const maxWidth = getMaxContentWidth();
  const [customCategories, setCustomCategories] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(true);
  const [hasAnsweredCorrect, setHasAnsweredCorrect] = useState(false);

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
      // Haptic feedback for each section reveal
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Secret word appears
      }, 300);
      
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // Imposter appears
      }, 900);
      
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Correctness question appears
      }, 1500);
    }
  }, [showResults]);

  const loadCustomCategories = async () => {
    const custom = await getCustomCategories();
    setCustomCategories(custom);
  };

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
      const imposterNames = players.filter(p => p.role === 'imposter').map(p => p.name);
      // Winners: when players caught imposter = normal + doubleAgent; when imposters won = imposters
      const winnerNames = wasCorrect
        ? players.filter(p => p.role === 'normal' || p.role === 'doubleAgent').map(p => p.name)
        : imposterNames;
      
      const result: GameResult = {
        word: settings.secretWord,
        category: categoryName,
        wasCorrect,
        timestamp: Date.now(),
        numPlayers: settings.numPlayers,
        numImposters: settings.numImposters,
        mode: settings.mode,
        imposterNames,
        winnerNames,
      };
      
      await saveGameResult(result);
    } catch (error) {
      console.error('Error saving game result:', error);
    }
  };


  const handlePlayAgain = () => {
    if (!settings) {
      console.log('No settings available for Play Again');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // If user didn't choose any categories, just proceed with a random category—no modal
    if (!settings.selectedCategories || settings.selectedCategories.length === 0) {
      proceedPlayAgainRandomCategory();
      return;
    }

    const allCategories = [...defaultCategories, ...customCategories];
    const categoryPool = settings.selectedCategories;
    const isMultiple = categoryPool.length > 1;
    const categoryNames = categoryPool
      .map(id => getCategoryName(id, allCategories))
      .filter(Boolean);
    const title = isMultiple ? 'Same categories again?' : 'Same category again?';
    const message = isMultiple
      ? `Play another round with your selected categories (${categoryNames.join(', ')})? We'll randomly pick one and a new word that hasn't been used this session.`
      : `Play another round with "${categoryNames[0]}"? We'll pick a new word that hasn't been used this session.`;

    showAlert({
      title,
      message,
      buttons: [
        {
          text: 'No, choose another',
          style: 'cancel',
          onPress: () => {
            clearSessionUsedWords();
            navigation.navigate('GameSetup');
          },
        },
        {
          text: 'Yes, let\'s go',
          onPress: () => proceedPlayAgainSameCategory(),
        },
      ],
    });
  };

  const proceedPlayAgainRandomCategory = async () => {
    if (!settings) return;

    try {
      const allCategories = [...defaultCategories, ...customCategories];
      const newSecretCategoryId = selectSingleRandomCategory(allCategories);
      if (!newSecretCategoryId) {
        navigation.navigate('GameSetup');
        return;
      }

      const chosenCategory = allCategories.find(c => c.id === newSecretCategoryId);
      if (!chosenCategory) {
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
        const normalQuestion = getRandomQuizQuestion(newSecretCategoryId, difficulty, usedQuestionIds);
        if (!normalQuestion) {
          showAlert({
            title: 'No more questions',
            message: 'All quiz questions for this category have been used this session. Head to setup to choose another category.',
            buttons: [{ text: 'OK', onPress: () => navigation.navigate('GameSetup') }],
          });
          return;
        }
        addSessionUsedQuestionId(normalQuestion.id);
        newSecretWord = normalQuestion.answer;
        newQuizQuestion = normalQuestion.question;
        const imposterQ = selectImposterQuizQuestion(
          newSecretCategoryId,
          normalQuestion.id,
          difficulty,
          normalQuestion.answer,
          normalQuestion.question
        );
        newImposterQuizQuestion = imposterQ?.question ?? newQuizQuestion;
        await addUsedWord(newSecretWord);
        addSessionUsedWord(newSecretCategoryId, newSecretWord);
      } else {
        if (chosenCategory.words.length === 0) {
          navigation.navigate('GameSetup');
          return;
        }
        const sessionUsed = getSessionUsedWords(newSecretCategoryId);
        newSecretWord = selectRandomWord(chosenCategory.words, sessionUsed);
        await addUsedWord(newSecretWord);
        addSessionUsedWord(newSecretCategoryId, newSecretWord);
      }

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
        secretCategory: newSecretCategoryId,
        quizQuestion: newQuizQuestion,
        imposterQuizQuestion: newImposterQuizQuestion,
        playerNames: playerNamesOrdered,
      };

      setPlayers(newPlayers);
      setSettings(newSettings);
      setTimeout(() => navigation.navigate('PassAndPlay'), 0);
    } catch (error) {
      console.error('Error in Play Again (random):', error);
      navigation.navigate('GameSetup');
    }
  };

  const proceedPlayAgainSameCategory = async () => {
    if (!settings) return;

    try {
      const allCategories = [...defaultCategories, ...customCategories];

      // When multiple categories selected, pick a (possibly different) one from the pool each round
      const categoryPool = settings.selectedCategories?.length
        ? settings.selectedCategories
        : [settings.secretCategory];
      const newSecretCategoryId =
        categoryPool.length > 1
          ? selectDifferentCategory(categoryPool, allCategories, settings.secretCategory, true)
          : settings.secretCategory;

      const chosenCategory = allCategories.find(c => c.id === newSecretCategoryId);

      if (!chosenCategory) {
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
        const normalQuestion = getRandomQuizQuestion(newSecretCategoryId, difficulty, usedQuestionIds);
        if (!normalQuestion) {
          showAlert({
            title: 'No more questions',
            message: 'All quiz questions for this category have been used this session. Head to setup to choose another category.',
            buttons: [{ text: 'OK', onPress: () => navigation.navigate('GameSetup') }],
          });
          return;
        }
        addSessionUsedQuestionId(normalQuestion.id);
        newSecretWord = normalQuestion.answer;
        newQuizQuestion = normalQuestion.question;
        const imposterQ = selectImposterQuizQuestion(
          newSecretCategoryId,
          normalQuestion.id,
          difficulty,
          normalQuestion.answer,
          normalQuestion.question
        );
        newImposterQuizQuestion = imposterQ?.question ?? newQuizQuestion;
        await addUsedWord(newSecretWord);
        addSessionUsedWord(newSecretCategoryId, newSecretWord);
      } else {
        if (chosenCategory.words.length === 0) {
          navigation.navigate('GameSetup');
          return;
        }
        const sessionUsed = getSessionUsedWords(newSecretCategoryId);
        newSecretWord = selectRandomWord(chosenCategory.words, sessionUsed);
        await addUsedWord(newSecretWord);
        addSessionUsedWord(newSecretCategoryId, newSecretWord);
      }

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
        secretCategory: newSecretCategoryId,
        quizQuestion: newQuizQuestion,
        imposterQuizQuestion: newImposterQuizQuestion,
        playerNames: playerNamesOrdered,
      };

      setPlayers(newPlayers);
      setSettings(newSettings);
      setTimeout(() => navigation.navigate('PassAndPlay'), 0);
    } catch (error) {
      console.error('Error in Play Again:', error);
      navigation.navigate('GameSetup');
    }
  };

  const handleNewGame = async () => {
    console.log('New Game button pressed');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Clear used words and session state so new game doesn't repeat
    await clearUsedWords();
    clearSessionUsedQuestionIds();
    clearSessionUsedWords();
    
    // Clear selected categories so new game starts with none selected
    if (settings) {
      setSettings({ ...settings, selectedCategories: [] });
    }
    
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
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(spacing.xxl * 2, insets.bottom + 80) },
          ]}
          showsVerticalScrollIndicator={true}
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
            <View style={styles.centeredCardWrapper}>
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
                <View style={{ marginTop: spacing.lg, zIndex: 1000 }}>
                  <TouchableOpacity
                    onPress={handleReveal}
                    activeOpacity={0.8}
                    style={[
                      styles.revealButton,
                      {
                        backgroundColor: colors.accent,
                      }
                    ]}
                  >
                    <Text style={[styles.revealButtonText, { color: '#FFFFFF' }]}>
                      Reveal Results
                    </Text>
                  </TouchableOpacity>
                </View>
              </Card>
            </View>
          </View>
        ) : (
          <>
            <Animated.View entering={FadeInDown.delay(0).springify()}>
              <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>
                  Game Results
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  The secret is revealed
                </Text>
              </View>
            </Animated.View>

            <Card style={styles.resultsCard}>
              {/* Secret Word Row - Zooms in with bounce */}
              <Animated.View entering={ZoomIn.delay(300).springify()}>
                <View style={styles.infoRow}>
                  <Animated.View entering={BounceIn.delay(350).springify()}>
                    <View style={[styles.infoIconContainer, { backgroundColor: colors.accentLight }]}>
                      <Svg width={28} height={28} viewBox="0 -960 960 960" fill={colors.accent}>
                        <Path d="M312-240q-51 0-97.5-18T131-311q-48-45-69.5-106.5T40-545q0-78 38-126.5T189-720q14 0 26.5 2.5T241-710l239 89 239-89q13-5 25.5-7.5T771-720q73 0 111 48.5T920-545q0 66-21.5 127.5T829-311q-37 35-83.5 53T648-240q-66 0-112-30l-46-30h-20l-46 30q-46 30-112 30Zm0-80q37 0 69-17.5t59-42.5h80q27 25 59 42.5t69 17.5q36 0 69.5-12.5T777-371q34-34 48.5-80t14.5-94q0-41-17-68.5T769-640q-3 0-22 4L480-536 213-636q-5-2-10.5-3t-11.5-1q-37 0-54 27t-17 68q0 49 14.5 95t49.5 80q26 25 59 37.5t69 12.5Zm49-60q37 0 58-16.5t21-45.5q0-49-64.5-93.5T239-580q-37 0-58 16.5T160-518q0 49 64.5 93.5T361-380Zm-6-60q-38 0-82.5-25T220-516q5-2 11.5-3.5T245-521q38 0 82.5 25.5T380-444q-5 2-11.5 3t-13.5 1Zm244 61q72 0 136.5-45t64.5-94q0-29-20.5-46T721-581q-72 0-136.5 45T520-442q0 29 21 46t58 17Zm6-61q-7 0-13-1t-11-3q8-26 52.5-51t82.5-25q7 0 13 1t11 3q-8 26-52.5 51T605-440Zm-125-40Z" />
                      </Svg>
                    </View>
                  </Animated.View>
                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                      {settings.mode === 'quiz' && settings.quizQuestion ? 'Answer' : 'Secret Word'}
                    </Text>
                    <TypewriterText 
                      text={settings.secretWord} 
                      style={[styles.infoValue, { color: colors.accent }]}
                      speed={30}
                      delay={400}
                    />
                    <View style={styles.infoDescriptionBlock}>
                      <TypewriterText
                        text={getCategoryName(settings.secretCategory, allCategories)}
                        style={[styles.infoDescription, { color: colors.textSecondary }]}
                        speed={25}
                        delay={400 + (settings.secretWord.length * 30) + 100}
                      />
                    </View>
                  </View>
                </View>
              </Animated.View>

              {settings.mode === 'quiz' && settings.quizQuestion && (
                <>
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  <Animated.View entering={FadeInDown.delay(600).springify()}>
                    <View style={styles.infoRow}>
                      <Animated.View entering={ZoomIn.delay(650).springify()}>
                        <View style={[styles.infoIconContainer, { backgroundColor: colors.accentLight }]}>
                          <Text style={[styles.infoIcon, { color: colors.accent }]}>❓</Text>
                        </View>
                      </Animated.View>
                      <View style={styles.infoContent}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                          Question
                        </Text>
                        <TypewriterText
                          text={settings.quizQuestion}
                          style={[styles.infoValue, { color: colors.text }]}
                          speed={20}
                          delay={700}
                        />
                      </View>
                    </View>
                  </Animated.View>
                </>
              )}

              {/* Imposter(s) Row - Flips in dramatically */}
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Animated.View entering={FlipInEasyX.delay(900).springify()}>
                <View style={styles.infoRow}>
                  <Animated.View entering={BounceIn.delay(950).springify()}>
                    <View style={[styles.infoIconContainer, { backgroundColor: colors.imposter + '20' }]}>
                      <Svg width={28} height={28} viewBox="0 -960 960 960" fill={colors.imposter}>
                        <Path d="M760-660q17 0 28.5-11.5T800-700q0-17-11.5-28.5T760-740q-17 0-28.5 11.5T720-700q0 17 11.5 28.5T760-660Zm-160 0q17 0 28.5-11.5T640-700q0-17-11.5-28.5T600-740q-17 0-28.5 11.5T560-700q0 17 11.5 28.5T600-660Zm-20 136h200q0-35-30.5-55.5T680-600q-39 0-69.5 20.5T580-524ZM110-150q-70-70-70-170v-280h480v280q0 100-70 170T280-80q-100 0-170-70Zm283-57q47-47 47-113v-200H120v200q0 66 47 113t113 47q66 0 113-47Zm287-153q-26 0-51.5-5.5T580-382v-94q22 17 47.5 26.5T680-440q66 0 113-47t47-113v-200H520v140h-80v-220h480v280q0 100-70 170t-170 70Zm-480-20q17 0 28.5-11.5T240-420q0-17-11.5-28.5T200-460q-17 0-28.5 11.5T160-420q0 17 11.5 28.5T200-380Zm188.5-11.5Q400-403 400-420t-11.5-28.5Q377-460 360-460t-28.5 11.5Q320-437 320-420t11.5 28.5Q343-380 360-380t28.5-11.5Zm-39 127Q380-285 380-320H180q0 35 30.5 55.5T280-244q39 0 69.5-20.5ZM280-340Zm400-280Z" />
                      </Svg>
                    </View>
                  </Animated.View>
                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                      Imposter{imposters.length > 1 ? 's' : ''}
                    </Text>
                    <TypewriterText
                      text={imposters.map(p => p.name).join(', ')}
                      style={[styles.infoValue, { color: colors.imposter }]}
                      speed={30}
                      delay={1000}
                    />
                  </View>
                </View>
              </Animated.View>

              {/* Double Agent(s) Row - Slides in from right */}
              {doubleAgents.length > 0 && (
                <>
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  <Animated.View entering={SlideInRight.delay(1200).springify()}>
                    <View style={styles.infoRow}>
                      <Animated.View entering={ZoomIn.delay(1250).springify()}>
                        <View style={[styles.infoIconContainer, { backgroundColor: colors.doubleAgent + '20' }]}>
                          <Text style={[styles.infoIcon, { color: colors.doubleAgent }]}>🕵️</Text>
                        </View>
                      </Animated.View>
                      <View style={styles.infoContent}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                          Double Agent{doubleAgents.length > 1 ? 's' : ''}
                        </Text>
                        <TypewriterText
                          text={doubleAgents.map(p => p.name).join(', ')}
                          style={[styles.infoValue, { color: colors.doubleAgent }]}
                          speed={30}
                          delay={1300}
                        />
                        <TypewriterText
                          text="Knew the word but wasn't the imposter"
                          style={[styles.infoDescription, { color: colors.textSecondary }]}
                          speed={20}
                          delay={1300 + (doubleAgents.map(p => p.name).join(', ').length * 30) + 100}
                        />
                      </View>
                    </View>
                  </Animated.View>
                </>
              )}

              {/* Did you get it correct? Row - Fades in smoothly */}
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Animated.View entering={FadeIn.delay(1500).springify()}>
                <View style={styles.infoRow}>
                  <View style={[styles.infoIconContainer, { backgroundColor: colors.accentLight }]}>
                    <Svg width={28} height={28} viewBox="0 -960 960 960" fill={colors.accent}>
                      <Path d="M80-40v-80h800v80H80Zm80-120v-240q-33-54-51-114.5T91-638q0-61 15.5-120T143-874q8-21 26-33.5t40-12.5q31 0 53 21t18 50l-11 91q-6 48 8.5 91t43.5 75.5q29 32.5 70 52t89 19.5q60 0 120.5 12.5T706-472q45 23 69.5 58.5T800-326v166H160Zm80-80h480v-86q0-24-12-42.5T674-398q-41-20-95-31t-99-11q-66 0-122.5-27t-96-72.5Q222-585 202-644.5T190-768q-10 30-14.5 64t-4.5 66q0 58 20.5 111.5T240-422v182Zm127-367q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47Zm169.5-56.5Q560-687 560-720t-23.5-56.5Q513-800 480-800t-56.5 23.5Q400-753 400-720t23.5 56.5Q447-640 480-640t56.5-23.5ZM320-160v-37q0-67 46.5-115T480-360h160v80H480q-34 0-57 24.5T400-197v37h-80Zm160-80Zm0-480Z" />
                    </Svg>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                      Did you get it correct?
                    </Text>
                    {!hasAnsweredCorrect ? (
                      <View style={styles.correctButtonRow}>
                        <TouchableOpacity
                          onPress={() => handleCorrectAnswer(true)}
                          activeOpacity={0.8}
                          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                          style={[
                            styles.correctButtonSmall,
                            {
                              backgroundColor: colors.accent,
                            }
                          ]}
                        >
                          <Text style={[styles.correctButtonText, { color: '#FFFFFF' }]}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleCorrectAnswer(false)}
                          activeOpacity={0.8}
                          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                          style={[
                            styles.correctButtonSmall,
                            {
                              backgroundColor: colors.accentLight,
                              borderWidth: 2,
                              borderColor: colors.accent,
                            }
                          ]}
                        >
                          <Text style={[styles.correctButtonText, { color: colors.accent }]}>No</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <>
                        <Text style={[styles.infoDescription, { color: colors.textSecondary }]}>
                          ✓ Answered
                        </Text>
                        <Pressable
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            navigation.navigate('Statistics');
                          }}
                          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                          style={({ pressed }) => [
                            styles.viewStatsButton,
                            { backgroundColor: colors.accentLight, borderColor: colors.accent, opacity: pressed ? 0.8 : 1 },
                          ]}
                        >
                          <Text style={[styles.viewStatsButtonText, { color: colors.accent }]}>
                            {t('stats.viewStatsLink')}
                          </Text>
                        </Pressable>
                      </>
                    )}
                  </View>
                </View>
              </Animated.View>

              {/* Learn More – shown for Seerah, Prophets, Islamic History, etc. when content exists */}
              {(() => {
                const learnMore = getLearnMore(settings.secretWord);
                if (!learnMore) return null;
                return (
                  <>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <Animated.View entering={FadeIn.delay(1700).springify()}>
                      <View style={[styles.learnMoreCard, { backgroundColor: colors.accentLight + '40', borderColor: colors.accent }]}>
                        <Text style={[styles.learnMoreTitle, { color: colors.accent }]}>
                          Learn about {settings.secretWord}
                        </Text>
                        <Text style={[styles.learnMoreSynopsis, { color: colors.textSecondary }]}>
                          {learnMore.synopsis}
                        </Text>
                        <Pressable
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            WebBrowser.openBrowserAsync(learnMore.youtubeUrl, {
                              createTask: false,
                            }).catch(() => {});
                          }}
                          style={({ pressed }) => [
                            styles.learnMoreButton,
                            { backgroundColor: colors.accent, opacity: pressed ? 0.9 : 1 },
                          ]}
                        >
                          <Text style={styles.learnMoreButtonText}>Watch video</Text>
                        </Pressable>
                      </View>
                    </Animated.View>
                  </>
                );
              })()}
            </Card>

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
    padding: spacing.lg,
    width: '100%',
    flexGrow: 1,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...typography.heading,
    fontSize: 32,
    marginBottom: spacing.sm,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  resultsCard: {
    marginBottom: spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  infoIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  infoIcon: {
    fontSize: 28,
  },
  infoIconImage: {
    width: 28,
    height: 28,
  },
  infoContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  infoLabel: {
    ...typography.caption,
    fontSize: 13,
    marginBottom: spacing.xs / 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
    width: '100%',
  },
  infoValue: {
    ...typography.bodyBold,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    textAlign: 'center',
    width: '100%',
  },
  infoDescriptionBlock: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  infoDescription: {
    ...typography.caption,
    fontSize: 13,
    marginTop: spacing.xs / 2,
    lineHeight: 20,
    textAlign: 'center',
    width: '100%',
  },
  divider: {
    height: 1,
    marginVertical: spacing.xs,
  },
  correctButtonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  correctButtonSmall: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  correctButtonText: {
    ...typography.bodyBold,
    fontSize: 16,
    fontWeight: '600',
  },
  viewStatsButton: {
    marginTop: spacing.xs,
    alignSelf: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
  },
  viewStatsButtonText: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: '600',
  },
  learnMoreCard: {
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 2,
    marginTop: spacing.xs,
  },
  learnMoreTitle: {
    ...typography.bodyBold,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  learnMoreSynopsis: {
    ...typography.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  learnMoreButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  learnMoreButtonText: {
    ...typography.bodyBold,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
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
  buttonContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  button: {
    width: '100%',
  },
  revealButton: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  revealButtonText: {
    ...typography.bodyBold,
    fontSize: 18,
    fontWeight: '700',
  },
});

// Typewriter Text Component
const TypewriterText: React.FC<{
  text: string;
  style: any;
  speed?: number;
  delay?: number;
}> = ({ text, style, speed = 30, delay = 0 }) => {
  const displayedText = useTypewriter(text, speed, delay);
  return <Text style={style}>{displayedText}</Text>;
};