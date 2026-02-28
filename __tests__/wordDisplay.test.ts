/**
 * Tests for word display utils: getWordDisplayParts
 * Run: npm test
 */
import { getWordDisplayParts, WORD_DISPLAY } from '../utils/wordDisplay';

const CUE_FONT = 48;

describe('getWordDisplayParts', () => {
  it('single word: one part, no second part', () => {
    const r = getWordDisplayParts('Khutbah', CUE_FONT);
    expect(r.firstPart).toBe('Khutbah');
    expect(r.secondPart).toBeNull();
    expect(r.mainLines).toBe(1);
    expect(r.partFontSize).toBe(CUE_FONT);
  });

  it('Ibrahim (AS): short phrase on one line', () => {
    const r = getWordDisplayParts('Ibrahim (AS)', CUE_FONT);
    expect(r.firstPart).toBe('Ibrahim (AS)');
    expect(r.secondPart).toBeNull();
    expect(r.mainLines).toBe(1);
    expect(r.partFontSize).toBe(CUE_FONT);
  });

  it('Laylatul Qadr: short phrase on one line', () => {
    const r = getWordDisplayParts('Laylatul Qadr', CUE_FONT);
    expect(r.firstPart).toBe('Laylatul Qadr');
    expect(r.secondPart).toBeNull();
    expect(r.mainLines).toBe(1);
    expect(r.partFontSize).toBe(CUE_FONT);
  });

  it('multi-word phrase: first N-2 words | last 2 words', () => {
    const splitSize = 50;
    const r = getWordDisplayParts('The Cow of Bani Israel', CUE_FONT, splitSize);
    expect(r.firstPart).toBe('The Cow of');
    expect(r.secondPart).toBe('Bani Israel');
    expect(r.partFontSize).toBe(splitSize);
  });

  it('Conquest of Spain: splits when over MAX_SINGLE_LINE_CHARS', () => {
    const r = getWordDisplayParts('Conquest of Spain', CUE_FONT);
    expect(r.firstPart).toBe('Conquest of');
    expect(r.secondPart).toBe('Spain');
  });

  it('trimmed input', () => {
    const r = getWordDisplayParts('  Ramadan  ', CUE_FONT);
    expect(r.firstPart).toBe('Ramadan');
    expect(r.secondPart).toBeNull();
  });

  it('Adam (as): short phrase on one line', () => {
    const r = getWordDisplayParts('Adam (as)', CUE_FONT);
    expect(r.firstPart).toBe('Adam (as)');
    expect(r.secondPart).toBeNull();
  });
});

describe('WORD_DISPLAY constants', () => {
  it('SPLIT_PHRASE_FONT_SIZE_BASE is 54', () => {
    expect(WORD_DISPLAY.SPLIT_PHRASE_FONT_SIZE_BASE).toBe(54);
  });
  it('WORD_MIN_SCALE is 0.95', () => {
    expect(WORD_DISPLAY.WORD_MIN_SCALE).toBe(0.95);
  });
  it('MAX_SINGLE_LINE_CHARS is 16', () => {
    expect(WORD_DISPLAY.MAX_SINGLE_LINE_CHARS).toBe(16);
  });
});
