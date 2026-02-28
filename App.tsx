import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Easing, Platform, Linking, AppState, View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { VersionCheckProvider, useVersionCheck } from './contexts/VersionCheckContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { HapticsProvider } from './contexts/HapticsContext';
import { GameProvider } from './contexts/GameContext';
import MenuScreen from './screens/MenuScreen';
import HowToPlayScreen from './screens/HowToPlayScreen';
import SettingsScreen from './screens/SettingsScreen';
import GameSetupScreen from './screens/GameSetupScreen';
import PassAndPlayScreen from './screens/PassAndPlayScreen';
import RoundInstructionsScreen from './screens/RoundInstructionsScreen';
import VotingTimerScreen from './screens/VotingTimerScreen';
import QuizAnswerScreen from './screens/QuizAnswerScreen';
import QuizAnswersReviewScreen from './screens/QuizAnswersReviewScreen';
import RevealScreen from './screens/RevealScreen';
import CreateCategoryScreen from './screens/CreateCategoryScreen';
import CreatePlaylistScreen from './screens/CreatePlaylistScreen';
import GameConfirmationScreen from './screens/GameConfirmationScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import DebugRevealPreviewScreen from './screens/DebugRevealPreviewScreen';
import DebugAchievementPopupScreen from './screens/DebugAchievementPopupScreen';
import { Alert, showAlert } from './components/Alert';
import { PatternBackground } from './components/PatternBackground';
import { checkForUpdate } from './utils/versionCheck';
import type { Player, GameSettings } from './types';

export type RootStackParamList = {
  Menu: undefined;
  HowToPlay: undefined;
  Settings: undefined;
  GameSetup: undefined;
  GameConfirmation: undefined;
  PassAndPlay: { nextRound?: { players: Player[]; settings: GameSettings } } | undefined;
  RoundInstructions: undefined;
  VotingTimer: { initialSeconds?: number };
  QuizAnswer: undefined;
  QuizAnswersReview: undefined;
  Reveal: undefined;
  CreateCategory: undefined;
  CreatePlaylist: { initialCategoryIds?: string[] };
  Statistics: undefined;
  DebugRevealPreview: undefined;
  DebugAchievementPopup: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const APP_STORE_URL = 'https://apps.apple.com/us/app/khafi/id6758224320';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.khafi.app';

async function openStoreUrl(url: string): Promise<void> {
  try {
    await Linking.openURL(url);
  } catch {
    try {
      await WebBrowser.openBrowserAsync(url, { createTask: false });
    } catch {
      // Silently fail; user can manually open store
    }
  }
}

function AppContent() {
  const { theme, colors } = useTheme();
  const { simulateUpdateRequired, setSimulateUpdateRequired } = useVersionCheck();
  const versionCheckDone = useRef(false);
  const [updateRequired, setUpdateRequired] = useState<{ storeUrl: string } | null>(null);

  // Determine StatusBar style based on theme
  // 'dark' and 'ramadan' use light content, others use dark content
  const statusBarStyle = theme === 'dark' || theme === 'ramadan' ? 'light' : 'dark';

  const runVersionCheck = () => {
    if (Platform.OS === 'web') return;
    checkForUpdate().then((result) => {
      if (result.type === 'update-required') {
        setUpdateRequired({ storeUrl: result.storeUrl });
      } else {
        setUpdateRequired(null);
        if (result.type === 'update-optional' && !versionCheckDone.current) {
          versionCheckDone.current = true;
          showAlert({
            title: 'Update available',
            message: `A new version of Khafī (${result.latestVersion}) is available. Update now for the latest features.`,
            buttons: [
              { text: 'Later', style: 'cancel' },
              {
                text: 'Update',
                onPress: () => Linking.openURL(result.storeUrl).catch(() => {}),
              },
            ],
          });
        }
      }
    });
  };

  // Version check on launch and when app comes to foreground (forced update)
  useEffect(() => {
    if (Platform.OS === 'web') return;
    runVersionCheck();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') runVersionCheck();
    });
    return () => sub.remove();
  }, []);

  // Hide splash as soon as app content mounts so user goes straight to the app (no extra splash screen)
  useEffect(() => {
    if (Platform.OS !== 'web') {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, []);

  const onNavigationReady = () => {
    // Splash already hidden on mount; this is a no-op for readiness only
  };

  // Blocking "Update required" screen — Khafī themed
  const showBlock = (updateRequired && Platform.OS !== 'web') || simulateUpdateRequired;
  const blockStoreUrl =
    updateRequired?.storeUrl ||
    (Platform.OS === 'android' ? PLAY_STORE_URL : APP_STORE_URL);
  if (showBlock) {
    return (
      <Modal
        visible
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={simulateUpdateRequired ? () => setSimulateUpdateRequired(false) : () => {}}
      >
        <View style={[styles.updateBlockContainer, { backgroundColor: colors.background }]}>
          <PatternBackground />
          <View style={styles.updateBlockOverlay}>
            <View style={[styles.updateBlockCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={[styles.updateBlockTitle, { color: colors.text }]}>Update Required</Text>
            <Text style={[styles.updateBlockMessage, { color: colors.textSecondary }]}>
              A new version of this app is available. Please update to continue.
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.updateBlockPrimaryButton,
                { backgroundColor: colors.accent },
                pressed && styles.updateBlockPrimaryButtonPressed,
              ]}
              onPress={() => openStoreUrl(blockStoreUrl)}
            >
              <Text style={styles.updateBlockPrimaryButtonText}>Update</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.updateBlockDismissButton,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => {
                if (simulateUpdateRequired) setSimulateUpdateRequired(false);
                else setUpdateRequired(null);
              }}
            >
              <Text style={[styles.updateBlockDismissButtonText, { color: colors.textSecondary }]}>
                {simulateUpdateRequired ? 'Dismiss' : 'Later'}
              </Text>
            </Pressable>
          </View>
        </View>
        </View>
      </Modal>
    );
  }

  return (
    <>
      <NavigationContainer onReady={onNavigationReady}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: 'transparent' },
            animationEnabled: true,
            cardStyleInterpolator: ({ current, next, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateY: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.height * 0.15, 0],
                        extrapolate: 'clamp',
                      }),
                    },
                    {
                      scale: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.98, 1],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                  opacity: current.progress.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0.8, 1],
                    extrapolate: 'clamp',
                  }),
                },
                overlayStyle: {
                  opacity: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0],
                    extrapolate: 'clamp',
                  }),
                },
              };
            },
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {
                  duration: 300,
                  easing: Easing.out(Easing.ease),
                },
              },
              close: {
                animation: 'timing',
                config: {
                  duration: 250,
                  easing: Easing.in(Easing.ease),
                },
              },
            },
          }}
        >
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="HowToPlay" component={HowToPlayScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="GameSetup" component={GameSetupScreen} />
          <Stack.Screen name="GameConfirmation" component={GameConfirmationScreen} />
          <Stack.Screen name="PassAndPlay" component={PassAndPlayScreen} />
          <Stack.Screen
            name="RoundInstructions"
            component={RoundInstructionsScreen}
          />
          <Stack.Screen name="VotingTimer" component={VotingTimerScreen} />
          <Stack.Screen name="QuizAnswer" component={QuizAnswerScreen} />
          <Stack.Screen name="QuizAnswersReview" component={QuizAnswersReviewScreen} />
          <Stack.Screen name="Reveal" component={RevealScreen} />
          <Stack.Screen name="CreateCategory" component={CreateCategoryScreen} />
          <Stack.Screen name="CreatePlaylist" component={CreatePlaylistScreen} />
          <Stack.Screen name="Statistics" component={StatisticsScreen} />
          <Stack.Screen name="DebugRevealPreview" component={DebugRevealPreviewScreen} />
          <Stack.Screen name="DebugAchievementPopup" component={DebugAchievementPopupScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style={statusBarStyle} />
      <Alert />
    </>
  );
}

const styles = StyleSheet.create({
  updateBlockContainer: {
    flex: 1,
  },
  updateBlockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  updateBlockCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  updateBlockTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  updateBlockMessage: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  updateBlockPrimaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  updateBlockPrimaryButtonPressed: {
    opacity: 0.8,
  },
  updateBlockPrimaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  updateBlockDismissButton: {
    marginTop: 12,
    paddingVertical: 8,
  },
  updateBlockDismissButtonText: {
    fontSize: 15,
  },
});

export default function App() {
  // Register service worker for PWA on web
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered:', registration);
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <VersionCheckProvider>
          <LanguageProvider>
            <HapticsProvider>
              <GameProvider>
                <AppContent />
              </GameProvider>
            </HapticsProvider>
          </LanguageProvider>
        </VersionCheckProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}