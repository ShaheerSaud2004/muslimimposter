import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { showAlert } from '../components/Alert';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import { saveCustomPlaylist } from '../utils/storage';
import { defaultCategories } from '../data/categories';
import { getCustomCategories } from '../utils/storage';
import { Category } from '../types';
import * as Haptics from 'expo-haptics';
import { NavigationHeader } from '../components/NavigationHeader';

type CreatePlaylistScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CreatePlaylist'
>;
type CreatePlaylistScreenRouteProp = RouteProp<RootStackParamList, 'CreatePlaylist'>;

export default function CreatePlaylistScreen() {
  const navigation = useNavigation<CreatePlaylistScreenNavigationProp>();
  const route = useRoute<CreatePlaylistScreenRouteProp>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [playlistName, setPlaylistName] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getCustomCategories().then(custom => {
        setAvailableCategories([...defaultCategories, ...custom]);
      });
    }, [])
  );

  useEffect(() => {
    const initial = route.params?.initialCategoryIds;
    if (initial && initial.length > 0) {
      setSelectedCategoryIds(initial);
    }
  }, [route.params?.initialCategoryIds]);

  const toggleCategory = (categoryId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategoryIds(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSave = async () => {
    if (!playlistName.trim()) {
      showAlert({ title: 'Error', message: t('createPlaylist.errorName') });
      return;
    }
    if (selectedCategoryIds.length === 0) {
      showAlert({ title: 'Error', message: t('createPlaylist.errorMinCategories') });
      return;
    }

    setIsSaving(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      const newPlaylist = {
        id: `playlist-${Date.now()}`,
        name: playlistName.trim(),
        categoryIds: selectedCategoryIds,
      };
      await saveCustomPlaylist(newPlaylist);
      showAlert({
        title: 'Success',
        message: t('createPlaylist.success'),
        buttons: [{ text: 'OK', onPress: () => navigation.goBack(), style: 'default' as const }],
      });
    } catch (error) {
      showAlert({ title: 'Error', message: 'Failed to save collection. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <PatternBackground />
      <NavigationHeader showGetStarted={false} showSettings={false} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(0).springify()}>
          <Card style={styles.card}>
            <View style={styles.header}>
              <Pressable onPress={() => navigation.goBack()}>
                <Text style={[styles.backButton, { color: colors.accent }]}>
                  {t('common.back')}
                </Text>
              </Pressable>
            </View>

            <Text style={[styles.heading, { color: colors.text }]}>
              {t('createPlaylist.title')}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {t('createPlaylist.subtitle')}
            </Text>

            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text }]}>
                {t('createPlaylist.nameLabel')}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder={t('createPlaylist.namePlaceholder')}
                placeholderTextColor={colors.textSecondary}
                value={playlistName}
                onChangeText={setPlaylistName}
                maxLength={50}
              />
            </View>

            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text }]}>
                {t('createPlaylist.selectCategories')}
              </Text>
              <View style={styles.categoryList}>
                {availableCategories.map((category, index) => (
                  <Animated.View key={category.id} entering={FadeIn.delay(50 + index * 20)}>
                    <Pressable
                      onPress={() => toggleCategory(category.id)}
                      style={({ pressed }) => [
                        styles.categoryRow,
                        {
                          backgroundColor: pressed
                            ? colors.accentLight
                            : selectedCategoryIds.includes(category.id)
                            ? colors.accentLight
                            : colors.cardBackground,
                          borderColor: selectedCategoryIds.includes(category.id)
                            ? colors.accent
                            : colors.border,
                          borderWidth: selectedCategoryIds.includes(category.id) ? 2 : 1,
                        },
                      ]}
                    >
                      {selectedCategoryIds.includes(category.id) && (
                        <View style={[styles.checkIcon, { backgroundColor: colors.accent }]}>
                          <Text style={styles.checkText}>✓</Text>
                        </View>
                      )}
                      <Text
                        style={[
                          styles.categoryName,
                          {
                            color: selectedCategoryIds.includes(category.id)
                              ? colors.accent
                              : colors.text,
                            fontWeight: selectedCategoryIds.includes(category.id) ? '700' : '500',
                          },
                        ]}
                      >
                        {category.name}
                      </Text>
                    </Pressable>
                  </Animated.View>
                ))}
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title={t('createPlaylist.save')}
                onPress={handleSave}
                disabled={isSaving}
                style={styles.button}
              />
            </View>
          </Card>
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
  },
  card: {
    padding: spacing.xl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  backButton: {
    ...typography.bodyBold,
    fontSize: 16,
  },
  heading: {
    ...typography.heading,
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  section: {
    marginBottom: spacing.xl,
  },
  label: {
    ...typography.bodyBold,
    fontSize: 15,
    marginBottom: spacing.sm,
  },
  input: {
    ...typography.body,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    height: 48,
    lineHeight: 20,
  },
  categoryList: {
    gap: spacing.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  checkIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  checkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  categoryName: {
    ...typography.body,
    fontSize: 15,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
  button: {
    width: '100%',
  },
});
