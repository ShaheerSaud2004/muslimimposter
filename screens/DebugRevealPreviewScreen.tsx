import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { Button } from '../components/Button';
import { PlayingCard } from '../components/PlayingCard';
import { NameLogo } from '../components/NameLogo';
import { useTheme } from '../contexts/ThemeContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import * as Haptics from 'expo-haptics';
import { getResponsiveFontSize, getMinCardTextSize } from '../utils/responsive';
import { getWordDisplayParts } from '../utils/wordDisplay';
import { defaultCategories } from '../data/categories';
import { getCustomCategories } from '../utils/storage';
import { getEnglishTranslation } from '../utils/translations';
import { NavigationHeader } from '../components/NavigationHeader';
import { Category } from '../types';

type DebugRevealPreviewScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'DebugRevealPreview'
>;

type WordItem = { word: string; categoryId: string; categoryName: string };

function flattenWords(categories: Category[]): WordItem[] {
  const items: WordItem[] = [];
  for (const cat of categories) {
    const categoryName = cat.name;
    for (const word of cat.words) {
      items.push({ word, categoryId: cat.id, categoryName });
    }
  }
  return items;
}

export default function DebugRevealPreviewScreen() {
  const navigation = useNavigation<DebugRevealPreviewScreenNavigationProp>();
  const { colors } = useTheme();
  const [words, setWords] = useState<WordItem[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadWords = useCallback(async () => {
    const custom = await getCustomCategories();
    const allCategories = [...defaultCategories, ...custom];
    const flat = flattenWords(allCategories.filter(c => c.words.length > 0));
    setWords(flat);
    setIndex(prev => (prev >= flat.length ? Math.max(0, flat.length - 1) : prev));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadWords();
  }, [loadWords]);

  const current = words[index];
  const wordParts = current
    ? getWordDisplayParts(current.word, 1, 1)
    : { firstPart: '', secondPart: null, mainLines: 1, partFontSize: 1 };
  const minCardTextSize = getMinCardTextSize();
  const categoryFontSize = Math.max(getResponsiveFontSize(14), minCardTextSize);
  const wordPrefixFontSize = Math.max(getResponsiveFontSize(16), minCardTextSize);
  const translationFontSize = Math.max(getResponsiveFontSize(15), minCardTextSize);
  const isSingleWord = wordParts.secondPart == null;
  const allWords = current ? current.word.trim().split(/\s+/).filter(Boolean) : [];
  // Each word = same size as category, just a bit bigger; works on all screens
  const wordFontSize = Math.max(categoryFontSize + 6, getResponsiveFontSize(19), minCardTextSize);

  const goPrev = () => {
    if (index <= 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIndex(i => i - 1);
  };

  const goNext = () => {
    if (index >= words.length - 1) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIndex(i => i + 1);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        <PatternBackground />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading words…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (words.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
        <PatternBackground />
        <NavigationHeader showGetStarted={false} showSettings={false} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>No words in any category.</Text>
          <Button title="← Back" onPress={() => navigation.goBack()} style={styles.backButtonTop} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
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
        <Text style={[styles.counter, { color: colors.textSecondary }]}>
          Word {index + 1} of {words.length}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardContainer}>
          <Animated.View entering={FadeIn.duration(200)} key={index} style={styles.cardWrapper}>
            <PlayingCard isRevealed playerName="Preview">
              <View style={styles.cardContent}>
                <View style={styles.logoContainer}>
                  <NameLogo width={96} height={96} />
                </View>
                <Text style={[styles.playerNameOnCardText, { color: colors.text, fontSize: getResponsiveFontSize(24) }]}>Preview</Text>
                <Text style={[styles.categoryLabel, { color: colors.textSecondary, fontSize: categoryFontSize }]}>
                  Category: {current.categoryName}
                </Text>
                <Text style={[styles.wordPrefix, { color: colors.textSecondary, fontSize: wordPrefixFontSize }]}>The word is...</Text>
                <View style={styles.wordBlock}>
                  {isSingleWord ? (
                    <View style={styles.wordSingleWrap}>
                      <Text
                        style={[styles.wordText, { color: colors.text, fontSize: wordFontSize }]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.7}
                        allowFontScaling={false}
                      >
                        {wordParts.firstPart}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.wordRow}>
                      {allWords.map((w, i) => (
                        <Text key={i} style={[styles.wordText, styles.wordChunk, styles.phraseChunk, { color: colors.text, fontSize: wordFontSize, lineHeight: Math.round(wordFontSize * 1.3) }]} numberOfLines={1} allowFontScaling={false}>
                          {w}{i < allWords.length - 1 ? ' ' : ''}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
                {getEnglishTranslation(current.word) && (
                  <View style={styles.wordTranslationContainer}>
                    <Text style={[styles.wordTranslation, { color: colors.textSecondary, fontSize: translationFontSize }]}>
                      {getEnglishTranslation(current.word)}
                    </Text>
                  </View>
                )}
              </View>
            </PlayingCard>
          </Animated.View>
        </View>

        <View style={styles.navRow}>
          <Button
            title="← Prev"
            onPress={goPrev}
            style={[styles.navButton, index === 0 && styles.navButtonDisabled]}
            disabled={index === 0}
          />
          <Button
            title="Next →"
            onPress={goNext}
            style={[styles.navButton, index >= words.length - 1 && styles.navButtonDisabled]}
            disabled={index >= words.length - 1}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  loadingText: {
    ...typography.body,
    fontSize: 16,
    marginBottom: spacing.lg,
  },
  backButtonTop: {
    minWidth: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  backButton: {
    ...typography.bodyBold,
    fontSize: 16,
  },
  counter: {
    ...typography.body,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl + 96,
  },
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    minHeight: 400,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 350,
  },
  cardContent: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  playerNameOnCardText: {
    ...typography.heading,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    width: '100%',
    paddingTop: spacing.xs / 4,
    paddingBottom: spacing.xs / 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  categoryLabel: {
    ...typography.caption,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.sm,
    opacity: 0.85,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '600',
    lineHeight: 20,
  },
  wordPrefix: {
    ...typography.body,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.sm,
    opacity: 0.75,
    fontStyle: 'italic',
    fontWeight: '500',
    letterSpacing: 0.3,
    lineHeight: 22,
  },
  wordBlock: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },
  wordSingleWrap: {
    alignSelf: 'center',
    maxWidth: '100%',
    marginTop: spacing.xs,
  },
  wordRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 2,
    width: '100%',
    maxWidth: '100%',
  },
  wordChunk: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  phraseChunk: {
    marginVertical: 0,
  },
  wordText: {
    ...typography.heading,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 1,
  },
  wordSuffix: {
    marginTop: spacing.xs,
    marginBottom: 0,
  },
  wordTranslationContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  wordTranslation: {
    ...typography.caption,
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.75,
    fontStyle: 'italic',
    fontWeight: '500',
    lineHeight: 24,
    maxWidth: '100%',
    paddingHorizontal: spacing.sm,
  },
  navRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  navButton: {
    flex: 1,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
});
