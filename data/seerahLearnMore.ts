/**
 * For each Seerah word (secret word), provide a short synopsis and a YouTube link
 * so players can learn more after the round. Update the YouTube URLs with your
 * preferred videos (e.g. from a Seerah series).
 */
export type SeerahLearnMore = {
  synopsis: string;
  youtubeUrl: string;
};

export const seerahLearnMore: Record<string, SeerahLearnMore> = {
  'Hijrah': {
    synopsis: 'The migration of Prophet Muhammad ﷺ and the Muslims from Makkah to Madinah in 622 CE, marking the start of the Islamic calendar and a new chapter for the Muslim community.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Hijrah+Prophet+Muhammad+Seerah',
  },
  'Battle of Badr': {
    synopsis: 'The first major battle in Islamic history (624 CE), where the Muslims of Madinah, though outnumbered, were victorious against the Quraysh of Makkah. A turning point for the early Muslim community.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Battle+of+Badr+Seerah',
  },
  'Battle of Uhud': {
    synopsis: 'The second major battle (625 CE) at Mount Uhud near Madinah. The Muslims faced a setback due to archers leaving their post, but the Prophet ﷺ and the community recovered and learned from the lesson.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Battle+of+Uhud+Seerah',
  },
  'Conquest of Makkah': {
    synopsis: 'In 630 CE, the Prophet ﷺ and the Muslims entered Makkah peacefully after years of exile. The city was liberated without bloodshed, and the Kaaba was cleansed of idols. Most Makkans embraced Islam.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Conquest+of+Makkah+Seerah',
  },
  'Night Journey': {
    synopsis: 'The Isra and Mi\'raj: the Prophet ﷺ was taken from Makkah to Jerusalem and then through the heavens in one night. He met previous prophets and received the command of the five daily prayers.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Isra+Miraj+Night+Journey+Seerah',
  },
  'First Revelation': {
    synopsis: 'In the Cave of Hira, the Angel Jibril (Gabriel) brought the first verses of the Quran to Prophet Muhammad ﷺ when he was 40. "Read in the name of your Lord who created..." (Surah Al-Alaq).',
    youtubeUrl: 'https://www.youtube.com/results?search_query=First+Revelation+Cave+Hira+Seerah',
  },
  'Treaty of Hudaybiyyah': {
    synopsis: 'A peace treaty between the Muslims and the Quraysh in 628 CE. Though the terms seemed unfavorable at first, it led to peace, more people embracing Islam, and opened the way for the eventual conquest of Makkah.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Treaty+of+Hudaybiyyah+Seerah',
  },
  'Breaking of the Idols': {
    synopsis: 'After the Conquest of Makkah, the Prophet ﷺ entered the Kaaba and removed the idols that had been placed inside. He restored the House of Allah to pure monotheism (tawheed).',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Breaking+Idols+Kaaba+Conquest+Makkah+Seerah',
  },
  'Year of Sorrow': {
    synopsis: 'The year when the Prophet ﷺ lost his wife Khadija (RA) and his uncle Abu Talib in quick succession. It was a time of great grief but also led to the journey to Taif and eventually the Hijrah.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Year+of+Sorrow+Khadija+Abu+Talib+Seerah',
  },
  'Pledge of Aqabah': {
    synopsis: 'The pledges at Aqabah where the Ansar (people of Madinah) pledged to support the Prophet ﷺ and invite him to Madinah. This paved the way for the Hijrah and the first Islamic state.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Pledge+of+Aqabah+Seerah',
  },
  'Battle of the Trench': {
    synopsis: 'The siege of Madinah (627 CE) when the Quraysh and their allies surrounded the city. Salman (RA) suggested digging a trench to defend the Muslims. The siege ended without battle.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Battle+of+the+Trench+Khandaq+Seerah',
  },
  'Farewell Pilgrimage': {
    synopsis: 'The last Hajj of the Prophet ﷺ in 632 CE. He delivered the famous sermon at Arafat, emphasizing equality, rights, and the completion of the message. He passed away shortly after.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Farewell+Pilgrimage+Khutbah+Arafat+Seerah',
  },
  'Birth of the Prophet': {
    synopsis: 'Prophet Muhammad ﷺ was born in Makkah in the Year of the Elephant (570 CE). His mother was Amina and his father Abdullah had passed away before his birth. He was raised by his grandfather and uncle.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Birth+of+Prophet+Muhammad+Year+of+Elephant+Seerah',
  },
  'Opening of Makkah': {
    synopsis: 'The peaceful opening (Fath) of Makkah in 630 CE—the same event as the Conquest of Makkah. The Prophet ﷺ entered as a conqueror but forgave the people and cleansed the Kaaba of idols.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Conquest+of+Makkah+Fath+Seerah',
  },
  'Call to Islam (Dawah)': {
    synopsis: 'The early, open call to Islam in Makkah. The Prophet ﷺ first called his family and then the people of Makkah to worship Allah alone. He faced rejection and persecution but continued with patience.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Call+to+Islam+Dawah+Makkah+Seerah',
  },
  'Boycott of Banu Hashim': {
    synopsis: 'The Quraysh imposed a social and economic boycott on the Prophet\'s clan, Banu Hashim, for about three years. They were confined to a valley in Makkah and suffered hardship until the boycott was lifted.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Boycott+Banu+Hashim+Seerah',
  },
  'Taif': {
    synopsis: 'After the Year of Sorrow, the Prophet ﷺ traveled to Taif to invite its people to Islam. He was rejected and stoned. He prayed to Allah, and later the people of Taif embraced Islam.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Prophet+Muhammad+Taif+Seerah',
  },
  'Battle of Hunayn': {
    synopsis: 'After the Conquest of Makkah (630 CE), the tribes of Hawazin and Thaqif attacked the Muslims. The battle at Hunayn started with a retreat but ended in a decisive victory for the Muslims.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Battle+of+Hunayn+Seerah',
  },
  'Battle of Tabuk': {
    synopsis: 'The last major expedition of the Prophet ﷺ (630 CE), against the Byzantine Empire. The Muslims marched to Tabuk in extreme heat. No battle occurred, but it demonstrated the strength of the Muslim state.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Battle+of+Tabuk+Seerah',
  },
};

/**
 * Get learn-more content for a Seerah word. Returns null if not found or not a Seerah word.
 */
export function getSeerahLearnMore(secretWord: string): SeerahLearnMore | null {
  return seerahLearnMore[secretWord] ?? null;
}
