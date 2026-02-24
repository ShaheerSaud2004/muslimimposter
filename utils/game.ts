import { Player, GameSettings, Category } from '../types';

export const generatePlayerNames = (count: number): string[] => {
  const names: string[] = [];
  for (let i = 1; i <= count; i++) {
    names.push(`Player ${i}`);
  }
  return names;
};

/** Voting/discussion time in seconds: dynamic by player count (base + per player), clamped 60–300 */
export const getVotingTimeSeconds = (numPlayers: number): number => {
  const base = 45;
  const perPlayer = 15;
  const total = base + perPlayer * numPlayers;
  return Math.min(300, Math.max(60, total));
};

export const createPlayers = (
  numPlayers: number,
  numImposters: number,
  hasDoubleAgent: boolean,
  startingPlayerId: string,
  playerNames: string[] = [],
  excludeImposterIds: string[] = []
): Player[] => {
  const players: Player[] = [];
  const indices = Array.from({ length: numPlayers }, (_, i) => i);
  const excludeIndices = new Set(
    excludeImposterIds
      .map(id => parseInt(id.replace('player-', ''), 10))
      .filter(n => !Number.isNaN(n) && n >= 0 && n < numPlayers)
  );
  const nonExcludedIndices = indices.filter(i => !excludeIndices.has(i));
  const canExclude = excludeIndices.size > 0 && nonExcludedIndices.length >= numImposters;
  const pool = canExclude ? [...nonExcludedIndices] : [...indices];

  // Pick numImposters from pool at random (always different people when canExclude)
  const imposterIndices: number[] = [];
  const remaining = [...pool];
  for (let n = 0; n < numImposters && remaining.length > 0; n++) {
    const idx = Math.floor(Math.random() * remaining.length);
    imposterIndices.push(remaining[idx]);
    remaining.splice(idx, 1);
  }
  const remainingIndices = indices.filter(i => !imposterIndices.includes(i));
  
  // Determine double agent index if enabled
  let doubleAgentIndex: number | null = null;
  if (hasDoubleAgent && remainingIndices.length > 0) {
    doubleAgentIndex = remainingIndices[Math.floor(Math.random() * remainingIndices.length)];
  }

  // Create players
  for (let i = 0; i < numPlayers; i++) {
    const id = `player-${i}`;
    let role: 'normal' | 'imposter' | 'doubleAgent' = 'normal';
    
    if (imposterIndices.includes(i)) {
      role = 'imposter';
    } else if (doubleAgentIndex === i) {
      role = 'doubleAgent';
    }

    players.push({
      id,
      name: playerNames[i] || `Player ${i + 1}`,
      role,
      hasSeenCard: false,
    });
  }

  // Sort so starting player is first
  const startIndex = players.findIndex(p => p.id === startingPlayerId);
  if (startIndex > 0) {
    const startPlayer = players[startIndex];
    players.splice(startIndex, 1);
    players.unshift(startPlayer);
  }

  return players;
};

export const selectRandomWord = (words: string[], usedWords: string[] = []): string => {
  // Filter out used words
  const availableWords = words.filter(word => !usedWords.includes(word));
  
  // If all words have been used, reset and use all words
  if (availableWords.length === 0) {
    return words[Math.floor(Math.random() * words.length)];
  }
  
  return availableWords[Math.floor(Math.random() * availableWords.length)];
};

export const selectRandomCategory = (
  categoryIds: string[],
  categories: Category[],
  excludeCategoryId?: string
): string => {
  let availableCategories = categoryIds.filter(id => {
    const cat = categories.find(c => c.id === id);
    return cat && (!cat.locked || cat.isCustom) && cat.words.length > 0;
  });
  // When possible, pick a different category from the last round
  if (excludeCategoryId && availableCategories.length > 1) {
    availableCategories = availableCategories.filter(id => id !== excludeCategoryId);
  }
  if (availableCategories.length === 0) {
    return categoryIds[0] || '';
  }
  return availableCategories[Math.floor(Math.random() * availableCategories.length)];
};

/** Pick a category different from excludeCategoryId when possible. Uses all categories if selected pool would be empty. */
export const selectDifferentCategory = (
  categoryIds: string[],
  categories: Category[],
  excludeCategoryId: string
): string => {
  const valid = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat && (!cat.locked || cat.isCustom) && cat.words.length > 0;
  };
  let pool = categoryIds.filter(valid).filter(id => id !== excludeCategoryId);
  if (pool.length === 0) {
    pool = categories
      .filter(c => (!c.locked || c.isCustom) && c.words.length > 0)
      .map(c => c.id)
      .filter(id => id !== excludeCategoryId);
  }
  if (pool.length === 0) return excludeCategoryId;
  return pool[Math.floor(Math.random() * pool.length)];
};

// Select a random single category when none are selected
export const selectSingleRandomCategory = (categories: Category[]): string => {
  // Filter out locked categories, and categories with no words
  const availableCategories = categories.filter(c => 
    (!c.locked || c.isCustom) && c.words.length > 0
  );
  
  if (availableCategories.length === 0) {
    return '';
  }
  
  return availableCategories[Math.floor(Math.random() * availableCategories.length)].id;
};

export const getCategoryName = (categoryId: string, categories: Category[]): string => {
  const category = categories.find(c => c.id === categoryId);
  return category?.name || 'Unknown';
};

export const generateHint = (word: string): string => {
  // Simple hint generation - can be enhanced
  const hints: Record<string, string> = {
    'Masjid': 'A place of worship',
    'Prophet': 'A messenger of Allah',
    'Quran': 'The holy book',
  };
  
  return hints[word] || `Starts with "${word[0].toUpperCase()}"`;
};

// Select a random quiz question for quiz mode
export const selectQuizQuestion = (
  categoryId: string,
  difficulty?: 'easy' | 'medium' | 'hard'
): { question: string; answer: string } | null => {
  const { getRandomQuizQuestion } = require('../data/quizQuestions');
  const quizQ = getRandomQuizQuestion(categoryId, difficulty);
  
  if (!quizQ) {
    return null;
  }
  
  return {
    question: quizQ.question,
    answer: quizQ.answer,
  };
};

// Determine the answer type with more granular subcategories
const getAnswerType = (answer: string, categoryId: string): string => {
  const answerLower = answer.toLowerCase();
  
  // Prophets (person names from prophets category)
  const prophets = [
    'muhammad', 'ibrahim', 'musa', 'isa', 'nuh', 'adam', 'yusuf', 'sulaiman', 'dawud', 'yunus',
    'yahya', 'zakariyya', 'ishaq', 'ismail', 'ayyub', 'hud', 'salih', 'idris'
  ];
  
  // Companions/Wives (person names from companions/seerah)
  const companions = [
    'abu bakr', 'umar', 'uthman', 'ali', 'khadija', 'aisha', 'fatima', 'bilal', 'hamza',
    'zayd', 'umm aiman', 'zainab', 'hassan', 'hussein', 'anas', 'abdullah ibn abbas',
    'abu hurairah', 'sahabah'
  ];
  
  // Scholars/Imams
  const scholars = [
    'imam malik', 'imam shafi', 'imam hanbal', 'imam abu hanifa', 'imam bukhari', 'imam muslim',
    'imam tirmidhi', 'al-nawawi', 'ibn qayyim'
  ];
  
  // Locations (cities, places)
  const locations = [
    'makkah', 'madinah', 'madina', 'jerusalem', 'istanbul', 'baghdad', 'damascus', 'cairo',
    'andalusia', 'saudi arabia', 'turkey', 'egypt', 'pakistan', 'indonesia', 'malaysia',
    'morocco', 'algeria', 'tunisia', 'iraq', 'iran', 'afghanistan', 'bangladesh', 'uae',
    'qatar', 'kuwait', 'oman', 'yemen'
  ];
  
  // Battles (specific battle events)
  const battles = [
    'battle of badr', 'battle of uhud', 'battle of khandaq', 'battle of yarmouk'
  ];
  
  // Events (historical events, journeys, treaties)
  const events = [
    'conquest of makkah', 'night journey', 'first revelation', 'treaty of hudaybiyyah', 'hijrah',
    'fall of constantinople', 'crusades', 'mongol invasion', 'reconquista', 'siege of vienna',
    'conquest of jerusalem', 'conquest of spain', 'abbasid revolution', 'umayyad caliphate',
    'golden age of baghdad', 'al-andalus', 'moorish spain', 'age of discovery',
    'building of al-azhar', 'first hijrah to abyssinia', 'ottoman empire rise',
    'salahuddin ayyubi'
  ];
  
  // Months/Holidays
  const months = [
    'ramadan', 'dhul hijjah', 'muharram', 'safar', 'rabi al-awwal', 'rabi al-thani',
    'jumada al-awwal', 'jumada al-thani', 'rajab', 'shaaban', 'shawwal', 'dhul qidah',
    'eid al-fitr', 'eid al-adha', 'laylatul qadr', 'mawlid', 'ashura'
  ];
  
  // Objects/Physical things
  const objects = [
    'kaaba', 'black stone', 'zamzam water', 'prayer rug', 'quran stand', 'hijab', 'niqab',
    'abaya', 'thobe', 'kufi', 'turban', 'scarf', 'blue mosque', 'dome of the rock',
    'masjid nabawi', 'masjid al-aqsa', 'al-azhar', 'taj mahal', 'alhambra', 'topkapi'
  ];
  
  // Check by category-specific matching first
  if (categoryId === 'prophets') {
    if (prophets.some(name => answerLower.includes(name) || name.includes(answerLower))) {
      return 'prophet';
    }
  }
  
  if (categoryId === 'companions' || categoryId === 'seerah') {
    if (companions.some(name => answerLower.includes(name) || name.includes(answerLower))) {
      return 'companion';
    }
  }
  
  if (categoryId === 'islamic-scholars') {
    if (scholars.some(name => answerLower.includes(name) || name.includes(answerLower))) {
      return 'scholar';
    }
  }
  
  // Then check general types
  if (battles.some(battle => answerLower.includes(battle) || battle.includes(answerLower))) {
    return 'battle';
  }
  if (events.some(event => answerLower.includes(event) || event.includes(answerLower))) {
    return 'event';
  }
  if (locations.some(loc => answerLower.includes(loc) || loc.includes(answerLower))) {
    return 'location';
  }
  if (months.some(month => answerLower.includes(month) || month.includes(answerLower))) {
    return 'month';
  }
  if (objects.some(obj => answerLower.includes(obj) || obj.includes(answerLower))) {
    return 'object';
  }
  
  // Default to concept/term for everything else
  return 'concept';
};

// Analyze question structure to find similar questions
const getQuestionStructure = (question: string): string => {
  const qLower = question.toLowerCase();
  
  // Questions asking "who" or about a person's role/relationship
  if (qLower.includes('who') || qLower.includes('wife') || qLower.includes('husband') || 
      qLower.includes('daughter') || qLower.includes('son') || qLower.includes('caliph') ||
      qLower.includes('companion') || qLower.includes('uncle') || qLower.includes('grandson')) {
    return 'person-role';
  }
  
  // Questions asking "where" or about location
  if (qLower.includes('where') || qLower.includes('city') || qLower.includes('place')) {
    return 'location';
  }
  
  // Questions asking "when" or about time
  if (qLower.includes('when') || qLower.includes('month') || qLower.includes('time')) {
    return 'time';
  }
  
  // Questions asking "what" about battles/events
  if (qLower.includes('battle') || qLower.includes('conquest') || qLower.includes('treaty') ||
      qLower.includes('journey') || qLower.includes('revelation') || qLower.includes('migration') ||
      qLower.includes('hijrah')) {
    return 'event';
  }
  
  // Questions asking about characteristics/attributes of a person
  if (qLower.includes('known for') || qLower.includes('prophet') && (qLower.includes('patience') ||
      qLower.includes('wisdom') || qLower.includes('beautiful') || qLower.includes('built'))) {
    return 'person-attribute';
  }
  
  // Questions asking "what" about concepts/things
  if (qLower.includes('what is') || qLower.includes('what') || qLower.includes('which')) {
    return 'concept';
  }
  
  return 'general';
};

// Select a different but similar quiz question for the imposter (same category, same answer type AND question structure)
export const selectImposterQuizQuestion = (
  categoryId: string,
  excludeQuestionId: string,
  difficulty?: 'easy' | 'medium' | 'hard',
  normalAnswer?: string,
  normalQuestion?: string
): { question: string; answer: string } | null => {
  const { getRandomQuizQuestion, quizQuestions } = require('../data/quizQuestions');
  
  // Find the excluded question to get its details
  const excludedQ = quizQuestions.find((q: any) => q.id === excludeQuestionId);
  if (!excludedQ) {
    return null;
  }
  
  const targetAnswer = normalAnswer || excludedQ.answer;
  const targetQuestion = normalQuestion || excludedQ.question;
  const targetAnswerType = getAnswerType(targetAnswer, categoryId);
  const targetQuestionStructure = getQuestionStructure(targetQuestion);
  
  // First try: same category, same answer type, same question structure
  let availableQuestions = quizQuestions.filter((q: any) => {
    if (q.categoryId !== categoryId || q.id === excludeQuestionId) {
      return false;
    }
    const qAnswerType = getAnswerType(q.answer, q.categoryId);
    const qQuestionStructure = getQuestionStructure(q.question);
    return qAnswerType === targetAnswerType && qQuestionStructure === targetQuestionStructure;
  });
  
  if (difficulty) {
    availableQuestions = availableQuestions.filter((q: any) => q.difficulty === difficulty);
  }
  
  // Second try: same category, same answer type (relax structure requirement)
  if (availableQuestions.length === 0) {
    availableQuestions = quizQuestions.filter((q: any) => {
      if (q.categoryId !== categoryId || q.id === excludeQuestionId) {
        return false;
      }
      const qAnswerType = getAnswerType(q.answer, q.categoryId);
      return qAnswerType === targetAnswerType;
    });
    
    if (difficulty) {
      availableQuestions = availableQuestions.filter((q: any) => q.difficulty === difficulty);
    }
  }
  
  // Third try: same category only (relax both requirements)
  if (availableQuestions.length === 0) {
    availableQuestions = quizQuestions.filter((q: any) => 
      q.categoryId === categoryId && q.id !== excludeQuestionId
    );
    
    if (difficulty) {
      availableQuestions = availableQuestions.filter((q: any) => q.difficulty === difficulty);
    }
  }
  
  if (availableQuestions.length === 0) {
    // Final fallback: get any question from the category
    const fallback = getRandomQuizQuestion(categoryId, difficulty);
    if (!fallback) {
      return null;
    }
    return {
      question: fallback.question,
      answer: fallback.answer,
    };
  }
  
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  const selected = availableQuestions[randomIndex];
  
  return {
    question: selected.question,
    answer: selected.answer,
  };
};