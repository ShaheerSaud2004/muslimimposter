import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Easing, Platform, Linking } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
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
import GameConfirmationScreen from './screens/GameConfirmationScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import { Alert, showAlert } from './components/Alert';
import { checkForUpdate } from './utils/versionCheck';

export type RootStackParamList = {
  Menu: undefined;
  HowToPlay: undefined;
  Settings: undefined;
  GameSetup: undefined;
  GameConfirmation: undefined;
  PassAndPlay: undefined;
  RoundInstructions: undefined;
  VotingTimer: undefined;
  QuizAnswer: undefined;
  QuizAnswersReview: undefined;
  Reveal: undefined;
  CreateCategory: undefined;
  Statistics: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function AppContent() {
  const { theme } = useTheme();
  const versionCheckDone = useRef(false);

  // Determine StatusBar style based on theme
  // 'dark' theme uses light content, others use dark content
  const statusBarStyle = theme === 'dark' ? 'light' : 'dark';

  // Version check on launch (skip on web)
  useEffect(() => {
    if (Platform.OS === 'web' || versionCheckDone.current) return;
    versionCheckDone.current = true;
    checkForUpdate().then((result) => {
      if (result.type === 'update-required') {
        showAlert({
          title: 'Update required',
          message: 'A new version of Khafī is required to continue. Please update from the App Store.',
          buttons: [
            {
              text: 'Update',
              onPress: () => Linking.openURL(result.storeUrl).catch(() => {}),
            },
          ],
        });
      } else if (result.type === 'update-optional') {
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
    });
  }, []);

  const onNavigationReady = () => {
    if (Platform.OS !== 'web') {
      SplashScreen.hideAsync().catch(() => {});
    }
  };

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
          <Stack.Screen name="Statistics" component={StatisticsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style={statusBarStyle} />
      <Alert />
    </>
  );
}

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
        <LanguageProvider>
          <GameProvider>
            <AppContent />
          </GameProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}