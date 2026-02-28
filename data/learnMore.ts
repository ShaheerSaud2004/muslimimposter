/**
 * Unified "Learn More" content for secret words across categories.
 * Each entry has a short synopsis and an optional YouTube/search link.
 */

import { seerahLearnMore } from './seerahLearnMore';

export type LearnMoreItem = {
  synopsis: string;
  youtubeUrl: string;
};

// Prophets – brief descriptions and search links
const prophetsLearnMore: Record<string, LearnMoreItem> = {
  'Muhammad ﷺ': {
    synopsis: 'Prophet Muhammad ﷺ is the final Messenger of Allah, sent to all of humanity. He was born in Makkah (570 CE), received revelation at 40, and established Islam. His life (Seerah) is the perfect example for Muslims.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Prophet+Muhammad+Seerah+Life+Story',
  },
  'Ibrahim (AS)': {
    synopsis: 'Prophet Ibrahim (Abraham) is the friend of Allah (Khalilullah). He called his people to Tawheed, faced the fire, and built the Kaaba with his son Ismail (AS). He is a central figure in Islam, Judaism, and Christianity.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Prophet+Ibrahim+Abraham+Islam+Story',
  },
  'Musa (AS)': {
    synopsis: 'Prophet Musa (Moses) was sent to Pharaoh and the Israelites. He received the Tawrat (Torah), performed miracles by Allah\'s leave, and led the Exodus. He is mentioned often in the Quran.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Prophet+Musa+Moses+Islam+Quran',
  },
  'Isa (AS)': {
    synopsis: 'Prophet Isa (Jesus) is a Messenger of Allah, born of Maryam (AS). He was given the Injil (Gospel), performed miracles by Allah\'s permission, and will return before the Day of Judgment. Muslims revere him as Messiah and Word of Allah.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Prophet+Isa+Jesus+in+Islam+Quran',
  },
  'Nuh (AS)': {
    synopsis: 'Prophet Nuh (Noah) preached to his people for centuries. When they rejected him, Allah commanded him to build the Ark. He and the believers were saved; the disbelievers were drowned. His story is in Surah Nuh.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Prophet+Nuh+Noah+Islam+Quran',
  },
  'Adam (AS)': {
    synopsis: 'Prophet Adam (AS) was the first human, created by Allah and placed in Paradise. After he and Hawwa (Eve) ate from the tree, they were sent to Earth. He is the father of humanity and the first Prophet.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Prophet+Adam+Creation+Islam+Quran',
  },
  'Yusuf (AS)': {
    synopsis: 'Prophet Yusuf (Joseph) was given dreams and wisdom. Sold into Egypt, he rose to authority and was reunited with his family. His story is told in full in Surah Yusuf—one of the most detailed narratives in the Quran.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Prophet+Yusuf+Joseph+Quran+Story',
  },
  'Sulaiman (AS)': {
    synopsis: 'Prophet Sulaiman (Solomon) was a king and prophet who could speak to animals and jinn. He had a mighty kingdom and asked Allah only for gratitude. The story of the Queen of Sheba is in the Quran.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Prophet+Sulaiman+Solomon+Islam+Quran',
  },
  'Dawud (AS)': {
    synopsis: 'Prophet Dawud (David) was a king and prophet who received the Zabur (Psalms). He defeated Goliath (Jalut) and was known for his devotion and justice. He is the father of Sulaiman (AS).',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Prophet+Dawud+David+Islam+Quran',
  },
  'Yunus (AS)': {
    synopsis: 'Prophet Yunus (Jonah) was sent to his people, left without permission, and was swallowed by the whale. He repented and was saved. His people later believed. He is mentioned in Surah Yunus and Surah As-Saffat.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Prophet+Yunus+Jonah+Whale+Islam+Quran',
  },
  'Yahya (AS)': {
    synopsis: 'Prophet Yahya (John the Baptist) was the son of Zakariyya (AS). He was righteous from youth and called people to worship Allah. He was a contemporary of Prophet Isa (AS).',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Prophet+Yahya+John+Baptist+Islam',
  },
  'Zakariyya (AS)': {
    synopsis: 'Prophet Zakariyya (Zechariah) prayed for a son in old age. Allah gave him Yahya (AS). He was a guardian of Maryam (AS) and is mentioned in the Quran for his steadfastness.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Prophet+Zakariyya+Zechariah+Islam+Quran',
  },
  'Ismail (AS)': {
    synopsis: 'Prophet Ismail (Ishmael) was the son of Ibrahim (AS) and Hajar. He and his father built the Kaaba. The sacrifice Ibrahim was commanded to offer was a test; Allah ransomed Ismail with a great sacrifice.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Prophet+Ismail+Ishmael+Ibrahim+Kaaba',
  },
  'Ayyub (AS)': {
    synopsis: 'Prophet Ayyub (Job) was tested with illness and loss but remained patient and grateful. Allah restored his health and family. He is the symbol of patience (Sabr) in the Quran.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Prophet+Ayyub+Job+Patience+Islam+Quran',
  },
};

// Islamic History – key events and figures
const islamicHistoryLearnMore: Record<string, LearnMoreItem> = {
  'Conquest of Jerusalem': {
    synopsis: 'In 637 CE, under the caliphate of Umar ibn al-Khattab (RA), Jerusalem was surrendered to the Muslims. Umar (RA) received the keys and ensured the safety of all inhabitants. The city became an important center of Islamic rule.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Conquest+of+Jerusalem+Umar+Islam+History',
  },
  'Battle of Yarmouk': {
    synopsis: 'A decisive battle (636 CE) between the Muslim army and the Byzantine Empire near the Yarmouk River. The Muslim victory opened the way for the conquest of Syria and the Levant.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Battle+of+Yarmouk+Islamic+History',
  },
  'Fall of Constantinople': {
    synopsis: 'In 1453, the Ottoman Sultan Mehmed II conquered Constantinople, ending the Byzantine Empire. The city became Istanbul and the capital of the Ottoman Empire. It was a turning point in world history.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Fall+of+Constantinople+1453+Ottoman',
  },
  'Golden Age of Baghdad': {
    synopsis: 'Under the Abbasids, Baghdad became a center of learning, science, and culture. The House of Wisdom preserved and translated Greek and other texts and advanced mathematics, medicine, and astronomy.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Golden+Age+Baghdad+Islamic+Civilization',
  },
  'Al-Andalus': {
    synopsis: 'Islamic Spain (711–1492) was a period of coexistence, scholarship, and architecture. Cities like Cordoba and Granada flourished. The legacy includes the Alhambra and advances in philosophy and science.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Al+Andalus+Islamic+Spain+History',
  },
  'Salahuddin Ayyubi': {
    synopsis: 'Salahuddin (Saladin) unified Muslim forces and recaptured Jerusalem from the Crusaders in 1187. He was known for chivalry, justice, and respect for civilians. He remains a symbol of Muslim resistance and nobility.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Salahuddin+Ayyubi+Saladin+Jerusalem',
  },
  'First Hijrah to Abyssinia': {
    synopsis: 'When persecution in Makkah intensified, the Prophet ﷺ allowed some Muslims to migrate to Abyssinia (Ethiopia), where the Negus gave them protection. This was the first hijrah (migration) in Islam.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=First+Hijrah+Abyssinia+Ethiopia+Muslims',
  },
  'Building of Al-Azhar': {
    synopsis: 'Al-Azhar in Cairo was founded in 970 CE and became one of the world\'s oldest universities. It has been a center of Islamic scholarship, law, and Arabic studies for over a thousand years.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Al+Azhar+University+Cairo+History',
  },
  'Umayyad Caliphate': {
    synopsis: 'The Umayyad dynasty (661–750 CE) expanded the Islamic state from Spain to Central Asia. Damascus was the capital. The period saw the spread of Islam and the development of administration and architecture.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Umayyad+Caliphate+Islamic+History',
  },
  'Abbasid Revolution': {
    synopsis: 'The Abbasids overthrew the Umayyads in 750 CE and moved the capital to Baghdad. The Abbasid era is often called the Golden Age of Islam, with advances in science, philosophy, and the arts.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Abbasid+Revolution+Islamic+Golden+Age',
  },
  'Conquest of Spain': {
    synopsis: 'In 711 CE, Muslim forces under Tariq ibn Ziyad crossed into Spain and began the Islamic presence in the Iberian Peninsula. This led to centuries of Al-Andalus and lasting cultural impact.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Conquest+of+Spain+711+Tariq+ibn+Ziyad',
  },
  'Ottoman Empire Rise': {
    synopsis: 'The Ottoman Empire emerged in Anatolia and grew into a vast empire lasting into the 20th century. It united much of the Muslim world and preserved Islamic law and culture across three continents.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Rise+of+Ottoman+Empire+History',
  },
  'Mongol Invasion': {
    synopsis: 'The Mongol invasions of the 13th century devastated Baghdad and other cities. Later, many Mongols embraced Islam, and the Ilkhanate and other khanates became patrons of Islamic culture.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Mongol+Invasion+Baghdad+Islam+History',
  },
  'Crusades': {
    synopsis: 'The Crusades were a series of wars between European Christians and Muslims over the Holy Land. Salahuddin\'s recapture of Jerusalem and the eventual Muslim resistance are central to Islamic history.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Crusades+Islam+Jerusalem+Salahuddin',
  },
  'Reconquista': {
    synopsis: 'The Reconquista was the centuries-long Christian reconquest of the Iberian Peninsula. It ended with the fall of Granada in 1492, which also marked the end of Al-Andalus.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Reconquista+Spain+Granada+1492',
  },
};

// Angels – roles and descriptions
const angelsLearnMore: Record<string, LearnMoreItem> = {
  'Jibril': {
    synopsis: 'Jibril (Gabriel) is the angel who brought revelation from Allah to the prophets, including the Quran to Prophet Muhammad ﷺ. He is the chief of the angels and the trusted messenger (Ruh al-Amin).',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Angel+Jibril+Gabriel+Islam+Quran',
  },
  'Mikail': {
    synopsis: 'Mikail (Michael) is the angel responsible for rain, sustenance, and the forces of nature. He is one of the greatest angels and is mentioned in the Quran alongside Jibril.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Angel+Mikail+Michael+Islam',
  },
  'Israfil': {
    synopsis: 'Israfil is the angel who will blow the Trumpet (Sur) on the Day of Judgment—twice: the first blow will end all life, the second will raise creation for reckoning.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Angel+Israfil+Trumpet+Day+of+Judgment+Islam',
  },
  'Azrael': {
    synopsis: 'Azrael (Malak al-Maut) is the Angel of Death, who takes the souls of every creature by Allah\'s command. He is not named in the Quran but is well known in Islamic tradition.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Angel+of+Death+Azrael+Islam',
  },
  'Malik': {
    synopsis: 'Malik is the guardian of Hell (Jahannam). He never smiles; when the people of Hell ask for relief, he tells them they must remain. Mentioned in the Quran (Surah Az-Zukhruf).',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Malik+Guardian+of+Hell+Islam+Quran',
  },
  'Kiraman Katibin': {
    synopsis: 'The Kiraman Katibin are the noble scribes—two angels who record every person\'s good and bad deeds. One sits on the right, one on the left. Their records will be shown on the Day of Judgment.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Kiraman+Katibin+Recording+Angels+Islam',
  },
  'Munkar': {
    synopsis: 'Munkar and Nakir are the two angels who question the deceased in the grave about Allah, the Prophet, and the religion. They test the soul in the barzakh (intermediate realm).',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Munkar+Nakir+Grave+Questioning+Islam',
  },
  'Nakir': {
    synopsis: 'Nakir and Munkar are the angels of the grave. They ask every person: Who is your Lord? What is your religion? Who is your Prophet? The believer answers correctly; the disbeliever cannot.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Munkar+Nakir+Grave+Angels+Islam',
  },
};

// Companions of the Prophet ﷺ
const companionsLearnMore: Record<string, LearnMoreItem> = {
  'Abu Bakr (RA)': {
    synopsis: 'Abu Bakr as-Siddiq (RA) was the closest companion of the Prophet ﷺ and the first adult male to accept Islam. He was the first Caliph and led the Muslim community after the Prophet\'s passing. Known for his unwavering faith and truthfulness.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Abu+Bakr+Siddiq+Companion+Islam',
  },
  'Umar (RA)': {
    synopsis: 'Umar ibn al-Khattab (RA) was the second Caliph and one of the greatest leaders in Islamic history. He accepted Islam after reading the Quran and strengthened the Muslim community. Known for justice and expansion of the Islamic state.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Umar+ibn+Khattab+Caliph+Islam',
  },
  'Uthman (RA)': {
    synopsis: 'Uthman ibn Affan (RA) was the third Caliph, known for his modesty and generosity. He compiled the Quran into one standard mus-haf. He was married to two of the Prophet\'s daughters and was one of the ten promised Paradise.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Uthman+ibn+Affan+Caliph+Quran',
  },
  'Ali (RA)': {
    synopsis: 'Ali ibn Abi Talib (RA) was the cousin and son-in-law of the Prophet ﷺ, and the fourth Caliph. He grew up in the Prophet\'s house, was among the first to accept Islam, and was known for his courage and knowledge.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Ali+ibn+Abi+Talib+Companion+Islam',
  },
  'Bilal (RA)': {
    synopsis: 'Bilal ibn Rabah (RA) was an Abyssinian companion and the first mu\'adhin (caller to prayer). He was freed from slavery by Abu Bakr (RA) and remained devoted to the Prophet ﷺ. His call to prayer is remembered to this day.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Bilal+ibn+Rabah+Adhan+Islam',
  },
  'Hamza (RA)': {
    synopsis: 'Hamza ibn Abdul-Muttalib (RA) was the uncle of the Prophet ﷺ and the "Lion of Allah." He accepted Islam in defense of the Prophet and was martyred at Uhud. He was known for his strength and bravery.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Hamza+ibn+Abdul+Muttalib+Martyr+Uhud',
  },
  'Zayd (RA)': {
    synopsis: 'Zayd ibn Harithah (RA) was the freed slave and adopted son of the Prophet ﷺ. He was one of the first to accept Islam and was martyred at the Battle of Mu\'tah. He was so beloved that Surah Al-Ahzab was revealed about him.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Zayd+ibn+Harithah+Companion+Islam',
  },
  'Umm Aiman (RA)': {
    synopsis: 'Umm Aiman (RA) was the nursemaid and then freed slave of the Prophet ﷺ. She was like family to him; he called her "my mother after my mother." She migrated to Madinah and was among the noble female companions.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Umm+Aiman+Companion+Prophet+Muhammad',
  },
  'Zainab (RA)': {
    synopsis: 'Zainab (RA) was the eldest daughter of the Prophet ﷺ and Khadija (RA). She married Abu al-As and remained in Makkah until after Badr. She is among the noble women of the Prophet\'s household.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Zainab+daughter+Prophet+Muhammad+Islam',
  },
  'Hassan (RA)': {
    synopsis: 'Hassan ibn Ali (RA) was the grandson of the Prophet ﷺ, son of Fatima (RA) and Ali (RA). He was known for his patience, generosity, and reconciliation. He is one of the leaders of the youth of Paradise.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Hassan+ibn+Ali+Grandson+Prophet+Islam',
  },
  'Hussein (RA)': {
    synopsis: 'Hussein ibn Ali (RA) was the grandson of the Prophet ﷺ and the son of Fatima (RA) and Ali (RA). He was martyred at Karbala. He is remembered for his stand for justice and is one of the leaders of the youth of Paradise.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Hussein+ibn+Ali+Karbala+Islam',
  },
  'Anas (RA)': {
    synopsis: 'Anas ibn Malik (RA) served the Prophet ﷺ for ten years as a youth. He narrated many hadiths and lived to see the spread of Islam. He is one of the most prolific narrators from the Prophet.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Anas+ibn+Malik+Companion+Hadith',
  },
  'Abdullah ibn Abbas (RA)': {
    synopsis: 'Abdullah ibn Abbas (RA) was the cousin of the Prophet ﷺ and is known as the "Scholar of the Ummah." He was a leading interpreter of the Quran and a great narrator of hadith. He was highly respected for his knowledge.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Abdullah+ibn+Abbas+Scholar+Quran+Tafsir',
  },
  'Abu Hurairah (RA)': {
    synopsis: 'Abu Hurairah (RA) was one of the most prolific narrators of hadith. He spent much time with the Prophet ﷺ and memorized his sayings. He is a major source of the Prophet\'s teachings for the ummah.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Abu+Hurairah+Hadith+Narrator+Islam',
  },
  'Sahabah (RA)': {
    synopsis: 'The Sahabah (Companions) are those who met the Prophet ﷺ as Muslims and died upon Islam. They transmitted the Quran and Sunnah and spread Islam. The Prophet said the best generation is his, then those who follow them.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Sahabah+Companions+Prophet+Muhammad+Islam',
  },
};

// Women in Islam
const womenInIslamLearnMore: Record<string, LearnMoreItem> = {
  'Khadija (RA)': {
    synopsis: 'Khadija bint Khuwaylid (RA) was the first wife of the Prophet ﷺ and the first person to believe in his message. She was a successful merchant who supported him with her wealth and heart. The Prophet called her the best of women.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Khadija+wife+Prophet+Muhammad+Islam',
  },
  'Aisha (RA)': {
    synopsis: 'Aisha bint Abu Bakr (RA) was a wife of the Prophet ﷺ and a leading scholar of Islam. She narrated many hadiths and taught the companions after his passing. She is known as the Mother of the Believers and "the one who knew the religion."',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Aisha+bint+Abu+Bakr+Islam+Hadith',
  },
  'Fatima (RA)': {
    synopsis: 'Fatima (RA) was the beloved daughter of the Prophet ﷺ and Khadija (RA). She married Ali (RA) and was the mother of Hassan and Hussein (RA). The Prophet said she is the leader of the women of Paradise.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Fatima+daughter+Prophet+Muhammad+Islam',
  },
  'Maryam': {
    synopsis: 'Maryam (Mary) is the only woman named in the Quran and has a chapter named after her. She was chosen above all women, gave birth to Prophet Isa (AS) without a father, and is a model of purity and devotion.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Maryam+Mary+in+Quran+Islam',
  },
  'Asiya': {
    synopsis: 'Asiya was the wife of Pharaoh who believed in Allah and in Musa (AS). She prayed for a house with Allah in Paradise and was martyred for her faith. The Prophet ﷺ named her among the best of women.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Asiya+wife+Pharaoh+Musa+Islam',
  },
  'Sumayyah': {
    synopsis: 'Sumayyah (RA) was the first martyr of Islam. She was tortured by the Quraysh for her faith and refused to renounce Islam. She died for the sake of Allah and is honored as the first of the martyrs.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Sumayyah+first+martyr+Islam',
  },
  'Umm Aiman (RA)': {
    synopsis: 'Umm Aiman (RA) was the nursemaid and then freed slave of the Prophet ﷺ. He called her "my mother after my mother." She was among the early believers and migrated to Madinah.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Umm+Aiman+Companion+Prophet+Muhammad',
  },
  'Zainab bint Muhammad (RA)': {
    synopsis: 'Zainab bint Muhammad (RA) was the eldest daughter of the Prophet ﷺ and Khadija (RA). She married Abu al-As and showed great patience. She is among the noble women of the Prophet\'s household.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Zainab+bint+Muhammad+daughter+Prophet',
  },
  'Nusaybah bint Ka\'ab': {
    synopsis: 'Nusaybah bint Ka\'ab (RA), also known as Umm Amarah, fought at Uhud and shielded the Prophet ﷺ. She was wounded defending him and is remembered as one of the brave women who took part in battle.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Nusaybah+bint+Kaab+Uhud+Islam',
  },
  'Safiyyah (RA)': {
    synopsis: 'Safiyyah bint Huyayy (RA) was a wife of the Prophet ﷺ and Mother of the Believers. She was from the Jewish tribe of Banu Nadir and embraced Islam. She was known for her intelligence and dignity.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Safiyyah+wife+Prophet+Muhammad+Islam',
  },
  'Hafsa (RA)': {
    synopsis: 'Hafsa bint Umar (RA) was a wife of the Prophet ﷺ and daughter of Umar (RA). The first standard copy of the Quran was compiled during the caliphate of her father and kept in her custody.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Hafsa+bint+Umar+Quran+Islam',
  },
  'Umm Salamah (RA)': {
    synopsis: 'Umm Salamah (RA) was a wife of the Prophet ﷺ and Mother of the Believers. She was known for her wisdom and narrated many hadiths. She migrated to Abyssinia and then to Madinah.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Umm+Salamah+wife+Prophet+Muhammad+Islam',
  },
};

// Islamic Scholars & Imams
const islamicScholarsLearnMore: Record<string, LearnMoreItem> = {
  'Imam Malik': {
    synopsis: 'Imam Malik ibn Anas (93–179 AH) founded the Maliki school of jurisprudence. His Muwatta is one of the earliest and most respected collections of hadith and fiqh. He lived in Madinah and learned from its scholars.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Imam+Malik+Maliki+Madhab+Islam',
  },
  'Imam Shafi': {
    synopsis: 'Imam Muhammad ibn Idris ash-Shafi\'i (150–204 AH) founded the Shafi\'i school. He combined the approaches of the Hijaz and Iraq and wrote the Risalah, laying foundations for Islamic legal theory (usul al-fiqh).',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Imam+Shafi+Shafii+Madhab+Islam',
  },
  'Imam Hanbal': {
    synopsis: 'Imam Ahmad ibn Hanbal (164–241 AH) founded the Hanbali school. He was a great hadith scholar and stood firm during the Mihna (inquisition). His Musnad is a major hadith collection.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Imam+Ahmad+Hanbal+Hanbali+Islam',
  },
  'Imam Abu Hanifa': {
    synopsis: 'Imam Abu Hanifa an-Nu\'man (80–150 AH) founded the Hanafi school, the most widely followed today. He was known for reasoning (ra\'y) and analogy (qiyas) in fiqh. He lived in Kufa and had many students.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Imam+Abu+Hanifa+Hanafi+Madhab+Islam',
  },
  'Imam Bukhari': {
    synopsis: 'Imam Muhammad al-Bukhari (194–256 AH) compiled the Sahih al-Bukhari, the most authentic collection of hadith. He traveled widely to gather narrations and set strict criteria for authenticity.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Imam+Bukhari+Sahih+al+Bukhari+Hadith',
  },
  'Imam Muslim': {
    synopsis: 'Imam Muslim ibn al-Hajjaj (206–261 AH) compiled Sahih Muslim, one of the two most authentic hadith books. He was a student of Imam Bukhari and applied rigorous standards to his collection.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Imam+Muslim+Sahih+Muslim+Hadith',
  },
  'Imam Tirmidhi': {
    synopsis: 'Imam at-Tirmidhi (209–279 AH) compiled the Jami\' at-Tirmidhi, one of the six canonical hadith books. He added notes on the legal use of each hadith and the opinions of the scholars.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Imam+Tirmidhi+Jami+Hadith+Islam',
  },
  'Al-Nawawi': {
    synopsis: 'Imam an-Nawawi (631–676 AH) was a Shafi\'i scholar from Syria. He wrote Riyad as-Salihin, Forty Hadith, and commentaries on Sahih Muslim. His works are still studied worldwide.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Imam+Nawawi+Riyad+Salihin+Islam',
  },
  'Ibn Qayyim': {
    synopsis: 'Ibn Qayyim al-Jawziyya (691–751 AH) was a Hanbali scholar and student of Ibn Taymiyyah. He wrote on tawheed, spirituality, and healing. His works include Zad al-Ma\'ad and Ighathat al-Lahfan.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Ibn+Qayyim+al+Jawziyya+Islam',
  },
};

// Hajj & Umrah
const hajjUmrahLearnMore: Record<string, LearnMoreItem> = {
  'Hajj': {
    synopsis: 'Hajj is the pilgrimage to Makkah that every able Muslim must perform once in a lifetime. It takes place in Dhul Hijjah and includes Tawaf, Sa\'i, standing at Arafat, and other rites. It is one of the five pillars of Islam.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Hajj+Pilgrimage+Makkah+Islam',
  },
  'Umrah': {
    synopsis: 'Umrah is the lesser pilgrimage to Makkah. It can be performed any time and includes Tawaf around the Kaaba and Sa\'i between Safa and Marwah. It is highly recommended but not obligatory like Hajj.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Umrah+Pilgrimage+Makkah+Islam',
  },
  'Makkah': {
    synopsis: 'Makkah is the holiest city in Islam, the birthplace of the Prophet ﷺ and the site of the Kaaba. Muslims face it for prayer and perform Hajj and Umrah there. It is in present-day Saudi Arabia.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Makkah+Mecca+Holy+City+Islam',
  },
  'Madinah': {
    synopsis: 'Madinah (Medina) is the second holiest city. The Prophet ﷺ migrated there and established the first Islamic state. Masjid an-Nabawi contains his grave. Muslims often visit it after Hajj or Umrah.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Madinah+Medina+Prophet+Mosque+Islam',
  },
  'Kaaba': {
    synopsis: 'The Kaaba is the cube-shaped building in Makkah that Muslims face in prayer. It was built by Ibrahim (AS) and Ismail (AS) and is the House of Allah. Tawaf is performed around it during Hajj and Umrah.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Kaaba+Makkah+Islam+History',
  },
  'Tawaf': {
    synopsis: 'Tawaf is the act of circumambulating the Kaaba seven times, counterclockwise. It is part of Hajj and Umrah. Pilgrims begin and end at the Black Stone and make du\'a as they go.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Tawaf+Kaaba+Hajj+Umrah+Islam',
  },
  'Black Stone': {
    synopsis: 'The Black Stone (al-Hajar al-Aswad) is set in the corner of the Kaaba. It was placed by Ibrahim (AS) and is kissed or pointed to during Tawaf. It is a symbol, not worshipped; worship is for Allah alone.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Black+Stone+Kaaba+Hajj+Islam',
  },
  'Zamzam Water': {
    synopsis: 'Zamzam is the blessed well in Makkah near the Kaaba. It sprang forth when Hajar ran between Safa and Marwah for her son Ismail (AS). Pilgrims drink from it and often take it home. It is a symbol of Allah\'s care.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Zamzam+Water+Makkah+Islam',
  },
  'Pilgrimage': {
    synopsis: 'Pilgrimage in Islam refers to Hajj (obligatory) and Umrah (recommended)—the journey to Makkah to perform the rites. It symbolizes unity, equality, and devotion to Allah.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Hajj+Umrah+Pilgrimage+Islam',
  },
};

// Ramadan & Islamic months / holidays
const ramadanIslamicMonthsLearnMore: Record<string, LearnMoreItem> = {
  'Ramadan': {
    synopsis: 'Ramadan is the ninth month of the Islamic calendar, when Muslims fast from dawn to sunset. It is the month in which the Quran was revealed. Fasting is one of the five pillars of Islam and a time of worship and reflection.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Ramadan+Fasting+Islam',
  },
  'Laylatul Qadr': {
    synopsis: 'Laylatul Qadr (the Night of Decree) is better than a thousand months. The Quran was first revealed in this night, which falls in the last ten nights of Ramadan. Muslims seek it through worship and du\'a.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Laylatul+Qadr+Night+of+Power+Ramadan',
  },
  'Eid al-Fitr': {
    synopsis: 'Eid al-Fitr is the festival that marks the end of Ramadan. Muslims pray the Eid prayer, give charity (fitr), and celebrate with family and community. It is a day of gratitude and joy.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Eid+al+Fitr+Islam+Celebration',
  },
  'Eid al-Adha': {
    synopsis: 'Eid al-Adha (the Festival of Sacrifice) is celebrated on the 10th of Dhul Hijjah, during Hajj. It commemorates Ibrahim (AS)\'s willingness to sacrifice his son. Muslims sacrifice an animal and share the meat.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Eid+al+Adha+Sacrifice+Islam',
  },
  'Ashura': {
    synopsis: 'Ashura is the 10th day of Muharram. Musa (AS) and his people were saved from Pharaoh on this day; the Prophet ﷺ fasted and encouraged fasting. It is a day of gratitude and reflection.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Ashura+Muharram+Islam+Fasting',
  },
  'Mawlid': {
    synopsis: 'Mawlid is the observance of the birth of the Prophet Muhammad ﷺ, often in Rabi al-Awwal. Muslims remember his life, send blessings upon him, and increase in love and following of his example.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Mawlid+Prophet+Muhammad+Birth+Islam',
  },
  'Dhul Hijjah': {
    synopsis: 'Dhul Hijjah is the last month of the Islamic calendar and the month of Hajj. The first ten days are especially blessed; the 9th is the Day of Arafat and the 10th is Eid al-Adha.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Dhul+Hijjah+Hajj+Month+Islam',
  },
  'Muharram': {
    synopsis: 'Muharram is the first month of the Islamic calendar and one of the sacred months. The 10th is Ashura. The Prophet ﷺ called it "the month of Allah" and encouraged fasting, especially on Ashura.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Muharram+Islamic+New+Year+Islam',
  },
  'Iftar': {
    synopsis: 'Iftar is the meal with which Muslims break their fast at sunset during Ramadan. It is a time of gratitude and often shared with family and community. The Prophet ﷺ broke his fast with dates and water.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Iftar+Breaking+Fast+Ramadan',
  },
  'Suhoor': {
    synopsis: 'Suhoor is the pre-dawn meal eaten before the fast begins in Ramadan. The Prophet ﷺ encouraged it and said there is blessing in it. It helps sustain the fasting person through the day.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Suhoor+Pre+dawn+meal+Ramadan',
  },
  'Taraweeh': {
    synopsis: 'Taraweeh are the voluntary night prayers performed in Ramadan, usually in congregation. The Prophet ﷺ prayed them and encouraged them. Many communities complete the full Quran in Taraweeh over the month.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Taraweeh+Ramadan+Night+Prayer+Islam',
  },
};

// Quran Surahs
const quranSurahsLearnMore: Record<string, LearnMoreItem> = {
  'Al-Fatiha': {
    synopsis: 'Al-Fatiha (The Opening) is the first chapter of the Quran. It is recited in every unit of prayer and is known as Umm al-Quran (Mother of the Quran). It includes praise of Allah, His lordship, and a prayer for guidance.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Surah+Al+Fatiha+Quran+Meaning',
  },
  'Al-Ikhlas': {
    synopsis: 'Al-Ikhlas (Sincerity) is a short surah that affirms the oneness of Allah. The Prophet ﷺ said it equals one-third of the Quran in reward. It is often recited for protection and blessing.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Surah+Al+Ikhlas+Quran+Tafsir',
  },
  'Yasin': {
    synopsis: 'Yasin is the 36th chapter of the Quran, known as the heart of the Quran. It is often recited for the deceased and contains stories of earlier prophets and signs of Allah\'s power.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Surah+Yasin+Quran+Full+Recitation',
  },
  'Al-Baqarah': {
    synopsis: 'Al-Baqarah (The Cow) is the longest chapter of the Quran. It contains laws, stories of Bani Israel, and the verse of the Throne (Ayat al-Kursi). It was revealed in Madinah.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Surah+Al+Baqarah+Quran+Introduction',
  },
  'Al-Kahf': {
    synopsis: 'Al-Kahf (The Cave) tells of the youth who slept in a cave for centuries, Musa and Khidr, Dhul Qarnayn, and the parable of the two gardens. The Prophet ﷺ recommended reciting it every Friday.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Surah+Al+Kahf+Quran+Stories',
  },
  'Ar-Rahman': {
    synopsis: 'Ar-Rahman (The Most Merciful) describes Allah\'s favors and blessings. Its refrain "So which of the favors of your Lord would you deny?" appears repeatedly. It is known for its rhythmic beauty.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Surah+Ar+Rahman+Quran+Recitation',
  },
  'Al-Mulk': {
    synopsis: 'Al-Mulk (The Sovereignty) speaks of Allah\'s creation and the consequences for those who reject the truth. The Prophet ﷺ said it protects from the punishment of the grave.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Surah+Al+Mulk+Quran+Benefits',
  },
  'An-Nas': {
    synopsis: 'An-Nas (Mankind) is the last surah of the Quran. It seeks refuge in Allah from the evil of mankind, jinn, and whisperers. Often recited with Al-Falaq for protection.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Surah+An+Nas+Al+Falaq+Protection',
  },
  'Al-Falaq': {
    synopsis: 'Al-Falaq (The Daybreak) seeks refuge in Allah from external evils. Together with An-Nas and Al-Ikhlas, they form the Mu\'awwidhat (surahs of refuge) for protection.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Surah+Al+Falaq+Quran+Meaning',
  },
  'Al-Kawthar': {
    synopsis: 'Al-Kawthar is the shortest surah. Allah gave the Prophet ﷺ Al-Kawthar (a river in Paradise) in response to his enemies. It encourages gratitude and devotion.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Surah+Al+Kawthar+Quran+Tafsir',
  },
  'Al-Asr': {
    synopsis: 'Al-Asr (The Declining Day) is a short surah emphasizing that mankind is in loss except those who believe, do good, and enjoin truth and patience. A profound summary of success.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Surah+Al+Asr+Quran+Meaning',
  },
  'Al-Fil': {
    synopsis: 'Al-Fil (The Elephant) tells of the Year of the Elephant, when Abraha\'s army was destroyed by birds. The Prophet ﷺ was born in that year.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Surah+Al+Fil+Year+of+Elephant+Quran',
  },
  'Maryam': {
    synopsis: 'Surah Maryam tells of Zakariyya, Yahya, Maryam, and the birth of Isa (AS). It emphasizes Allah\'s power to do the impossible and the importance of family and worship.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Surah+Maryam+Quran+Story',
  },
  'Yusuf': {
    synopsis: 'Surah Yusuf is a complete narrative of Prophet Yusuf (AS)—his dreams, betrayal by brothers, life in Egypt, and reunion. The Prophet ﷺ called it the most beautiful of stories.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Surah+Yusuf+Story+Quran',
  },
  'Ibrahim': {
    synopsis: 'Surah Ibrahim is named after Prophet Ibrahim (AS). It contains his du\'as, stories of earlier prophets, and lessons on gratitude and the consequences of ingratitude.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Surah+Ibrahim+Quran+Tafsir',
  },
};

// Stories from the Quran
const quranStoriesLearnMore: Record<string, LearnMoreItem> = {
  'People of the Cave': {
    synopsis: 'The story of young believers who fled persecution and slept in a cave for centuries. Allah preserved them as a sign of resurrection. Told in Surah Al-Kahf.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=People+of+the+Cave+Ashab+al+Kahf+Quran',
  },
  'Musa and Khidr': {
    synopsis: 'Prophet Musa (AS) journeyed with al-Khidr, who performed puzzling actions. Khidr explained that Allah\'s wisdom surpasses human understanding. A lesson in trusting Allah.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Musa+and+Khidr+Quran+Story',
  },
  'Queen of Sheba': {
    synopsis: 'The Queen of Sheba (Bilqis) ruled a powerful kingdom. When Sulaiman (AS) invited her to Islam, she came and submitted. Her story shows wisdom and the power of truth.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Queen+of+Sheba+Bilqis+Sulaiman+Quran',
  },
  'Story of Yusuf': {
    synopsis: 'Yusuf (AS) was betrayed by his brothers, sold into Egypt, and rose to power. He forgave his brothers and reunited his family. A story of patience, dreams, and divine plan.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Story+of+Yusuf+Joseph+Quran',
  },
  'Noah and the Ark': {
    synopsis: 'Prophet Nuh (AS) preached for centuries. When his people rejected him, Allah commanded the Ark. The believers were saved; the disbelievers drowned. A sign of Allah\'s justice.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Noah+Ark+Prophet+Nuh+Quran',
  },
  'Ibrahim and the Fire': {
    synopsis: 'When Ibrahim (AS) was thrown into the fire for calling to Tawheed, Allah said "O fire, be cool and safe for Ibrahim." He emerged unharmed—a miracle of Allah\'s protection.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Ibrahim+Fire+Prophet+Abraham+Quran',
  },
  'Maryam and Isa': {
    synopsis: 'Maryam (AS) gave birth to Isa (AS) without a father. She was pure and devoted. Isa spoke as an infant, declaring he was a servant of Allah and a prophet.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Maryam+Isa+Virgin+Birth+Quran',
  },
  'Dhul Qarnayn': {
    synopsis: 'Dhul Qarnayn was a righteous king who traveled east and west. He built a wall to contain Ya\'juj and Ma\'juj. His story is in Surah Al-Kahf.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Dhul+Qarnayn+Quran+Story',
  },
  'Prophet Saleh and the Camel': {
    synopsis: 'Prophet Saleh (AS) was sent to Thamud. Allah gave them a she-camel as a sign. They killed it and were destroyed. A lesson in heeding prophetic guidance.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Prophet+Saleh+Thamud+Camel+Quran',
  },
  'People of the Elephant': {
    synopsis: 'Abraha marched to destroy the Kaaba with his elephant army. Allah sent birds that pelted them with stones. The year of the Prophet\'s ﷺ birth.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=People+of+the+Elephant+Abraha+Quran',
  },
  'Cave of Hira': {
    synopsis: 'The Cave of Hira is where the Prophet ﷺ received the first revelation from Jibril. "Read in the name of your Lord who created..." (Surah Al-Alaq) began the Quran.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Cave+of+Hira+First+Revelation+Quran',
  },
  'Ashab al-Ukhdud': {
    synopsis: 'The People of the Trench were believers who were burned in trenches for their faith. A boy, a monk, and others chose death over abandoning Islam. Their story inspires steadfastness.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Ashab+al+Ukhdud+People+of+the+Trench+Quran',
  },
  'Talut and Jalut': {
    synopsis: 'Talut (Saul) led the Israelites against Jalut (Goliath). Dawud (AS) defeated Jalut with a sling. A story of trust in Allah and the victory of the few over the many.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Talut+Jalut+Dawud+Goliath+Quran',
  },
  'The Cow of Bani Israel': {
    synopsis: 'When a man was killed, Musa (AS) was told to strike the dead with part of a sacrificed cow. The cow had to meet specific conditions. A lesson in obeying Allah\'s commands fully.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Cow+of+Bani+Israel+Quran+Story',
  },
  'Manna and Quail': {
    synopsis: 'Allah provided Bani Israel with manna (sweet food) and quail in the wilderness. They were told to take only what they needed, but some hoarded. A lesson in gratitude and trust.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Manna+Quail+Bani+Israel+Quran',
  },
};

// Sunnah Foods
const sunnahFoodsLearnMore: Record<string, LearnMoreItem> = {
  'Dates': {
    synopsis: 'The Prophet ﷺ broke his fast with dates and said a house without dates has no food. Dates are nutritious and were among his favorite foods. He recommended dates for Suhoor.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Dates+Sunnah+Prophet+Muhammad+Islam',
  },
  'Olives': {
    synopsis: 'The Prophet ﷺ said "Eat olive oil and apply it, for it is from a blessed tree." Olives and olive oil were part of his diet and are mentioned in the Quran.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Olives+Olive+Oil+Sunnah+Islam',
  },
  'Olive Oil': {
    synopsis: 'The Prophet ﷺ encouraged olive oil for eating and applying. It is a Sunnah food with many health benefits and is mentioned in the Quran as a blessed tree.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Olive+Oil+Sunnah+Prophet+Muhammad',
  },
  'Honey': {
    synopsis: 'The Prophet ﷺ said "Healing is in three things: a drink of honey, cupping, and cauterization." Honey is a cure and a Sunnah food he used for healing.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Honey+Sunnah+Healing+Islam',
  },
  'Black Seed': {
    synopsis: 'The Prophet ﷺ said "Black seed is a cure for every disease except death." (Habbatul Barakah) It is a powerful Sunnah remedy used for centuries.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Black+Seed+Habba+Baraka+Sunnah+Islam',
  },
  'Barley': {
    synopsis: 'The Prophet ﷺ recommended barley for fever and illness. Talbina (barley soup) was made for the sick. It is a nourishing Sunnah food.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Barley+Talbina+Sunnah+Prophet+Muhammad',
  },
  'Figs': {
    synopsis: 'Figs are mentioned in the Quran (Surah At-Tin) and were eaten by the Prophet ﷺ. They are a Sunnah fruit with many benefits.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Figs+Sunnah+Quran+Islam',
  },
  'Grapes': {
    synopsis: 'Grapes were among the fruits the Prophet ﷺ ate. They are mentioned in the Quran and were part of the diet in Madinah.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Grapes+Sunnah+Prophet+Muhammad',
  },
  'Pomegranate': {
    synopsis: 'The Prophet ﷺ said "There is not a pomegranate that does not have a seed from Paradise." It is a Sunnah fruit he enjoyed.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Pomegranate+Sunnah+Islam',
  },
  'Milk': {
    synopsis: 'The Prophet ﷺ said "When one of you eats, let him mention the name of Allah, and if he forgets, let him say Bismillah. And when he drinks milk, let him say: O Allah, bless it for us."',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Milk+Sunnah+Prophet+Muhammad',
  },
  'Water': {
    synopsis: 'The Prophet ﷺ drank water in three breaths, never blowing into the vessel, and preferred cool water. He taught moderation and etiquette in drinking.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Water+Drinking+Sunnah+Islam',
  },
  'Vinegar': {
    synopsis: 'The Prophet ﷺ said "What a good condiment vinegar is." He used it with bread and it was a staple in his household.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Vinegar+Sunnah+Prophet+Muhammad',
  },
  'Tharid': {
    synopsis: 'Tharid is bread with broth—the Prophet\'s ﷺ favorite dish. He said "Aisha is the best of women as Tharid is the best of foods."',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Tharid+Sunnah+Food+Prophet+Muhammad',
  },
  'Bread': {
    synopsis: 'The Prophet ﷺ ate bread, often with olive oil, vinegar, or meat. He taught not to waste food and to respect what Allah provides.',
    youtubeUrl: 'https://www.youtube.com/results?search_query=Bread+Sunnah+Prophet+Muhammad',
  },
};

// Unified map: word -> LearnMoreItem (all categories)
const learnMoreMap: Record<string, LearnMoreItem> = {
  ...seerahLearnMore,
  ...prophetsLearnMore,
  ...islamicHistoryLearnMore,
  ...angelsLearnMore,
  ...companionsLearnMore,
  ...womenInIslamLearnMore,
  ...islamicScholarsLearnMore,
  ...hajjUmrahLearnMore,
  ...ramadanIslamicMonthsLearnMore,
  ...quranSurahsLearnMore,
  ...quranStoriesLearnMore,
  ...sunnahFoodsLearnMore,
};

/**
 * Get Learn More content for a secret word. Works for Seerah, Prophets, Islamic History, etc.
 * Returns null if no entry exists for that word.
 */
export function getLearnMore(secretWord: string): LearnMoreItem | null {
  return learnMoreMap[secretWord] ?? null;
}

/**
 * Get Learn More content for any word. Returns curated content when available,
 * otherwise a fallback with short description and YouTube search link.
 */
export function getLearnMoreOrFallback(secretWord: string, categoryName?: string): LearnMoreItem {
  const curated = learnMoreMap[secretWord];
  if (curated) return curated;
  const query = encodeURIComponent(`${secretWord} Islam`);
  return {
    synopsis: categoryName
      ? `Learn more about "${secretWord}" in ${categoryName}.`
      : `Learn more about "${secretWord}".`,
    youtubeUrl: `https://www.youtube.com/results?search_query=${query}`,
  };
}
