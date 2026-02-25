import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Locale } from '../types';
import { getSettings, saveSettings } from '../utils/storage';
import { getTranslations } from '../locales';
import type { TranslationKeys } from '../locales';

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getNested(obj: Record<string, unknown>, path: string): string {
  const value = path.split('.').reduce((o: unknown, k) => (o as Record<string, unknown>)?.[k], obj);
  return typeof value === 'string' ? value : path;
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getSettings().then((settings) => {
      if (settings.locale) {
        setLocaleState(settings.locale);
      }
      setReady(true);
    });
  }, []);

  const setLocale = async (newLocale: Locale) => {
    setLocaleState(newLocale);
    await saveSettings({ locale: newLocale });
  };

  const t = (key: string): string => {
    const strings = getTranslations(locale) as Record<string, unknown>;
    return getNested(strings, key);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
