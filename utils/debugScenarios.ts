import type { Player, GameSettings } from '../types';
import { createPlayers } from './game';

const DEFAULT_NAMES = ['Ali', 'Fatima', 'Omar', 'Aisha'];
const SECRET_WORD = 'Salah';
const SECRET_CATEGORY = 'worship';
const QUIZ_QUESTION = 'What is the second pillar of Islam?';
const IMPOSTER_QUIZ_QUESTION = 'What is the first pillar of Islam?';

function baseSettings(overrides: Partial<GameSettings> = {}): GameSettings {
  return {
    numPlayers: 4,
    numImposters: 1,
    mode: 'word',
    specialModes: { blindImposter: false, doubleAgent: false, trollMode: false },
    selectedCategories: [SECRET_CATEGORY],
    showCategoryToImposter: true,
    showHintToImposter: false,
    startingPlayerId: 'player-0',
    secretWord: SECRET_WORD,
    secretCategory: SECRET_CATEGORY,
    playerNames: DEFAULT_NAMES,
    ...overrides,
  };
}

export type DebugScenarioId =
  | 'reveal_normal'
  | 'reveal_troll'
  | 'reveal_double_agent'
  | 'reveal_quiz'
  | 'game_confirmation_normal'
  | 'game_confirmation_troll'
  | 'game_confirmation_double_agent'
  | 'game_confirmation_blind'
  | 'pass_and_play_normal'
  | 'pass_and_play_troll'
  | 'round_instructions'
  | 'voting_timer'
  | 'quiz_answer'
  | 'quiz_answers_review';

export function getScenarioState(
  scenarioId: DebugScenarioId
): { players: Player[]; settings: GameSettings } {
  const names = DEFAULT_NAMES.slice(0, 4);
  const startingPlayerId = 'player-0';

  switch (scenarioId) {
    case 'reveal_normal': {
      const settings = baseSettings();
      const players = createPlayers(4, 1, false, startingPlayerId, names);
      return { players, settings };
    }
    case 'reveal_troll': {
      const settings = baseSettings({
        numImposters: 3,
        trollRoundActive: true,
        specialModes: { blindImposter: false, doubleAgent: false, trollMode: true },
      });
      const players = createPlayers(4, 3, false, startingPlayerId, names);
      return { players, settings };
    }
    case 'reveal_double_agent': {
      const settings = baseSettings({
        specialModes: { blindImposter: false, doubleAgent: true, trollMode: false },
      });
      const players = createPlayers(4, 1, true, startingPlayerId, names);
      return { players, settings };
    }
    case 'reveal_quiz': {
      const settings = baseSettings({
        mode: 'quiz',
        quizQuestion: QUIZ_QUESTION,
        imposterQuizQuestion: IMPOSTER_QUIZ_QUESTION,
      });
      const players = createPlayers(4, 1, false, startingPlayerId, names);
      return { players, settings };
    }
    case 'game_confirmation_normal': {
      const settings = baseSettings();
      const players = createPlayers(4, 1, false, startingPlayerId, names);
      return { players, settings };
    }
    case 'game_confirmation_troll': {
      const settings = baseSettings({
        numImposters: 3,
        trollRoundActive: true,
        specialModes: { blindImposter: false, doubleAgent: false, trollMode: true },
      });
      const players = createPlayers(4, 3, false, startingPlayerId, names);
      return { players, settings };
    }
    case 'game_confirmation_double_agent': {
      const settings = baseSettings({
        specialModes: { blindImposter: false, doubleAgent: true, trollMode: false },
      });
      const players = createPlayers(4, 1, true, startingPlayerId, names);
      return { players, settings };
    }
    case 'game_confirmation_blind': {
      const settings = baseSettings({
        specialModes: { blindImposter: true, doubleAgent: false, trollMode: false },
        showCategoryToImposter: false,
      });
      const players = createPlayers(4, 1, false, startingPlayerId, names);
      return { players, settings };
    }
    case 'pass_and_play_normal': {
      const settings = baseSettings();
      const players = createPlayers(4, 1, false, startingPlayerId, names);
      return { players, settings };
    }
    case 'pass_and_play_troll': {
      const settings = baseSettings({
        numImposters: 3,
        trollRoundActive: true,
        specialModes: { blindImposter: false, doubleAgent: false, trollMode: true },
      });
      const players = createPlayers(4, 3, false, startingPlayerId, names);
      return { players, settings };
    }
    case 'round_instructions': {
      const settings = baseSettings();
      const players = createPlayers(4, 1, false, startingPlayerId, names);
      return { players, settings };
    }
    case 'voting_timer': {
      const settings = baseSettings();
      const players = createPlayers(4, 1, false, startingPlayerId, names);
      return { players, settings };
    }
    case 'quiz_answer': {
      const settings = baseSettings({
        mode: 'quiz',
        quizQuestion: QUIZ_QUESTION,
        imposterQuizQuestion: IMPOSTER_QUIZ_QUESTION,
      });
      const players = createPlayers(4, 1, false, startingPlayerId, names).map((p, i) => ({
        ...p,
        quizAnswer: p.role === 'imposter' ? 'Shahada' : 'Salah',
      }));
      return { players, settings };
    }
    case 'quiz_answers_review': {
      const settings = baseSettings({
        mode: 'quiz',
        quizQuestion: QUIZ_QUESTION,
        imposterQuizQuestion: IMPOSTER_QUIZ_QUESTION,
      });
      const players = createPlayers(4, 1, false, startingPlayerId, names).map((p, i) => ({
        ...p,
        quizAnswer: p.role === 'imposter' ? 'Shahada' : (i === 0 ? 'Salah' : 'Prayer'),
      }));
      return { players, settings };
    }
    default:
      const settings = baseSettings();
      const players = createPlayers(4, 1, false, startingPlayerId, names);
      return { players, settings };
  }
}

export type DebugScenarioEntry = {
  id: DebugScenarioId;
  label: string;
  sublabel: string;
  route: 'Reveal' | 'GameConfirmation' | 'PassAndPlay' | 'RoundInstructions' | 'VotingTimer' | 'QuizAnswer' | 'QuizAnswersReview';
};

export const DEBUG_SCENARIOS: DebugScenarioEntry[] = [
  { id: 'reveal_normal', label: 'Reveal (normal)', sublabel: '1 imposter, word mode', route: 'Reveal' },
  { id: 'reveal_troll', label: 'Reveal (troll round)', sublabel: '3 imposters, troll badge + explanation', route: 'Reveal' },
  { id: 'reveal_double_agent', label: 'Reveal (double agent)', sublabel: '1 imposter + double agent', route: 'Reveal' },
  { id: 'reveal_quiz', label: 'Reveal (quiz mode)', sublabel: 'Question + answer', route: 'Reveal' },
  { id: 'game_confirmation_normal', label: 'Game Confirmation (normal)', sublabel: '4 players, 1 imposter', route: 'GameConfirmation' },
  { id: 'game_confirmation_troll', label: 'Game Confirmation (troll)', sublabel: 'Troll round badge', route: 'GameConfirmation' },
  { id: 'game_confirmation_double_agent', label: 'Game Confirmation (double agent)', sublabel: 'Double agent active', route: 'GameConfirmation' },
  { id: 'game_confirmation_blind', label: 'Game Confirmation (blind imposter)', sublabel: 'Blind imposter active', route: 'GameConfirmation' },
  { id: 'pass_and_play_normal', label: 'Pass And Play (normal)', sublabel: 'Deck view, 4 players', route: 'PassAndPlay' },
  { id: 'pass_and_play_troll', label: 'Pass And Play (troll)', sublabel: '3 imposters, no fellow-imposter list', route: 'PassAndPlay' },
  { id: 'round_instructions', label: 'Round Instructions', sublabel: 'Intro before cards', route: 'RoundInstructions' },
  { id: 'voting_timer', label: 'Voting Timer', sublabel: 'Discussion countdown', route: 'VotingTimer' },
  { id: 'quiz_answer', label: 'Quiz Answer', sublabel: 'Type answer, imposter vs player', route: 'QuizAnswer' },
  { id: 'quiz_answers_review', label: 'Quiz Answers Review', sublabel: 'All answers + imposter badges', route: 'QuizAnswersReview' },
];
