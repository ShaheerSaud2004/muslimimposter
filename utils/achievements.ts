/**
 * Achievements/badges computed from game results.
 */

import { getGameResults } from './storage';
import { defaultCategories } from '../data/categories';

export type BadgeId =
  | 'rounds_won_10'
  | 'imposters_won_5'
  | 'all_categories'
  | 'first_game'
  | 'streak_3'
  | 'played_6_plus'
  | 'both_modes'
  | 'used_special_modes';

export type Badge = {
  id: BadgeId;
  titleKey: string;
  unlocked: boolean;
  progress?: string;
};

const BADGE_ROUNDS_WON = 10;
const BADGE_IMPOSTERS_WON = 5;
const STREAK_TARGET = 3;

function maxConsecutivePlayersWon(results: { wasCorrect: boolean }[]): number {
  let max = 0;
  let current = 0;
  for (const r of results) {
    if (r.wasCorrect) {
      current += 1;
      max = Math.max(max, current);
    } else {
      current = 0;
    }
  }
  return max;
}

export async function getAchievements(): Promise<Badge[]> {
  const results = await getGameResults();
  const roundsWon = results.filter((r) => r.wasCorrect).length;
  const impostersWon = results.filter((r) => !r.wasCorrect).length;
  const categoryIds = new Set(results.map((r) => r.category));
  const defaultCategoryNames = new Set(defaultCategories.map((c) => c.name));
  const playedAllDefault =
    defaultCategoryNames.size > 0 &&
    [...defaultCategoryNames].every((name) => categoryIds.has(name));

  const hasPlayedAnyGame = results.length >= 1;
  const streak = maxConsecutivePlayersWon(results);
  const playedWith6Plus = results.some((r) => r.numPlayers >= 6);
  const usedWordMode = results.some((r) => r.mode === 'word' || r.mode === 'question');
  const usedQuizMode = results.some((r) => r.mode === 'quiz');
  const usedSpecialModes = results.some(
    (r) => r.usedBlindImposter === true || r.usedDoubleAgent === true
  );

  return [
    {
      id: 'rounds_won_10',
      titleKey: 'achievements.badgeRoundsWon',
      unlocked: roundsWon >= BADGE_ROUNDS_WON,
      progress: `${roundsWon}/${BADGE_ROUNDS_WON}`,
    },
    {
      id: 'imposters_won_5',
      titleKey: 'achievements.badgeImpostersWon',
      unlocked: impostersWon >= BADGE_IMPOSTERS_WON,
      progress: `${impostersWon}/${BADGE_IMPOSTERS_WON}`,
    },
    {
      id: 'all_categories',
      titleKey: 'achievements.badgeAllCategories',
      unlocked: playedAllDefault,
      progress: `${categoryIds.size}/${defaultCategoryNames.size}`,
    },
    {
      id: 'first_game',
      titleKey: 'achievements.badgeFirstGame',
      unlocked: hasPlayedAnyGame,
      progress: hasPlayedAnyGame ? '1/1' : '0/1',
    },
    {
      id: 'streak_3',
      titleKey: 'achievements.badgeStreak3',
      unlocked: streak >= STREAK_TARGET,
      progress: `${streak}/${STREAK_TARGET}`,
    },
    {
      id: 'played_6_plus',
      titleKey: 'achievements.badgePlayed6Plus',
      unlocked: playedWith6Plus,
      progress: playedWith6Plus ? '—' : undefined,
    },
    {
      id: 'both_modes',
      titleKey: 'achievements.badgeBothModes',
      unlocked: usedWordMode && usedQuizMode,
      progress: usedWordMode && usedQuizMode ? '—' : undefined,
    },
    {
      id: 'used_special_modes',
      titleKey: 'achievements.badgeUsedSpecialModes',
      unlocked: usedSpecialModes,
      progress: usedSpecialModes ? '—' : undefined,
    },
  ];
}
