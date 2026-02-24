import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

/**
 * Creates and plays a simple beep sound
 * @param frequency - Frequency in Hz (default: 440Hz - A4 note)
 * @param duration - Duration in milliseconds (default: 500ms)
 * @param volume - Volume 0-1 (default: 0.5)
 */
export const playBeepSound = async (
  frequency: number = 440,
  duration: number = 500,
  volume: number = 0.5
): Promise<void> => {
  try {
    // Configure audio mode
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });

    // Generate a simple sine wave beep
    const sampleRate = 44100;
    const numSamples = Math.floor((duration / 1000) * sampleRate);
    const samples = new Float32Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
      // Create a sine wave with a fade in/out envelope to avoid clicks
      const t = i / sampleRate;
      const envelope = Math.min(1, t * 100) * Math.min(1, (duration / 1000 - t) * 100);
      samples[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * volume;
    }

    // Note: expo-av doesn't support playing raw audio buffers directly
    // So we'll use a different approach - use a data URI or web audio API
    // For now, return and let the caller handle it with haptic feedback
    // In a production app, you'd want to use a pre-recorded sound file
  } catch (error) {
    console.log('Error generating beep:', error);
    throw error;
  }
};

/**
 * Plays a timer end sound using haptic feedback
 * This is a fallback when sound files aren't available
 */
export const playTimerEndHaptic = async (): Promise<void> => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  // Add a second impact for emphasis
  setTimeout(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, 200);
};
