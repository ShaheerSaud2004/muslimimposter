/**
 * Tests for app constants
 * Run: npm test
 */
import { VOTING_TIMER, GAME_SETUP, WORD_DISPLAY } from '../constants';

describe('VOTING_TIMER', () => {
  it('has expected bounds', () => {
    expect(VOTING_TIMER.MIN_SECONDS).toBe(60);
    expect(VOTING_TIMER.MAX_SECONDS).toBe(300);
    expect(VOTING_TIMER.ADD_30_SECONDS).toBe(30);
  });
});

describe('GAME_SETUP', () => {
  it('PLAYER_NAME_MAX_LENGTH is 20', () => {
    expect(GAME_SETUP.PLAYER_NAME_MAX_LENGTH).toBe(20);
  });
});

describe('WORD_DISPLAY', () => {
  it('has SPLIT_PHRASE_FONT_SIZE_BASE and WORD_MIN_SCALE', () => {
    expect(WORD_DISPLAY.SPLIT_PHRASE_FONT_SIZE_BASE).toBe(54);
    expect(WORD_DISPLAY.WORD_MIN_SCALE).toBe(0.95);
  });
});
