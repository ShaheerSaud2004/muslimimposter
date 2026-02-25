import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Platform,
  Modal,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Constants from 'expo-constants';
import { showAlert } from '../components/Alert';
import { checkForUpdate } from '../utils/versionCheck';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import type { Locale } from '../types';
import * as Haptics from 'expo-haptics';
import { getMaxContentWidth, getResponsivePadding } from '../utils/responsive';
import { NavigationHeader } from '../components/NavigationHeader';

type SettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Settings'
>;

type SettingRowProps = {
  icon?: string;
  iconElement?: React.ReactNode;
  label: string;
  sublabel?: string;
  onPress: () => void;
  isLast?: boolean;
  colors: { text: string; textSecondary: string; border: string; accentLight: string };
};

function SettingRow({ icon, iconElement, label, sublabel, onPress, isLast, colors }: SettingRowProps) {
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
          {iconElement ?? (icon ? <Text style={styles.settingIcon}>{icon}</Text> : null)}
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

const LOCALE_OPTIONS: { value: Locale; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'العربية' },
  { value: 'ur', label: 'اردو' },
];

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { colors } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const maxWidth = getMaxContentWidth();
  const responsivePadding = getResponsivePadding();
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const handleLanguageSelect = async (selectedLocale: Locale) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setLocale(selectedLocale);
    setLanguageModalVisible(false);
  };

  const handleRateApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const appStoreUrl = Platform.select({
      ios: 'https://apps.apple.com/us/app/khafi/id6758224320',
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
    const email = 'shaheersaud2004@gmail.com';
    const subject = encodeURIComponent('Khafī App Feedback');
    const body = encodeURIComponent(`Hi,\n\nI wanted to share some feedback:\n\n`);
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    Linking.openURL(mailtoUrl).catch(() => {
      showAlert({
        title: 'Send Feedback',
        message: `Email: shaheersaud2004@gmail.com\n\nOr message me on LinkedIn!\n\nWe'd love to hear from you.`,
      });
    });
  };

  const handleCreateCategory = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('CreateCategory');
  };

  const handleCheckForUpdates = async () => {
    if (checkingUpdate) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCheckingUpdate(true);
    try {
      const result = await checkForUpdate();
      if (result.type === 'up-to-date') {
        showAlert({
          title: 'You\'re up to date',
          message: 'Khafī is running the latest version.',
          buttons: [{ text: 'OK' }],
        });
      } else if (result.type === 'update-required') {
        showAlert({
          title: 'Update required',
          message: 'A new version of Khafī is required to continue. Please update from the App Store.',
          buttons: [
            { text: 'Update', onPress: () => Linking.openURL(result.storeUrl).catch(() => {}) },
          ],
        });
      } else if (result.type === 'update-optional') {
        showAlert({
          title: 'Update available',
          message: `A new version (${result.latestVersion}) is available. Update now for the latest features.`,
          buttons: [
            { text: 'Later', style: 'cancel' },
            { text: 'Update', onPress: () => Linking.openURL(result.storeUrl).catch(() => {}) },
          ],
        });
      }
    } catch {
      showAlert({
        title: 'Check failed',
        message: 'Could not check for updates. Try again later.',
        buttons: [{ text: 'OK' }],
      });
    } finally {
      setCheckingUpdate(false);
    }
  };

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

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
          { maxWidth, alignSelf: 'center', width: '100%', paddingTop: spacing.md },
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
              <Text style={[styles.backButton, { color: colors.accent }]}>{t('common.back')}</Text>
            </Pressable>
            <Text style={[styles.title, { color: colors.text }]}>{t('settings.title')}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {t('settings.subtitle')}
            </Text>
          </View>

          <View style={[styles.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('settings.appearance')}</Text>
            <SettingRow
              iconElement={
                <Svg width={24} height={24} viewBox="0 -960 960 960" fill={colors.text}>
                  <Path d="M325-111.5q-73-31.5-127.5-86t-86-127.5Q80-398 80-480.5t31.5-155q31.5-72.5 86-127t127.5-86Q398-880 480.5-880t155 31.5q72.5 31.5 127 86t86 127Q880-563 880-480.5T848.5-325q-31.5 73-86 127.5t-127 86Q563-80 480.5-80T325-111.5ZM480-162q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z" />
                </Svg>
              }
              label={t('settings.language')}
              sublabel={LOCALE_OPTIONS.find(o => o.value === locale)?.label ?? locale}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setLanguageModalVisible(true);
              }}
              colors={colors}
            />
          </View>

          <View style={[styles.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('settings.content')}</Text>
            <SettingRow
              iconElement={
                <Svg width={24} height={24} viewBox="0 -960 960 960" fill={colors.text}>
                  <Path d="m260-520 220-360 220 360H260ZM700-80q-75 0-127.5-52.5T520-260q0-75 52.5-127.5T700-440q75 0 127.5 52.5T880-260q0 75-52.5 127.5T700-80Zm-580-20v-320h320v320H120Zm580-60q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm-500-20h160v-160H200v160Zm202-420h156l-78-126-78 126Zm78 0ZM360-340Zm340 80Z" />
                </Svg>
              }
              label={t('settings.createCustomCategory')}
              sublabel={t('settings.createCustomCategorySublabel')}
              onPress={handleCreateCategory}
              isLast
              colors={colors}
            />
          </View>

          <View style={[styles.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('settings.support')}</Text>
            <SettingRow
              iconElement={
                <Svg width={24} height={24} viewBox="0 -960 960 960" fill={colors.text}>
                  <Path d="M480-120q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q82 0 155.5 35T760-706v-94h80v240H600v-80h110q-41-56-101-88t-129-32q-117 0-198.5 81.5T200-480q0 117 81.5 198.5T480-200q105 0 183.5-68T756-440h82q-15 137-117.5 228.5T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z" />
                </Svg>
              }
              label={t('settings.checkUpdates')}
              sublabel={checkingUpdate ? 'Checking…' : t('settings.checkUpdatesSublabel')}
              onPress={handleCheckForUpdates}
              colors={colors}
            />
            <SettingRow
              iconElement={
                <Svg width={24} height={24} viewBox="0 -960 960 960" fill={colors.text}>
                  <Path d="M852-212 732-332l56-56 120 120-56 56ZM708-692l-56-56 120-120 56 56-120 120Zm-456 0L132-812l56-56 120 120-56 56ZM108-212l-56-56 120-120 56 56-120 120Zm246-75 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-361Z" />
                </Svg>
              }
              label={t('settings.rateApp')}
              sublabel={t('settings.rateAppSublabel')}
              onPress={handleRateApp}
              colors={colors}
            />
            <SettingRow
              iconElement={
                <Svg width={24} height={24} viewBox="0 -960 960 960" fill={colors.text}>
                  <Path d="M640-200v80q0 17-11.5 28.5T600-80H120q-17 0-28.5-11.5T80-120v-320q0-17 11.5-28.5T120-480h120v-160q0-100 70-170t170-70h160q100 0 170 70t70 170v560h-80v-120H640Zm0-80h160v-360q0-66-47-113t-113-47H480q-66 0-113 47t-47 113v160h280q17 0 28.5 11.5T640-440v160ZM400-560v-80h320v80H400Zm-40 274 200-114H160l200 114Zm0 70L160-330v170h400v-170L360-216ZM160-400v240-240Z" />
                </Svg>
              }
              label={t('settings.feedback')}
              sublabel={t('settings.feedbackSublabel')}
              onPress={handleSendFeedback}
              colors={colors}
            />
            <SettingRow
              iconElement={
                <Svg width={24} height={24} viewBox="0 -960 960 960" fill={colors.text}>
                  <Path d="M480-320q102-92 131-129.5t29-74.5q0-36-26-62t-62-26q-21 0-40.5 8.5T480-580q-12-15-31-23.5t-41-8.5q-36 0-62 26t-26 62q0 19 5 35t22 37.5q17 21.5 48.5 52.5t84.5 79Zm0 240q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z" />
                </Svg>
              }
              label={t('settings.privacy')}
              sublabel={t('settings.privacySublabel')}
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
                  {t('settings.firstIteration')}
                </Text>
                <Text style={[styles.infoMessage, { color: colors.textSecondary }]}>
                  {t('settings.firstIterationMessage')}
                </Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(500)} style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Khafī · خفي
            </Text>
            <Text style={[styles.footerVersion, { color: colors.textSecondary }]}>
              v{appVersion}
            </Text>
          </Animated.View>
        </Animated.View>
      </ScrollView>

      <Modal
        visible={languageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <Pressable
          style={styles.themeModalOverlay}
          onPress={() => setLanguageModalVisible(false)}
        >
          <View style={[styles.themeModalContent, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.themeModalTitle, { color: colors.text }]}>{t('settings.language')}</Text>
            {LOCALE_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => handleLanguageSelect(opt.value)}
                style={[
                  styles.themeOption,
                  { borderColor: colors.border },
                  locale === opt.value && { backgroundColor: colors.accentLight, borderColor: colors.accent },
                ]}
              >
                <Text style={[styles.themeOptionLabel, { color: colors.text }]}>{opt.label}</Text>
                {locale === opt.value && (
                  <Text style={[styles.themeOptionCheck, { color: colors.accent }]}>✓</Text>
                )}
              </Pressable>
            ))}
            <Pressable
              onPress={() => setLanguageModalVisible(false)}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <Text style={[styles.themeModalCancel, { color: colors.textSecondary }]}>{t('settings.cancel')}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
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
  themeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  themeModalContent: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.lg,
  },
  themeModalTitle: {
    ...typography.heading,
    fontSize: 20,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  themeOptionLabel: {
    ...typography.body,
    fontWeight: '500',
  },
  themeOptionCheck: {
    fontSize: 18,
    fontWeight: '700',
  },
  themeModalCancel: {
    ...typography.body,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
