import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { showAlert } from '../components/Alert';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTheme } from '../contexts/ThemeContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import { saveCustomCategory } from '../utils/storage';
import { Category } from '../types';
import * as Haptics from 'expo-haptics';

type CreateCategoryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CreateCategory'
>;

export default function CreateCategoryScreen() {
  const navigation = useNavigation<CreateCategoryScreenNavigationProp>();
  const { colors } = useTheme();
  
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [words, setWords] = useState<string[]>(['']);
  const [isSaving, setIsSaving] = useState(false);

  const addWordField = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setWords([...words, '']);
  };

  const removeWordField = (index: number) => {
    if (words.length > 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const newWords = words.filter((_, i) => i !== index);
      setWords(newWords);
    }
  };

  const updateWord = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);
  };

  const handleSave = async () => {
    if (!categoryName.trim()) {
      showAlert({ title: 'Error', message: 'Please enter a category name.' });
      return;
    }

    if (!description.trim()) {
      showAlert({ title: 'Error', message: 'Please enter a category description.' });
      return;
    }

    const validWords = words.filter(w => w.trim().length > 0);
    if (validWords.length < 3) {
      showAlert({ title: 'Error', message: 'Please add at least 3 words to your category.' });
      return;
    }

    setIsSaving(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      const newCategory: Category = {
        id: `custom-${Date.now()}`,
        name: categoryName.trim(),
        description: description.trim(),
        words: validWords.map(w => w.trim()),
        locked: false,
        isCustom: true,
      };

      await saveCustomCategory(newCategory);
      
      showAlert({
        title: 'Success!',
        message: 'Your custom category has been created and saved.',
        buttons: [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
            style: 'default',
          },
        ],
      });
    } catch (error) {
      showAlert({ title: 'Error', message: 'Failed to save category. Please try again.' });
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <PatternBackground />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(0).springify()}>
          <Card style={styles.card}>
            <View style={styles.header}>
              <Pressable onPress={() => navigation.goBack()}>
                <Text style={[styles.backButton, { color: colors.accent }]}>
                  ← Back
                </Text>
              </Pressable>
            </View>

            <Text style={[styles.heading, { color: colors.text }]}>
              Create Custom Category
            </Text>
            <Text
              style={[styles.subtitle, { color: colors.textSecondary }]}
            >
              Add your own category with custom words for personalized gameplay
            </Text>

            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text }]}>
                Category Name *
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
                placeholder="e.g., My Family Traditions"
                placeholderTextColor={colors.textSecondary}
                value={categoryName}
                onChangeText={setCategoryName}
                maxLength={50}
              />
            </View>

            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text }]}>
                Description *
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Brief description of this category..."
                placeholderTextColor={colors.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                maxLength={150}
              />
            </View>

            <View style={styles.section}>
              <View style={styles.wordsHeader}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Words (Minimum 3) *
                </Text>
              </View>
              
              {words.map((word, index) => (
                <View key={index} style={styles.wordRow}>
                  <TextInput
                    style={[
                      styles.wordInput,
                      {
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    placeholder={`Word ${index + 1}`}
                    placeholderTextColor={colors.textSecondary}
                    value={word}
                    onChangeText={(value) => updateWord(index, value)}
                    maxLength={30}
                  />
                  {words.length > 1 && (
                    <Pressable
                      onPress={() => removeWordField(index)}
                      style={({ pressed }) => [
                        styles.removeButton,
                        {
                          backgroundColor: colors.imposter + '20',
                          opacity: pressed ? 0.6 : 1,
                        },
                      ]}
                    >
                      <Text style={[styles.removeButtonText, { color: colors.imposter }]}>
                        ×
                      </Text>
                    </Pressable>
                  )}
                </View>
              ))}

              <Pressable
                onPress={addWordField}
                style={({ pressed }) => [
                  styles.addButton,
                  {
                    backgroundColor: pressed ? colors.accentLight : colors.border,
                    borderColor: colors.accent,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text style={[styles.addButtonText, { color: colors.accent }]}>
                  + Add Word
                </Text>
              </Pressable>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title={isSaving ? 'Saving...' : 'Save Category'}
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
    padding: spacing.md,
    fontSize: 16,
  },
  textArea: {
    ...typography.body,
    borderWidth: 2,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  wordsHeader: {
    marginBottom: spacing.sm,
  },
  wordRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  wordInput: {
    ...typography.body,
    borderWidth: 2,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 16,
    flex: 1,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 24,
  },
  addButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  addButtonText: {
    ...typography.bodyBold,
    fontSize: 15,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
  button: {
    width: '100%',
  },
});
