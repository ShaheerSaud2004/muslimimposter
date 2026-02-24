import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export const PatternBackground: React.FC = () => {
  const { colors, theme } = useTheme();

  if (theme === 'soft') {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: colors.patternOpacity,
            backgroundColor: 'transparent',
          },
        ]}
      >
        {/* Subtle geometric pattern using simple views */}
        <View
          style={[
            styles.patternLine,
            { backgroundColor: colors.text, opacity: 0.1 },
            { top: '20%', left: 0, right: 0, height: 1 },
          ]}
        />
        <View
          style={[
            styles.patternLine,
            { backgroundColor: colors.text, opacity: 0.1 },
            { top: '40%', left: 0, right: 0, height: 1 },
          ]}
        />
        <View
          style={[
            styles.patternLine,
            { backgroundColor: colors.text, opacity: 0.1 },
            { top: '60%', left: 0, right: 0, height: 1 },
          ]}
        />
        <View
          style={[
            styles.patternLine,
            { backgroundColor: colors.text, opacity: 0.1 },
            { top: '80%', left: 0, right: 0, height: 1 },
          ]}
        />
      </View>
    );
  }

  if (theme === 'paper') {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: 0.02,
            backgroundColor: colors.text,
          },
        ]}
      />
    );
  }

  // Dark theme - minimal pattern
  return null;
};

const styles = StyleSheet.create({
  patternLine: {
    position: 'absolute',
  },
});