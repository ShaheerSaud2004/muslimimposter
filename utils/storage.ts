import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, Category } from '../types';

const STORAGE_KEYS = {
  SETTINGS: '@khafi:settings',
  UNLOCKED_CATEGORIES: '@khafi:unlocked',
  CUSTOM_CATEGORIES: '@khafi:custom',
  USED_WORDS: '@khafi:used_words',
  GAME_RESULTS: '@khafi:game_results',
};

export const saveSettings = async (settings: Partial<AppSettings>): Promise<void> => {
  try {
    const existing = await getSettings();
    const updated = { ...existing, ...settings };
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const getSettings = async (): Promise<AppSettings> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  
  return {
    theme: 'dark', // Warm Majlis - default theme
    unlockedCategories: [],
    customCategories: [],
  };
};

export const saveCustomCategory = async (category: Category): Promise<void> => {
  try {
    const categories = await getCustomCategories();
    const updated = categories.filter(c => c.id !== category.id);
    updated.push(category);
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving custom category:', error);
  }
};

export const getCustomCategories = async (): Promise<Category[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_CATEGORIES);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading custom categories:', error);
  }
  return [];
};

export const deleteCustomCategory = async (categoryId: string): Promise<void> => {
  try {
    const categories = await getCustomCategories();
    const updated = categories.filter(c => c.id !== categoryId);
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting custom category:', error);
  }
};

export const unlockCategory = async (categoryId: string): Promise<void> => {
  try {
    const unlocked = await getUnlockedCategories();
    if (!unlocked.includes(categoryId)) {
      unlocked.push(categoryId);
      await AsyncStorage.setItem(STORAGE_KEYS.UNLOCKED_CATEGORIES, JSON.stringify(unlocked));
    }
  } catch (error) {
    console.error('Error unlocking category:', error);
  }
};

export const getUnlockedCategories = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.UNLOCKED_CATEGORIES);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading unlocked categories:', error);
  }
  return [];
};

// Track used words to prevent repetition
export const addUsedWord = async (word: string): Promise<void> => {
  try {
    const usedWords = await getUsedWords();
    if (!usedWords.includes(word)) {
      usedWords.push(word);
      await AsyncStorage.setItem(STORAGE_KEYS.USED_WORDS, JSON.stringify(usedWords));
    }
  } catch (error) {
    console.error('Error saving used word:', error);
  }
};

export const getUsedWords = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USED_WORDS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading used words:', error);
  }
  return [];
};

export const clearUsedWords = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USED_WORDS);
  } catch (error) {
    console.error('Error clearing used words:', error);
  }
};

// Session-only: used quiz question IDs (cleared on New Game so we don't repeat in same session)
let sessionUsedQuestionIds: string[] = [];

export const getSessionUsedQuestionIds = (): string[] => [...sessionUsedQuestionIds];

export const addSessionUsedQuestionId = (id: string): void => {
  if (!sessionUsedQuestionIds.includes(id)) {
    sessionUsedQuestionIds.push(id);
  }
};

export const clearSessionUsedQuestionIds = (): void => {
  sessionUsedQuestionIds = [];
};

// Game results tracking
export interface GameResult {
  word: string;
  category: string;
  wasCorrect: boolean;
  timestamp: number;
  numPlayers: number;
  numImposters: number;
  mode: 'word' | 'question' | 'quiz';
}

export const saveGameResult = async (result: GameResult): Promise<void> => {
  try {
    const results = await getGameResults();
    results.push(result);
    await AsyncStorage.setItem(STORAGE_KEYS.GAME_RESULTS, JSON.stringify(results));
  } catch (error) {
    console.error('Error saving game result:', error);
  }
};

export const getGameResults = async (): Promise<GameResult[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.GAME_RESULTS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading game results:', error);
  }
  return [];
};

export const clearGameResults = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.GAME_RESULTS);
  } catch (error) {
    console.error('Error clearing game results:', error);
  }
};
