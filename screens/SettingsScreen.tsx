import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import { showAlert } from '../components/Alert';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { useTheme } from '../contexts/ThemeContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import * as Haptics from 'expo-haptics';
import { getMaxContentWidth, getResponsivePadding } from '../utils/responsive';

type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Settings'
>;

type SettingRowProps = {
  icon: string;
  label: string;
  sublabel?: string;
  onPress: () => void;
  isLast?: boolean;
  colors: { text: string; textSecondary: string; border: string; accentLight: string };
};

function SettingRow({ icon, label, sublabel, onPress, isLast, colors }: SettingRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingRow,
        {
          backgroundColor: pressed ? colors.accentLight : 'transparent',
          borderBottomColor: colors.border,
          borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <View style={styles.settingRowLeft}>
        <View style={[styles.settingIconWrap, { backgroundColor: colors.accentLight }]}>
          <Text style={styles.settingIcon}>{icon}</Text>
        </View>
        <View>
          <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
          {sublabel ? (
            <Text style={[styles.settingSublabel, { color: colors.textSecondary }]} numberOfLines={1}>
              {sublabel}
            </Text>
          ) : null}
        </View>
      </View>
      <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { colors } = useTheme();
  const maxWidth = getMaxContentWidth();
  const responsivePadding = getResponsivePadding();

  const handleRateApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const appStoreUrl = Platform.select({
      ios: 'https://apps.apple.com/app/id1234567890',
      default: '',
    });
    if (appStoreUrl) {
      Linking.openURL(appStoreUrl).catch(() => {
        showAlert({ title: 'Error', message: 'Unable to open the app store. Please rate us manually!' });
      });
    } else {
      showAlert({
        title: 'Rate Khafī',
        message: "Thank you for wanting to rate us! The app isn't on the stores yet, but we appreciate your support!",
      });
    }
  };

  const handleSendFeedback = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const email = 'support@khafi.app';
    const subject = encodeURIComponent('Khafī App Feedback');
    const body = encodeURIComponent(`Hi Khafī Team,\n\nI wanted to share some feedback:\n\n`);
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    Linking.openURL(mailtoUrl).catch(() => {
      showAlert({
        title: 'Send Feedback',
        message: `Email us at:\n\n${email}\n\nWe'd love to hear from you!`,
      });
    });
  };

  const handleCreateCategory = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('CreateCategory');
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <PatternBackground />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { maxWidth, alignSelf: 'center', width: '100%' },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(0).springify()}>
          <View style={styles.header}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.goBack();
              }}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <Text style={[styles.backButton, { color: colors.accent }]}>← Back</Text>
            </Pressable>
            <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              App preferences & support
            </Text>
          </View>

          <View style={[styles.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>CONTENT</Text>
            <SettingRow
              icon="📁"
              label="Create Custom Category"
              sublabel="Add your own word lists"
              onPress={handleCreateCategory}
              isLast
              colors={colors}
            />
          </View>

          <View style={[styles.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>SUPPORT</Text>
            <SettingRow
              icon="⭐"
              label="Rate Khafī"
              sublabel="Leave a review"
              onPress={handleRateApp}
              colors={colors}
            />
            <SettingRow
              icon="✉️"
              label="Send feedback"
              sublabel="We read every message"
              onPress={handleSendFeedback}
              colors={colors}
            />
            <SettingRow
              icon="🔒"
              label="Privacy Policy"
              sublabel="How we handle your data"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                const privacyUrl = 'https://shaheersaud2004.github.io/push/privacy-policy.html';
                Linking.openURL(privacyUrl).catch(() => {
                  showAlert({
                    title: 'Privacy Policy',
                    message: 'Our privacy policy explains how we collect, use, and protect your data.\n\nWe do not collect, store, or share any personal data. All game data is stored locally on your device.\n\nFor the full privacy policy, visit:\nhttps://shaheersaud2004.github.io/push/privacy-policy.html',
                  });
                });
              }}
              isLast
              colors={colors}
            />
          </View>

          <Animated.View entering={FadeIn.delay(400)} style={[styles.infoSection, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <View style={styles.infoContent}>
              <Text style={[styles.infoIcon, { color: colors.accent }]}>✨</Text>
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoTitle, { color: colors.text }]}>
                  First Iteration
                </Text>
                <Text style={[styles.infoMessage, { color: colors.textSecondary }]}>
                  This is the first version of Khafī. New features and improvements will be added soon!
                </Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(500)} style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Khafī · خفي
            </Text>
            <Text style={[styles.footerVersion, { color: colors.textSecondary }]}>
              v1.0.0
            </Text>
          </Animated.View>
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
    marginBottom: spacing.sm, // Increased spacing for better hierarchy
    fontWeight: '600', // Ensure consistent weight
  },
  subtitle: {
    ...typography.body,
    fontSize: 15,
    opacity: 0.85,
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  settingIconWrap: {
    width: 44, // iOS accessibility minimum
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  settingIcon: {
    fontSize: 20,
  },
  settingLabel: {
    ...typography.bodyBold,
    fontSize: 16,
    fontWeight: '600', // Ensure consistent weight
  },
  settingSublabel: {
    ...typography.caption,
    fontSize: 13,
    marginTop: 2,
    opacity: 0.85,
  },
  settingArrow: {
    fontSize: 22,
    fontWeight: '300',
    marginLeft: spacing.sm,
  },
  infoSection: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  infoIcon: {
    fontSize: 24,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    ...typography.bodyBold,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  infoMessage: {
    ...typography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.caption,
    fontSize: 14,
  },
  footerVersion: {
    ...typography.caption,
    fontSize: 12,
    marginTop: spacing.xs,
    opacity: 0.7,
  },
});
