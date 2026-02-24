import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../App';
import { useTheme } from '../contexts/ThemeContext';
import { spacing } from '../theme';
import * as Haptics from 'expo-haptics';

type NavigationHeaderProps = {
  showGetStarted?: boolean;
  showSettings?: boolean;
};

export function NavigationHeader({ 
  showGetStarted = true, 
  showSettings = true 
}: NavigationHeaderProps) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleSettingsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Settings');
  };

  const handleGetStartedPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('GameSetup');
  };

  return (
    <View 
      style={[
        styles.container, 
        { 
          top: Math.max(insets.top, spacing.md) + spacing.sm, 
          right: Math.max(insets.right, spacing.md) + spacing.sm,
          left: Math.max(insets.left, spacing.md) + spacing.sm,
        }
      ]}
      pointerEvents={showGetStarted || showSettings ? "auto" : "none"}
    >
      {showGetStarted && (
        <Pressable
          onPress={handleGetStartedPress}
          style={({ pressed }) => [
            styles.button,
            {
              opacity: pressed ? 0.6 : 1,
              backgroundColor: colors.accent,
            },
          ]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Get Started</Text>
        </Pressable>
      )}
      {showSettings && (
        <Pressable
          onPress={handleSettingsPress}
          style={({ pressed }) => [
            styles.settingsButton,
            {
              opacity: pressed ? 0.6 : 1,
            },
          ]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={[styles.settingsIconContainer, { backgroundColor: colors.border }]}>
            <Image
              source={require('../settings.png')}
              style={[styles.settingsIcon, { tintColor: colors.textSecondary }]}
              resizeMode="contain"
            />
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing.sm,
  },
  button: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    minHeight: 44,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  settingsButton: {
    padding: spacing.xs,
  },
  settingsIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    opacity: 1,
    minWidth: 44,
    minHeight: 44,
  },
  settingsIcon: {
    width: 20,
    height: 20,
  },
});
