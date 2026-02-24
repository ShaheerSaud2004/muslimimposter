import { Category } from '../types';

export interface QuizQuestion {
  id: string;
  categoryId: string;
  question: string;
  answer: string; // This becomes the secret word
  difficulty: 'easy' | 'medium' | 'hard';
}

export const quizQuestions: QuizQuestion[] = [
  // Seerah Questions
  {
    id: 'seerah-1',
    categoryId: 'seerah',
    question: 'First wife of the Prophet ﷺ',
    answer: 'Khadija (RA)',
    difficulty: 'medium',
  },
  {
    id: 'seerah-2',
    categoryId: 'seerah',
    question: 'Where was the Prophet ﷺ born?',
    answer: 'Makkah',
    difficulty: 'easy',
  },
  {
    id: 'seerah-3',
    categoryId: 'seerah',
    question: 'First battle fought by Muslims',
    answer: 'Battle of Badr',
    difficulty: 'hard',
  },
  {
    id: 'seerah-4',
    categoryId: 'seerah',
    question: 'Where did the Prophet ﷺ migrate to?',
    answer: 'Madinah',
    difficulty: 'easy',
  },
  {
    id: 'seerah-5',
    categoryId: 'seerah',
    question: 'Night journey where the Prophet ﷺ traveled to Jerusalem',
    answer: 'Night Journey',
    difficulty: 'hard',
  },
  {
    id: 'seerah-6',
    categoryId: 'seerah',
    question: 'When did the Prophet ﷺ receive his first revelation?',
    answer: 'First Revelation',
    difficulty: 'hard',
  },
  {
    id: 'seerah-7',
    categoryId: 'seerah',
    question: 'Major event where Muslims conquered Makkah',
    answer: 'Conquest of Makkah',
    difficulty: 'hard',
  },
  {
    id: 'seerah-8',
    categoryId: 'seerah',
    question: 'Battle where Muslims were defeated',
    answer: 'Battle of Uhud',
    difficulty: 'hard',
  },
  {
    id: 'seerah-9',
    categoryId: 'seerah',
    question: 'The migration from Makkah to Madinah',
    answer: 'Hijrah',
    difficulty: 'medium',
  },
  {
    id: 'seerah-10',
    categoryId: 'seerah',
    question: 'Treaty signed between Muslims and Quraysh',
    answer: 'Treaty of Hudaybiyyah',
    difficulty: 'hard',
  },
  
  // Prophets Questions
  {
    id: 'prophets-1',
    categoryId: 'prophets',
    question: 'Prophet known for his patience',
    answer: 'Ayyub (AS)',
    difficulty: 'medium',
  },
  {
    id: 'prophets-2',
    categoryId: 'prophets',
    question: 'Prophet who built the Ark',
    answer: 'Nuh (AS)',
    difficulty: 'easy',
  },
  {
    id: 'prophets-3',
    categoryId: 'prophets',
    question: 'Prophet known as the father of many nations',
    answer: 'Ibrahim (AS)',
    difficulty: 'medium',
  },
  {
    id: 'prophets-4',
    categoryId: 'prophets',
    question: 'First prophet and first human',
    answer: 'Adam (AS)',
    difficulty: 'easy',
  },
  {
    id: 'prophets-5',
    categoryId: 'prophets',
    question: 'Prophet known for his beautiful story in the Quran',
    answer: 'Yusuf (AS)',
    difficulty: 'medium',
  },
  {
    id: 'prophets-6',
    categoryId: 'prophets',
    question: 'Prophet who spoke to Allah directly',
    answer: 'Musa (AS)',
    difficulty: 'medium',
  },
  {
    id: 'prophets-7',
    categoryId: 'prophets',
    question: 'Prophet known as the Messiah',
    answer: 'Isa (AS)',
    difficulty: 'easy',
  },
  {
    id: 'prophets-8',
    categoryId: 'prophets',
    question: 'Prophet known for his wisdom and kingdom',
    answer: 'Sulaiman (AS)',
    difficulty: 'medium',
  },
  {
    id: 'prophets-9',
    categoryId: 'prophets',
    question: 'Prophet who was swallowed by a whale',
    answer: 'Yunus (AS)',
    difficulty: 'medium',
  },
  {
    id: 'prophets-10',
    categoryId: 'prophets',
    question: 'Prophet and Messenger of Allah (final prophet)',
    answer: 'Muhammad ﷺ',
    difficulty: 'easy',
  },
  
  // Ramadan Questions
  {
    id: 'ramadan-1',
    categoryId: 'ramadan',
    question: 'Meal eaten before dawn during Ramadan',
    answer: 'Suhoor',
    difficulty: 'easy',
  },
  {
    id: 'ramadan-2',
    categoryId: 'ramadan',
    question: 'Meal eaten to break fast',
    answer: 'Iftar',
    difficulty: 'easy',
  },
  {
    id: 'ramadan-3',
    categoryId: 'ramadan',
    question: 'Night of Power in Ramadan',
    answer: 'Laylatul Qadr',
    difficulty: 'medium',
  },
  {
    id: 'ramadan-4',
    categoryId: 'ramadan',
    question: 'Special prayers performed during Ramadan nights',
    answer: 'Taraweeh',
    difficulty: 'medium',
  },
  {
    id: 'ramadan-5',
    categoryId: 'ramadan',
    question: 'The act of abstaining from food and drink during daylight',
    answer: 'Fasting',
    difficulty: 'easy',
  },
  {
    id: 'ramadan-6',
    categoryId: 'ramadan',
    question: 'Holy book revealed during Ramadan',
    answer: 'Quran',
    difficulty: 'easy',
  },
  {
    id: 'ramadan-7',
    categoryId: 'ramadan',
    question: 'Festival that marks the end of Ramadan',
    answer: 'Eid',
    difficulty: 'easy',
  },
  {
    id: 'ramadan-8',
    categoryId: 'ramadan',
    question: 'Obligatory charity given during Ramadan',
    answer: 'Zakat',
    difficulty: 'medium',
  },
  
  // Worship & Prayer Questions
  {
    id: 'worship-1',
    categoryId: 'worship',
    question: 'What is the ruling for the final sitting in prayer?',
    answer: 'Fard',
    difficulty: 'medium',
  },
  {
    id: 'worship-2',
    categoryId: 'worship',
    question: 'How many daily prayers are fard?',
    answer: 'Five',
    difficulty: 'easy',
  },
  {
    id: 'worship-3',
    categoryId: 'worship',
    question: 'What is the call to prayer called?',
    answer: 'Adhan',
    difficulty: 'easy',
  },
  {
    id: 'worship-4',
    categoryId: 'worship',
    question: 'Ritual purification before prayer',
    answer: 'Wudu',
    difficulty: 'easy',
  },
  {
    id: 'worship-5',
    categoryId: 'worship',
    question: 'Direction Muslims face during prayer',
    answer: 'Qibla',
    difficulty: 'easy',
  },
  {
    id: 'worship-6',
    categoryId: 'worship',
    question: 'Friday prayer',
    answer: 'Jummah',
    difficulty: 'easy',
  },
  {
    id: 'worship-7',
    categoryId: 'worship',
    question: 'Sermon given during Friday prayer',
    answer: 'Khutbah',
    difficulty: 'medium',
  },
  {
    id: 'worship-8',
    categoryId: 'worship',
    question: 'Person who leads the prayer',
    answer: 'Imam',
    difficulty: 'easy',
  },
  {
    id: 'worship-9',
    categoryId: 'worship',
    question: 'Prostration position in prayer',
    answer: 'Sajdah',
    difficulty: 'medium',
  },
  {
    id: 'worship-10',
    categoryId: 'worship',
    question: 'Bowing position in prayer',
    answer: 'Ruku',
    difficulty: 'medium',
  },
  
  // Halal Foods Questions
  {
    id: 'halal-1',
    categoryId: 'halal-foods',
    question: 'Sweet fruit mentioned in the Quran',
    answer: 'Dates',
    difficulty: 'easy',
  },
  {
    id: 'halal-3',
    categoryId: 'halal-foods',
    question: 'Natural sweetener made by bees',
    answer: 'Honey',
    difficulty: 'easy',
  },
  {
    id: 'halal-4',
    categoryId: 'halal-foods',
    question: 'Fruit mentioned in the Quran',
    answer: 'Olives',
    difficulty: 'easy',
  },
  
  // Masjid Life Questions
  {
    id: 'masjid-1',
    categoryId: 'masjid-life',
    question: 'Place of worship for Muslims',
    answer: 'Mosque',
    difficulty: 'easy',
  },
  {
    id: 'masjid-2',
    categoryId: 'masjid-life',
    question: 'Main area where prayers are performed',
    answer: 'Prayer Hall',
    difficulty: 'easy',
  },
  {
    id: 'masjid-3',
    categoryId: 'masjid-life',
    question: 'Stand used to hold the Quran',
    answer: 'Quran Stand',
    difficulty: 'medium',
  },
  {
    id: 'masjid-4',
    categoryId: 'masjid-life',
    question: 'Rug used for prayer',
    answer: 'Prayer Rug',
    difficulty: 'easy',
  },
  
  // Islamic Values Questions
  {
    id: 'values-1',
    categoryId: 'values',
    question: 'Virtue of pardoning others',
    answer: 'Forgiveness',
    difficulty: 'easy',
  },
  {
    id: 'values-2',
    categoryId: 'values',
    question: 'Quality of being humble and not showing off',
    answer: 'Modesty',
    difficulty: 'easy',
  },
  {
    id: 'values-3',
    categoryId: 'values',
    question: 'Bond between Muslim men',
    answer: 'Brotherhood',
    difficulty: 'easy',
  },
  
  // Basic Islamic Terms Questions
  {
    id: 'basic-1',
    categoryId: 'basic-terms',
    question: 'Arabic word for God',
    answer: 'Allah',
    difficulty: 'easy',
  },
  {
    id: 'basic-2',
    categoryId: 'basic-terms',
    question: 'Way of life in Islam',
    answer: 'Deen',
    difficulty: 'medium',
  },
  {
    id: 'basic-3',
    categoryId: 'basic-terms',
    question: 'Faith or belief in Islam',
    answer: 'Iman',
    difficulty: 'medium',
  },
  {
    id: 'basic-4',
    categoryId: 'basic-terms',
    question: 'What is forbidden in Islam',
    answer: 'Haram',
    difficulty: 'easy',
  },
  {
    id: 'basic-5',
    categoryId: 'basic-terms',
    question: 'Sayings and actions of the Prophet ﷺ',
    answer: 'Sunnah',
    difficulty: 'medium',
  },
  {
    id: 'basic-6',
    categoryId: 'basic-terms',
    question: 'Sayings of the Prophet ﷺ',
    answer: 'Hadith',
    difficulty: 'medium',
  },
  {
    id: 'basic-7',
    categoryId: 'basic-terms',
    question: 'Declaration of faith',
    answer: 'Shahadah',
    difficulty: 'medium',
  },
  
  // Islamic Months & Holidays Questions
  {
    id: 'months-1',
    categoryId: 'islamic-months',
    question: 'Month of fasting',
    answer: 'Ramadan',
    difficulty: 'easy',
  },
  {
    id: 'months-2',
    categoryId: 'islamic-months',
    question: 'Month of Hajj',
    answer: 'Dhul Hijjah',
    difficulty: 'medium',
  },
  {
    id: 'months-3',
    categoryId: 'islamic-months',
    question: 'First month of Islamic calendar',
    answer: 'Muharram',
    difficulty: 'medium',
  },
  {
    id: 'months-4',
    categoryId: 'islamic-months',
    question: 'Festival after Ramadan',
    answer: 'Eid al-Fitr',
    difficulty: 'easy',
  },
  {
    id: 'months-5',
    categoryId: 'islamic-months',
    question: 'Festival of sacrifice',
    answer: 'Eid al-Adha',
    difficulty: 'easy',
  },
  {
    id: 'months-6',
    categoryId: 'islamic-months',
    question: 'Month of the Prophet\'s birth',
    answer: 'Rabi al-Awwal',
    difficulty: 'medium',
  },
  
  // Quran Concepts Questions
  {
    id: 'quran-1',
    categoryId: 'quran-concepts',
    question: 'Paradise in Islam',
    answer: 'Jannah',
    difficulty: 'easy',
  },
  {
    id: 'quran-2',
    categoryId: 'quran-concepts',
    question: 'Hellfire in Islam',
    answer: 'Jahannam',
    difficulty: 'easy',
  },
  {
    id: 'quran-3',
    categoryId: 'quran-concepts',
    question: 'Spiritual beings created from fire',
    answer: 'Jinn',
    difficulty: 'medium',
  },
  {
    id: 'quran-4',
    categoryId: 'quran-concepts',
    question: 'Spiritual beings created from light',
    answer: 'Angels',
    difficulty: 'easy',
  },
  {
    id: 'quran-5',
    categoryId: 'quran-concepts',
    question: 'Day when all will be judged',
    answer: 'Day of Judgment',
    difficulty: 'medium',
  },
  {
    id: 'quran-6',
    categoryId: 'quran-concepts',
    question: 'Oneness of Allah',
    answer: 'Tawheed',
    difficulty: 'hard',
  },
  {
    id: 'quran-7',
    categoryId: 'quran-concepts',
    question: 'Disbelief or rejection',
    answer: 'Kufr',
    difficulty: 'hard',
  },
  {
    id: 'quran-8',
    categoryId: 'quran-concepts',
    question: 'The afterlife',
    answer: 'Akhirah',
    difficulty: 'medium',
  },
  
  // Marriage & Nikah Questions
  {
    id: 'marriage-1',
    categoryId: 'marriage',
    question: 'Islamic marriage ceremony',
    answer: 'Nikah',
    difficulty: 'medium',
  },
  {
    id: 'marriage-2',
    categoryId: 'marriage',
    question: 'Dowry given to the bride',
    answer: 'Mahr',
    difficulty: 'medium',
  },
  {
    id: 'marriage-3',
    categoryId: 'marriage',
    question: 'Wedding feast',
    answer: 'Walima',
    difficulty: 'medium',
  },
  {
    id: 'marriage-4',
    categoryId: 'marriage',
    question: 'Decorative art applied to hands before wedding',
    answer: 'Henna',
    difficulty: 'easy',
  },
  
  // Charity & Zakat Questions
  {
    id: 'charity-1',
    categoryId: 'charity-zakat',
    question: 'Obligatory charity in Islam',
    answer: 'Zakat',
    difficulty: 'medium',
  },
  {
    id: 'charity-2',
    categoryId: 'charity-zakat',
    question: 'Voluntary charity',
    answer: 'Sadaqah',
    difficulty: 'medium',
  },
  {
    id: 'charity-3',
    categoryId: 'charity-zakat',
    question: 'Act of giving to others',
    answer: 'Charity',
    difficulty: 'easy',
  },
  {
    id: 'charity-4',
    categoryId: 'charity-zakat',
    question: 'Children without parents',
    answer: 'Orphans',
    difficulty: 'easy',
  },
  
  // Hajj & Umrah Questions
  {
    id: 'hajj-1',
    categoryId: 'hajj-umrah',
    question: 'Black stone located in the Kaaba',
    answer: 'Black Stone',
    difficulty: 'easy',
  },
  {
    id: 'hajj-2',
    categoryId: 'hajj-umrah',
    question: 'Sacred water from Makkah',
    answer: 'Zamzam Water',
    difficulty: 'easy',
  },
  {
    id: 'hajj-3',
    categoryId: 'hajj-umrah',
    question: 'Circumambulation around the Kaaba',
    answer: 'Tawaf',
    difficulty: 'medium',
  },
  {
    id: 'hajj-4',
    categoryId: 'hajj-umrah',
    question: 'Holy city where the Prophet ﷺ is buried',
    answer: 'Madinah',
    difficulty: 'easy',
  },
  {
    id: 'hajj-5',
    categoryId: 'hajj-umrah',
    question: 'Holy city where the Kaaba is located',
    answer: 'Makkah',
    difficulty: 'easy',
  },
  {
    id: 'hajj-6',
    categoryId: 'hajj-umrah',
    question: 'Sacred house in Makkah',
    answer: 'Kaaba',
    difficulty: 'easy',
  },
  {
    id: 'hajj-7',
    categoryId: 'hajj-umrah',
    question: 'Journey to Makkah',
    answer: 'Pilgrimage',
    difficulty: 'easy',
  },
  
  // Islamic Clothing Questions
  {
    id: 'clothing-1',
    categoryId: 'islamic-clothing',
    question: 'Head covering worn by Muslim women',
    answer: 'Hijab',
    difficulty: 'easy',
  },
  {
    id: 'clothing-2',
    categoryId: 'islamic-clothing',
    question: 'Face covering worn by some Muslim women',
    answer: 'Niqab',
    difficulty: 'medium',
  },
  {
    id: 'clothing-3',
    categoryId: 'islamic-clothing',
    question: 'Long loose dress worn by Muslim women',
    answer: 'Abaya',
    difficulty: 'easy',
  },
  {
    id: 'clothing-4',
    categoryId: 'islamic-clothing',
    question: 'Long robe worn by Muslim men',
    answer: 'Thobe',
    difficulty: 'easy',
  },
  {
    id: 'clothing-5',
    categoryId: 'islamic-clothing',
    question: 'Cap worn by Muslim men',
    answer: 'Kufi',
    difficulty: 'easy',
  },
  
  // Companions Questions
  {
    id: 'companions-1',
    categoryId: 'companions',
    question: 'First Caliph after the Prophet ﷺ',
    answer: 'Abu Bakr (RA)',
    difficulty: 'medium',
  },
  {
    id: 'companions-2',
    categoryId: 'companions',
    question: 'Companion known for freeing slaves',
    answer: 'Bilal (RA)',
    difficulty: 'medium',
  },
  {
    id: 'companions-3',
    categoryId: 'companions',
    question: 'Daughter of the Prophet ﷺ',
    answer: 'Fatima (RA)',
    difficulty: 'easy',
  },
  {
    id: 'companions-4',
    categoryId: 'companions',
    question: 'Second Caliph',
    answer: 'Umar (RA)',
    difficulty: 'medium',
  },
  {
    id: 'companions-5',
    categoryId: 'companions',
    question: 'Third Caliph',
    answer: 'Uthman (RA)',
    difficulty: 'medium',
  },
  {
    id: 'companions-6',
    categoryId: 'companions',
    question: 'Fourth Caliph and cousin of the Prophet ﷺ',
    answer: 'Ali (RA)',
    difficulty: 'medium',
  },
  {
    id: 'companions-7',
    categoryId: 'companions',
    question: 'First wife of the Prophet ﷺ',
    answer: 'Khadija (RA)',
    difficulty: 'medium',
  },
  {
    id: 'companions-8',
    categoryId: 'companions',
    question: 'Youngest wife of the Prophet ﷺ',
    answer: 'Aisha (RA)',
    difficulty: 'medium',
  },
  {
    id: 'companions-9',
    categoryId: 'companions',
    question: 'Uncle of the Prophet ﷺ who was martyred',
    answer: 'Hamza (RA)',
    difficulty: 'hard',
  },
  {
    id: 'companions-10',
    categoryId: 'companions',
    question: 'Grandsons of the Prophet ﷺ',
    answer: 'Hassan (RA)',
    difficulty: 'medium',
  },
  
  // Islamic Architecture & Places Questions
  {
    id: 'architecture-1',
    categoryId: 'islamic-architecture',
    question: 'Sacred house in Makkah',
    answer: 'Kaaba',
    difficulty: 'easy',
  },
  {
    id: 'architecture-2',
    categoryId: 'islamic-architecture',
    question: 'Mosque of the Prophet ﷺ in Madinah',
    answer: 'Masjid Nabawi',
    difficulty: 'medium',
  },
  {
    id: 'architecture-3',
    categoryId: 'islamic-architecture',
    question: 'Third holiest mosque in Islam',
    answer: 'Masjid Al-Aqsa',
    difficulty: 'medium',
  },
  {
    id: 'architecture-4',
    categoryId: 'islamic-architecture',
    question: 'Famous mosque in Jerusalem',
    answer: 'Dome of the Rock',
    difficulty: 'medium',
  },
  {
    id: 'architecture-5',
    categoryId: 'islamic-architecture',
    question: 'Famous Islamic university in Cairo',
    answer: 'Al-Azhar',
    difficulty: 'hard',
  },
  {
    id: 'architecture-6',
    categoryId: 'islamic-architecture',
    question: 'Holy city in Saudi Arabia',
    answer: 'Makkah',
    difficulty: 'easy',
  },
  {
    id: 'architecture-7',
    categoryId: 'islamic-architecture',
    question: 'City of the Prophet ﷺ',
    answer: 'Medina',
    difficulty: 'easy',
  },
  {
    id: 'architecture-8',
    categoryId: 'islamic-architecture',
    question: 'Holy city for Muslims, Christians, and Jews',
    answer: 'Jerusalem',
    difficulty: 'easy',
  },
  
  // Islamic Scholars & Imams Questions
  {
    id: 'scholars-1',
    categoryId: 'islamic-scholars',
    question: 'Founder of the Maliki school of jurisprudence',
    answer: 'Imam Malik',
    difficulty: 'hard',
  },
  {
    id: 'scholars-2',
    categoryId: 'islamic-scholars',
    question: 'Founder of the Shafi\'i school of jurisprudence',
    answer: 'Imam Shafi',
    difficulty: 'hard',
  },
  {
    id: 'scholars-3',
    categoryId: 'islamic-scholars',
    question: 'Founder of the Hanbali school of jurisprudence',
    answer: 'Imam Hanbal',
    difficulty: 'hard',
  },
  {
    id: 'scholars-4',
    categoryId: 'islamic-scholars',
    question: 'Founder of the Hanafi school of jurisprudence',
    answer: 'Imam Abu Hanifa',
    difficulty: 'hard',
  },
  {
    id: 'scholars-5',
    categoryId: 'islamic-scholars',
    question: 'Compiler of Sahih al-Bukhari',
    answer: 'Imam Bukhari',
    difficulty: 'hard',
  },
  {
    id: 'scholars-6',
    categoryId: 'islamic-scholars',
    question: 'Compiler of Sahih Muslim',
    answer: 'Imam Muslim',
    difficulty: 'hard',
  },
  
  // Duas & Supplications Questions
  {
    id: 'duas-1',
    categoryId: 'islamic-duas',
    question: 'Dua for when traveling (Dua al-Safar)',
    answer: 'Travel (Dua al-Safar)',
    difficulty: 'easy',
  },
  {
    id: 'duas-2',
    categoryId: 'islamic-duas',
    question: 'Dua before eating',
    answer: 'Eating (Dua before eating)',
    difficulty: 'easy',
  },
  {
    id: 'duas-3',
    categoryId: 'islamic-duas',
    question: 'Dua before sleeping',
    answer: 'Sleeping (Dua before sleeping)',
    difficulty: 'easy',
  },
  {
    id: 'duas-4',
    categoryId: 'islamic-duas',
    question: 'Dua for forgiveness',
    answer: 'Forgiveness (Dua for forgiveness)',
    difficulty: 'easy',
  },
  {
    id: 'duas-5',
    categoryId: 'islamic-duas',
    question: 'Dua for parents',
    answer: 'Parents (Dua for parents)',
    difficulty: 'easy',
  },
  
  // Islamic Etiquette Questions
  {
    id: 'etiquette-1',
    categoryId: 'islamic-etiquette',
    question: 'Islamic practice of cleaning after using the bathroom',
    answer: 'Istinja',
    difficulty: 'easy',
  },
  {
    id: 'etiquette-2',
    categoryId: 'islamic-etiquette',
    question: 'Islamic practice of cleaning private parts with water',
    answer: 'Istinbra',
    difficulty: 'easy',
  },
  {
    id: 'etiquette-3',
    categoryId: 'islamic-etiquette',
    question: 'Quality of being respectful',
    answer: 'Respect',
    difficulty: 'easy',
  },
  {
    id: 'etiquette-4',
    categoryId: 'islamic-etiquette',
    question: 'Quality of being kind',
    answer: 'Kindness',
    difficulty: 'easy',
  },
  {
    id: 'etiquette-5',
    categoryId: 'islamic-etiquette',
    question: 'Quality of being humble',
    answer: 'Humility',
    difficulty: 'easy',
  },
  {
    id: 'etiquette-6',
    categoryId: 'islamic-etiquette',
    question: 'Quality of being patient',
    answer: 'Patience',
    difficulty: 'easy',
  },
  {
    id: 'etiquette-7',
    categoryId: 'islamic-etiquette',
    question: 'Quality of being grateful',
    answer: 'Gratitude',
    difficulty: 'easy',
  },
  
  // Islamic Countries & Cities Questions
  {
    id: 'countries-1',
    categoryId: 'islamic-countries',
    question: 'Country with most Muslims',
    answer: 'Indonesia',
    difficulty: 'easy',
  },
  {
    id: 'countries-2',
    categoryId: 'islamic-countries',
    question: 'Country where the two holy cities are located',
    answer: 'Saudi Arabia',
    difficulty: 'easy',
  },
  {
    id: 'countries-3',
    categoryId: 'islamic-countries',
    question: 'Largest Muslim country by population',
    answer: 'Indonesia',
    difficulty: 'medium',
  },
  {
    id: 'countries-4',
    categoryId: 'islamic-countries',
    question: 'Country known for pyramids',
    answer: 'Egypt',
    difficulty: 'easy',
  },
  {
    id: 'countries-5',
    categoryId: 'islamic-countries',
    question: 'Country that bridges Europe and Asia',
    answer: 'Turkey',
    difficulty: 'easy',
  },
  {
    id: 'countries-6',
    categoryId: 'islamic-countries',
    question: 'Country with second largest Muslim population',
    answer: 'Pakistan',
    difficulty: 'medium',
  },
  {
    id: 'countries-7',
    categoryId: 'islamic-countries',
    question: 'Southeast Asian Muslim country',
    answer: 'Malaysia',
    difficulty: 'easy',
  },
];

// Get random quiz question for a category (excludeIds = session-used so we don't repeat)
export function getRandomQuizQuestion(
  categoryId: string,
  difficulty?: 'easy' | 'medium' | 'hard',
  excludeIds: string[] = []
): QuizQuestion | null {
  let availableQuestions = quizQuestions.filter(
    q => q.categoryId === categoryId && !excludeIds.includes(q.id)
  );
  
  if (difficulty) {
    availableQuestions = availableQuestions.filter(q => q.difficulty === difficulty);
  }
  
  if (availableQuestions.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  return availableQuestions[randomIndex];
}

// Get all quiz questions for a category
export function getQuizQuestionsForCategory(categoryId: string): QuizQuestion[] {
  return quizQuestions.filter(q => q.categoryId === categoryId);
}
