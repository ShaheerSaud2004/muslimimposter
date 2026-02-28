import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Haptics from 'expo-haptics';
import { getSettings, saveSettings } from '../utils/storage';

type HapticsContextType = {
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  setHapticsEnabled: (v: boolean) => Promise<void>;
  setSoundEnabled: (v: boolean) => Promise<void>;
  triggerImpact: (style?: Haptics.ImpactFeedbackStyle) => void;
  triggerNotification: (type: Haptics.NotificationFeedbackType) => void;
};

const HapticsContext = createContext<HapticsContextType | undefined>(undefined);

export const HapticsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hapticsEnabled, setHapticsState] = useState(true);
  const [soundEnabled, setSoundState] = useState(true);

  useEffect(() => {
    getSettings().then((s) => {
      setHapticsState(s.hapticsEnabled !== false);
      setSoundState(s.soundEnabled !== false);
    });
  }, []);

  const setHapticsEnabled = async (v: boolean) => {
    setHapticsState(v);
    await saveSettings({ hapticsEnabled: v });
  };

  const setSoundEnabled = async (v: boolean) => {
    setSoundState(v);
    await saveSettings({ soundEnabled: v });
  };

  const triggerImpact = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    if (hapticsEnabled) {
      Haptics.impactAsync(style);
    }
  };

  const triggerNotification = (type: Haptics.NotificationFeedbackType) => {
    if (hapticsEnabled) {
      Haptics.notificationAsync(type);
    }
  };

  return (
    <HapticsContext.Provider
      value={{
        hapticsEnabled,
        soundEnabled,
        setHapticsEnabled,
        setSoundEnabled,
        triggerImpact,
        triggerNotification,
      }}
    >
      {children}
    </HapticsContext.Provider>
  );
};

export const useHaptics = () => {
  const ctx = useContext(HapticsContext);
  if (!ctx) {
    throw new Error('useHaptics must be used within HapticsProvider');
  }
  return ctx;
};
