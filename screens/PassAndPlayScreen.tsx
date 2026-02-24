import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
import { getCategoryName } from '../utils/game';
import { defaultCategories } from '../data/categories';
import { getCustomCategories } from '../utils/storage';
import { getEnglishTranslation } from '../utils/translations';
import { Player } from '../types';

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
  const { players, settings, setPlayers } = useGame();
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

  useEffect(() => {
    if (settings && players.length > 0) {
      loadCustomCategories();
      // Entrance animation
      deckScale.value = withDelay(200, withSpring(1, { damping: 15, stiffness: 150 }));
      deckOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [settings, players.length, loadCustomCategories, deckScale, deckOpacity]);

  if (!settings || players.length === 0) {
    return null;
  }

  const allPlayersSeen = players.every(p => p.hasSeenCard);
  const remainingCount = players.filter(p => !p.hasSeenCard).length;

  const handlePlayerCardPress = (player: Player) => {
    if (player.hasSeenCard) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // First tap: select player and transition to their view
    setSelectedPlayer(player);
    setViewMode('player');
    setRevealed(false);
  };

  const handleRevealTap = () => {
    if (!selectedPlayer || revealed || selectedPlayer.hasSeenCard) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMode('deck');
    setSelectedPlayer(null);
    setRevealed(false);
  };

  const handleContinue = () => {
    if (allPlayersSeen) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.navigate('RoundInstructions');
    }
  };

  const getCardContent = (player: Player) => {
    const allCategories = [...defaultCategories, ...customCategories];
    const categoryName = getCategoryName(settings.secretCategory, allCategories);
    // Show category for all players, except imposters when blind imposter mode is enabled
    const shouldShowCategory = !(player.role === 'imposter' && settings.specialModes.blindImposter);
    const isQuizMode = settings.mode === 'quiz' && settings.quizQuestion;
    
    if (player.role === 'imposter') {
      return (
        <>
          {isQuizMode && (
            <View style={[styles.quizQuestionCard, { backgroundColor: colors.accentLight + '30', borderColor: colors.accent }]}>
              <Text style={[styles.quizQuestionLabel, { color: colors.textSecondary }]}>
                Question:
              </Text>
              <Text style={[styles.quizQuestionText, { color: colors.accent }]}>
                {settings.quizQuestion}
              </Text>
            </View>
          )}
          {shouldShowCategory && (
            <Text style={[styles.categoryLabel, { color: colors.textSecondary }]}>
              Category: {categoryName}
            </Text>
          )}
          <Text style={[styles.wordPrefix, { color: colors.textSecondary }]}>
            {isQuizMode ? 'The answer is...' : 'The word is...'}
          </Text>
          <Text style={[styles.roleLabel, { color: colors.imposter }]}>
            IMPOSTER
          </Text>
          {settings.specialModes.blindImposter && (
            <Text
              style={[styles.instructionText, { color: colors.textSecondary }]}
            >
              {isQuizMode ? 'You do not know the answer' : 'You do not know the word'}
            </Text>
          )}
          {isQuizMode && !settings.specialModes.blindImposter && (
            <Text
              style={[styles.instructionText, { color: colors.textSecondary }]}
            >
              You do not know the answer to the question
            </Text>
          )}
        </>
      );
    }

    if (player.role === 'doubleAgent') {
      return (
        <>
          {isQuizMode && settings.quizQuestion && (
            <View style={[styles.quizQuestionCard, { backgroundColor: colors.accentLight + '30', borderColor: colors.accent }]}>
              <Text style={[styles.quizQuestionLabel, { color: colors.textSecondary }]}>
                Question:
              </Text>
              <Text style={[styles.quizQuestionText, { color: colors.accent }]}>
                {settings.quizQuestion}
              </Text>
            </View>
          )}
          {shouldShowCategory && (
            <Text style={[styles.categoryLabel, { color: colors.textSecondary }]}>
              Category: {categoryName}
            </Text>
          )}
          <Text style={[styles.roleLabel, { color: colors.doubleAgent }]}>
            DOUBLE AGENT
          </Text>
          <Text style={[styles.wordPrefix, { color: colors.textSecondary }]}>
            {isQuizMode ? 'The answer is...' : 'The word is...'}
          </Text>
          <Text 
            style={[styles.wordText, { color: colors.text }]}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.5}
          >
            {settings.secretWord}
          </Text>
          {getEnglishTranslation(settings.secretWord) && (
            <Text
              style={[styles.wordTranslation, { color: colors.textSecondary }]}
            >
              {getEnglishTranslation(settings.secretWord)}
            </Text>
          )}
          <Text
            style={[styles.instructionText, { color: colors.textSecondary }]}
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
            <Text style={[styles.quizQuestionLabel, { color: colors.textSecondary }]}>
              Question:
            </Text>
            <Text style={[styles.quizQuestionText, { color: colors.accent }]}>
              {settings.quizQuestion}
            </Text>
          </View>
        )}
        {shouldShowCategory && (
          <Text style={[styles.categoryLabel, { color: colors.textSecondary }]}>
            Category: {categoryName}
          </Text>
        )}
        <Text style={[styles.wordPrefix, { color: colors.textSecondary }]}>
          {isQuizMode ? 'The answer is...' : 'The word is...'}
        </Text>
        <Text 
          style={[styles.wordText, { color: colors.text }]}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.5}
        >
          {settings.secretWord}
        </Text>
        {getEnglishTranslation(settings.secretWord) && (
          <Text
            style={[styles.wordTranslation, { color: colors.textSecondary }]}
          >
            {getEnglishTranslation(settings.secretWord)}
          </Text>
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

        <View style={styles.content}>
          <Animated.View style={[styles.header, deckAnimatedStyle]}>
            <Text
              style={[styles.title, { color: colors.text }]}
            >
              Select Your Card
            </Text>
            <Text
              style={[styles.progressText, { color: colors.textSecondary }]}
            >
              {remainingCount} {remainingCount === 1 ? 'card' : 'cards'} remaining
            </Text>
          </Animated.View>

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
                title={remainingCount === 0 ? "Continue to Round Start!" : "Continue to Round"}
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

        <View style={styles.content}>
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
                      <NameLogo width={120} height={120} />
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
                  title="Back to Deck"
                  onPress={handleBackToDeck}
                  style={styles.backToDeckButton}
                />
              </Animated.View>
            )}
          </View>
        </View>
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
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    marginBottom: 0,
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
    paddingTop: spacing.lg,
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
    marginBottom: spacing.md,
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
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
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
    marginVertical: spacing.lg,
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
    marginBottom: spacing.md,
    opacity: 0.75,
    fontStyle: 'italic',
    fontWeight: '500',
    letterSpacing: 0.3,
    lineHeight: 22,
  },
  wordText: {
    ...typography.heading,
    fontSize: 56,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 2,
    lineHeight: 64,
    marginVertical: spacing.md,
  },
  wordTranslation: {
    ...typography.caption,
    fontSize: 15,
    textAlign: 'center',
    marginTop: spacing.sm,
    opacity: 0.75,
    fontStyle: 'italic',
    fontWeight: '500',
    lineHeight: 20,
    paddingHorizontal: spacing.md,
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
  hideContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  autoHideText: {
    ...typography.caption,
    fontSize: 14,
  },
  backToDeckContainer: {
    marginTop: spacing.xl,
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