import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  FadeInDown, 
  FadeIn,
} from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../contexts/ThemeContext';
import { useGame } from '../contexts/GameContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import * as Haptics from 'expo-haptics';

type RoundInstructionsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RoundInstructions'
>;

export default function RoundInstructionsScreen() {
  const navigation = useNavigation<RoundInstructionsScreenNavigationProp>();
  const { colors } = useTheme();
  const { players, settings } = useGame();

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (settings.mode === 'quiz') {
      navigation.navigate('QuizAnswer');
    } else {
      navigation.navigate('VotingTimer');
    }
  };

  const startingPlayer = players.find(p => p.id === settings.startingPlayerId) || players[0];
  
  if (!settings || players.length === 0) {
    return null;
  }
  if (!startingPlayer) {
    return null;
  }

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
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View 
          entering={FadeInDown.delay(0).springify()}
        >
          <View style={styles.header}>
            <Text style={[styles.heading, { color: colors.text }]}>
              Round Instructions
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
            {/* Starting Player Section - Highlighted */}
            <Animated.View entering={FadeInDown.delay(100).springify()}>
              <View style={[styles.startingPlayerSection, { backgroundColor: colors.accentLight, borderColor: colors.accent }]}>
                <View style={[styles.iconContainer, { backgroundColor: colors.accent }]}>
                  <Image 
                    source={require('../users.png')} 
                    style={[styles.iconImage, { tintColor: colors.text }]}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.startingPlayerContent}>
                  <Text style={[styles.startingPlayerLabel, { color: colors.textSecondary }]}>
                    Starting Player
                  </Text>
                  <Text style={[styles.playerName, { color: colors.accent }]}>
                    {startingPlayer.name}
                  </Text>
                </View>
              </View>
            </Animated.View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Direction Section */}
            <Animated.View entering={FadeInDown.delay(200).springify()}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, { backgroundColor: colors.accentLight }]}>
                    <Image 
                      source={require('../users.png')} 
                      style={[styles.sectionIconImage, { tintColor: colors.accent }]}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Direction
                  </Text>
                </View>
                <Text style={[styles.instruction, { color: colors.textSecondary }]}>
                  Proceed clockwise around the group
                </Text>
              </View>
            </Animated.View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Game Mode Section */}
            <Animated.View entering={FadeInDown.delay(300).springify()}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, { backgroundColor: colors.accentLight }]}>
                    <Image 
                      source={require('../brain.png')} 
                      style={[styles.sectionIconImage, { tintColor: colors.accent }]}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    {settings.mode === 'word' ? 'Clue Round' : 'Quiz/Questions Mode'}
                  </Text>
                </View>
                {settings.mode === 'quiz' && settings.quizQuestion ? (
                  <>
                    <Text style={[styles.instruction, { color: colors.textSecondary }]}>
                      Each player will answer a question. Normal players get the same question, but the imposter gets a different (but similar) question. After everyone answers, you'll see all the answers before revealing who the imposter is.
                    </Text>
                  </>
                ) : (
                  <Text style={[styles.instruction, { color: colors.textSecondary }]}>
                    Each player gives ONE clue word related to the secret word. Try not to reveal it!
                  </Text>
                )}
              </View>
            </Animated.View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Voting Section */}
            <Animated.View entering={FadeInDown.delay(400).springify()}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, { backgroundColor: colors.accentLight }]}>
                    <Image 
                      source={require('../drama.png')} 
                      style={[styles.sectionIconImage, { tintColor: colors.accent }]}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Voting
                  </Text>
                </View>
                <Text style={[styles.instruction, { color: colors.textSecondary }]}>
                  After all clues/questions, discuss and vote IN PERSON. The app will reveal the results when you're ready.
                </Text>
              </View>
            </Animated.View>
          </Card>

          <Animated.View entering={FadeIn.delay(500)} style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <Button
                title={settings.mode === 'quiz' ? "Start Answering Questions →" : "Proceed to Timer →"}
                onPress={handleContinue}
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
  startingPlayerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 28,
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  startingPlayerContent: {
    flex: 1,
    alignItems: 'center',
  },
  startingPlayerLabel: {
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
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
    fontFamily: 'Etna Sans Serif',
  },
  divider: {
    height: 1,
    marginVertical: spacing.md,
    opacity: 0.25,
  },
  section: {
    marginBottom: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionIconText: {
    fontSize: 16,
  },
  sectionIconImage: {
    width: 20,
    height: 20,
  },
  sectionTitle: {
    ...typography.bodyBold,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  instruction: {
    ...typography.body,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: spacing.lg + 4,
    marginTop: spacing.xs,
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
  quizQuestionBox: {
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: spacing.sm,
    marginLeft: spacing.lg + 4,
  },
  quizQuestionLabel: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  quizQuestion: {
    ...typography.bodyBold,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
});