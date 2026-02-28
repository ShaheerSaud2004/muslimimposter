import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const TRACK_WIDTH = 44;
const TRACK_HEIGHT = 26;
const THUMB_SIZE = 22;
const PADDING = 2;
const THUMB_RANGE = TRACK_WIDTH - THUMB_SIZE - PADDING * 2;

const springConfig = {
  damping: 18,
  stiffness: 200,
  mass: 0.6,
};

type AnimatedSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  trackColor?: { false: string; true: string };
  thumbColor?: string | { false: string; true: string };
  disabled?: boolean;
};

export function AnimatedSwitch({
  value,
  onValueChange,
  trackColor = { false: '#3c3c3e', true: '#34c759' },
  thumbColor = '#ffffff',
  disabled = false,
}: AnimatedSwitchProps) {
  const position = useSharedValue(value ? 1 : 0);
  const thumbColors =
    typeof thumbColor === 'string'
      ? { false: thumbColor, true: thumbColor }
      : thumbColor;

  useEffect(() => {
    position.value = withSpring(value ? 1 : 0, springConfig);
  }, [value, position]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      position.value,
      [0, 1],
      [trackColor.false, trackColor.true]
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => {
    const x = position.value * THUMB_RANGE + PADDING;
    return {
      transform: [{ translateX: x }],
      backgroundColor: interpolateColor(
        position.value,
        [0, 1],
        [thumbColors.false, thumbColors.true]
      ),
    };
  });

  const handlePress = () => {
    if (disabled) return;
    const next = !value;
    position.value = withSpring(next ? 1 : 0, springConfig);
    onValueChange(next);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [pressed && styles.pressed]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: 'center',
    padding: PADDING,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    position: 'absolute',
    left: PADDING,
    top: PADDING,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
  },
});
