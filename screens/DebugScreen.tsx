import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../App';
import { useTheme } from '../contexts/ThemeContext';
import { useGame } from '../contexts/GameContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import { getMaxContentWidth, getResponsiveFontSize } from '../utils/responsive';
import * as Haptics from 'expo-haptics';
import {
  DEBUG_SCENARIOS,
  getScenarioState,
  type DebugScenarioId,
} from '../utils/debugScenarios';

type DebugScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Debug'
>;

const OTHER_SCREENS: { name: string; route: keyof RootStackParamList; sub: string }[] = [
  { name: 'Menu', route: 'Menu', sub: 'Main menu' },
  { name: 'How To Play', route: 'HowToPlay', sub: 'Tutorial' },
  { name: 'Game Setup', route: 'GameSetup', sub: 'Players, categories, modes' },
  { name: 'Create Category', route: 'CreateCategory', sub: 'Custom word list' },
  { name: 'Create Playlist', route: 'CreatePlaylist', sub: 'Category playlist' },
  { name: 'Statistics', route: 'Statistics', sub: 'Stats & achievements' },
  { name: 'Card Reveal Preview', route: 'DebugRevealPreview', sub: 'Card reveal animation' },
  { name: 'Achievement Popup', route: 'DebugAchievementPopup', sub: 'Achievement unlocked UI' },
];

export default function DebugScreen() {
  const navigation = useNavigation<DebugScreenNavigationProp>();
  const { colors } = useTheme();
  const { setPlayers, setSettings } = useGame();
  const maxWidth = getMaxContentWidth();

  const openScenario = (scenarioId: DebugScenarioId) => {
    const { players, settings } = getScenarioState(scenarioId);
    setPlayers(players);
    setSettings(settings);
    const entry = DEBUG_SCENARIOS.find(e => e.id === scenarioId);
    if (entry) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (entry.route === 'PassAndPlay') navigation.navigate('PassAndPlay', undefined);
      else if (entry.route === 'VotingTimer') navigation.navigate('VotingTimer', undefined);
      else navigation.navigate(entry.route);
    }
  };

  const openOther = (route: keyof RootStackParamList) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (route === 'PassAndPlay') navigation.navigate('PassAndPlay', undefined);
    else if (route === 'VotingTimer') navigation.navigate('VotingTimer', undefined);
    else if (route === 'CreatePlaylist') navigation.navigate('CreatePlaylist', undefined);
    else navigation.navigate(route);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <PatternBackground />
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
          style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.7 : 1 }]}
          hitSlop={12}
        >
          <Text style={[styles.backLabel, { color: colors.accent }]}>← Back</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Debug</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: spacing.xxl * 2 }]}
        showsVerticalScrollIndicator
      >
        <View style={[styles.section, { maxWidth }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Scenarios (pre-filled game state)
          </Text>
          <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
            Tap to load mock players & settings, then open the screen. Use Back to return here.
          </Text>
          {DEBUG_SCENARIOS.map(({ id, label, sublabel }) => (
            <Pressable
              key={id}
              onPress={() => openScenario(id)}
              style={({ pressed }) => [
                styles.row,
                { borderColor: colors.border, backgroundColor: pressed ? colors.accentLight + '40' : 'transparent' },
              ]}
            >
              <View style={styles.rowText}>
                <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
                <Text style={[styles.rowSub, { color: colors.textSecondary }]}>{sublabel}</Text>
              </View>
              <Text style={[styles.arrow, { color: colors.textSecondary }]}>›</Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.section, { maxWidth }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Other screens
          </Text>
          <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
            No game state; screen may show empty or default content.
          </Text>
          {OTHER_SCREENS.map(({ name, route, sub }) => (
            <Pressable
              key={route}
              onPress={() => openOther(route)}
              style={({ pressed }) => [
                styles.row,
                { borderColor: colors.border, backgroundColor: pressed ? colors.accentLight + '40' : 'transparent' },
              ]}
            >
              <View style={styles.rowText}>
                <Text style={[styles.rowLabel, { color: colors.text }]}>{name}</Text>
                <Text style={[styles.rowSub, { color: colors.textSecondary }]}>{sub}</Text>
              </View>
              <Text style={[styles.arrow, { color: colors.textSecondary }]}>›</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    minWidth: 72,
  },
  backLabel: {
    ...typography.body,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    ...typography.heading,
    fontSize: 20,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    width: '100%',
    alignSelf: 'center',
  },
  section: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.caption,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
  },
  sectionSub: {
    ...typography.caption,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.xs,
    borderWidth: 1,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    ...typography.body,
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
  },
  rowSub: {
    ...typography.caption,
    fontSize: getResponsiveFontSize(13),
    marginTop: 2,
  },
  arrow: {
    fontSize: 22,
    marginLeft: spacing.sm,
  },
});
