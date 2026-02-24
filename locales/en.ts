export const en = {
  menu: {
    getStarted: 'Get Started',
    howToPlay: 'How to Play',
    statistics: 'Statistics',
    tagline: 'The Islamic Hidden Word Game',
  },
  settings: {
    title: 'Settings',
    subtitle: 'App preferences & support',
    appearance: 'APPEARANCE',
    theme: 'Theme',
    themeSoft: 'Soft',
    themePaper: 'Paper',
    themeDark: 'Dark',
    content: 'CONTENT',
    createCustomCategory: 'Create Custom Category',
    createCustomCategorySublabel: 'Add your own word lists',
    support: 'SUPPORT',
    checkUpdates: 'Check for updates',
    checkUpdatesSublabel: 'See if a new version is available',
    rateApp: 'Rate Khafī',
    rateAppSublabel: 'Leave a review',
    feedback: 'Send feedback',
    feedbackSublabel: 'We read every message',
    privacy: 'Privacy Policy',
    privacySublabel: 'How we handle your data',
    language: 'Language',
    languageSublabel: 'App language',
    cancel: 'Cancel',
    firstIteration: 'First Iteration',
    firstIterationMessage: 'This is the first version of Khafī. New features and improvements will be added soon!',
    statistics: 'Statistics',
    statisticsSublabel: 'Your game stats',
  },
  stats: {
    title: 'Statistics',
    subtitle: 'Your game stats on this device',
    totalRounds: 'Rounds played',
    playersWon: 'Players won',
    impostersWon: 'Imposters won',
    winRate: 'Win rate',
    recentGames: 'RECENT GAMES',
    imposter: 'Imposter',
    winners: 'Winners',
    won: 'Won',
    lost: 'Lost',
    clearStats: 'Clear statistics',
    noGamesYet: 'No games yet',
    noGamesYetMessage: 'Play rounds and tap "Did you get the imposter?" on the Reveal screen to see your stats here.',
    clearConfirmTitle: 'Clear statistics?',
    clearConfirmMessage: 'This will delete all your game history on this device. This cannot be undone.',
    viewStatsLink: 'Click here to view stats',
  },
  common: {
    back: '← Back',
  },
} as const;

export type TranslationKeys = typeof en;

/** Same structure as en but values can be any string (for translated locales) */
export type TranslationSchema = {
  [K in keyof TranslationKeys]: {
    [P in keyof TranslationKeys[K]]: string;
  };
};
