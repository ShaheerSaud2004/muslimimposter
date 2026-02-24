/**
 * Tests for game utils: Play Again randomness (different imposter, different category).
 * Run: npm test
 */
import {
  createPlayers,
  selectDifferentCategory,
  selectRandomCategory,
  getVotingTimeSeconds,
  generatePlayerNames,
} from '../utils/game';

// Minimal Category shape for tests (matches types/index Category)
const mockCategories = [
  { id: 'prophets', name: 'Prophets', description: '', words: ['Adam', 'Nuh'], locked: false, isCustom: false },
  { id: 'seerah', name: 'Seerah', description: '', words: ['Hijrah', 'Badr'], locked: false, isCustom: false },
  { id: 'ramadan', name: 'Ramadan', description: '', words: ['Suhoor', 'Iftar'], locked: false, isCustom: false },
];

describe('getVotingTimeSeconds', () => {
  it('returns value between 60 and 300', () => {
    for (let n = 3; n <= 20; n++) {
      const t = getVotingTimeSeconds(n);
      expect(t).toBeGreaterThanOrEqual(60);
      expect(t).toBeLessThanOrEqual(300);
    }
  });

  it('increases with player count', () => {
    const t3 = getVotingTimeSeconds(3);
    const t6 = getVotingTimeSeconds(6);
    const t10 = getVotingTimeSeconds(10);
    expect(t6).toBeGreaterThan(t3);
    expect(t10).toBeGreaterThan(t6);
  });
});

describe('generatePlayerNames', () => {
  it('returns exactly count names', () => {
    expect(generatePlayerNames(5)).toHaveLength(5);
    expect(generatePlayerNames(1)[0]).toBe('Player 1');
    expect(generatePlayerNames(3)[2]).toBe('Player 3');
  });
});

describe('createPlayers — imposter is different on Play Again', () => {
  const RUNS = 80;
  const numPlayers = 3;
  const numImposters = 1;
  const playerNames = ['Alice', 'Bob', 'Carol'];

  it('with excludeImposterIds, new imposter is never the excluded player', () => {
    const excludeImposterIds = ['player-1']; // Bob was imposter last round
    const allowedNewImposterIds = ['player-0', 'player-2']; // Alice or Carol only

    for (let i = 0; i < RUNS; i++) {
      const players = createPlayers(
        numPlayers,
        numImposters,
        false,
        'player-0',
        playerNames,
        excludeImposterIds
      );
      const imposter = players.find(p => p.role === 'imposter');
      expect(imposter).toBeDefined();
      expect(allowedNewImposterIds).toContain(imposter!.id);
      expect(imposter!.id).not.toBe('player-1');
    }
  });

  it('with excludeImposterIds, imposter rotates over many runs', () => {
    const seenImposterIds = new Set<string>();
    const excludeImposterIds = ['player-1'];

    for (let i = 0; i < RUNS; i++) {
      const players = createPlayers(
        numPlayers,
        numImposters,
        false,
        'player-0',
        playerNames,
        excludeImposterIds
      );
      const imposter = players.find(p => p.role === 'imposter');
      expect(imposter).toBeDefined();
      seenImposterIds.add(imposter!.id);
    }

    expect(seenImposterIds.has('player-1')).toBe(false);
    expect(seenImposterIds.size).toBe(2); // both player-0 and player-2 should appear
  });

  it('without excludeImposterIds, any player can be imposter over many runs', () => {
    const seenImposterIds = new Set<string>();

    for (let i = 0; i < RUNS; i++) {
      const players = createPlayers(
        numPlayers,
        numImposters,
        false,
        'player-0',
        playerNames,
        []
      );
      const imposter = players.find(p => p.role === 'imposter');
      expect(imposter).toBeDefined();
      seenImposterIds.add(imposter!.id);
    }

    expect(seenImposterIds.size).toBe(3);
  });

  it('creates correct number of players and one imposter', () => {
    const players = createPlayers(4, 1, false, 'player-0', [], []);
    expect(players).toHaveLength(4);
    expect(players.filter(p => p.role === 'imposter')).toHaveLength(1);
    expect(players.every(p => p.hasSeenCard === false)).toBe(true);
  });
});

describe('selectDifferentCategory — category is different on Play Again', () => {
  const RUNS = 50;
  const categoryIds = mockCategories.map(c => c.id);

  it('never returns the excluded category when 2+ categories available', () => {
    const excludeId = 'prophets';

    for (let i = 0; i < RUNS; i++) {
      const result = selectDifferentCategory(categoryIds, mockCategories, excludeId);
      expect(result).not.toBe(excludeId);
      expect(['seerah', 'ramadan']).toContain(result);
    }
  });

  it('returns different categories over many runs (not always same one)', () => {
    const excludeId = 'prophets';
    const seen = new Set<string>();

    for (let i = 0; i < RUNS; i++) {
      const result = selectDifferentCategory(categoryIds, mockCategories, excludeId);
      seen.add(result);
    }

    expect(seen.size).toBe(2);
    expect(seen.has('prophets')).toBe(false);
  });

  it('when only one category in list and it is excluded, falls back to all categories', () => {
    const singleSelected = ['prophets'];
    const excludeId = 'prophets';

    for (let i = 0; i < RUNS; i++) {
      const result = selectDifferentCategory(singleSelected, mockCategories, excludeId);
      expect(result).not.toBe(excludeId);
      expect(mockCategories.map(c => c.id)).toContain(result);
    }
  });

  it('when only one category exists in app, returns that id', () => {
    const oneCat = [mockCategories[0]];
    const result = selectDifferentCategory(
      oneCat.map(c => c.id),
      oneCat,
      mockCategories[0].id
    );
    expect(result).toBe(mockCategories[0].id);
  });
});

describe('selectRandomCategory with exclude', () => {
  it('when excludeCategoryId given and 2+ categories, result is not excluded', () => {
    const categoryIds = ['prophets', 'seerah', 'ramadan'];
    const RUNS = 40;

    for (let i = 0; i < RUNS; i++) {
      const result = selectRandomCategory(
        categoryIds,
        mockCategories,
        'prophets'
      );
      expect(result).not.toBe('prophets');
    }
  });
});
