import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import * as Haptics from 'expo-haptics';
import { NavigationHeader } from '../components/NavigationHeader';
import { TypingText } from '../components/TypingText';
import type { Badge } from '../utils/achievements';

type DebugAchievementPopupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'DebugAchievementPopup'
>;

const PREVIEW_BADGES: Badge[] = [
  { id: 'rounds_won_10', titleKey: 'achievements.badgeRoundsWon', unlocked: true, progress: '10/10' },
  { id: 'imposters_won_5', titleKey: 'achievements.badgeImpostersWon', unlocked: true, progress: '5/5' },
  { id: 'all_categories', titleKey: 'achievements.badgeAllCategories', unlocked: true, progress: '—' },
  { id: 'first_game', titleKey: 'achievements.badgeFirstGame', unlocked: true, progress: '1/1' },
  { id: 'streak_3', titleKey: 'achievements.badgeStreak3', unlocked: true, progress: '3/3' },
  { id: 'played_6_plus', titleKey: 'achievements.badgePlayed6Plus', unlocked: true, progress: '—' },
  { id: 'both_modes', titleKey: 'achievements.badgeBothModes', unlocked: true, progress: '—' },
  { id: 'used_special_modes', titleKey: 'achievements.badgeUsedSpecialModes', unlocked: true, progress: '—' },
];

export default function DebugAchievementPopupScreen() {
  const navigation = useNavigation<DebugAchievementPopupScreenNavigationProp>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge>(PREVIEW_BADGES[0]);

  useEffect(() => {
    if (showPopup) {
      const id = setTimeout(() => setShowPopup(false), 4000);
      return () => clearTimeout(id);
    }
  }, [showPopup]);

  const handlePreviewBadge = (badge: Badge) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedBadge(badge);
    setShowPopup(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <PatternBackground />
      <NavigationHeader showGetStarted={false} showSettings={false} />

      <View style={styles.header}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={[styles.backButton, { color: colors.accent }]}>← Back</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          Achievement popup preview
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={[styles.content, { paddingHorizontal: spacing.lg }]}>
        <Animated.View
          entering={FadeIn.delay(100)}
          style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
        >
          <View style={[styles.iconWrap, { backgroundColor: colors.accentLight }]}>
            <Svg width={32} height={32} viewBox="0 0 24 24" fill={colors.accent}>
              <Path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C18.08 14.63 20 12.55 20 10V7c0-1.1-.9-2-2-2zM5 10V7h2v3H5zm14 0h-2V7h2v3z" />
            </Svg>
          </View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Preview unlock toast
          </Text>
          <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
            Tap an achievement to preview its unlock popup.
          </Text>
          {PREVIEW_BADGES.map((badge) => (
            <Pressable
              key={badge.id}
              onPress={() => handlePreviewBadge(badge)}
              style={({ pressed }) => [
                styles.badgeRow,
                { backgroundColor: pressed ? colors.accentLight : 'transparent', borderColor: colors.border },
              ]}
            >
              <Text style={[styles.badgeRowLabel, { color: colors.text }]} numberOfLines={1}>
                {t(badge.titleKey)}
              </Text>
              <Text style={[styles.badgeRowArrow, { color: colors.textSecondary }]}>›</Text>
            </Pressable>
          ))}
        </Animated.View>
      </View>

      <Modal
        visible={showPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPopup(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setShowPopup(false)}>
          <Animated.View
            entering={FadeInDown.duration(280)}
            style={[styles.popupCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={[styles.popupIconWrap, { backgroundColor: colors.accentLight }]}>
                <Svg width={44} height={44} viewBox="0 0 24 24" fill={colors.accent}>
                  <Path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C18.08 14.63 20 12.55 20 10V7c0-1.1-.9-2-2-2zM5 10V7h2v3H5zm14 0h-2V7h2v3z" />
                </Svg>
              </View>
              <TypingText
                text={t('achievements.achievementUnlocked')}
                style={[styles.popupTitle, { color: colors.accent }]}
                delayPerChar={40}
              />
              <TypingText
                text={t(selectedBadge.titleKey)}
                style={[styles.popupBadgeName, { color: colors.text }]}
                delayPerChar={45}
              />
              <Text style={[styles.popupHint, { color: colors.textSecondary }]}>
                Tap anywhere to close
              </Text>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  backButton: {
    ...typography.bodyBold,
    fontSize: 16,
    minWidth: 60,
  },
  headerTitle: {
    ...typography.bodyBold,
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
  headerSpacer: {
    width: 60,
  },
  content: {
    flex: 1,
    paddingTop: spacing.sm,
    maxWidth: 420,
    alignSelf: 'center',
    width: '100%',
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: spacing.xl,
    alignItems: 'center',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.bodyBold,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  cardDescription: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing.sm,
    width: '100%',
  },
  badgeRowLabel: {
    ...typography.body,
    fontSize: 16,
    flex: 1,
  },
  badgeRowArrow: {
    fontSize: 20,
    fontWeight: '300',
    marginLeft: spacing.sm,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  popupCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 24,
    borderWidth: 1,
    padding: spacing.xl,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  popupIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    alignSelf: 'center',
  },
  popupTitle: {
    ...typography.bodyBold,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  popupBadgeName: {
    ...typography.body,
    fontSize: 17,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  popupHint: {
    ...typography.caption,
    fontSize: 13,
    textAlign: 'center',
  },
});
