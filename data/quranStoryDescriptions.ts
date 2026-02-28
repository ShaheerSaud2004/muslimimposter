/**
 * Very brief one-line descriptions for "Stories from the Quran" category.
 * Shown inside the card beneath the story name.
 */

export const quranStoryBriefDescriptions: Record<string, string> = {
  'People of the Cave': 'Youths slept in cave – sign of resurrection.',
  'Musa and Khidr': 'Musa and a wise servant – lesson in divine wisdom.',
  'Queen of Sheba': 'Sheba\'s queen visits Sulaiman – submits to Allah.',
  'Story of Yusuf': 'Dreams, betrayal, Egypt – reunion with family.',
  'Noah and the Ark': 'Nuh\'s Ark – believers saved.',
  'Ibrahim and the Fire': 'Fire made cool for Ibrahim.',
  'Maryam and Isa': 'Maryam gives birth to Isa by Allah\'s command.',
  'Dhul Qarnayn': 'Righteous ruler – barrier against Ya\'juj and Ma\'juj.',
  'Prophet Saleh and the Camel': 'She-camel as sign – they kill it, destroyed.',
  'People of the Elephant': 'Army turned back before Makkah.',
  'Cave of Hira': 'First revelation – Iqra\'.',
  'Ashab al-Ukhdud': 'Believers in fire-pits for faith.',
  'Talut and Jalut': 'Dawud defeats Jalut (Goliath).',
  'The Cow of Bani Israel': 'Bani Israel sacrifice a cow.',
  'Manna and Quail': 'Food for Bani Israel in wilderness.',
};

export function getQuranStoryBrief(word: string): string | null {
  return quranStoryBriefDescriptions[word] ?? null;
}
