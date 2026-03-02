import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { Button } from '../components/Button';
import { PlayingCard } from '../components/PlayingCard';
import { NameLogo } from '../components/NameLogo';
import { useTheme } from '../contexts/ThemeContext';
import { useGame } from '../contexts/GameContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import * as Haptics from 'expo-haptics';
import { getCategoryName, getImposterHint } from '../utils/game';
import { getResponsiveFontSize, getMinCardTextSize } from '../utils/responsive';
import { defaultCategories } from '../data/categories';
import { getCustomCategories } from '../utils/storage';
import { getEnglishTranslation } from '../utils/translations';
import { Player } from '../types';
import { NavigationHeader } from '../components/NavigationHeader';
import { showAlert } from '../components/Alert';
import { useLanguage } from '../contexts/LanguageContext';
import { useHaptics } from '../contexts/HapticsContext';
import { getWordDisplayParts } from '../utils/wordDisplay';

type PassAndPlayScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PassAndPlay'
>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - spacing.xl * 3) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

type ViewMode = 'deck' | 'player';

// Player Card Component for the deck view
type PlayerCardProps = {
  player: Player;
  index: number;
  colors: any;
  onPress: (player: Player) => void;
};

const PlayerCardDeck: React.FC<PlayerCardProps> = ({ player, index, colors, onPress }) => {
  const cardOpacity = useSharedValue(player.hasSeenCard ? 0.5 : 1);
  const cardScale = useSharedValue(1);
  const cardRotation = useSharedValue(0);

  useEffect(() => {
    cardOpacity.value = withTiming(player.hasSeenCard ? 0.5 : 1, { duration: 300 });
  }, [player.hasSeenCard]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [
      { scale: cardScale.value },
      { rotateZ: `${cardRotation.value}deg` },
    ],
  }));

  const handleCardPress = () => {
    if (player.hasSeenCard) return;
    cardScale.value = withSequence(
      withSpring(0.95, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );
    cardRotation.value = withSequence(
      withSpring(-2, { damping: 10 }),
      withSpring(0, { damping: 10 })
    );
    onPress(player);
  };

  return (
    <Animated.View
      entering={FadeIn.delay(500 + index * 100).springify()}
      style={styles.cardWrapper}
    >
      <Pressable
        onPress={handleCardPress}
        disabled={player.hasSeenCard}
      >
        <Animated.View
          style={[
            styles.playerCard,
            {
              backgroundColor: player.hasSeenCard
                ? colors.border
                : colors.cardBackground,
              borderColor: player.hasSeenCard
                ? colors.textSecondary
                : colors.border,
              shadowColor: colors.shadow,
            },
            cardAnimatedStyle,
          ]}
        >
          {!player.hasSeenCard && (
            <View style={styles.cardPatternContainer} pointerEvents="none">
              {/* Central decorative circle */}
              <View style={[styles.cardCentralCircle, { borderColor: colors.text, opacity: 0.12 }]} />
              
              {/* Corner geometric patterns - L-shaped */}
              <View style={[styles.cardCornerPattern, styles.cardCornerTopLeft]}>
                <View style={[styles.cardGeometricLine, { backgroundColor: colors.text, opacity: 0.15 }]} />
                <View style={[styles.cardGeometricLine, styles.cardGeometricLineVertical, { backgroundColor: colors.text, opacity: 0.15 }]} />
              </View>
              
              <View style={[styles.cardCornerPattern, styles.cardCornerTopRight]}>
                <View style={[styles.cardGeometricLine, { backgroundColor: colors.text, opacity: 0.15 }]} />
                <View style={[styles.cardGeometricLine, styles.cardGeometricLineVertical, { backgroundColor: colors.text, opacity: 0.15 }]} />
              </View>
              
              <View style={[styles.cardCornerPattern, styles.cardCornerBottomLeft]}>
                <View style={[styles.cardGeometricLine, { backgroundColor: colors.text, opacity: 0.15 }]} />
                <View style={[styles.cardGeometricLine, styles.cardGeometricLineVertical, { backgroundColor: colors.text, opacity: 0.15 }]} />
              </View>
              
              <View style={[styles.cardCornerPattern, styles.cardCornerBottomRight]}>
                <View style={[styles.cardGeometricLine, { backgroundColor: colors.text, opacity: 0.15 }]} />
                <View style={[styles.cardGeometricLine, styles.cardGeometricLineVertical, { backgroundColor: colors.text, opacity: 0.15 }]} />
              </View>

              {/* Border geometric lines */}
              <View style={[styles.cardBorderLine, styles.cardBorderTop, { backgroundColor: colors.text, opacity: 0.15 }]} />
              <View style={[styles.cardBorderLine, styles.cardBorderBottom, { backgroundColor: colors.text, opacity: 0.15 }]} />
              <View style={[styles.cardBorderLine, styles.cardBorderLeft, { backgroundColor: colors.text, opacity: 0.15 }]} />
              <View style={[styles.cardBorderLine, styles.cardBorderRight, { backgroundColor: colors.text, opacity: 0.15 }]} />

              {/* Small decorative circles at corners */}
              <View style={[styles.cardDecorativeCircle, styles.cardCircleTopLeft, { backgroundColor: colors.text, opacity: 0.06 }]} />
              <View style={[styles.cardDecorativeCircle, styles.cardCircleTopRight, { backgroundColor: colors.text, opacity: 0.06 }]} />
              <View style={[styles.cardDecorativeCircle, styles.cardCircleBottomLeft, { backgroundColor: colors.text, opacity: 0.06 }]} />
              <View style={[styles.cardDecorativeCircle, styles.cardCircleBottomRight, { backgroundColor: colors.text, opacity: 0.06 }]} />
            </View>
          )}
          <Text
            style={[
              styles.playerCardName,
              {
                color: player.hasSeenCard
                  ? colors.textSecondary
                  : colors.text,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {player.name}
          </Text>
          {player.hasSeenCard && (
            <Text
              style={[
                styles.seenLabel,
                { color: colors.textSecondary },
              ]}
            >
              Viewed
            </Text>
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

export default function PassAndPlayScreen() {
  const navigation = useNavigation<PassAndPlayScreenNavigationProp>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { triggerImpact, triggerNotification } = useHaptics();
  const route = useRoute<RouteProp<RootStackParamList, 'PassAndPlay'>>();
  const nextRound = route.params?.nextRound;
  const { players: contextPlayers, settings: contextSettings, setPlayers, setSettings } = useGame();
  const players = nextRound?.players ?? contextPlayers;
  const settings = nextRound?.settings ?? contextSettings;
  const [customCategories, setCustomCategories] = useState<any[]>([]);

  const [viewMode, setViewMode] = useState<ViewMode>('deck');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [revealed, setRevealed] = useState(false);

  // Animation values
  const deckScale = useSharedValue(0.9);
  const deckOpacity = useSharedValue(0);

  const loadCustomCategories = useCallback(async () => {
    const custom = await getCustomCategories();
    setCustomCategories(custom);
  }, []);

  const deckAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: deckScale.value }],
    opacity: deckOpacity.value,
  }));

  // When arriving with nextRound (Play Again), apply to context after mount so Reveal screen never re-renders with new data
  useEffect(() => {
    if (nextRound) {
      setPlayers(nextRound.players);
      setSettings(nextRound.settings);
      navigation.setParams({ nextRound: undefined });
    }
  }, [nextRound]);

  useEffect(() => {
    if (settings && players.length > 0) {
      loadCustomCategories();
      // Entrance animation
      deckScale.value = withDelay(200, withSpring(1, { damping: 15, stiffness: 150 }));
      deckOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
      triggerNotification(Haptics.NotificationFeedbackType.Success);
    }
  }, [settings, players.length, loadCustomCategories, deckScale, deckOpacity]);

  if (!settings || players.length === 0) {
    return null;
  }

  const allPlayersSeen = players.every(p => p.hasSeenCard);
  const remainingCount = players.filter(p => !p.hasSeenCard).length;

  const handlePlayerCardPress = (player: Player) => {
    if (player.hasSeenCard) return;
    
    triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
    
    // First tap: select player and transition to their view
    setSelectedPlayer(player);
    setViewMode('player');
    setRevealed(false);
  };

  const handleRevealTap = () => {
    if (!selectedPlayer || revealed || selectedPlayer.hasSeenCard) return;
    
    triggerNotification(Haptics.NotificationFeedbackType.Success);
    setRevealed(true);

    // Mark player as seen
    const updatedPlayers = [...players];
    const playerIndex = updatedPlayers.findIndex(p => p.id === selectedPlayer.id);
    if (playerIndex !== -1) {
      updatedPlayers[playerIndex].hasSeenCard = true;
      setPlayers(updatedPlayers);
    }
  };

  const handleBackToDeck = () => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Light);
    setViewMode('deck');
    setSelectedPlayer(null);
    setRevealed(false);
  };

  const handleContinue = () => {
    if (allPlayersSeen) {
      triggerNotification(Haptics.NotificationFeedbackType.Success);
      navigation.navigate('RoundInstructions');
    }
  };

  const minCardTextSize = getMinCardTextSize();
  const categorySize = Math.max(getResponsiveFontSize(14, 13), minCardTextSize);
  const cardFontSizes = {
    category: categorySize,
    wordPrefix: Math.max(getResponsiveFontSize(16, 14), minCardTextSize),
    wordTranslation: Math.max(getResponsiveFontSize(15, 14), minCardTextSize),
    quizLabel: Math.max(getResponsiveFontSize(12, 11), minCardTextSize),
    quizText: Math.max(getResponsiveFontSize(16, 14), minCardTextSize),
    instruction: Math.max(getResponsiveFontSize(14, 13), minCardTextSize),
    roleLabel: Math.max(getResponsiveFontSize(36, 32), minCardTextSize),
    // Each word on card = same size as category, just a bit bigger; works on all screens
    word: Math.max(categorySize + 6, getResponsiveFontSize(19), minCardTextSize),
  };

  const getCardContent = (player: Player) => {
    const allCategories = [...defaultCategories, ...customCategories];
    const categoryName = getCategoryName(settings.secretCategory, allCategories);
    const shouldShowCategory = !(player.role === 'imposter' && settings.specialModes.blindImposter);
    const isQuizMode = settings.mode === 'quiz' && settings.quizQuestion;
    const { firstPart: wordFirstPart, secondPart: wordSecondPart } = getWordDisplayParts(settings.secretWord, 1, 1);
    const isSingleWord = wordSecondPart == null;
    const allWords = settings.secretWord.trim().split(/\s+/).filter(Boolean);
    const showTranslation = allWords.length <= 2 && getEnglishTranslation(settings.secretWord);

    if (player.role === 'imposter') {
      const otherImposters = players.filter(p => p.role === 'imposter' && p.id !== player.id);
      return (
        <>
          {isQuizMode && (
            <View style={[styles.quizQuestionCard, { backgroundColor: colors.accentLight + '30', borderColor: colors.accent }]}>
              <Text style={[styles.quizQuestionLabel, { color: colors.textSecondary, fontSize: cardFontSizes.quizLabel }]}>
                Question:
              </Text>
              <Text style={[styles.quizQuestionText, { color: colors.accent, fontSize: cardFontSizes.quizText }]}>
                {settings.quizQuestion}
              </Text>
            </View>
          )}
          {shouldShowCategory && (
            <Text style={[styles.categoryLabel, { color: colors.textSecondary, fontSize: cardFontSizes.category }]}>
              Category: {categoryName}
            </Text>
          )}
          <Text style={[styles.wordPrefix, { color: colors.textSecondary, fontSize: cardFontSizes.wordPrefix }]}>
            {isQuizMode ? 'The answer is...' : 'The word is...'}
          </Text>
          <Text style={[styles.roleLabel, { color: colors.imposter, fontSize: cardFontSizes.roleLabel }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6} allowFontScaling={false}>
            IMPOSTER
          </Text>
          {otherImposters.length > 0 && !settings.trollRoundActive && (
            <Text
              style={[styles.instructionText, { color: colors.imposter, marginTop: 8, fontWeight: '600', fontSize: cardFontSizes.instruction }]}
            >
              Your fellow imposters: {otherImposters.map(p => p.name).join(', ')}
            </Text>
          )}
          {settings.specialModes.blindImposter && (
            <Text
              style={[styles.instructionText, { color: colors.textSecondary, fontSize: cardFontSizes.instruction }]}
            >
              {isQuizMode ? 'You do not know the answer' : 'You do not know the word'}
            </Text>
          )}
          {isQuizMode && !settings.specialModes.blindImposter && (
            <Text
              style={[styles.instructionText, { color: colors.textSecondary, fontSize: cardFontSizes.instruction }]}
            >
              You do not know the answer to the question
            </Text>
          )}
          {settings.showHintToImposter && !settings.specialModes.blindImposter && (() => {
            const hint = getImposterHint(settings.secretWord, settings.secretCategory);
            return (
              <View style={[styles.imposterHintContainer, { backgroundColor: colors.accentLight + '40', borderColor: colors.accent }]}>
                <Text style={[styles.imposterHintLabel, { color: colors.accent }]}>Hint</Text>
                <Text style={[styles.imposterHintText, { color: colors.text }]}>{hint}</Text>
              </View>
            );
          })()}
        </>
      );
    }

    if (player.role === 'doubleAgent') {
      return (
        <>
          {isQuizMode && settings.quizQuestion && (
            <View style={[styles.quizQuestionCard, { backgroundColor: colors.accentLight + '30', borderColor: colors.accent }]}>
              <Text style={[styles.quizQuestionLabel, { color: colors.textSecondary, fontSize: cardFontSizes.quizLabel }]}>
                Question:
              </Text>
              <Text style={[styles.quizQuestionText, { color: colors.accent, fontSize: cardFontSizes.quizText }]}>
                {settings.quizQuestion}
              </Text>
            </View>
          )}
          {shouldShowCategory && (
            <Text style={[styles.categoryLabel, { color: colors.textSecondary, fontSize: cardFontSizes.category }]}>
              Category: {categoryName}
            </Text>
          )}
          <Text style={[styles.roleLabel, { color: colors.doubleAgent, fontSize: cardFontSizes.roleLabel }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6} allowFontScaling={false}>
            DOUBLE AGENT
          </Text>
          <Text style={[styles.wordPrefix, { color: colors.textSecondary, fontSize: cardFontSizes.wordPrefix }]}>
            {isQuizMode ? 'The answer is...' : 'The word is...'}
          </Text>
          <View style={styles.wordBlock}>
            {isSingleWord ? (
              <View style={styles.wordSingleWrap}>
                <Text
                  style={[styles.wordText, { color: colors.text, fontSize: cardFontSizes.word }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.7}
                  allowFontScaling={false}
                >
                  {wordFirstPart}
                </Text>
              </View>
            ) : (
              <View style={styles.wordRow}>
                {allWords.map((w, i) => (
                  <Text key={i} style={[styles.wordText, styles.wordChunk, styles.phraseChunk, { color: colors.text, fontSize: cardFontSizes.word, lineHeight: Math.round(cardFontSizes.word * 1.3) }]} numberOfLines={1} allowFontScaling={false}>
                    {w}{i < allWords.length - 1 ? ' ' : ''}
                  </Text>
                ))}
              </View>
            )}
          </View>
{showTranslation && (
          <View style={styles.wordTranslationContainer}>
            <Text
              style={[styles.wordTranslation, { color: colors.textSecondary, fontSize: cardFontSizes.wordTranslation }]}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {getEnglishTranslation(settings.secretWord)}
            </Text>
          </View>
        )}
          <Text
            style={[styles.instructionText, { color: colors.textSecondary, fontSize: cardFontSizes.instruction }]}
          >
            You know the {isQuizMode ? 'answer' : 'word'} but are NOT the imposter
          </Text>
        </>
      );
    }

    return (
      <>
        {isQuizMode && settings.quizQuestion && (
          <View style={[styles.quizQuestionCard, { backgroundColor: colors.accentLight + '30', borderColor: colors.accent }]}>
            <Text style={[styles.quizQuestionLabel, { color: colors.textSecondary, fontSize: cardFontSizes.quizLabel }]}>
              Question:
            </Text>
            <Text style={[styles.quizQuestionText, { color: colors.accent, fontSize: cardFontSizes.quizText }]}>
              {settings.quizQuestion}
            </Text>
          </View>
        )}
        {shouldShowCategory && (
          <Text style={[styles.categoryLabel, { color: colors.textSecondary, fontSize: cardFontSizes.category }]}>
            Category: {categoryName}
          </Text>
        )}
        <Text style={[styles.wordPrefix, { color: colors.textSecondary, fontSize: cardFontSizes.wordPrefix }]}>
          {isQuizMode ? 'The answer is...' : 'The word is...'}
        </Text>
        <View style={styles.wordBlock}>
          {isSingleWord ? (
            <View style={styles.wordSingleWrap}>
              <Text
                style={[styles.wordText, { color: colors.text, fontSize: cardFontSizes.word }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                allowFontScaling={false}
              >
                {wordFirstPart}
              </Text>
            </View>
          ) : (
            <View style={styles.wordRow}>
              {allWords.map((w, i) => (
                <Text key={i} style={[styles.wordText, styles.wordChunk, styles.phraseChunk, { color: colors.text, fontSize: cardFontSizes.word, lineHeight: Math.round(cardFontSizes.word * 1.3) }]} numberOfLines={1} allowFontScaling={false}>
                  {w}{i < allWords.length - 1 ? ' ' : ''}
                </Text>
              ))}
            </View>
          )}
        </View>
        {showTranslation && (
          <View style={styles.wordTranslationContainer}>
            <Text
              style={[styles.wordTranslation, { color: colors.textSecondary, fontSize: cardFontSizes.wordTranslation }]}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {getEnglishTranslation(settings.secretWord)}
            </Text>
          </View>
        )}
      </>
    );
  };

  // Deck View
  if (viewMode === 'deck') {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top', 'bottom']}
      >
        <PatternBackground />
        <NavigationHeader showGetStarted={false} showSettings={false} />

        <View style={styles.content}>
          <View style={styles.deckTopBar}>
            <Pressable
              onPress={() => {
                triggerImpact(Haptics.ImpactFeedbackStyle.Light);
                showAlert({
                  title: t('common.leaveGame'),
                  message: t('common.leaveGameConfirm'),
                  buttons: [
                    { text: t('common.leaveConfirmCancel'), style: 'cancel' },
                    { text: t('common.leaveConfirmLeave'), style: 'destructive', onPress: () => navigation.navigate('GameSetup') },
                  ],
                });
              }}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={[styles.backButton, { color: colors.accent }]}>{t('common.back')}</Text>
            </Pressable>
          </View>
          <View style={styles.header}>
            <Animated.View style={deckAnimatedStyle}>
              <Text
                style={[styles.title, { color: colors.text }]}
              >
                {t('game.selectYourCard')}
              </Text>
              <Text
                style={[styles.progressText, { color: colors.textSecondary }]}
              >
                {(remainingCount === 1 ? t('game.cardsRemaining') : t('game.cardsRemaining_other')).replace('{{count}}', String(remainingCount))}
              </Text>
            </Animated.View>
          </View>

          <ScrollView
            contentContainerStyle={styles.deckContainer}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              entering={FadeIn.delay(400).springify()}
              style={styles.cardGrid}
            >
              {players.map((player, index) => (
                <PlayerCardDeck
                  key={player.id}
                  player={player}
                  index={index}
                  colors={colors}
                  onPress={handlePlayerCardPress}
                />
              ))}
            </Animated.View>
          </ScrollView>

          {allPlayersSeen && (
            <Animated.View
              entering={SlideInDown.springify()}
              exiting={SlideOutDown.springify()}
              style={styles.buttonContainer}
            >
              <Button
                title={remainingCount === 0 ? t('game.continueToRoundStart') : t('game.continueToRound')}
                onPress={handleContinue}
                style={styles.button}
              />
            </Animated.View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // Player View (after selecting a card)
  if (viewMode === 'player' && selectedPlayer) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top', 'bottom']}
      >
        <PatternBackground />
        <NavigationHeader showGetStarted={false} showSettings={false} />

        <ScrollView
          style={styles.playerScrollView}
          contentContainerStyle={styles.playerScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.cardContainer}>
            <Pressable
              onPress={handleRevealTap}
              disabled={revealed || selectedPlayer.hasSeenCard}
              style={({ pressed }) => [
                styles.cardPressable,
                pressed && !revealed && !selectedPlayer.hasSeenCard && styles.cardPressed,
              ]}
            >
              <View style={styles.cardWithName}>
                <PlayingCard
                  isRevealed={revealed}
                  disabled={selectedPlayer.hasSeenCard}
                  playerName={selectedPlayer.name}
                >
                  <View style={styles.cardContent}>
                    <Animated.View
                      entering={FadeIn.delay(50).springify()}
                      style={styles.logoContainer}
                    >
                      <NameLogo width={96} height={96} />
                    </Animated.View>
                    <Animated.View
                      entering={FadeIn.delay(100).springify()}
                      style={styles.playerNameOnCard}
                    >
                      <Text
                        style={[styles.playerNameOnCardText, { color: colors.text }]}
                      >
                        {selectedPlayer.name}
                      </Text>
                    </Animated.View>
                    {getCardContent(selectedPlayer)}
                  </View>
                </PlayingCard>
              </View>
            </Pressable>
            
            {!revealed && !selectedPlayer.hasSeenCard && (
              <Animated.View
                entering={FadeIn.delay(300).springify()}
                style={styles.tapHint}
              >
                <Text style={[styles.tapHintText, { color: colors.textSecondary }]}>
                  Tap the card to reveal
                </Text>
              </Animated.View>
            )}

            {revealed && (
              <Animated.View
                entering={SlideInDown.springify()}
                style={styles.backToDeckContainer}
              >
                <Button
                  title={t('game.backToDeck')}
                  onPress={handleBackToDeck}
                  style={styles.backToDeckButton}
                />
            </Animated.View>
          )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  playerScrollView: {
    flex: 1,
  },
  playerScrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl + 96,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    marginBottom: 0,
  },
  deckTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  title: {
    ...typography.heading,
    fontSize: 32,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  progressText: {
    ...typography.body,
    fontSize: 16,
    textAlign: 'center',
  },
  deckContainer: {
    flexGrow: 1,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginBottom: spacing.md,
  },
  playerCard: {
    width: '100%',
    height: CARD_HEIGHT,
    borderRadius: 16,
    borderWidth: 2,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  cardPatternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  cardCentralCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  cardCornerPattern: {
    position: 'absolute',
    width: 24,
    height: 24,
  },
  cardCornerTopLeft: {
    top: 8,
    left: 8,
  },
  cardCornerTopRight: {
    top: 8,
    right: 8,
    transform: [{ scaleX: -1 }],
  },
  cardCornerBottomLeft: {
    bottom: 8,
    left: 8,
    transform: [{ scaleY: -1 }],
  },
  cardCornerBottomRight: {
    bottom: 8,
    right: 8,
    transform: [{ scaleX: -1 }, { scaleY: -1 }],
  },
  cardGeometricLine: {
    position: 'absolute',
    height: 2,
    width: 14,
    top: 0,
    left: 0,
  },
  cardGeometricLineVertical: {
    width: 2,
    height: 14,
  },
  cardBorderLine: {
    position: 'absolute',
  },
  cardBorderTop: {
    top: 6,
    left: '12%',
    right: '12%',
    height: 1.5,
  },
  cardBorderBottom: {
    bottom: 6,
    left: '12%',
    right: '12%',
    height: 1.5,
  },
  cardBorderLeft: {
    left: 6,
    top: '15%',
    bottom: '15%',
    width: 1.5,
  },
  cardBorderRight: {
    right: 6,
    top: '15%',
    bottom: '15%',
    width: 1.5,
  },
  cardDecorativeCircle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  cardCircleTopLeft: {
    top: 6,
    left: 6,
  },
  cardCircleTopRight: {
    top: 6,
    right: 6,
  },
  cardCircleBottomLeft: {
    bottom: 6,
    left: 6,
  },
  cardCircleBottomRight: {
    bottom: 6,
    right: 6,
  },
  playerCardName: {
    ...typography.heading,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    zIndex: 1,
    position: 'relative',
    fontFamily: 'Etna Sans Serif',
  },
  seenLabel: {
    ...typography.caption,
    fontSize: 12,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    zIndex: 1,
    position: 'relative',
  },
  playerHeader: {
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  backButton: {
    ...typography.body,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  playerTitle: {
    ...typography.heading,
    fontSize: 28,
    fontWeight: '700',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    minHeight: 360,
  },
  cardPressable: {
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWithName: {
    width: '100%',
    position: 'relative',
  },
  playerNameOnCard: {
    width: '100%',
    marginTop: spacing.xs / 2,
    marginBottom: spacing.sm,
    paddingTop: spacing.xs / 4,
    paddingBottom: spacing.xs / 2,
    borderBottomWidth: 1,
    alignItems: 'center',
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  playerNameOnCardText: {
    ...typography.heading,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'Etna Sans Serif',
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  cardContent: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  tapHint: {
    marginTop: spacing.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
  },
  tapHintText: {
    ...typography.body,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  roleLabel: {
    ...typography.heading,
    fontSize: 36,
    textAlign: 'center',
    marginVertical: spacing.md,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  categoryLabel: {
    ...typography.caption,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.sm,
    opacity: 0.85,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '600',
    lineHeight: 20,
  },
  wordPrefix: {
    ...typography.body,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.sm,
    opacity: 0.75,
    fontStyle: 'italic',
    fontWeight: '500',
    letterSpacing: 0.3,
    lineHeight: 22,
  },
  wordBlock: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },
  wordSingleWrap: {
    alignSelf: 'center',
    maxWidth: '100%',
    marginTop: spacing.xs,
  },
  wordRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 2,
    width: '100%',
    maxWidth: '100%',
  },
  wordChunk: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  phraseChunk: {
    marginVertical: 0,
  },
  wordText: {
    ...typography.heading,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 1,
  },
  wordSuffix: {
    marginTop: spacing.xs,
    marginBottom: 0,
  },
  wordTranslationContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  wordTranslation: {
    ...typography.caption,
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.75,
    fontStyle: 'italic',
    fontWeight: '500',
    lineHeight: 24,
    maxWidth: '100%',
    paddingHorizontal: spacing.sm,
  },
  categoryText: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  quizQuestionCard: {
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: spacing.lg,
    width: '100%',
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
  quizQuestionText: {
    ...typography.bodyBold,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'center',
  },
  instructionText: {
    ...typography.body,
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.lg,
    opacity: 0.8,
    lineHeight: 20,
    paddingHorizontal: spacing.lg,
    fontWeight: '500',
  },
  imposterHintContainer: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    width: '100%',
    alignItems: 'center',
  },
  imposterHintLabel: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  imposterHintText: {
    ...typography.body,
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  hideContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  autoHideText: {
    ...typography.caption,
    fontSize: 14,
  },
  backToDeckContainer: {
    marginTop: spacing.xl + spacing.lg,
    width: '100%',
    maxWidth: 350,
  },
  backToDeckButton: {
    width: '100%',
  },
  buttonContainer: {
    marginTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  button: {
    width: '100%',
  },
});