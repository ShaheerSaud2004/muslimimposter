import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Modal,
  Image,
} from 'react-native';
import { showAlert } from '../components/Alert';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../contexts/ThemeContext';
import { useGame } from '../contexts/GameContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import * as Haptics from 'expo-haptics';
import { defaultCategories, getCategoryById, getAllWords } from '../data/categories';
import {
  createPlayers,
  selectRandomWord,
  selectRandomCategory,
  selectSingleRandomCategory,
  getCategoryName,
  selectQuizQuestion,
  selectImposterQuizQuestion,
} from '../utils/game';
import { getSettings, getCustomCategories, getUsedWords, addUsedWord, getSessionUsedQuestionIds, addSessionUsedQuestionId } from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameSettings, GameMode, Category, Difficulty } from '../types';
import { getMaxContentWidth, getResponsivePadding } from '../utils/responsive';

type GameSetupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'GameSetup'
>;

export default function GameSetupScreen() {
  const navigation = useNavigation<GameSetupScreenNavigationProp>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { players, settings, setPlayers, setSettings } = useGame();
  const maxWidth = getMaxContentWidth();
  const responsivePadding = getResponsivePadding();
  const hasInitializedFromContext = useRef(false);

  const [numPlayers, setNumPlayers] = useState(3);
  const [numImposters, setNumImposters] = useState(1);
  const [mode, setMode] = useState<GameMode>('word');
  const [blindImposter, setBlindImposter] = useState(false);
  const [doubleAgent, setDoubleAgent] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showHintToImposter, setShowHintToImposter] = useState(false);
  const [customCategories, setCustomCategories] = useState<Category[]>([]);
  const [modalCategory, setModalCategory] = useState<Category | null>(null);
  const [infoModal, setInfoModal] = useState<'blind' | 'double' | 'word' | 'quiz' | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '']);
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showNameInputModal, setShowNameInputModal] = useState(false);
  const [nameInputModalIndex, setNameInputModalIndex] = useState<number | null>(null);
  const [tempNameInput, setTempNameInput] = useState('');

  // Pre-fill form from existing game when coming from "New Game" (so player count etc. are preserved)
  useEffect(() => {
    if (hasInitializedFromContext.current || !players.length || !settings) return;
    hasInitializedFromContext.current = true;
    setNumPlayers(players.length);
    setNumImposters(settings.numImposters);
    setMode(settings.mode);
    setBlindImposter(settings.specialModes.blindImposter);
    setDoubleAgent(settings.specialModes.doubleAgent);
    setSelectedCategories(settings.selectedCategories ?? []);
    setShowHintToImposter(settings.showHintToImposter);
    setDifficulty(settings.difficulty ?? 'all');
  }, [players.length, settings]);

  // Restore player names after numPlayers sync (runs after the pad/trim effect)
  useEffect(() => {
    if (!hasInitializedFromContext.current || !players.length || !settings || numPlayers !== players.length) return;
    const names = settings.playerNames ?? players.map(p => p.name);
    if (names.length === numPlayers) {
      setPlayerNames(names);
    }
    hasInitializedFromContext.current = false;
  }, [numPlayers, players.length, settings]);

  // Clear selected categories when difficulty changes (skip when restoring from context)
  useEffect(() => {
    if (hasInitializedFromContext.current) return;
    setSelectedCategories([]);
  }, [difficulty]);

  useEffect(() => {
    // Load data asynchronously to prevent blocking render
    const loadData = async () => {
      await Promise.all([
        loadCustomCategories(),
      ]);
    };
    loadData();
    loadSavedPlayerNames();
  }, []);

  const loadSavedPlayerNames = async () => {
    try {
      // Try to load from AsyncStorage
      const savedNames = await AsyncStorage.getItem('@khafi:playerNames');
      if (savedNames) {
        const parsed = JSON.parse(savedNames);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPlayerNames(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading saved player names:', error);
    }
  };

  const savePlayerNames = async (names: string[]) => {
    try {
      await AsyncStorage.setItem('@khafi:playerNames', JSON.stringify(names));
    } catch (error) {
      console.error('Error saving player names:', error);
    }
  };

  const handleNameInputSubmit = async () => {
    if (nameInputModalIndex === null) return;
    
    const name = tempNameInput.trim();
    if (!name) {
      showAlert({ title: 'Name Required', message: 'Please enter a name for this player.' });
      return;
    }

    // Update the name
    const updatedNames = [...playerNames];
    updatedNames[nameInputModalIndex] = name;
    setPlayerNames(updatedNames);
    setTempNameInput('');
    setShowNameInputModal(false);
    
    // All names filled, continue with game start
    setNameInputModalIndex(null);
    await startGame(); // Start the game
  };

  // Update player names array when number of players changes
  useEffect(() => {
    setPlayerNames(prev => {
      const newNames = [...prev];
      while (newNames.length < numPlayers) {
        newNames.push(''); // Start with empty string, placeholder will show default
      }
      return newNames.slice(0, numPlayers);
    });
  }, [numPlayers]);

  const updatePlayerName = (index: number, name: string) => {
    setPlayerNames(prev => {
      const newNames = [...prev];
      newNames[index] = name;
      return newNames;
    });
  };


  const loadCustomCategories = async () => {
    const custom = await getCustomCategories();
    setCustomCategories(custom);
  };

  const recommendedImposters = Math.floor(numPlayers / 3);
  const maxImposters = numPlayers - 1; // Can't have all players be imposters
  const exceedsRecommended = numImposters > recommendedImposters;
  
  // Use default categories
  let sortedCategories = [...defaultCategories];

  // Filter categories by difficulty
  let filteredCategories = sortedCategories;
  if (difficulty !== 'all') {
    filteredCategories = sortedCategories.filter(cat => {
      // Custom categories don't have difficulty, show them always
      if (cat.isCustom) {
        return true;
      }
      return cat.difficulty === difficulty;
    });
  }

  const availableCategories = [...filteredCategories, ...customCategories];
  
  const MAX_VISIBLE_CATEGORIES = 6;
  const visibleCategories = availableCategories.slice(0, MAX_VISIBLE_CATEGORIES);
  const hasMoreCategories = availableCategories.length > MAX_VISIBLE_CATEGORIES;

  const toggleCategory = async (categoryId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const adjustNumber = (type: 'players' | 'imposters', delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (type === 'players') {
      const newVal = Math.max(3, Math.min(20, numPlayers + delta));
      setNumPlayers(newVal);
      // Don't auto-adjust imposters, just cap at max
      if (numImposters > newVal - 1) {
        setNumImposters(newVal - 1);
      }
    } else {
      setNumImposters(Math.max(1, Math.min(maxImposters, numImposters + delta)));
    }
  };

  const startGame = async () => {
    // If no categories selected, randomly choose ONE category
    let categoriesToUse: string[];
    let secretCategoryId: string;
    
    if (selectedCategories.length === 0) {
      // Randomly select a single category
      secretCategoryId = selectSingleRandomCategory(availableCategories);
      if (!secretCategoryId) {
        showAlert({ title: 'Error', message: 'No categories available. Please unlock a category.' });
        return;
      }
      categoriesToUse = [secretCategoryId];
    } else {
      // Use selected categories and randomly pick one for the word
      categoriesToUse = selectedCategories;
      secretCategoryId = selectRandomCategory(categoriesToUse, availableCategories);
    }

    // Get words from only the chosen category
    const allCategories = [...availableCategories, ...customCategories];
    const chosenCategory = allCategories.find(c => c.id === secretCategoryId);
    
    if (!chosenCategory || chosenCategory.words.length === 0) {
      showAlert({ title: 'Error', message: 'No words available in selected category.' });
      return;
    }

    // Handle Quiz Mode: Get question first, answer becomes the word
    let secretWord: string;
    let quizQuestion: string | undefined;
    let imposterQuizQuestion: string | undefined;
    
    if (mode === 'quiz') {
      // Get a quiz question for this category (exclude session-used so we don't repeat)
      const { getRandomQuizQuestion } = require('../data/quizQuestions');
      const usedQuestionIds = getSessionUsedQuestionIds();
      const normalQuestion = getRandomQuizQuestion(
        secretCategoryId,
        difficulty === 'all' ? undefined : difficulty,
        usedQuestionIds
      );
      
      if (!normalQuestion) {
        showAlert({ 
          title: 'No Quiz Questions', 
          message: 'No quiz questions available for this category (or all have been used this session). Try another category or use Word + Clue mode.' 
        });
        return;
      }
      
      addSessionUsedQuestionId(normalQuestion.id);
      quizQuestion = normalQuestion.question;
      secretWord = normalQuestion.answer; // The answer becomes the secret word
      
      // Get a different but similar question for the imposter (same category, same answer type, same question structure)
      const imposterQ = selectImposterQuizQuestion(
        secretCategoryId,
        normalQuestion.id,
        difficulty === 'all' ? undefined : difficulty,
        normalQuestion.answer,
        normalQuestion.question
      );
      if (imposterQ) {
        imposterQuizQuestion = imposterQ.question;
      } else {
        // Fallback: use the same question if no other available
        imposterQuizQuestion = quizQuestion;
      }
      
      // Mark word as used
      await addUsedWord(secretWord);
    } else {
      // Regular mode: Get used words and select a word that hasn't been used
      const usedWords = await getUsedWords();
      secretWord = selectRandomWord(chosenCategory.words, usedWords);
      
      // Mark word as used
      await addUsedWord(secretWord);
    }
    
    // Select random starting player ID first
    const randomPlayerIndex = Math.floor(Math.random() * numPlayers);
    const startingPlayerId = `player-${randomPlayerIndex}`;
    
    const players = createPlayers(numPlayers, numImposters, doubleAgent, startingPlayerId, playerNames);

    const settings: GameSettings = {
      numPlayers,
      numImposters,
      mode,
      specialModes: {
        blindImposter,
        doubleAgent,
      },
      selectedCategories: categoriesToUse,
      showCategoryToImposter: !blindImposter, // Show category when Blind Imposter is OFF
      showHintToImposter,
      startingPlayerId,
      difficulty: difficulty === 'all' ? undefined : difficulty,
      secretWord,
      secretCategory: secretCategoryId,
      playerNames: playerNames, // Save player names for persistence
      quizQuestion: quizQuestion, // For quiz mode: question for normal players
      imposterQuizQuestion: imposterQuizQuestion, // For quiz mode: question for imposter
    };

    // Save player names for next game
    await savePlayerNames(playerNames);

    setPlayers(players);
    setSettings(settings);

    // Navigate to game confirmation screen
    navigation.navigate('GameConfirmation');
  };

  const handleStart = async () => {
    if (numImposters >= numPlayers) {
      showAlert({ title: 'Error', message: 'You cannot have all players be imposters. At least one player must be normal.' });
      return;
    }

    // All validations passed, start the game
    await startGame();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <PatternBackground />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { maxWidth, alignSelf: 'center', width: '100%' },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(0).springify()} style={styles.headerContainer}>
          <Pressable 
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.backButtonContainer,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <View style={[styles.backIcon, { backgroundColor: colors.accentLight }]}>
              <Text style={[styles.backIconText, { color: colors.accent }]}>←</Text>
            </View>
          </Pressable>
          <Text style={[styles.heading, { color: colors.text }]}>
            Game Setup
          </Text>
        </Animated.View>

        {/* Players & Imposters Card */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Card style={styles.sectionCard}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Players
            </Text>
            
            {/* Players */}
            <View style={styles.numberSection}>
              <View style={styles.numberLabelContainer}>
                <Text style={[styles.numberLabel, { color: colors.text }]}>
                  Number of Players
                </Text>
              </View>
              <View style={styles.numberSelector}>
                <Pressable
                  onPress={() => adjustNumber('players', -1)}
                  style={({ pressed }) => [
                    styles.numberButton,
                    {
                      backgroundColor: pressed ? colors.accentLight : colors.border,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.numberButtonText, { color: colors.accent }]}>
                    −
                  </Text>
                </Pressable>
                <View style={[styles.numberDisplay, { backgroundColor: colors.accentLight }]}>
                  <Text style={[styles.number, { color: colors.accent }]}>
                    {numPlayers}
                  </Text>
                </View>
                <Pressable
                  onPress={() => adjustNumber('players', 1)}
                  style={({ pressed }) => [
                    styles.numberButton,
                    {
                      backgroundColor: pressed ? colors.accentLight : colors.border,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.numberButtonText, { color: colors.accent }]}>
                    +
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Imposters */}
            <View style={styles.numberSection}>
              <View style={styles.numberLabelContainer}>
                <Text style={[styles.numberLabel, { color: colors.text }]}>
                  Number of Imposters
                </Text>
                <View style={styles.hintContainer}>
                  <Text style={[styles.hint, { color: colors.textSecondary }]}>
                    Recommended: {recommendedImposters}
                  </Text>
                  {exceedsRecommended && (
                    <View style={[styles.warningBadge, { backgroundColor: colors.imposter + '20' }]}>
                      <Text style={[styles.warningText, { color: colors.imposter }]}>
                        ⚠️ Not recommended
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.numberSelector}>
                <Pressable
                  onPress={() => adjustNumber('imposters', -1)}
                  style={({ pressed }) => [
                    styles.numberButton,
                    {
                      backgroundColor: pressed ? colors.imposter + '20' : colors.border,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.numberButtonText, { color: colors.imposter }]}>
                    −
                  </Text>
                </Pressable>
                <View style={[styles.numberDisplay, { backgroundColor: colors.imposter + '15' }]}>
                  <Text style={[styles.number, { color: colors.imposter }]}>
                    {numImposters}
                  </Text>
                </View>
                <Pressable
                  onPress={() => adjustNumber('imposters', 1)}
                  style={({ pressed }) => [
                    styles.numberButton,
                    {
                      backgroundColor: pressed ? colors.imposter + '20' : colors.border,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.numberButtonText, { color: colors.imposter }]}>
                    +
                  </Text>
                </Pressable>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Player Names Card */}
        {
          <Animated.View entering={FadeInDown.delay(175).springify()}>
            <Card style={styles.sectionCard}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Player Names
              </Text>
              <Text style={[styles.categoryHint, { color: colors.textSecondary, marginBottom: spacing.md }]}>
                Enter names for each player (optional)
              </Text>
              <View style={styles.nameInputsContainer}>
                {Array.from({ length: numPlayers }, (_, index) => ({ index, name: playerNames[index] ?? '' })).map(({ index, name }) => (
                  <Animated.View
                    key={index}
                    entering={FadeIn.delay(175 + index * 30)}
                    style={styles.nameInputWrapper}
                  >
                    <View style={[styles.nameInputLabel, { backgroundColor: colors.accentLight }]}>
                      <Text style={[styles.nameInputLabelText, { color: colors.accent }]}>
                        {index + 1}
                      </Text>
                    </View>
                    <View style={styles.nameInputContainer}>
                      <View style={styles.nameInputFieldWrapper}>
                        <TextInput
                          style={[
                            styles.nameInput,
                            {
                              backgroundColor: colors.cardBackground,
                              borderColor: colors.border,
                              color: colors.text,
                              paddingRight: spacing.md,
                              paddingLeft: spacing.md,
                              textAlign: 'left',
                              includeFontPadding: false,
                              lineHeight: 20,
                            },
                          ]}
                          placeholder={`Player ${index + 1}`}
                          placeholderTextColor={colors.textSecondary}
                          value={name}
                          onChangeText={(text) => updatePlayerName(index, text)}
                          maxLength={20}
                          multiline={false}
                        />
                      </View>
                      {name.trim() && (
                        <Pressable
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            updatePlayerName(index, '');
                          }}
                          style={({ pressed }) => [
                            styles.clearButton,
                            { opacity: pressed ? 0.6 : 1 },
                          ]}
                        >
                          <View style={[styles.clearButtonIcon, { backgroundColor: colors.textSecondary + '30', borderWidth: 1, borderColor: colors.border }]}>
                            <Text style={[styles.clearButtonText, { color: colors.text }]}>✕</Text>
                          </View>
                        </Pressable>
                      )}
                    </View>
                  </Animated.View>
                ))}
              </View>
            </Card>
          </Animated.View>
        }

        {/* Game Mode & Special Modes Card */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Card style={styles.sectionCard}>
            <View style={styles.gameModeHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Game Mode
              </Text>
            </View>
            <View style={styles.modeContainer}>
              <View style={styles.modeOptionWrapper}>
                <View style={{ position: 'relative' }}>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setMode('word');
                    }}
                    style={({ pressed }) => [
                      styles.modeOption,
                      {
                        backgroundColor: pressed
                          ? colors.accentLight
                          : mode === 'word'
                          ? colors.accentLight
                          : colors.border,
                        borderColor:
                          mode === 'word' || pressed ? colors.accent : colors.border,
                        borderWidth: mode === 'word' || pressed ? 2 : 1,
                        transform: [{ scale: pressed ? 0.96 : 1 }],
                        shadowColor: pressed ? colors.accent : 'transparent',
                        shadowOffset: { width: 0, height: pressed ? 2 : 0 },
                        shadowOpacity: pressed ? 0.2 : 0,
                        shadowRadius: pressed ? 4 : 0,
                        elevation: pressed ? 3 : 0,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.modeText,
                        {
                          color: mode === 'word' ? colors.accent : colors.text,
                          fontWeight: mode === 'word' ? '700' : '600',
                        },
                      ]}
                    >
                      Word + Clue
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setInfoModal('word');
                    }}
                    style={styles.readMoreButtonInBox}
                  >
                      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                          stroke={colors.textSecondary}
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity={0.6}
                        />
                      </Svg>
                  </Pressable>
                </View>
              </View>
              <View style={styles.modeOptionWrapper}>
                <View style={{ position: 'relative' }}>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setMode('quiz');
                    }}
                    style={({ pressed }) => [
                      styles.modeOption,
                      {
                        backgroundColor:
                          pressed
                            ? colors.accentLight
                            : mode === 'quiz'
                            ? colors.accentLight
                            : colors.border,
                        borderColor:
                          mode === 'quiz' || pressed ? colors.accent : colors.border,
                        borderWidth: mode === 'quiz' || pressed ? 2 : 1,
                        transform: [{ scale: pressed ? 0.96 : 1 }],
                        shadowColor: pressed ? colors.accent : 'transparent',
                        shadowOffset: { width: 0, height: pressed ? 2 : 0 },
                        shadowOpacity: pressed ? 0.2 : 0,
                        shadowRadius: pressed ? 4 : 0,
                        elevation: pressed ? 3 : 0,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.modeText,
                        {
                          color: mode === 'quiz' ? colors.accent : colors.text,
                          fontWeight: mode === 'quiz' ? '700' : '600',
                        },
                      ]}
                    >
                      Quiz/Questions
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setInfoModal('quiz');
                    }}
                    style={styles.readMoreButtonInBox}
                  >
                    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        stroke={colors.textSecondary}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={0.6}
                      />
                    </Svg>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border, marginTop: spacing.lg }]} />

            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: colors.text, marginTop: spacing.lg }]}>
                Special Modes
              </Text>
            </View>
            
            <View style={styles.toggleContainer}>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setBlindImposter(!blindImposter);
                }}
                style={({ pressed }) => [
                  styles.toggleRow,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <View style={styles.toggleLabelContainer}>
                  <View style={styles.labelRow}>
                    <Text style={[styles.toggleLabel, { color: colors.text }]}>
                      Blind Imposter
                    </Text>
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setInfoModal('blind');
                      }}
                      style={styles.readMoreButtonInline}
                    >
                      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                          stroke={colors.textSecondary}
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                    </Pressable>
                  </View>
                  <Text style={[styles.toggleDescription, { color: colors.textSecondary }]}>
                    Imposter doesn't see the category
                  </Text>
                </View>
                <View
                  style={[
                    styles.toggle,
                    {
                      backgroundColor: blindImposter ? colors.accent : colors.border,
                    },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.toggleThumb,
                      {
                        transform: [{ translateX: blindImposter ? 20 : 0 }],
                      },
                    ]}
                  />
                </View>
              </Pressable>
              
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setDoubleAgent(!doubleAgent);
                }}
                style={({ pressed }) => [
                  styles.toggleRow,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <View style={styles.toggleLabelContainer}>
                  <View style={styles.labelRow}>
                    <Text style={[styles.toggleLabel, { color: colors.text }]}>
                      Double Agent
                    </Text>
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setInfoModal('double');
                      }}
                      style={styles.readMoreButtonInline}
                    >
                      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                          stroke={colors.textSecondary}
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                    </Pressable>
                  </View>
                  <Text style={[styles.toggleDescription, { color: colors.textSecondary }]}>
                    One player knows the word but isn't imposter
                  </Text>
                </View>
                <View
                  style={[
                    styles.toggle,
                    {
                      backgroundColor: doubleAgent ? colors.doubleAgent : colors.border,
                    },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.toggleThumb,
                      {
                        transform: [{ translateX: doubleAgent ? 20 : 0 }],
                      },
                    ]}
                  />
                </View>
              </Pressable>
            </View>
          </Card>
        </Animated.View>

        {/* Difficulty Level Card */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Card style={styles.sectionCard}>
            <View style={styles.gameModeHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Difficulty Level
              </Text>
            </View>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowDifficultyModal(true);
              }}
              style={({ pressed }) => [
                styles.difficultyDropdown,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <View style={styles.difficultyDropdownContent}>
                <View style={styles.difficultyIcons}>
                  {difficulty === 'easy' && (
                    <Svg width={20} height={20} viewBox="0 -960 960 960">
                      <Path
                        d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"
                        fill={colors.accent}
                      />
                    </Svg>
                  )}
                  {difficulty === 'medium' && (
                    <>
                      <Svg width={20} height={20} viewBox="0 -960 960 960">
                        <Path
                          d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"
                          fill={colors.accent}
                        />
                      </Svg>
                      <Svg width={20} height={20} viewBox="0 -960 960 960">
                        <Path
                          d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"
                          fill={colors.accent}
                        />
                      </Svg>
                    </>
                  )}
                  {difficulty === 'hard' && (
                    <>
                      <Svg width={20} height={20} viewBox="0 -960 960 960">
                        <Path
                          d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"
                          fill={colors.accent}
                        />
                      </Svg>
                      <Svg width={20} height={20} viewBox="0 -960 960 960">
                        <Path
                          d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"
                          fill={colors.accent}
                        />
                      </Svg>
                      <Svg width={20} height={20} viewBox="0 -960 960 960">
                        <Path
                          d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"
                          fill={colors.accent}
                        />
                      </Svg>
                    </>
                  )}
                  {difficulty === 'all' && (
                    <>
                      <Svg width={20} height={20} viewBox="0 -960 960 960">
                        <Path
                          d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"
                          fill={colors.accent}
                        />
                      </Svg>
                      <Svg width={20} height={20} viewBox="0 -960 960 960">
                        <Path
                          d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"
                          fill={colors.accent}
                        />
                      </Svg>
                      <Svg width={20} height={20} viewBox="0 -960 960 960">
                        <Path
                          d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"
                          fill={colors.accent}
                        />
                      </Svg>
                      <Svg width={20} height={20} viewBox="0 -960 960 960">
                        <Path
                          d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"
                          fill={colors.accent}
                        />
                      </Svg>
                    </>
                  )}
                </View>
                <Text style={[styles.difficultyDropdownText, { color: colors.text }]}>
                  {difficulty === 'easy' ? 'Easy' : difficulty === 'medium' ? 'Medium' : difficulty === 'hard' ? 'Hard' : 'All'}
                </Text>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M7 10l5 5 5-5"
                    stroke={colors.textSecondary}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            </Pressable>

            {/* Difficulty Selection Modal */}
            <Modal
              visible={showDifficultyModal}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowDifficultyModal(false)}
            >
              <Pressable
                style={styles.modalOverlay}
                onPress={() => setShowDifficultyModal(false)}
              >
                <View style={[styles.difficultyModalContent, { backgroundColor: colors.cardBackground }]}>
                  {(['easy', 'medium', 'hard', 'all'] as const).map((level) => (
                    <Pressable
                      key={level}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setDifficulty(level);
                        setShowDifficultyModal(false);
                      }}
                      style={({ pressed }) => [
                        styles.difficultyModalOption,
                        {
                          backgroundColor: difficulty === level ? colors.accentLight : 'transparent',
                          borderColor: difficulty === level ? colors.accent : colors.border,
                          opacity: pressed ? 0.7 : 1,
                        },
                      ]}
                    >
                      <View style={styles.difficultyModalOptionContent}>
                        <View style={styles.difficultyIcons}>
                          {level === 'easy' && (
                            <Svg width={20} height={20} viewBox="0 -960 960 960">
                              <Path
                                d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"
                                fill={difficulty === level ? colors.accent : colors.textSecondary}
                              />
                            </Svg>
                          )}
                          {level === 'medium' && (
                            <>
                              <Svg width={20} height={20} viewBox="0 -960 960 960">
                                <Path
                                  d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"
                                  fill={difficulty === level ? colors.accent : colors.textSecondary}
                                />
                              </Svg>
                              <Svg width={20} height={20} viewBox="0 -960 960 960">
                                <Path
                                  d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"
                                  fill={difficulty === level ? colors.accent : colors.textSecondary}
                                />
                              </Svg>
                            </>
                          )}
                          {level === 'hard' && (
                            <>
                              <Svg width={20} height={20} viewBox="0 -960 960 960">
                                <Path
                                  d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"
                                  fill={difficulty === level ? colors.accent : colors.textSecondary}
                                />
                              </Svg>
                              <Svg width={20} height={20} viewBox="0 -960 960 960">
                                <Path
                                  d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"
                                  fill={difficulty === level ? colors.accent : colors.textSecondary}
                                />
                              </Svg>
                              <Svg width={20} height={20} viewBox="0 -960 960 960">
                                <Path
                                  d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"
                                  fill={difficulty === level ? colors.accent : colors.textSecondary}
                                />
                              </Svg>
                            </>
                          )}
                          {level === 'all' && (
                            <>
                              <Svg width={20} height={20} viewBox="0 -960 960 960">
                                <Path
                                  d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"
                                  fill={difficulty === level ? colors.accent : colors.textSecondary}
                                />
                              </Svg>
                              <Svg width={20} height={20} viewBox="0 -960 960 960">
                                <Path
                                  d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"
                                  fill={difficulty === level ? colors.accent : colors.textSecondary}
                                />
                              </Svg>
                              <Svg width={20} height={20} viewBox="0 -960 960 960">
                                <Path
                                  d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"
                                  fill={difficulty === level ? colors.accent : colors.textSecondary}
                                />
                              </Svg>
                              <Svg width={20} height={20} viewBox="0 -960 960 960">
                                <Path
                                  d="M240-400q0 52 21 98.5t60 81.5q-1-5-1-9v-9q0-32 12-60t35-51l113-111 113 111q23 23 35 51t12 60v9q0 4-1 9 39-35 60-81.5t21-98.5q0-50-18.5-94.5T648-574q-20 13-42 19.5t-45 6.5q-62 0-107.5-41T401-690q-39 33-69 68.5t-50.5 72Q261-513 250.5-475T240-400Zm240 52-57 56q-11 11-17 25t-6 29q0 32 23.5 55t56.5 23q33 0 56.5-23t23.5-55q0-16-6-29.5T537-292l-57-56Zm0-492v132q0 34 23.5 57t57.5 23q18 0 33.5-7.5T622-658l18-22q74 42 117 117t43 163q0 134-93 227T480-80q-134 0-227-93t-93-227q0-129 86.5-245T480-840Z"
                                  fill={difficulty === level ? colors.accent : colors.textSecondary}
                                />
                              </Svg>
                            </>
                          )}
                        </View>
                        <Text
                          style={[
                            styles.difficultyModalOptionText,
                            {
                              color: difficulty === level ? colors.accent : colors.text,
                              fontWeight: difficulty === level ? '700' : '600',
                            },
                          ]}
                        >
                          {level === 'easy' ? 'Easy' : level === 'medium' ? 'Medium' : level === 'hard' ? 'Hard' : 'All'}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </Pressable>
            </Modal>
          </Card>
        </Animated.View>

        {/* Categories Card */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Card style={styles.sectionCard}>
            <View style={styles.categoryHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Categories
              </Text>
              {selectedCategories.length > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.accentLight }]}>
                  <Text style={[styles.badgeText, { color: colors.accent }]}>
                    {selectedCategories.length} selected
                  </Text>
                </View>
              )}
            </View>
            <Text style={[styles.categoryHint, { color: colors.textSecondary }]}>
              {selectedCategories.length === 0 
                ? 'Select specific categories, or leave empty to use all' 
                : 'Long press a category to see details'}
            </Text>
            <View style={styles.categoryGrid}>
              {visibleCategories.map((category, index) => (
                <Animated.View
                  key={category.id}
                  entering={FadeIn.delay(300 + index * 30)}
                >
                  <Pressable
                    onPress={() => toggleCategory(category.id)}
                    onLongPress={() => setModalCategory(category)}
                    style={({ pressed }) => [
                      styles.categoryChip,
                      {
                        backgroundColor: pressed
                          ? colors.accentLight
                          : selectedCategories.includes(category.id)
                          ? colors.accentLight
                          : colors.border,
                        borderColor: selectedCategories.includes(category.id)
                          ? colors.accent
                          : pressed
                          ? colors.accent
                          : colors.border,
                        borderWidth: selectedCategories.includes(category.id) || pressed ? 2 : 1,
                        transform: [{ scale: pressed ? 0.95 : 1 }],
                        shadowColor: pressed ? colors.accent : 'transparent',
                        shadowOffset: { width: 0, height: pressed ? 2 : 0 },
                        shadowOpacity: pressed ? 0.2 : 0,
                        shadowRadius: pressed ? 4 : 0,
                        elevation: pressed ? 3 : 0,
                      },
                    ]}
                  >
                    <View style={styles.categoryContent}>
                      {selectedCategories.includes(category.id) && (
                        <View style={[styles.checkIcon, { backgroundColor: colors.accent }]}>
                          <Text style={styles.checkText}>✓</Text>
                        </View>
                      )}
                      <Text
                        style={[
                          styles.categoryText,
                          {
                            color: selectedCategories.includes(category.id)
                              ? colors.accent
                              : colors.textSecondary,
                            fontWeight: selectedCategories.includes(category.id)
                              ? '700'
                              : '500',
                          },
                        ]}
                      >
                        {category.name}
                      </Text>
                    </View>
                  </Pressable>
                </Animated.View>
              ))}
              {hasMoreCategories && (
                <Animated.View entering={FadeIn.delay(300 + visibleCategories.length * 30)}>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      setShowAllCategories(true);
                    }}
                    style={({ pressed }) => [
                      styles.seeMoreChip,
                      {
                        backgroundColor: pressed ? colors.accentLight : colors.border,
                        borderColor: colors.accent,
                        opacity: pressed ? 0.8 : 1,
                        transform: [{ scale: pressed ? 0.96 : 1 }],
                      },
                    ]}
                  >
                    <Text style={[styles.seeMoreText, { color: colors.accent }]}>
                      See More ({availableCategories.length - MAX_VISIBLE_CATEGORIES})
                    </Text>
                  </Pressable>
                </Animated.View>
              )}
            </View>
          </Card>
        </Animated.View>

        {/* Start Button */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Button
            title="Start Game"
            onPress={handleStart}
            style={styles.startButton}
          />
        </Animated.View>
      </ScrollView>

      {/* Name Input Modal */}
      <Modal
        visible={showNameInputModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowNameInputModal(false);
          setNameInputModalIndex(null);
          setTempNameInput('');
        }}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => {
            setShowNameInputModal(false);
            setNameInputModalIndex(null);
            setTempNameInput('');
          }}
        >
          <Card
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalTitle, { color: colors.text, flex: 1, marginBottom: 0 }]}>
                Enter Player Name
              </Text>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowNameInputModal(false);
                  setNameInputModalIndex(null);
                  setTempNameInput('');
                }}
                style={({ pressed }) => [
                  styles.modalCloseBtn,
                  { backgroundColor: colors.border, opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <Text style={[styles.modalCloseBtnText, { color: colors.text }]}>✕</Text>
              </Pressable>
            </View>
            <Text style={[styles.modalDescription, { color: colors.textSecondary, marginBottom: spacing.md }]}>
              Please enter a name for Player {nameInputModalIndex !== null ? nameInputModalIndex + 1 : ''}
            </Text>
            <TextInput
              style={[
                styles.nameInput,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                  color: colors.text,
                  paddingRight: spacing.md,
                  paddingLeft: spacing.md,
                  marginBottom: spacing.md,
                },
              ]}
              placeholder="Player name"
              placeholderTextColor={colors.textSecondary}
              value={tempNameInput}
              onChangeText={setTempNameInput}
              maxLength={20}
              autoFocus
              onSubmitEditing={handleNameInputSubmit}
            />
            <View style={styles.modalButtonRow}>
              <View style={styles.modalButtonWrapper}>
                <Button
                  title="Cancel"
                  onPress={() => {
                    setShowNameInputModal(false);
                    setNameInputModalIndex(null);
                    setTempNameInput('');
                  }}
                  variant="secondary"
                  style={styles.modalButtonCompact}
                />
              </View>
              <View style={styles.modalButtonWrapper}>
                <Button
                  title="Continue"
                  onPress={handleNameInputSubmit}
                  style={styles.modalButtonCompact}
                />
              </View>
            </View>
          </Card>
        </Pressable>
      </Modal>

      {/* Category Modal */}
      <Modal
        visible={!!modalCategory}
        transparent
        animationType="fade"
        onRequestClose={() => setModalCategory(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalCategory(null)}
        >
          <Card
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            {modalCategory && (
              <>
                <View style={styles.modalHeaderRow}>
                  <Text
                    style={[styles.modalTitle, { color: colors.text, flex: 1, marginBottom: 0 }]}
                    numberOfLines={1}
                  >
                    {modalCategory.name}
                  </Text>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setModalCategory(null);
                    }}
                    style={({ pressed }) => [
                      styles.modalCloseBtn,
                      { backgroundColor: colors.border, opacity: pressed ? 0.6 : 1 },
                    ]}
                  >
                    <Text style={[styles.modalCloseBtnText, { color: colors.text }]}>✕</Text>
                  </Pressable>
                </View>
                <View>
                  <Text
                    style={[styles.modalDescription, { color: colors.textSecondary }]}
                  >
                    {modalCategory.description}
                  </Text>
                  <Text
                    style={[styles.modalExamples, { color: colors.textSecondary }]}
                  >
                    Examples: {modalCategory.words.slice(0, 5).join(', ')}
                    {modalCategory.words.length > 5 && '...'}
                  </Text>
                </View>
              </>
            )}
          </Card>
        </Pressable>
      </Modal>

      {/* All Categories Modal */}
      <Modal
        visible={showAllCategories}
        animationType="slide"
        onRequestClose={() => setShowAllCategories(false)}
      >
        <View style={[styles.fullScreenModal, { backgroundColor: colors.background }]}>
          <PatternBackground />
          <View style={[styles.fullScreenModalContent, { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.lg }]}>
            <View style={styles.allCategoriesHeader}>
              <Text style={[styles.modalTitle, { color: colors.text, fontSize: 28, flex: 1, marginBottom: 0 }]} numberOfLines={1}>
                All Categories
              </Text>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowAllCategories(false);
                }}
                style={({ pressed }) => [
                  styles.modalCloseBtn,
                  {
                    backgroundColor: colors.border,
                    opacity: pressed ? 0.6 : 1,
                  },
                ]}
              >
                <Text style={[styles.modalCloseBtnText, { color: colors.text }]}>✕</Text>
              </Pressable>
            </View>
            <ScrollView 
              style={styles.categoriesList}
              contentContainerStyle={styles.categoriesListContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Popular Categories Section */}
              {(() => {
                const popularCategoryIds = ['msa', 'prophets', 'ramadan'];
                const popularCategories = popularCategoryIds
                  .map(id => availableCategories.find(cat => cat.id === id))
                  .filter((cat): cat is Category => cat !== undefined);
                const otherCategories = availableCategories.filter(cat => !popularCategoryIds.includes(cat.id));
                
                return (
                  <>
                    {popularCategories.length > 0 && (
                      <>
                        <Text style={[styles.popularSectionTitle, { color: colors.text }]}>
                          Popular Categories
                        </Text>
                        {popularCategories.map((category) => (
                          <Pressable
                            key={category.id}
                            onPress={() => {
                              toggleCategory(category.id);
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }}
                            style={({ pressed }) => [
                              styles.categoryListItem,
                              {
                                backgroundColor: pressed
                                  ? colors.accentLight
                                  : selectedCategories.includes(category.id)
                                  ? colors.accentLight
                                  : colors.cardBackground,
                                borderColor: pressed
                                  ? colors.accent
                                  : selectedCategories.includes(category.id)
                                  ? colors.accent
                                  : colors.border,
                                borderWidth: selectedCategories.includes(category.id) || pressed ? 2 : 1,
                                transform: [{ scale: pressed ? 0.98 : 1 }],
                                shadowColor: pressed ? colors.accent : 'transparent',
                                shadowOffset: { width: 0, height: pressed ? 2 : 0 },
                                shadowOpacity: pressed ? 0.15 : 0,
                                shadowRadius: pressed ? 3 : 0,
                                elevation: pressed ? 2 : 0,
                              },
                            ]}
                          >
                            <View style={styles.categoryListItemContent}>
                              <View style={styles.categoryListItemLeft}>
                                {selectedCategories.includes(category.id) && (
                                  <View style={[styles.checkIconSmall, { backgroundColor: colors.accent }]}>
                                    <Text style={styles.checkText}>✓</Text>
                                  </View>
                                )}
                                <View style={styles.categoryListItemText}>
                                  <View style={styles.categoryListItemHeader}>
                                    <Text style={[styles.categoryListItemName, { color: colors.text }]}>
                                      {category.name}
                                    </Text>
                                    {category.locked && (
                                      <Text style={[styles.lockIconSmall, { color: colors.textSecondary }]}>🔒</Text>
                                    )}
                                  </View>
                                  <Text style={[styles.categoryListItemDescription, { color: colors.textSecondary }]}>
                                    {category.description}
                                  </Text>
                                  <Text style={[styles.categoryListItemExamples, { color: colors.textSecondary }]}>
                                    {category.words.slice(0, 3).join(', ')}
                                    {category.words.length > 3 && '...'}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </Pressable>
                        ))}
                        <View style={[styles.sectionDivider, { backgroundColor: colors.border }]} />
                      </>
                    )}
                    {otherCategories.map((category) => (
                      <Pressable
                        key={category.id}
                        onPress={() => {
                          toggleCategory(category.id);
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                        style={({ pressed }) => [
                          styles.categoryListItem,
                          {
                            backgroundColor: pressed
                              ? colors.accentLight
                              : selectedCategories.includes(category.id)
                              ? colors.accentLight
                              : colors.cardBackground,
                            borderColor: pressed
                              ? colors.accent
                              : selectedCategories.includes(category.id)
                              ? colors.accent
                              : colors.border,
                            borderWidth: selectedCategories.includes(category.id) || pressed ? 2 : 1,
                            transform: [{ scale: pressed ? 0.98 : 1 }],
                            shadowColor: pressed ? colors.accent : 'transparent',
                            shadowOffset: { width: 0, height: pressed ? 2 : 0 },
                            shadowOpacity: pressed ? 0.15 : 0,
                            shadowRadius: pressed ? 3 : 0,
                            elevation: pressed ? 2 : 0,
                          },
                        ]}
                        disabled={category.locked}
                      >
                        <View style={styles.categoryListItemContent}>
                          <View style={styles.categoryListItemLeft}>
                            {selectedCategories.includes(category.id) && (
                              <View style={[styles.checkIconSmall, { backgroundColor: colors.accent }]}>
                                <Text style={styles.checkText}>✓</Text>
                              </View>
                            )}
                            <View style={styles.categoryListItemText}>
                              <View style={styles.categoryListItemHeader}>
                                <Text
                                  style={[
                                    styles.categoryListItemName,
                                    {
                                      color: selectedCategories.includes(category.id)
                                        ? colors.accent
                                        : colors.text,
                                      fontWeight: selectedCategories.includes(category.id)
                                        ? '700'
                                        : '600',
                                    },
                                  ]}
                                >
                                  {category.name}
                                </Text>
                              </View>
                              <Text
                                style={[styles.categoryListItemDescription, { color: colors.textSecondary }]}
                              >
                                {category.description}
                              </Text>
                              {category.words.length > 0 ? (
                                <Text
                                  style={[styles.categoryListItemExamples, { color: colors.textSecondary }]}
                                >
                                  Examples: {category.words.slice(0, 4).join(', ')}
                                  {category.words.length > 4 && '...'}
                                </Text>
                              ) : null}
                            </View>
                          </View>
                        </View>
                      </Pressable>
                    ))}
                  </>
                );
              })()}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Info Modal */}
      <Modal
        visible={!!infoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoModal(null)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setInfoModal(null)}
        >
          <Card
            style={styles.infoModalContent}
            onPress={(e) => e.stopPropagation()}
          >
            {infoModal && (
              <View>
                <View style={[styles.modalHeaderRow, { padding: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                  <Text style={[styles.modalTitle, { color: colors.text, flex: 1, marginBottom: 0 }]} numberOfLines={1}>
                    {infoModal === 'blind' && 'Blind Imposter'}
                    {infoModal === 'double' && 'Double Agent'}
                    {infoModal === 'word' && 'Word + Clue Mode'}
                    {infoModal === 'quiz' && 'Quiz/Questions Mode'}
                  </Text>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setInfoModal(null);
                    }}
                    style={({ pressed }) => [
                      styles.modalCloseBtn,
                      { backgroundColor: colors.border, opacity: pressed ? 0.6 : 1 },
                    ]}
                  >
                    <Text style={[styles.modalCloseBtnText, { color: colors.text }]}>✕</Text>
                  </Pressable>
                </View>
                <View style={styles.infoModalScrollContent}>
                  {infoModal === 'blind' && (
                    <>
                      <View style={[styles.modalSection, { backgroundColor: colors.accentLight + '30', borderLeftWidth: 3, borderLeftColor: colors.accent, paddingLeft: spacing.sm, marginBottom: spacing.sm }]}>
                        <Text style={[styles.modalDescription, { color: colors.text, fontWeight: '600', marginBottom: spacing.xs }]}>
                          What it does:
                        </Text>
                        <Text style={[styles.modalDescription, { color: colors.text }]}>
                          When enabled, the imposter will only see "IMPOSTER" on their card - they won't see the category or any hints about the secret word.
                        </Text>
                      </View>
                      <Text style={[styles.modalDescription, { color: colors.textSecondary, marginTop: spacing.sm }]}>
                        This makes the game more challenging as the imposter must bluff without knowing which category the word belongs to. They have to guess based on the clues or questions given by other players.
                      </Text>
                      <Text style={[styles.modalDescription, { color: colors.textSecondary, marginTop: spacing.xs }]}>
                        Normal players will still see the secret word and category on their cards, so they can give accurate clues or answers.
                      </Text>
                    </>
                  )}
                  {infoModal === 'double' && (
                    <>
                      <View style={[styles.modalSection, { backgroundColor: colors.accentLight + '30', borderLeftWidth: 3, borderLeftColor: colors.accent, paddingLeft: spacing.sm, marginBottom: spacing.sm }]}>
                        <Text style={[styles.modalDescription, { color: colors.text, fontWeight: '600', marginBottom: spacing.xs }]}>
                          What it is:
                        </Text>
                        <Text style={[styles.modalDescription, { color: colors.text }]}>
                          One player (chosen randomly) will see the secret word on their card, but they are NOT an imposter. This player is called the "Double Agent".
                        </Text>
                      </View>
                      <Text style={[styles.modalDescription, { color: colors.textSecondary, marginTop: spacing.sm }]}>
                        The Double Agent knows the word, so they can give accurate clues or answers. However, their goal is to survive without being voted out, while making it seem like they might be the imposter.
                      </Text>
                      <Text style={[styles.modalDescription, { color: colors.textSecondary, marginTop: spacing.xs }]}>
                        Neither the imposters nor the other normal players know who the Double Agent is. This adds an extra layer of strategy and deception to the game!
                      </Text>
                      <View style={[styles.modalSection, { backgroundColor: colors.accentLight + '20', padding: spacing.sm, borderRadius: 8, marginTop: spacing.sm }]}>
                        <Text style={[styles.modalDescription, { color: colors.text, fontWeight: '600', marginBottom: spacing.xs / 2 }]}>
                          Victory Condition:
                        </Text>
                        <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                          The Double Agent wins if they survive the voting round. If they're voted out, the normal players and imposters continue playing as usual.
                        </Text>
                      </View>
                    </>
                  )}
                  {infoModal === 'word' && (
                    <>
                      <Text style={[styles.modalDescription, { color: colors.text, marginBottom: spacing.sm }]}>
                        In Word + Clue mode, players take turns giving ONE clue word related to the secret word. The clue must be a single word (not a phrase or sentence).
                      </Text>
                      <View style={[styles.modalSection, { backgroundColor: colors.accentLight + '20', padding: spacing.sm, borderRadius: 8, marginBottom: spacing.sm }]}>
                        <Text style={[styles.modalDescription, { color: colors.accent, fontWeight: '700', marginBottom: spacing.xs }]}>
                          How to play:
                        </Text>
                        <Text style={[styles.modalDescription, { color: colors.text }]}>
                          Starting with the first player, each person gives one clue word. Go around the group until everyone has given a clue.
                        </Text>
                      </View>
                      <View style={[styles.modalSection, { backgroundColor: colors.accentLight + '20', padding: spacing.sm, borderRadius: 8, marginBottom: spacing.sm }]}>
                        <Text style={[styles.modalDescription, { color: colors.accent, fontWeight: '700', marginBottom: spacing.xs }]}>
                          Example:
                        </Text>
                        <Text style={[styles.modalDescription, { color: colors.text }]}>
                          If the secret word is "Masjid", players might give clues like "Prayer", "Dome", "Friday", "Community", etc.
                        </Text>
                      </View>
                      <Text style={[styles.modalDescription, { color: colors.textSecondary, marginTop: spacing.xs }]}>
                        After all players have given their clues, the group discusses and votes IN PERSON to identify the imposter(s). The imposter tries to blend in without knowing the word, so their clues might be vague or off-topic.
                      </Text>
                      <Text style={[styles.modalDescription, { color: colors.textSecondary, marginTop: spacing.xs }]}>
                        Normal players see the secret word on their card, so they can give accurate clues. The imposter only sees "IMPOSTER" (or nothing if Blind Imposter mode is on).
                      </Text>
                    </>
                  )}
                  {infoModal === 'quiz' && (
                    <>
                      <Text style={[styles.modalDescription, { color: colors.text, marginBottom: spacing.sm }]}>
                        In Quiz mode, players are first given a question. They determine the answer, and that answer becomes the secret word. Then players give clues based on that word.
                      </Text>
                      <View style={[styles.modalSection, { backgroundColor: colors.accentLight + '20', padding: spacing.sm, borderRadius: 8, marginBottom: spacing.sm }]}>
                        <Text style={[styles.modalDescription, { color: colors.accent, fontWeight: '700', marginBottom: spacing.xs }]}>
                          How to play:
                        </Text>
                        <Text style={[styles.modalDescription, { color: colors.text }]}>
                          1. All players see a question (e.g., "First wife of the Prophet ﷺ")
                        </Text>
                        <Text style={[styles.modalDescription, { color: colors.text }]}>
                          2. Players determine the answer (e.g., "Khadija")
                        </Text>
                        <Text style={[styles.modalDescription, { color: colors.text }]}>
                          3. The answer becomes the secret word
                        </Text>
                        <Text style={[styles.modalDescription, { color: colors.text }]}>
                          4. Players then give clues about that word (e.g., "businesswoman", "first believer", etc.)
                        </Text>
                      </View>
                      <View style={[styles.modalSection, { backgroundColor: colors.accentLight + '20', padding: spacing.sm, borderRadius: 8, marginBottom: spacing.sm }]}>
                        <Text style={[styles.modalDescription, { color: colors.accent, fontWeight: '700', marginBottom: spacing.xs }]}>
                          Example:
                        </Text>
                        <Text style={[styles.modalDescription, { color: colors.text }]}>
                          Question: "Country with most Muslims"
                        </Text>
                        <Text style={[styles.modalDescription, { color: colors.text }]}>
                          Answer: "Indonesia" (becomes the secret word)
                        </Text>
                        <Text style={[styles.modalDescription, { color: colors.text }]}>
                          Clues: "Archipelago", "Jakarta", "Southeast Asia", etc.
                        </Text>
                      </View>
                      <Text style={[styles.modalDescription, { color: colors.textSecondary, marginTop: spacing.xs }]}>
                        The imposter doesn't know the answer, so they must guess and give clues based on their guess. After clues, players vote on who they think is the imposter.
                      </Text>
                    </>
                  )}
                </View>
              </View>
            )}
          </Card>
        </Pressable>
      </Modal>
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
  headerContainer: {
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonContainer: {
    marginRight: spacing.md,
  },
  backIcon: {
    width: 44, // iOS accessibility minimum
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  backIconText: {
    fontSize: 20,
    fontWeight: '600',
  },
  heading: {
    ...typography.heading,
    fontSize: 28,
    flex: 1,
    fontWeight: '600', // Ensure consistent weight
  },
  sectionCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.bodyBold,
    fontSize: 18,
    marginBottom: spacing.md,
    letterSpacing: 0.3,
    fontWeight: '600', // Ensure consistent weight
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: spacing.md,
  },
  numberSection: {
    marginBottom: spacing.lg,
  },
  numberLabelContainer: {
    marginBottom: spacing.sm,
  },
  numberLabel: {
    ...typography.bodyBold,
    fontSize: 15,
    marginBottom: spacing.xs,
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  hint: {
    ...typography.caption,
    fontSize: 12,
  },
  warningBadge: {
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    marginTop: spacing.xs / 2,
  },
  warningText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
  },
  numberSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  numberButton: {
    width: 48, // Already meets 44pt minimum
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  numberButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  numberDisplay: {
    minWidth: 70,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  number: {
    ...typography.heading,
    fontSize: 32,
    fontWeight: '700',
  },
  gameModeHeader: {
    marginBottom: spacing.sm,
  },
  modeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modeOptionWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  modeOption: {
    minWidth: 0,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    position: 'relative',
  },
  modeText: {
    ...typography.body,
    fontSize: 15,
    letterSpacing: 0.3,
    textAlign: 'center',
    fontWeight: '600',
  },
  difficultyContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs / 2,
  },
  difficultyIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  difficultyDropdown: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    minHeight: 56,
    justifyContent: 'center',
  },
  difficultyDropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  difficultyDropdownText: {
    ...typography.body,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  difficultyModalContent: {
    borderRadius: 16,
    padding: spacing.md,
    width: '100%',
    maxWidth: 400,
    gap: spacing.xs,
  },
  difficultyModalOption: {
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    minHeight: 56,
  },
  difficultyModalOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  difficultyModalOptionText: {
    ...typography.body,
    fontSize: 16,
    flex: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  readMoreButtonInBox: {
    position: 'absolute',
    top: 2,
    right: 0,
    padding: spacing.xs / 2,
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  readMoreButtonInline: {
    padding: spacing.xs / 2,
    marginLeft: spacing.xs,
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleContainer: {
    gap: spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    position: 'relative',
  },
  toggleLabelContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  toggleLabel: {
    ...typography.body,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: spacing.xs / 2,
  },
  infoButton: {
    marginLeft: spacing.xs,
  },
  infoIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    minWidth: 44, // iOS accessibility minimum
    minHeight: 44,
    padding: 12, // Extra padding for touch target
  },
  infoIconText: {
    fontSize: 12,
    fontWeight: '700',
    fontStyle: 'normal',
  },
  toggleDescription: {
    ...typography.caption,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
  },
  badgeText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
  },
  categoryHint: {
    ...typography.caption,
    fontSize: 13, // Slightly larger for better readability
    marginBottom: spacing.md,
    lineHeight: 20, // Improved line height
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryChip: {
    paddingVertical: spacing.md, // Increased for better touch target
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    position: 'relative',
    minHeight: 44, // iOS accessibility minimum
    justifyContent: 'center',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  categoryText: {
    ...typography.caption,
    fontSize: 13,
  },
  lockIcon: {
    fontSize: 12,
    marginLeft: spacing.xs,
  },
  featuredBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  featuredText: {
    fontSize: 11,
  },
  featuredBadgeSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  featuredTextSmall: {
    fontSize: 12,
  },
  nameInputsContainer: {
    gap: spacing.sm,
  },
  nameInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  nameInputLabel: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameInputLabelText: {
    ...typography.bodyBold,
    fontSize: 14,
  },
  nameInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  nameInputFieldWrapper: {
    flex: 1,
    position: 'relative',
  },
  nameInput: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    ...typography.body,
    fontSize: 16,
    minHeight: 44,
    paddingVertical: spacing.sm,
    textAlignVertical: 'center',
    lineHeight: 20,
  },
  clearButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xs,
    minWidth: 36,
    minHeight: 36,
  },
  clearButtonIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 20,
  },
  deliveryMethodContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  deliveryMethodOption: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  deliveryMethodIconText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  deliveryMethodText: {
    ...typography.bodyBold,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  deliveryMethodSubtext: {
    ...typography.caption,
    fontSize: 12,
    textAlign: 'center',
  },
  contactButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  contactButtonText: {
    fontSize: 24,
  },
  contactListContainer: {
    flex: 1,
    marginTop: spacing.md,
  },
  contactItem: {
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  contactItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  contactItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactItemIconText: {
    ...typography.bodyBold,
    fontSize: 20,
    fontWeight: '700',
  },
  contactItemText: {
    flex: 1,
  },
  contactItemName: {
    ...typography.bodyBold,
    fontSize: 16,
    marginBottom: spacing.xs / 2,
  },
  contactItemPhone: {
    ...typography.body,
    fontSize: 14,
  },
  startButton: {
    marginTop: spacing.md,
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '85%',
    padding: spacing.xl,
    overflow: 'hidden',
  },
  modalScrollContent: {
    paddingBottom: spacing.sm,
  },
  infoModalContent: {
    width: '100%',
    maxWidth: 380,
    padding: 0,
    overflow: 'hidden',
  },
  infoModalScrollContent: {
    padding: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  modalCloseBtn: {
    width: 44, // iOS accessibility minimum
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  modalCloseBtnText: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalTitle: {
    ...typography.heading,
    fontSize: 22, // Slightly larger for better hierarchy
    marginBottom: spacing.md, // Increased spacing
    fontWeight: '600', // Ensure consistent weight
  },
  modalDescription: {
    ...typography.body,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  modalSection: {
    marginBottom: spacing.xs,
  },
  modalExamples: {
    ...typography.caption,
    marginBottom: 0,
  },
  modalButtonCompact: {
    flex: 1,
    minHeight: 44, // iOS accessibility minimum
    paddingVertical: spacing.md, // Increased for better touch target
    paddingHorizontal: spacing.sm, // Ensure horizontal padding
    minWidth: 0, // Allow flex to shrink if needed
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    width: '100%',
  },
  modalButtonWrapper: {
    flex: 1,
    minWidth: 0, // Allow flex to shrink if needed
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginTop: spacing.md,
  },
  loadingText: {
    ...typography.body,
    fontSize: 15,
    marginBottom: spacing.xs,
  },
  loadingSubtext: {
    ...typography.caption,
    fontSize: 12,
  },
  seeMoreChip: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  seeMoreText: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: '600',
  },
  fullScreenModal: {
    flex: 1,
  },
  fullScreenModalContent: {
    flex: 1,
    padding: spacing.lg,
  },
  allCategoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  categoriesList: {
    flex: 1,
  },
  categoriesListContent: {
    paddingBottom: spacing.xl,
  },
  categoryListItem: {
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing.md,
    minHeight: 44, // iOS accessibility minimum
  },
  categoryListItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryListItemLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: spacing.sm,
  },
  checkIconSmall: {
    width: 24, // Standardized size
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  categoryListItemText: {
    flex: 1,
  },
  categoryListItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  categoryListItemName: {
    ...typography.bodyBold,
    fontSize: 16,
  },
  lockIconSmall: {
    fontSize: 14,
  },
  categoryListItemDescription: {
    ...typography.caption,
    fontSize: 13,
    marginBottom: spacing.xs,
    lineHeight: 18,
  },
  categoryListItemExamples: {
    ...typography.caption,
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  popularSectionTitle: {
    ...typography.heading,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  sectionDivider: {
    height: 1,
    marginVertical: spacing.lg,
    opacity: 0.3,
  },
});