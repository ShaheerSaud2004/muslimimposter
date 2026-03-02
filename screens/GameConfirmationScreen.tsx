import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
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
import { getMaxContentWidth, getResponsivePadding } from '../utils/responsive';
import { NavigationHeader } from '../components/NavigationHeader';
import { getCategoryName } from '../utils/game';
import { defaultCategories } from '../data/categories';

type GameConfirmationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'GameConfirmation'
>;

export default function GameConfirmationScreen() {
  const navigation = useNavigation<GameConfirmationScreenNavigationProp>();
  const { colors } = useTheme();
  const { players, settings } = useGame();
  const maxWidth = getMaxContentWidth();
  const responsivePadding = getResponsivePadding();

  if (!settings || players.length === 0) {
    return null;
  }

  const numImposters = players.filter(p => p.role === 'imposter').length;
  const hasDoubleAgent = players.some(p => p.role === 'doubleAgent');
  const numNormalPlayers = players.filter(p => p.role === 'normal').length;

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('PassAndPlay');
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <PatternBackground />
      <NavigationHeader showGetStarted={false} showSettings={false} />
      
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { maxWidth, alignSelf: 'center', width: '100%' },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(0).springify()}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Ready to Play?
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Confirm your game settings
            </Text>
          </View>

          <Card style={styles.confirmationCard}>
            <View style={styles.infoRow}>
              <View style={[styles.infoIconContainer, { backgroundColor: colors.accentLight }]}>
                <Svg width={28} height={28} viewBox="0 -960 960 960" fill={colors.accent}>
                  <Path d="M360-80v-529q-91-24-145.5-100.5T160-880h80q0 83 53.5 141.5T430-680h100q30 0 56 11t47 32l181 181-56 56-158-158v478h-80v-240h-80v240h-80Zm63.5-663.5Q400-767 400-800t23.5-56.5Q447-880 480-880t56.5 23.5Q560-833 560-800t-23.5 56.5Q513-720 480-720t-56.5-23.5Z" />
                </Svg>
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                  Players
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {settings.numPlayers} {settings.numPlayers === 1 ? 'player' : 'players'}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIconContainer, { backgroundColor: colors.imposter + '20' }]}>
                <Svg width={28} height={28} viewBox="0 -960 960 960" fill={colors.accent}>
                  <Path d="M760-660q17 0 28.5-11.5T800-700q0-17-11.5-28.5T760-740q-17 0-28.5 11.5T720-700q0 17 11.5 28.5T760-660Zm-160 0q17 0 28.5-11.5T640-700q0-17-11.5-28.5T600-740q-17 0-28.5 11.5T560-700q0 17 11.5 28.5T600-660Zm-20 136h200q0-35-30.5-55.5T680-600q-39 0-69.5 20.5T580-524ZM110-150q-70-70-70-170v-280h480v280q0 100-70 170T280-80q-100 0-170-70Zm283-57q47-47 47-113v-200H120v200q0 66 47 113t113 47q66 0 113-47Zm287-153q-26 0-51.5-5.5T580-382v-94q22 17 47.5 26.5T680-440q66 0 113-47t47-113v-200H520v140h-80v-220h480v280q0 100-70 170t-170 70Zm-480-20q17 0 28.5-11.5T240-420q0-17-11.5-28.5T200-460q-17 0-28.5 11.5T160-420q0 17 11.5 28.5T200-380Zm188.5-11.5Q400-403 400-420t-11.5-28.5Q377-460 360-460t-28.5 11.5Q320-437 320-420t11.5 28.5Q343-380 360-380t28.5-11.5Zm-39 127Q380-285 380-320H180q0 35 30.5 55.5T280-244q39 0 69.5-20.5ZM280-340Zm400-280Z" />
                </Svg>
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                  Imposters
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1} allowFontScaling={false}>
                  {numImposters} {numImposters === 1 ? 'imposter' : 'imposters'}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {settings.selectedCategories && settings.selectedCategories.length > 0 && (
              <>
                <View style={styles.infoRow}>
                  <View style={[styles.infoIconContainer, { backgroundColor: colors.accentLight }]}>
                    <Svg width={28} height={28} viewBox="0 -960 960 960" fill={colors.accent}>
                      <Path d="M400-160h160v-160H400v160ZM160-400h160v-160H160v160Zm240 0h160v-160H400v160Zm240 0h160v-160H640v160Zm0-240h160v-160H640v160ZM320-80v-240H80v-320h480v-240h320v560H640v240H320Z" />
                    </Svg>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                      Categories
                    </Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {settings.selectedCategories
                        .map(id => getCategoryName(id, defaultCategories))
                        .filter(Boolean)
                        .join(', ')}
                    </Text>
                  </View>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              </>
            )}

            <View style={styles.infoRow}>
              <View style={[styles.infoIconContainer, { backgroundColor: colors.accentLight }]}>
                <Svg width={28} height={28} viewBox="0 -960 960 960" fill={colors.accent}>
                  <Path d="M390-120q-51 0-88-35.5T260-241q-60-8-100-53t-40-106q0-21 5.5-41.5T142-480q-11-18-16.5-38t-5.5-42q0-61 40-105.5t99-52.5q3-51 41-86.5t90-35.5q26 0 48.5 10t41.5 27q18-17 41-27t49-10q52 0 89.5 35t40.5 86q59 8 99.5 53T840-560q0 22-5.5 42T818-480q11 18 16.5 38.5T840-400q0 62-40.5 106.5T699-241q-5 50-41.5 85.5T570-120q-25 0-48.5-9.5T480-156q-19 17-42 26.5t-48 9.5Zm130-590v460q0 21 14.5 35.5T570-200q20 0 34.5-16t15.5-36q-21-8-38.5-21.5T550-306q-10-14-7.5-30t16.5-26q14-10 30-7.5t26 16.5q11 16 28 24.5t37 8.5q33 0 56.5-23.5T760-400q0-5-.5-10t-2.5-10q-17 10-36.5 15t-40.5 5q-17 0-28.5-11.5T640-440q0-17 11.5-28.5T680-480q33 0 56.5-23.5T760-560q0-33-23.5-56T680-640q-11 18-28.5 31.5T613-587q-16 6-31-1t-20-23q-5-16 1.5-31t22.5-20q15-5 24.5-18t9.5-30q0-21-14.5-35.5T570-760q-21 0-35.5 14.5T520-710Zm-80 460v-460q0-21-14.5-35.5T390-760q-21 0-35.5 14.5T340-710q0 16 9 29.5t24 18.5q16 5 23 20t2 31q-6 16-21 23t-31 1q-21-8-38.5-21.5T279-640q-32 1-55.5 24.5T200-560q0 33 23.5 56.5T280-480q17 0 28.5 11.5T320-440q0 17-11.5 28.5T280-400q-21 0-40.5-5T203-420q-2 5-2.5 10t-.5 10q0 33 23.5 56.5T280-320q20 0 37-8.5t28-24.5q10-14 26-16.5t30 7.5q14 10 16.5 26t-7.5 30q-14 19-32 33t-39 22q1 20 16 35.5t35 15.5q21 0 35.5-14.5T440-250Zm40-230Z" />
                </Svg>
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                  Game Mode
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {settings.mode === 'word' ? 'Word + Clue' : 'Question'}
                </Text>
              </View>
            </View>

            {hasDoubleAgent && (
              <>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={styles.infoRow}>
                  <View style={[styles.infoIconContainer, { backgroundColor: colors.doubleAgent + '20' }]}>
                    <Text style={[styles.infoIcon, { color: colors.doubleAgent }]}>🕵️</Text>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                      Special Mode
                    </Text>
                    <Text style={[styles.infoValue, { color: colors.doubleAgent }]} numberOfLines={1} allowFontScaling={false}>
                      Double Agent Active
                    </Text>
                    <Text style={[styles.infoDescription, { color: colors.textSecondary }]}>
                      One player knows the word but isn't the imposter
                    </Text>
                  </View>
                </View>
              </>
            )}

            {settings.specialModes.blindImposter && (
              <>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={styles.infoRow}>
                  <View style={[styles.infoIconContainer, { backgroundColor: colors.accentLight }]}>
                    <Svg width={28} height={28} viewBox="0 -960 960 960" fill={colors.accent}>
                      <Path d="M240-40H120q-33 0-56.5-23.5T40-120v-120h80v120h120v80Zm480 0v-80h120v-120h80v120q0 33-23.5 56.5T840-40H720ZM480-220q-120 0-217.5-71T120-480q45-118 142.5-189T480-740q120 0 217.5 71T840-480q-45 118-142.5 189T480-220Zm0-80q88 0 161-48t112-132q-39-84-112-132t-161-48q-88 0-161 48T207-480q39 84 112 132t161 48Zm0-40q58 0 99-41t41-99q0-58-41-99t-99-41q-58 0-99 41t-41 99q0 58 41 99t99 41Zm0-80q-25 0-42.5-17.5T420-480q0-25 17.5-42.5T480-540q25 0 42.5 17.5T540-480q0 25-17.5 42.5T480-420ZM40-720v-120q0-33 23.5-56.5T120-920h120v80H120v120H40Zm800 0v-120H720v-80h120q33 0 56.5 23.5T920-840v120h-80ZM480-480Z" />
                    </Svg>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                      Special Mode
                    </Text>
                    <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1} allowFontScaling={false}>
                      Blind Imposter Active
                    </Text>
                    <Text style={[styles.infoDescription, { color: colors.textSecondary }]}>
                      Imposter doesn't see the category
                    </Text>
                  </View>
                </View>
              </>
            )}
          </Card>

          <Animated.View entering={FadeIn.delay(300)} style={styles.buttonContainer}>
            <Button
              title="Let's play"
              onPress={handleContinue}
              style={styles.button}
            />
            <Button
              title="Go Back"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.goBack();
              }}
              variant="secondary"
              style={styles.button}
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
  confirmationCard: {
    marginBottom: spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  infoIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  infoLabel: {
    ...typography.caption,
    fontSize: 13,
    marginBottom: spacing.xs / 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    ...typography.bodyBold,
    fontSize: 18,
    fontWeight: '600',
  },
  infoDescription: {
    ...typography.caption,
    fontSize: 13,
    marginTop: spacing.xs / 2,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    marginVertical: spacing.xs,
  },
  buttonContainer: {
    gap: spacing.md,
  },
  button: {
    width: '100%',
  },
});
