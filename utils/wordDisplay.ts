import { WORD_DISPLAY } from '../constants';

export type WordDisplayParts = {
  firstPart: string;
  secondPart: string | null;
  /** 1 for single line (single word or first part only), 2 for two-line single word (legacy) */
  mainLines: number;
  /** Font size to use: splitPhraseFontSize when there is a second part, else cue word size */
  partFontSize: number;
};

/**
 * Splits a word/phrase for card display:
 * - Short phrases (≤ MAX_SINGLE_LINE_CHARS): one line, e.g. "Ibrahim (AS)", "Laylatul Qadr", "Dates"
 * - Longer phrases: split across two lines:
 *   - "The Cow of Bani Israel" → firstPart: "The Cow of", secondPart: "Bani Israel"
 *   - "Conquest of Spain" → firstPart: "Conquest of", secondPart: "Spain"
 * - "Khutbah" → firstPart: "Khutbah", secondPart: null (single line, shrink to fit)
 */
export function getWordDisplayParts(
  word: string,
  cueWordFontSize: number,
  splitPhraseFontSize?: number
): WordDisplayParts {
  const w = word.trim();
  const splitSize = splitPhraseFontSize ?? Math.round(cueWordFontSize * 0.75);
  // Short phrases stay on one line so they don't wrap unnecessarily
  if (w.length <= WORD_DISPLAY.MAX_SINGLE_LINE_CHARS) {
    return {
      firstPart: w,
      secondPart: null,
      mainLines: 1,
      partFontSize: cueWordFontSize,
    };
  }
  const asMatch = w.match(/^(.+)\s+\((AS|as)\)$/);
  const wordMainPart = asMatch ? asMatch[1].trim() : w;
  const wordSuffix = asMatch ? `(${asMatch[2]})` : null;
  const parts = wordMainPart.split(/\s+/);
  const multiWordSplit = !wordSuffix && parts.length >= 2;
  // 3 words → "Conquest of" | "Spain"; 4+ words → "The Cow of" | "Bani Israel"
  const firstPart = multiWordSplit
    ? (parts.length === 3 ? parts.slice(0, 2).join(' ') : parts.length > 3 ? parts.slice(0, -2).join(' ') : parts[0])
    : wordMainPart;
  const secondPart = multiWordSplit
    ? (parts.length === 3 ? parts[2] : parts.length > 3 ? parts.slice(-2).join(' ') : parts[1])
    : wordSuffix;
  const mainLines = secondPart ? 1 : (wordMainPart.includes(' ') ? 2 : 1);
  const partFontSize = secondPart ? splitSize : cueWordFontSize;
  return {
    firstPart,
    secondPart,
    mainLines,
    partFontSize,
  };
}

export { WORD_DISPLAY };
