import type { Locale } from '../types';
import type { TranslationKeys, TranslationSchema } from './en';
import { en } from './en';
import { ar } from './ar';
import { ur } from './ur';

const translations: Record<Locale, TranslationKeys | TranslationSchema> = {
  en,
  ar,
  ur,
};

export function getTranslations(locale: Locale): TranslationKeys | TranslationSchema {
  return translations[locale] ?? en;
}

export type { TranslationKeys, TranslationSchema } from './en';
export { en, ar, ur };
