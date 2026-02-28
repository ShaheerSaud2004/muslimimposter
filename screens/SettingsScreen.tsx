import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { RootStackParamList } from '../App';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useVersionCheck } from '../contexts/VersionCheckContext';
import { PatternBackground } from '../components/PatternBackground';
import { typography, spacing } from '../theme';
import type { Theme } from '../theme';
import type { Locale, DiscussionTimePreset } from '../types';
import * as Haptics from 'expo-haptics';
import { getMaxContentWidth, getResponsivePadding, getResponsiveFontSize } from '../utils/responsive';
import { getCustomCategories, deleteCustomCategory, getSettings, saveSettings } from '../utils/storage';
import { NavigationHeader } from '../components/NavigationHeader';
import { AnimatedSwitch } from '../components/AnimatedSwitch';
import { useHaptics } from '../contexts/HapticsContext';

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
  labelFontSize?: number;
  sublabelFontSize?: number;
};

function SettingRow({ icon, iconElement, label, sublabel, onPress, isLast, colors, labelFontSize, sublabelFontSize }: SettingRowProps) {
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
          <Text style={[styles.settingLabel, { color: colors.text }, labelFontSize != null && { fontSize: labelFontSize }]}>{label}</Text>
          {sublabel ? (
            <Text style={[styles.settingSublabel, { color: colors.textSecondary }, sublabelFontSize != null && { fontSize: sublabelFontSize }]} numberOfLines={1}>
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

const THEME_OPTIONS: { value: Theme; labelKey: string }[] = [
  { value: 'soft', labelKey: 'settings.themeSoft' },
  { value: 'paper', labelKey: 'settings.themePaper' },
  { value: 'dark', labelKey: 'settings.themeDark' },
  { value: 'ramadan', labelKey: 'settings.themeRamadan' },
];

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { colors, theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const { setSimulateUpdateRequired } = useVersionCheck();
  const { hapticsEnabled, soundEnabled, setHapticsEnabled, setSoundEnabled, triggerImpact } = useHaptics();
  const maxWidth = getMaxContentWidth();
  const responsivePadding = getResponsivePadding();
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [discussionTimeModalVisible, setDiscussionTimeModalVisible] = useState(false);
  const [discussionTimePreset, setDiscussionTimePreset] = useState<DiscussionTimePreset | undefined>(undefined);
  const [debugMenuVisible, setDebugMenuVisible] = useState(false);
  const [customCategories, setCustomCategories] = useState<{ id: string; name: string }[]>([]);
  const firstIterationTapCount = useRef(0);
  const firstIterationTapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const settingLabelSize = getResponsiveFontSize(17);
  const settingSublabelSize = getResponsiveFontSize(14);

  useEffect(() => {
    getCustomCategories().then(cats => setCustomCategories(cats.map(c => ({ id: c.id, name: c.name }))));
  }, []);

  useEffect(() => {
    getSettings().then(s => setDiscussionTimePreset(s.discussionTimePreset));
  }, []);

  useFocusEffect(
    useCallback(() => {
      getCustomCategories().then(cats => setCustomCategories(cats.map(c => ({ id: c.id, name: c.name }))));
    }, [])
  );

  const handleFirstIterationPress = () => {
    firstIterationTapCount.current += 1;
    if (firstIterationTapTimeout.current) clearTimeout(firstIterationTapTimeout.current);
    if (firstIterationTapCount.current >= 5) {
      firstIterationTapCount.current = 0;
      triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
      setDebugMenuVisible(true);
      return;
    }
    firstIterationTapTimeout.current = setTimeout(() => {
      firstIterationTapCount.current = 0;
      firstIterationTapTimeout.current = null;
    }, 1500);
  };

  const handlePreviewCardReveal = () => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
    setDebugMenuVisible(false);
    navigation.navigate('DebugRevealPreview');
  };

  const handlePreviewAchievementPopup = () => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
    setDebugMenuVisible(false);
    navigation.navigate('DebugAchievementPopup');
  };

  const handleThemeSelect = async (selectedTheme: Theme) => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Light);
    await setTheme(selectedTheme);
    setThemeModalVisible(false);
  };

  const handleLanguageSelect = async (selectedLocale: Locale) => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Light);
    await setLocale(selectedLocale);
    setLanguageModalVisible(false);
  };

  const DISCUSSION_TIME_OPTIONS: { value: DiscussionTimePreset | undefined; labelKey: string }[] = [
    { value: undefined, labelKey: 'settings.discussionTimeAuto' },
    { value: 'short', labelKey: 'settings.discussionTimeShort' },
    { value: 'medium', labelKey: 'settings.discussionTimeMedium' },
    { value: 'long', labelKey: 'settings.discussionTimeLong' },
  ];

  const handleDiscussionTimeSelect = async (preset: DiscussionTimePreset | undefined) => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Light);
    setDiscussionTimePreset(preset);
    await saveSettings({ discussionTimePreset: preset ?? undefined });
    setDiscussionTimeModalVisible(false);
  };

  const handleShowTutorialAgain = () => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('HowToPlay');
  };

  const handleRateApp = () => {
    triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
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
    triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
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
    triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('CreateCategory');
  };

  const handleCheckForUpdates = async () => {
    if (checkingUpdate) return;
    triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
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
                triggerImpact(Haptics.ImpactFeedbackStyle.Light);
                navigation.goBack();
              }}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <Text style={[styles.backButton, { color: colors.accent, fontSize: getResponsiveFontSize(16) }]}>{t('common.back')}</Text>
            </Pressable>
            <Text style={[styles.title, { color: colors.text, fontSize: getResponsiveFontSize(28) }]}>{t('settings.title')}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: getResponsiveFontSize(15) }]}>
              {t('settings.subtitle')}
            </Text>
          </View>

          <View style={[styles.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: getResponsiveFontSize(12) }]}>{t('settings.appearance')}</Text>
            <SettingRow
              iconElement={
                <Svg width={24} height={24} viewBox="0 -960 960 960" fill={colors.text}>
                  <Path d="M346-140 100-386q-10-10-15-22t-5-25q0-13 5-25t15-22l230-229-106-106 62-65 400 400q10 10 14.5 22t4.5 25q0 13-4.5 25T686-386L440-140q-10 10-22 15t-25 5q-13 0-25-5t-22-15Zm47-506L179-432h428L393-646Zm399 526q-36 0-61-25.5T706-208q0-27 13.5-51t30.5-47l42-54 44 54q16 23 30 47t14 51q0 37-26 62.5T792-120Z" />
                </Svg>
              }
              label={t('settings.theme')}
              sublabel={t((THEME_OPTIONS.find(o => o.value === theme) ?? THEME_OPTIONS[0]).labelKey)}
              labelFontSize={settingLabelSize}
              sublabelFontSize={settingSublabelSize}
              onPress={() => {
                triggerImpact(Haptics.ImpactFeedbackStyle.Light);
                setThemeModalVisible(true);
              }}
              colors={colors}
            />
            <SettingRow
              iconElement={
                <Svg width={24} height={24} viewBox="0 -960 960 960" fill={colors.text}>
                  <Path d="M325-111.5q-73-31.5-127.5-86t-86-127.5Q80-398 80-480.5t31.5-155q31.5-72.5 86-127t127.5-86Q398-880 480.5-880t155 31.5q72.5 31.5 127 86t86 127Q880-563 880-480.5T848.5-325q-31.5 73-86 127.5t-127 86Q563-80 480.5-80T325-111.5ZM480-162q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z" />
                </Svg>
              }
              label={t('settings.language')}
              sublabel={LOCALE_OPTIONS.find(o => o.value === locale)?.label ?? locale}
              labelFontSize={settingLabelSize}
              sublabelFontSize={settingSublabelSize}
              onPress={() => {
                triggerImpact(Haptics.ImpactFeedbackStyle.Light);
                setLanguageModalVisible(true);
              }}
              colors={colors}
            />
            <View style={[styles.settingRow, { borderBottomWidth: 0, borderBottomColor: colors.border }]}>
              <View style={styles.settingRowLeft}>
                <View style={[styles.settingIconWrap, { backgroundColor: colors.accentLight }]}>
                  <Svg width={24} height={24} viewBox="0 -960 960 960" fill={colors.text}>
                    <Path d="M320-120q-33 0-56.5-23.5T240-200v-560q0-33 23.5-56.5T320-840h320q33 0 56.5 23.5T720-760v560q0 33-23.5 56.5T640-120H320Zm320-80v-560H320v560h320ZM508.5-651.5Q520-663 520-680t-11.5-28.5Q497-720 480-720t-28.5 11.5Q440-697 440-680t11.5 28.5Q463-640 480-640t28.5-11.5ZM0-360v-240h80v240H0Zm120 80v-400h80v400h-80Zm760-80v-240h80v240h-80Zm-120 80v-400h80v400h-80Zm-440 80v-560 560Z" />
                  </Svg>
                </View>
                <View>
                  <Text style={[styles.settingLabel, { color: colors.text, fontSize: settingLabelSize }]}>{t('settingsExtra.haptics')}</Text>
                  <Text style={[styles.settingSublabel, { color: colors.textSecondary, fontSize: settingSublabelSize }]} numberOfLines={1}>
                    {t('settingsExtra.hapticsSublabel')}
                  </Text>
                </View>
              </View>
              <View style={styles.settingSwitchWrap}>
                <AnimatedSwitch
                  value={hapticsEnabled}
                  onValueChange={(v) => { triggerImpact(Haptics.ImpactFeedbackStyle.Light); setHapticsEnabled(v); }}
                  trackColor={{ false: colors.border, true: colors.accentLight }}
                  thumbColor={{ false: colors.textSecondary, true: '#FFFFFF' }}
                />
              </View>
            </View>
            <View style={[styles.settingRow, { borderBottomWidth: 0, borderBottomColor: colors.border }]}>
              <View style={styles.settingRowLeft}>
                <View style={[styles.settingIconWrap, { backgroundColor: colors.accentLight }]}>
                  <Svg width={24} height={24} viewBox="0 -960 960 960" fill={colors.text}>
                    <Path d="M709-255H482L369-142q-23 23-56.5 23T256-142L143-255q-23-23-23-57t23-57l112-112v-227l454 453Zm-193-80L335-516v68L199-312l113 113 136-136h68ZM289-785q107-68 231.5-54.5T735-736q90 90 103.5 214.5T784-290l-58-58q45-82 31.5-173.5T678-679q-66-66-157.5-79.5T347-727l-58-58Zm118 118q57-17 115-7t100 52q42 42 51.5 99.5T666-408l-68-68q0-25-7.5-48.5T566-565q-18-18-41.5-26t-49.5-8l-68-68Zm-49 309Z" />
                  </Svg>
                </View>
                <View>
                  <Text style={[styles.settingLabel, { color: colors.text, fontSize: settingLabelSize }]}>{t('settingsExtra.sound')}</Text>
                  <Text style={[styles.settingSublabel, { color: colors.textSecondary, fontSize: settingSublabelSize }]} numberOfLines={1}>
                    {t('settingsExtra.soundSublabel')}
                  </Text>
                </View>
              </View>
              <View style={styles.settingSwitchWrap}>
                <AnimatedSwitch
                  value={soundEnabled}
                  onValueChange={(v) => { triggerImpact(Haptics.ImpactFeedbackStyle.Light); setSoundEnabled(v); }}
                  trackColor={{ false: colors.border, true: colors.accentLight }}
                  thumbColor={{ false: colors.textSecondary, true: '#FFFFFF' }}
                />
              </View>
            </View>
          </View>

          <View style={[styles.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: getResponsiveFontSize(12) }]}>{t('settings.content')}</Text>
            <SettingRow
              iconElement={
                <Svg width={24} height={24} viewBox="0 -960 960 960" fill={colors.text}>
                  <Path d="m260-520 220-360 220 360H260ZM700-80q-75 0-127.5-52.5T520-260q0-75 52.5-127.5T700-440q75 0 127.5 52.5T880-260q0 75-52.5 127.5T700-80Zm-580-20v-320h320v320H120Zm580-60q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm-500-20h160v-160H200v160Zm202-420h156l-78-126-78 126Zm78 0ZM360-340Zm340 80Z" />
                </Svg>
              }
              label={t('settings.createCustomCategory')}
              sublabel={t('settings.createCustomCategorySublabel')}
              labelFontSize={settingLabelSize}
              sublabelFontSize={settingSublabelSize}
              onPress={handleCreateCategory}
              colors={colors}
            />
            {customCategories.length === 0 && (
              <View style={[styles.emptyStateWrap, { borderTopColor: colors.border }]}>
                <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                  {t('settingsExtra.noCustomCategoriesYet')}
                </Text>
              </View>
            )}
            {customCategories.length > 0 && customCategories.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => {
                  showAlert({
                    title: t('settings.deleteCategoryTitle'),
                    message: t('settings.deleteCategoryMessage').replace('{{name}}', cat.name),
                    buttons: [
                      { text: t('settings.cancel'), style: 'cancel' as const },
                      {
                        text: t('settings.delete'),
                        style: 'destructive' as const,
                        onPress: async () => {
                          await deleteCustomCategory(cat.id);
                          const cats = await getCustomCategories();
                          setCustomCategories(cats.map(c => ({ id: c.id, name: c.name })));
                        },
                      },
                    ],
                  });
                }}
                style={[styles.settingRow, { borderBottomColor: colors.border }]}
              >
                <View style={styles.settingRowLeft}>
                  <Text style={[styles.settingLabel, { color: colors.text }]} numberOfLines={1}>{cat.name}</Text>
                </View>
                <View style={[styles.settingIconWrap, { backgroundColor: colors.accentLight }]}>
                  <Svg width={20} height={20} viewBox="0 -960 960 960" fill={colors.text}>
                    <Path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360Z" />
                  </Svg>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={[styles.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: getResponsiveFontSize(12) }]}>{t('settings.game')}</Text>
            <SettingRow
              iconElement={
                <Svg width={24} height={24} viewBox="0 -960 960 960" fill={colors.text}>
                  <Path d="M154.5-534.5Q140-549 140-570t14.5-35.5Q169-620 190-620t35.5 14.5Q240-591 240-570t-14.5 35.5Q211-520 190-520t-35.5-14.5Zm580 0Q720-549 720-570t14.5-35.5Q749-620 770-620t35.5 14.5Q820-591 820-570t-14.5 35.5Q791-520 770-520t-35.5-14.5ZM40-440Zm880 0ZM160-80H80v-160h160q-66 0-113-47T80-400h80q0 33 23.5 56.5T240-320v-120h108l-38-155q-23-92-98.5-148.5T40-800v-80q123 0 220.5 73T387-615l52 205q5 19-7 34.5T400-360h-80v120q0 33-23.5 56.5T240-160h-80v80Zm720 0h-80v-80h-80q-33 0-56.5-23.5T640-240v-120h-80q-20 0-32-16t-6-36l51-203q32-115 127-190t220-75v80q-95 0-170.5 57T651-595l-39 155h108v120q33 0 56.5-23.5T800-400h80q0 66-47 113t-113 47h160v160ZM320-240v-80 80Zm320 0v-80 80Z" />
                </Svg>
              }
              label={t('settings.discussionTime')}
              sublabel={t(DISCUSSION_TIME_OPTIONS.find(o => o.value === discussionTimePreset)?.labelKey ?? 'settings.discussionTimeAuto')}
              labelFontSize={settingLabelSize}
              sublabelFontSize={settingSublabelSize}
              onPress={() => {
                triggerImpact(Haptics.ImpactFeedbackStyle.Light);
                setDiscussionTimeModalVisible(true);
              }}
              colors={colors}
            />
            <SettingRow
              iconElement={
                <Svg width={24} height={24} viewBox="0 -960 960 960" fill={colors.text}>
                  <Path d="M200-80v-800h80v80h560l-80 200 80 200H280v320h-80Zm80-640v240-240Zm276.5 176.5Q580-567 580-600t-23.5-56.5Q533-680 500-680t-56.5 23.5Q420-633 420-600t23.5 56.5Q467-520 500-520t56.5-23.5ZM280-480h442l-48-120 48-120H280v240Z" />
                </Svg>
              }
              label={t('settings.showTutorialAgain')}
              sublabel={t('settings.showTutorialAgainSublabel')}
              labelFontSize={settingLabelSize}
              sublabelFontSize={settingSublabelSize}
              onPress={handleShowTutorialAgain}
              colors={colors}
            />
          </View>

          <View style={[styles.section, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: getResponsiveFontSize(12) }]}>{t('settings.support')}</Text>
            <SettingRow
              iconElement={
                <Svg width={24} height={24} viewBox="0 -960 960 960" fill={colors.text}>
                  <Path d="M480-120q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q82 0 155.5 35T760-706v-94h80v240H600v-80h110q-41-56-101-88t-129-32q-117 0-198.5 81.5T200-480q0 117 81.5 198.5T480-200q105 0 183.5-68T756-440h82q-15 137-117.5 228.5T480-120Zm112-192L440-464v-216h80v184l128 128-56 56Z" />
                </Svg>
              }
              label={t('settings.checkUpdates')}
              sublabel={checkingUpdate ? t('settingsExtra.checking') : t('settings.checkUpdatesSublabel')}
              labelFontSize={settingLabelSize}
              sublabelFontSize={settingSublabelSize}
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
              labelFontSize={settingLabelSize}
              sublabelFontSize={settingSublabelSize}
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
              labelFontSize={settingLabelSize}
              sublabelFontSize={settingSublabelSize}
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
              labelFontSize={settingLabelSize}
              sublabelFontSize={settingSublabelSize}
              onPress={() => {
                triggerImpact(Haptics.ImpactFeedbackStyle.Medium);
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

          <Pressable onPress={handleFirstIterationPress}>
            <Animated.View entering={FadeIn.delay(400)} style={[styles.infoSection, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
              <View style={styles.infoContent}>
                <Text style={[styles.infoIcon, { color: colors.accent }]}>✨</Text>
                <View style={styles.infoTextContainer}>
                  <Text style={[styles.infoTitle, { color: colors.text, fontSize: getResponsiveFontSize(17) }]}>
                    {t('settings.firstIteration')}
                  </Text>
                  <Text style={[styles.infoMessage, { color: colors.textSecondary, fontSize: getResponsiveFontSize(14) }]}>
                    {t('settings.firstIterationMessage')}
                  </Text>
                </View>
              </View>
            </Animated.View>
          </Pressable>

          <Animated.View entering={FadeIn.delay(500)} style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary, fontSize: getResponsiveFontSize(15) }]}>
              Khafī · خفي
            </Text>
            <Text style={[styles.footerVersion, { color: colors.textSecondary, fontSize: getResponsiveFontSize(13) }]}>
              v{appVersion}
            </Text>
          </Animated.View>
        </Animated.View>
      </ScrollView>

      <Modal
        visible={themeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <Pressable
          style={styles.themeModalOverlay}
          onPress={() => setThemeModalVisible(false)}
        >
          <View style={[styles.themeModalContent, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.themeModalTitle, { color: colors.text }]}>{t('settings.theme')}</Text>
            {THEME_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => handleThemeSelect(opt.value)}
                style={[
                  styles.themeOption,
                  { borderColor: colors.border },
                  theme === opt.value && { backgroundColor: colors.accentLight, borderColor: colors.accent },
                ]}
              >
                <Text style={[styles.themeOptionLabel, { color: colors.text }]}>{t(opt.labelKey)}</Text>
                {theme === opt.value && (
                  <Text style={[styles.themeOptionCheck, { color: colors.accent }]}>✓</Text>
                )}
              </Pressable>
            ))}
            <Pressable
              onPress={() => setThemeModalVisible(false)}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <Text style={[styles.themeModalCancel, { color: colors.textSecondary }]}>{t('settings.cancel')}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

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

      <Modal
        visible={discussionTimeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDiscussionTimeModalVisible(false)}
      >
        <Pressable
          style={styles.themeModalOverlay}
          onPress={() => setDiscussionTimeModalVisible(false)}
        >
          <View style={[styles.themeModalContent, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.themeModalTitle, { color: colors.text }]}>{t('settings.discussionTime')}</Text>
            {DISCUSSION_TIME_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value ?? 'auto'}
                onPress={() => handleDiscussionTimeSelect(opt.value)}
                style={[
                  styles.themeOption,
                  { borderColor: colors.border },
                  discussionTimePreset === opt.value && { backgroundColor: colors.accentLight, borderColor: colors.accent },
                ]}
              >
                <Text style={[styles.themeOptionLabel, { color: colors.text }]}>{t(opt.labelKey)}</Text>
                {discussionTimePreset === opt.value && (
                  <Text style={[styles.themeOptionCheck, { color: colors.accent }]}>✓</Text>
                )}
              </Pressable>
            ))}
            <Pressable
              onPress={() => setDiscussionTimeModalVisible(false)}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <Text style={[styles.themeModalCancel, { color: colors.textSecondary }]}>{t('settings.cancel')}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={debugMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDebugMenuVisible(false)}
      >
        <Pressable
          style={styles.themeModalOverlay}
          onPress={() => setDebugMenuVisible(false)}
        >
          <Pressable
            style={[styles.themeModalContent, styles.debugModalContent, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Debug menu options are shown in all builds (dev + production) — do not wrap in __DEV__ */}
            <Text style={[styles.themeModalTitle, { color: colors.text, fontSize: getResponsiveFontSize(22) }]}>Debug</Text>
            <Text style={[styles.debugModalSublabel, { color: colors.textSecondary, fontSize: getResponsiveFontSize(14) }]}>
              Preview screens & dev tools
            </Text>
            <Pressable
              onPress={handlePreviewCardReveal}
              style={[styles.debugModalRow, { borderColor: colors.border }]}
            >
              <View style={styles.debugModalIconWrap}>
                <Text style={[styles.settingIcon, { fontSize: getResponsiveFontSize(22) }]}>🃏</Text>
              </View>
              <View style={styles.debugModalRowText}>
                <Text style={[styles.settingLabel, { color: colors.text, fontSize: getResponsiveFontSize(17) }]}>{t('settingsExtra.previewCardReveal')}</Text>
                <Text style={[styles.settingSublabel, { color: colors.textSecondary, fontSize: getResponsiveFontSize(14) }]}>Card reveal animation</Text>
              </View>
              <Text style={[styles.settingArrow, { color: colors.textSecondary, fontSize: getResponsiveFontSize(24) }]}>›</Text>
            </Pressable>
            <Pressable
              onPress={handlePreviewAchievementPopup}
              style={[styles.debugModalRow, { borderColor: colors.border }]}
            >
              <Svg width={24} height={24} viewBox="0 0 24 24" fill={colors.accent}>
                <Path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C18.08 14.63 20 12.55 20 10V7c0-1.1-.9-2-2-2zM5 10V7h2v3H5zm14 0h-2V7h2v3z" />
              </Svg>
              <View style={styles.debugModalRowText}>
                <Text style={[styles.settingLabel, { color: colors.text, fontSize: getResponsiveFontSize(17) }]}>Preview achievement popup</Text>
                <Text style={[styles.settingSublabel, { color: colors.textSecondary, fontSize: getResponsiveFontSize(14) }]}>Achievement unlocked UI</Text>
              </View>
              <Text style={[styles.settingArrow, { color: colors.textSecondary, fontSize: getResponsiveFontSize(24) }]}>›</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                triggerImpact(Haptics.ImpactFeedbackStyle.Light);
                setSimulateUpdateRequired(true);
                setDebugMenuVisible(false);
              }}
              style={[styles.debugModalRow, { borderColor: colors.border }]}
            >
              <View style={styles.debugModalIconWrap}>
                <Text style={[styles.settingIcon, { fontSize: getResponsiveFontSize(22) }]}>🔄</Text>
              </View>
              <View style={styles.debugModalRowText}>
                <Text style={[styles.settingLabel, { color: colors.text, fontSize: getResponsiveFontSize(17) }]}>Simulate update required</Text>
                <Text style={[styles.settingSublabel, { color: colors.textSecondary, fontSize: getResponsiveFontSize(14) }]}>Show blocking update screen</Text>
              </View>
              <Text style={[styles.settingArrow, { color: colors.textSecondary, fontSize: getResponsiveFontSize(24) }]}>›</Text>
            </Pressable>
            <Pressable
              onPress={() => { triggerImpact(Haptics.ImpactFeedbackStyle.Light); setDebugMenuVisible(false); }}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1, marginTop: spacing.lg }]}
            >
              <Text style={[styles.themeModalCancel, { color: colors.textSecondary, fontSize: getResponsiveFontSize(16) }]}>Close</Text>
            </Pressable>
          </Pressable>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  emptyStateWrap: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  emptyStateText: {
    ...typography.body,
    fontSize: 14,
    textAlign: 'center',
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
    minWidth: 0,
  },
  settingSwitchWrap: {
    marginLeft: spacing.lg,
    alignSelf: 'flex-start',
    marginTop: 2,
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
  debugModalContent: {
    alignSelf: 'center',
  },
  debugModalSublabel: {
    ...typography.caption,
    fontSize: 13,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  debugModalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  debugModalIconWrap: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  debugModalRowText: {
    flex: 1,
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
