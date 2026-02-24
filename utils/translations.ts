// Arabic to English translations for common Islamic terms
export const arabicTranslations: Record<string, string> = {
  // Adab category
  'Salam': 'Peace greeting',
  'Bismillah': 'In the name of Allah',
  'Alhamdulillah': 'Praise be to Allah',
  'InshaAllah': 'God willing',
  'MashaAllah': 'God has willed it',
  'Barakallahu': 'May Allah bless',
  'JazakAllah': 'May Allah reward you',
  
  // Ramadan & Worship
  'Iftar': 'Breaking fast',
  'Suhoor': 'Pre-dawn meal',
  'Taraweeh': 'Night prayer (Ramadan)',
  'Qiyam': 'Night prayer',
  'Itikaf': 'Spiritual retreat',
  'Zakat': 'Charity (obligatory)',
  'Sadaqah': 'Charity (voluntary)',
  'Dhikr': 'Remembrance of Allah',
  'Dua': 'Supplication',
  'Wudu': 'Ablution',
  'Salah': 'Prayer',
  'Tasbih': 'Prayer beads',
  'Sajdah': 'Prostration',
  'Ruku': 'Bowing',
  'Adhan': 'Call to prayer',
  'Iqamah': 'Second call to prayer',
  
  // Masjid Life
  'Minbar': 'Pulpit',
  'Mihrab': 'Prayer niche',
  'Qibla': 'Direction of prayer',
  'Musalla': 'Prayer area',
  'Jummah': 'Friday prayer',
  'Khutbah': 'Friday sermon',
  'Saff': 'Prayer row',
  'Janamaz': 'Prayer rug',
  'Tarawih': 'Night prayer (Ramadan)',
  
  // Basic Arabic Words
  'Allah': 'God',
  'Rahman': 'The Merciful',
  'Rahim': 'The Compassionate',
  'Akhirah': 'Afterlife',
  'Dunya': 'Worldly life',
  'Deen': 'Religion',
  'Iman': 'Faith',
  'Tawheed': 'Oneness of God',
  'Shirk': 'Associating partners with Allah',
  'Halal': 'Permissible',
  'Haram': 'Forbidden',
  'Sunnah': 'Prophetic tradition',
  'Hadith': 'Prophetic saying',
  'Fard': 'Obligatory',
  'Wajib': 'Required',
  'Mustahabb': 'Recommended',
  'Makruh': 'Disliked',
  'Nikah': 'Marriage',
  'Mahr': 'Bridal gift / Dowry',
  'Walima': 'Wedding feast / Reception',
  
  // Foods
  'Zabiha': 'Islamically slaughtered',
  'Tharid': 'Bread and meat dish',
  
  // Seerah - Popular Moments
  'Hijrah': 'Migration to Madinah',
  'Battle of Badr': 'Battle of Badr - First major victory',
  'Battle of Uhud': 'Battle of Uhud - Second major battle',
  'Conquest of Makkah': 'Conquest of Mecca - Victory',
  'Night Journey': 'Night Journey - Isra & Mi\'raj',
  'First Revelation': 'First Revelation - In Cave Hira',
  'Treaty of Hudaybiyyah': 'Treaty of Hudaybiyyah - Peace treaty',
  'Battle of Khandaq': 'Battle of Khandaq - Battle of the Trench',
  'Birth in Makkah': 'Birth in Mecca',
  'Migration to Madinah': 'Migration to Medina',
  'Farewell Pilgrimage': 'Farewell Pilgrimage - Final Hajj',
  'Year of Sorrow': 'Year of Sorrow - Death of Khadija & Abu Talib',
  'Pledge of Aqabah': 'Pledge of Aqabah - Oath of allegiance',
  'Breaking of the Idols': 'Breaking of the Idols - In Kaaba',
  'Opening of Makkah': 'Opening of Mecca - Victory',
  'Return to Makkah': 'Return to Mecca',
  'Call to Islam': 'Call to Islam - Da\'wah',
  'Building the Masjid': 'Building the Masjid - First mosque',
  
  // Islamic History - Popular Moments
  'Conquest of Jerusalem': 'Conquest of Jerusalem - By Umar ibn Khattab',
  'Battle of Yarmouk': 'Battle of Yarmouk - Major victory',
  'Fall of Constantinople': 'Fall of Constantinople - 1453 to Ottomans',
  'Golden Age of Baghdad': 'Golden Age of Baghdad - Islamic Golden Age',
  'Al-Andalus': 'Al-Andalus - Islamic Spain',
  'Crusades': 'Crusades - Religious wars',
  'Building of Al-Azhar': 'Building of Al-Azhar - First university',
  'First Hijrah to Abyssinia': 'First Hijrah to Abyssinia - Early migration',
  'Mongol Invasion': 'Mongol Invasion - Fall of Baghdad',
  'Reconquista': 'Reconquista - Spanish reconquest',
  'Ottoman Empire Rise': 'Rise of Ottoman Empire',
  'Salahuddin Ayyubi': 'Saladin - Liberator of Jerusalem',
  'Umayyad Caliphate': 'Umayyad Caliphate - First dynasty',
  'Abbasid Revolution': 'Abbasid Revolution - Overthrow of Umayyads',
  'Conquest of Spain': 'Conquest of Spain - 711 CE',
  'Siege of Vienna': 'Siege of Vienna - 1683',
  'Moorish Spain': 'Moorish Spain - Golden period',
  'Age of Discovery': 'Age of Discovery - Islamic contributions',
  
  // Prophets - Popular
  'Muhammad': 'Prophet Muhammad - Final Messenger',
  'Ibrahim': 'Prophet Abraham - Friend of Allah',
  'Musa': 'Prophet Moses - Spoke with Allah',
  'Isa': 'Prophet Jesus - Messiah',
  'Nuh': 'Prophet Noah - Ark builder',
  'Adam': 'Prophet Adam - First human',
  'Yusuf': 'Prophet Joseph - Beautiful dreamer',
  'Sulaiman': 'Prophet Solomon - King of wisdom',
  'Dawud': 'Prophet David - Psalm singer',
  'Yunus': 'Prophet Jonah - Whale story',
  'Yahya': 'Prophet John - Baptist',
  'Zakariyya': 'Prophet Zechariah - Father of Yahya',
  'Ishaq': 'Prophet Isaac - Son of Ibrahim',
  'Ismail': 'Prophet Ishmael - Son of Ibrahim',
  'Ayyub': 'Prophet Job - Patient',
  'Hud': 'Prophet Hud - To Ad people',
  'Salih': 'Prophet Salih - To Thamud people',
  'Idris': 'Prophet Idris - Elevated by Allah',
};

export const getEnglishTranslation = (arabicTerm: string): string | null => {
  return arabicTranslations[arabicTerm] || null;
};

export const hasArabicScript = (text: string): boolean => {
  // Check if text contains Arabic script characters
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text);
};