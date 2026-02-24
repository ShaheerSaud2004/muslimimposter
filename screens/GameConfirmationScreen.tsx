import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
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
                <Image 
                  source={require('../users.png')} 
                  style={[styles.infoIconImage, { tintColor: colors.accent }]}
                  resizeMode="contain"
                />
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
                <Image 
                  source={require('../drama.png')} 
                  style={[styles.infoIconImage, { tintColor: colors.accent }]}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                  Imposters
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {numImposters} {numImposters === 1 ? 'imposter' : 'imposters'}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.infoRow}>
              <View style={[styles.infoIconContainer, { backgroundColor: colors.accentLight }]}>
                <Image 
                  source={require('../brain.png')} 
                  style={[styles.infoIconImage, { tintColor: colors.accent }]}
                  resizeMode="contain"
                />
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
                    <Text style={[styles.infoValue, { color: colors.doubleAgent }]}>
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
                    <Text style={[styles.infoIcon, { color: colors.accent }]}>👁️</Text>
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                      Special Mode
                    </Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>
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
              title="Continue to Game"
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
