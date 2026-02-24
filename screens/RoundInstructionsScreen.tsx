import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
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

  if (!settings || players.length === 0) {
    return null;
  }

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (settings.mode === 'quiz') {
      navigation.navigate('QuizAnswer');
    } else {
      navigation.navigate('VotingTimer');
    }
  };

  const startingPlayer = players.find(p => p.id === settings.startingPlayerId) || players[0];

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
                  <Svg width={24} height={24} viewBox="0 -960 960 960" fill={colors.text}>
                    <Path d="M360-80v-529q-91-24-145.5-100.5T160-880h80q0 83 53.5 141.5T430-680h100q30 0 56 11t47 32l181 181-56 56-158-158v478h-80v-240h-80v240h-80Zm63.5-663.5Q400-767 400-800t23.5-56.5Q447-880 480-880t56.5 23.5Q560-833 560-800t-23.5 56.5Q513-720 480-720t-56.5-23.5Z" />
                  </Svg>
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
                    <Svg width={20} height={20} viewBox="0 -960 960 960" fill={colors.accent}>
                      <Path d="M360-80v-529q-91-24-145.5-100.5T160-880h80q0 83 53.5 141.5T430-680h100q30 0 56 11t47 32l181 181-56 56-158-158v478h-80v-240h-80v240h-80Zm63.5-663.5Q400-767 400-800t23.5-56.5Q447-880 480-880t56.5 23.5Q560-833 560-800t-23.5 56.5Q513-720 480-720t-56.5-23.5Z" />
                    </Svg>
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
                    <Svg width={20} height={20} viewBox="0 -960 960 960" fill={colors.accent}>
                      <Path d="M390-120q-51 0-88-35.5T260-241q-60-8-100-53t-40-106q0-21 5.5-41.5T142-480q-11-18-16.5-38t-5.5-42q0-61 40-105.5t99-52.5q3-51 41-86.5t90-35.5q26 0 48.5 10t41.5 27q18-17 41-27t49-10q52 0 89.5 35t40.5 86q59 8 99.5 53T840-560q0 22-5.5 42T818-480q11 18 16.5 38.5T840-400q0 62-40.5 106.5T699-241q-5 50-41.5 85.5T570-120q-25 0-48.5-9.5T480-156q-19 17-42 26.5t-48 9.5Zm130-590v460q0 21 14.5 35.5T570-200q20 0 34.5-16t15.5-36q-21-8-38.5-21.5T550-306q-10-14-7.5-30t16.5-26q14-10 30-7.5t26 16.5q11 16 28 24.5t37 8.5q33 0 56.5-23.5T760-400q0-5-.5-10t-2.5-10q-17 10-36.5 15t-40.5 5q-17 0-28.5-11.5T640-440q0-17 11.5-28.5T680-480q33 0 56.5-23.5T760-560q0-33-23.5-56T680-640q-11 18-28.5 31.5T613-587q-16 6-31-1t-20-23q-5-16 1.5-31t22.5-20q15-5 24.5-18t9.5-30q0-21-14.5-35.5T570-760q-21 0-35.5 14.5T520-710Zm-80 460v-460q0-21-14.5-35.5T390-760q-21 0-35.5 14.5T340-710q0 16 9 29.5t24 18.5q16 5 23 20t2 31q-6 16-21 23t-31 1q-21-8-38.5-21.5T279-640q-32 1-55.5 24.5T200-560q0 33 23.5 56.5T280-480q17 0 28.5 11.5T320-440q0 17-11.5 28.5T280-400q-21 0-40.5-5T203-420q-2 5-2.5 10t-.5 10q0 33 23.5 56.5T280-320q20 0 37-8.5t28-24.5q10-14 26-16.5t30 7.5q14 10 16.5 26t-7.5 30q-14 19-32 33t-39 22q1 20 16 35.5t35 15.5q21 0 35.5-14.5T440-250Zm40-230Z" />
                    </Svg>
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
                    <Svg width={20} height={20} viewBox="0 -960 960 960" fill={colors.accent}>
                      <Path d="M760-660q17 0 28.5-11.5T800-700q0-17-11.5-28.5T760-740q-17 0-28.5 11.5T720-700q0 17 11.5 28.5T760-660Zm-160 0q17 0 28.5-11.5T640-700q0-17-11.5-28.5T600-740q-17 0-28.5 11.5T560-700q0 17 11.5 28.5T600-660Zm-20 136h200q0-35-30.5-55.5T680-600q-39 0-69.5 20.5T580-524ZM110-150q-70-70-70-170v-280h480v280q0 100-70 170T280-80q-100 0-170-70Zm283-57q47-47 47-113v-200H120v200q0 66 47 113t113 47q66 0 113-47Zm287-153q-26 0-51.5-5.5T580-382v-94q22 17 47.5 26.5T680-440q66 0 113-47t47-113v-200H520v140h-80v-220h480v280q0 100-70 170t-170 70Zm-480-20q17 0 28.5-11.5T240-420q0-17-11.5-28.5T200-460q-17 0-28.5 11.5T160-420q0 17 11.5 28.5T200-380Zm188.5-11.5Q400-403 400-420t-11.5-28.5Q377-460 360-460t-28.5 11.5Q320-437 320-420t11.5 28.5Q343-380 360-380t28.5-11.5Zm-39 127Q380-285 380-320H180q0 35 30.5 55.5T280-244q39 0 69.5-20.5ZM280-340Zm400-280Z" />
                    </Svg>
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
  iconEmoji: {
    fontSize: 24,
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
  sectionIconEmoji: {
    fontSize: 20,
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