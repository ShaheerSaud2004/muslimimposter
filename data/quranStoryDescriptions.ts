/**
 * Very brief one-line descriptions for "Stories from the Quran" category.
 * Shown inside the card beneath the story name.
 */

export const quranStoryBriefDescriptions: Record<string, string> = {
  'People of the Cave': 'Youths who slept in a cave for centuries; a sign of resurrection (Surah Al-Kahf).',
  'Musa and Khidr': 'Musa travels with a wise servant of Allah who does puzzling things; a lesson in divine wisdom.',
  'Queen of Sheba': 'Sheba\'s queen visits Sulaiman and submits to Allah.',
  'Story of Yusuf': 'Yusuf: dreams, betrayal, Egypt, and reunion with his family.',
  'Noah and the Ark': 'Nuh builds the Ark; believers are saved, disbelievers drowned.',
  'Ibrahim and the Fire': 'Ibrahim is thrown into the fire; Allah makes it cool and safe.',
  'Maryam and Isa': 'Maryam gives birth to Isa (Jesus) by Allah\'s command.',
  'Dhul Qarnayn': 'A righteous ruler who builds a barrier against Ya\'juj and Ma\'juj.',
  'Prophet Saleh and the Camel': 'Saleh\'s people are given a she-camel as a sign; they kill it and are destroyed.',
  'People of the Elephant': 'An army with an elephant is turned back before Makkah (Year of the Elephant).',
  'Cave of Hira': 'Where the Prophet ﷺ received the first revelation (Iqra\').',
  'Ashab al-Ukhdud': 'Believers thrown into fire-pits for their faith.',
  'Talut and Jalut': 'Talut (Saul) and Dawud defeat the giant Jalut (Goliath).',
  'The Cow of Bani Israel': 'Bani Israel are commanded to sacrifice a cow; they delay and complicate it.',
  'Manna and Quail': 'Allah sends manna and quail as food for Bani Israel in the wilderness.',
};

export function getQuranStoryBrief(word: string): string | null {
  return quranStoryBriefDescriptions[word] ?? null;
}
