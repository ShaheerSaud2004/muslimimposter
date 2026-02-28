import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PatternBackground } from '../components/PatternBackground';
import { Card } from '../components/Card';
import { typography, spacing } from '../theme';
import * as Haptics from 'expo-haptics';
import { getGameResults, clearGameResults, type GameResult } from '../utils/storage';
import { getAchievements, type Badge } from '../utils/achievements';
import { showAlert } from '../components/Alert';
import { getMaxContentWidth } from '../utils/responsive';
import { NavigationHeader } from '../components/NavigationHeader';
import Svg, { Path } from 'react-native-svg';

type StatisticsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Statistics'
>;

const RECENT_LIMIT = 10;

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  }
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

export default function StatisticsScreen() {
  const navigation = useNavigation<StatisticsScreenNavigationProp>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const maxWidth = getMaxContentWidth();
  const [results, setResults] = useState<GameResult[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadResults = useCallback(async () => {
    const data = await getGameResults();
    setResults(data);
    const achievements = await getAchievements();
    setBadges(achievements);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadResults();
    }, [loadResults])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadResults();
    setRefreshing(false);
  }, [loadResults]);

  const totalRounds = results.length;
  const playersWon = results.filter((r) => r.wasCorrect).length;
  const impostersWon = totalRounds - playersWon;
  const winRate = totalRounds > 0 ? Math.round((playersWon / totalRounds) * 100) : 0;
  const recentResults = [...results].reverse().slice(0, RECENT_LIMIT);
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  const [activeTab, setActiveTab] = useState<'stats' | 'achievements'>('stats');

  const handleClearStats = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    showAlert({
      title: t('stats.clearConfirmTitle'),
      message: t('stats.clearConfirmMessage'),
      buttons: [
        { text: t('settings.cancel'), style: 'cancel' },
        {
          text: t('stats.clearStats'),
          style: 'destructive',
          onPress: async () => {
            await clearGameResults();
            setResults([]);
          },
        },
      ],
    });
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
          { maxWidth, alignSelf: 'center', width: '100%', paddingBottom: Math.max(spacing.xxl, insets.bottom + 40) },
        ]}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
      >
        <Animated.View entering={FadeInDown.delay(0).springify()}>
          <View style={styles.header}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.goBack();
              }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <Text style={[styles.backButton, { color: colors.accent }]}>{t('common.back')}</Text>
            </Pressable>
            <Text style={[styles.title, { color: colors.text }]}>{t('stats.title')}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {t('stats.subtitle')}
            </Text>
          </View>

          <View style={[styles.tabBar, { backgroundColor: colors.border + '40', borderRadius: 14 }]}>
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveTab('stats'); }}
              style={[styles.tab, activeTab === 'stats' && { backgroundColor: colors.cardBackground, ...styles.tabActive }]}
            >
              <Text style={[styles.tabLabel, { color: activeTab === 'stats' ? colors.accent : colors.textSecondary }]}>
                {t('stats.tabStats')}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setActiveTab('achievements'); }}
              style={[styles.tab, activeTab === 'achievements' && { backgroundColor: colors.cardBackground, ...styles.tabActive }]}
            >
              <Text style={[styles.tabLabel, { color: activeTab === 'achievements' ? colors.accent : colors.textSecondary }]}>
                {t('stats.tabAchievements')}
              </Text>
            </Pressable>
          </View>

          {activeTab === 'achievements' ? (
            <View style={styles.tabContent}>
              <Animated.View entering={FadeIn.duration(200)} style={styles.achievementsTab}>
                <View style={[styles.achievementsSummary, { backgroundColor: colors.accentLight + '50', borderColor: colors.accent }]}>
                  <Text style={[styles.achievementsSummaryValue, { color: colors.accent }]}>
                    {unlockedCount} / {badges.length}
                  </Text>
                  <Text style={[styles.achievementsSummaryLabel, { color: colors.textSecondary }]}>
                    {t('achievements.unlocked')}
                  </Text>
                </View>
                <View style={styles.achievementsList}>
                  {badges.map((badge, i) => (
                    <Animated.View
                      key={badge.id}
                      entering={FadeInDown.delay(50 + i * 40).springify()}
                      style={[
                        styles.achievementCard,
                        {
                          backgroundColor: badge.unlocked ? colors.cardBackground : colors.cardBackground,
                          borderColor: badge.unlocked ? colors.accent + '60' : colors.border,
                          borderWidth: badge.unlocked ? 2 : 1,
                        },
                      ]}
                    >
                      <View style={[styles.achievementIconWrap, { backgroundColor: badge.unlocked ? colors.accentLight : colors.border + '80' }]}>
                        {badge.unlocked ? (
                          <Svg width={36} height={36} viewBox="0 0 24 24" fill={colors.accent}>
                            <Path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C18.08 14.63 20 12.55 20 10V7c0-1.1-.9-2-2-2zM5 10V7h2v3H5zm14 0h-2V7h2v3z" />
                          </Svg>
                        ) : (
                          <Svg width={36} height={36} viewBox="0 0 24 24" fill={colors.textSecondary}>
                            <Path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                          </Svg>
                        )}
                      </View>
                      <View style={styles.achievementCardContent}>
                        <Text style={[styles.achievementCardTitle, { color: badge.unlocked ? colors.text : colors.textSecondary }]} numberOfLines={2}>
                          {t(badge.titleKey)}
                        </Text>
                        {badge.progress != null && (
                          <Text style={[styles.achievementCardProgress, { color: colors.textSecondary }]}>
                            {badge.progress}
                          </Text>
                        )}
                        <View style={[styles.achievementCardStatus, { backgroundColor: badge.unlocked ? colors.accent + '25' : colors.border + '40' }]}>
                          <Text style={[styles.achievementCardStatusText, { color: badge.unlocked ? colors.accent : colors.textSecondary }]}>
                            {badge.unlocked ? t('achievements.unlocked') : t('achievements.locked')}
                          </Text>
                        </View>
                      </View>
                    </Animated.View>
                  ))}
                </View>
              </Animated.View>
            </View>
          ) : totalRounds === 0 ? (
            <Animated.View entering={FadeIn.delay(100)}>
              <Card style={[styles.emptyCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                <Text style={[styles.emptyIcon, { color: colors.textSecondary }]}>📊</Text>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('stats.noGamesYet')}</Text>
                <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
                  {t('stats.noGamesYetMessage')}
                </Text>
              </Card>
            </Animated.View>
          ) : (
            <>
              <View style={styles.statsGrid}>
                <Animated.View entering={FadeInDown.delay(80).springify()} style={styles.statBox}>
                  <Card style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                    <Text style={[styles.statValue, { color: colors.accent }]}>{totalRounds}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('stats.totalRounds')}</Text>
                  </Card>
                </Animated.View>
                <Animated.View entering={FadeInDown.delay(120).springify()} style={styles.statBox}>
                  <Card style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                    <Text style={[styles.statValue, { color: colors.doubleAgent }]}>{playersWon}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('stats.playersWon')}</Text>
                  </Card>
                </Animated.View>
                <Animated.View entering={FadeInDown.delay(160).springify()} style={styles.statBox}>
                  <Card style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                    <Text style={[styles.statValue, { color: colors.imposter }]}>{impostersWon}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('stats.impostersWon')}</Text>
                  </Card>
                </Animated.View>
                <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.statBox}>
                  <Card style={[styles.statCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                    <Text style={[styles.statValue, { color: colors.accent }]}>{winRate}%</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t('stats.winRate')}</Text>
                  </Card>
                </Animated.View>
              </View>

              {recentResults.length > 0 && (
                <Animated.View entering={FadeInDown.delay(240).springify()} style={styles.recentSection}>
                  <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    {t('stats.recentGames')}
                  </Text>
                  <Card style={[styles.recentCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
                    {recentResults.map((r, i) => (
                      <View
                        key={`${r.timestamp}-${i}`}
                        style={[
                          styles.recentRow,
                          i < recentResults.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
                        ]}
                      >
                        <View style={styles.recentLeft}>
                          <Text style={[styles.recentWord, { color: colors.text }]} numberOfLines={1}>
                            {r.word}
                          </Text>
                          <Text style={[styles.recentCategory, { color: colors.textSecondary }]} numberOfLines={1}>
                            {r.category}
                          </Text>
                          {r.imposterNames && r.imposterNames.length > 0 && (
                            <Text style={[styles.recentImposter, { color: colors.imposter }]} numberOfLines={1}>
                              {t('stats.imposter')}: {r.imposterNames.join(', ')}
                            </Text>
                          )}
                          {r.winnerNames && r.winnerNames.length > 0 && (
                            <Text style={[styles.recentWinners, { color: r.wasCorrect ? colors.doubleAgent : colors.imposter }]} numberOfLines={2}>
                              {t('stats.winners')}: {r.winnerNames.join(', ')}
                            </Text>
                          )}
                        </View>
                        <View style={styles.recentRight}>
                          <View style={[styles.recentBadge, { backgroundColor: r.wasCorrect ? colors.doubleAgent + '30' : colors.imposter + '30' }]}>
                            <Text style={[styles.recentBadgeText, { color: r.wasCorrect ? colors.doubleAgent : colors.imposter }]}>
                              {r.wasCorrect ? t('stats.won') : t('stats.lost')}
                            </Text>
                          </View>
                          <Text style={[styles.recentDate, { color: colors.textSecondary }]}>
                            {formatDate(r.timestamp)}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </Card>
                </Animated.View>
              )}

              <Animated.View entering={FadeIn.delay(320)} style={styles.clearSection}>
                <Pressable
                  onPress={handleClearStats}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  style={({ pressed }) => [
                    styles.clearButton,
                    { borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <Text style={[styles.clearButtonText, { color: colors.textSecondary }]}>
                    {t('stats.clearStats')}
                  </Text>
                </Pressable>
              </Animated.View>
            </>
          )}
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
  },
  backButton: {
    ...typography.bodyBold,
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.heading,
    fontSize: 28,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  subtitle: {
    ...typography.body,
    fontSize: 15,
    opacity: 0.85,
  },
  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.heading,
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  emptyMessage: {
    ...typography.body,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.xl,
  },
  statBox: {
    width: '50%',
    padding: spacing.xs,
  },
  statCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.lg,
    alignItems: 'center',
  },
  statValue: {
    ...typography.heading,
    fontSize: 32,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    fontSize: 13,
    textAlign: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    padding: 4,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabLabel: {
    ...typography.bodyBold,
    fontSize: 15,
  },
  tabContent: {
    minHeight: 200,
  },
  achievementsTab: {
    marginBottom: spacing.xl,
  },
  achievementsSummary: {
    borderRadius: 16,
    borderWidth: 2,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  achievementsSummaryValue: {
    ...typography.heading,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  achievementsSummaryLabel: {
    ...typography.caption,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  achievementsList: {
    gap: spacing.md,
  },
  achievementCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  achievementIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementCardContent: {
    flex: 1,
    minWidth: 0,
  },
  achievementCardTitle: {
    ...typography.bodyBold,
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  achievementCardProgress: {
    ...typography.caption,
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  achievementCardStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 8,
  },
  achievementCardStatusText: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
  },
  recentSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.xs,
  },
  recentCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  recentLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  recentWord: {
    ...typography.bodyBold,
    fontSize: 16,
  },
  recentCategory: {
    ...typography.caption,
    fontSize: 13,
    marginTop: 2,
  },
  recentImposter: {
    ...typography.caption,
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  recentWinners: {
    ...typography.caption,
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  recentRight: {
    alignItems: 'flex-end',
  },
  recentBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 8,
    marginBottom: spacing.xs,
  },
  recentBadgeText: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
  },
  recentDate: {
    ...typography.caption,
    fontSize: 11,
  },
  clearSection: {
    alignItems: 'center',
  },
  clearButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    borderWidth: 1,
  },
  clearButtonText: {
    ...typography.body,
    fontSize: 15,
  },
});
