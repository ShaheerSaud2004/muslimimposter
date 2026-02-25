/**
 * Tests for game utils: Play Again randomness (different imposter, different category).
 * Run: npm test
 */
import {
  createPlayers,
  selectDifferentCategory,
  selectRandomCategory,
  selectSingleRandomCategory,
  selectRandomWord,
  getCategoryName,
  getVotingTimeSeconds,
  generatePlayerNames,
} from '../utils/game';

// Minimal Category shape for tests (matches types/index Category)
const mockCategories = [
  { id: 'prophets', name: 'Prophets', description: '', words: ['Adam', 'Nuh'], locked: false, isCustom: false },
  { id: 'seerah', name: 'Seerah', description: '', words: ['Hijrah', 'Badr'], locked: false, isCustom: false },
  { id: 'ramadan', name: 'Ramadan', description: '', words: ['Suhoor', 'Iftar'], locked: false, isCustom: false },
  { id: 'quran-surahs', name: 'Quran Surahs', description: '', words: ['Al-Fatiha', 'Yasin'], locked: false, isCustom: false },
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
  const threeCategoryIds = ['prophets', 'seerah', 'ramadan'];

  it('never returns the excluded category when 2+ categories available', () => {
    const excludeId = 'prophets';

    for (let i = 0; i < RUNS; i++) {
      const result = selectDifferentCategory(threeCategoryIds, mockCategories, excludeId);
      expect(result).not.toBe(excludeId);
      expect(threeCategoryIds).toContain(result);
    }
  });

  it('returns different categories over many runs (not always same one)', () => {
    const excludeId = 'prophets';
    const seen = new Set<string>();

    for (let i = 0; i < RUNS; i++) {
      const result = selectDifferentCategory(threeCategoryIds, mockCategories, excludeId);
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

  it('with strictPool true, never returns a category outside the selected pool', () => {
    const selectedOnly = ['seerah', 'ramadan'];
    const excludeId = 'seerah';
    const RUNS = 40;

    for (let i = 0; i < RUNS; i++) {
      const result = selectDifferentCategory(
        selectedOnly,
        mockCategories,
        excludeId,
        true
      );
      expect(selectedOnly).toContain(result);
      expect(result).not.toBe(excludeId);
      expect(result).toBe('ramadan');
    }
  });

  it('with strictPool true, when only one category in pool and it is excluded, returns that same category', () => {
    const selectedOnly = ['prophets'];
    const result = selectDifferentCategory(
      selectedOnly,
      mockCategories,
      'prophets',
      true
    );
    expect(result).toBe('prophets');
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

  it('result is always one of the given categoryIds (never from outside pool)', () => {
    const selectedIds = ['seerah', 'ramadan'];
    const RUNS = 50;

    for (let i = 0; i < RUNS; i++) {
      const result = selectRandomCategory(selectedIds, mockCategories);
      expect(selectedIds).toContain(result);
      expect(['prophets', 'quran-surahs']).not.toContain(result);
    }
  });

  it('filters out invalid category ids (missing, locked, or no words)', () => {
    const withInvalid = ['seerah', 'nonexistent', 'ramadan'];
    const categoriesWithLocked = [
      ...mockCategories,
      { id: 'locked-cat', name: 'Locked', description: '', words: ['A'], locked: true, isCustom: false },
    ];
    const RUNS = 30;

    for (let i = 0; i < RUNS; i++) {
      const result = selectRandomCategory(withInvalid, categoriesWithLocked);
      expect(['seerah', 'ramadan']).toContain(result);
    }
  });
});

describe('selectSingleRandomCategory', () => {
  it('returns one of the category ids when categories have words', () => {
    const ids = mockCategories.map(c => c.id);
    const RUNS = 40;

    for (let i = 0; i < RUNS; i++) {
      const result = selectSingleRandomCategory(mockCategories);
      expect(ids).toContain(result);
    }
  });

  it('returns empty string when no categories have words', () => {
    const noWords = [
      { id: 'a', name: 'A', description: '', words: [], locked: false, isCustom: false },
    ];
    expect(selectSingleRandomCategory(noWords)).toBe('');
  });

  it('excludes locked categories unless isCustom', () => {
    const withLocked = [
      { id: 'unlocked', name: 'U', description: '', words: ['x'], locked: false, isCustom: false },
      { id: 'locked', name: 'L', description: '', words: ['y'], locked: true, isCustom: false },
    ];
    const RUNS = 30;

    for (let i = 0; i < RUNS; i++) {
      const result = selectSingleRandomCategory(withLocked);
      expect(result).toBe('unlocked');
    }
  });
});

describe('selectRandomWord', () => {
  it('returns a word from the list', () => {
    const words = ['Hijrah', 'Badr', 'Suhoor'];
    const RUNS = 20;

    for (let i = 0; i < RUNS; i++) {
      const result = selectRandomWord(words);
      expect(words).toContain(result);
    }
  });

  it('excludes used words when possible', () => {
    const words = ['A', 'B', 'C'];
    const used = ['A', 'B'];

    for (let i = 0; i < 20; i++) {
      const result = selectRandomWord(words, used);
      expect(result).toBe('C');
    }
  });

  it('when all words used, returns one of the words (reset behavior)', () => {
    const words = ['X', 'Y'];
    const used = ['X', 'Y'];

    for (let i = 0; i < 10; i++) {
      const result = selectRandomWord(words, used);
      expect(words).toContain(result);
    }
  });
});

describe('getCategoryName', () => {
  it('returns category name for known id', () => {
    expect(getCategoryName('seerah', mockCategories)).toBe('Seerah');
    expect(getCategoryName('ramadan', mockCategories)).toBe('Ramadan');
  });

  it('returns Unknown for unknown id', () => {
    expect(getCategoryName('unknown-id', mockCategories)).toBe('Unknown');
  });
});
