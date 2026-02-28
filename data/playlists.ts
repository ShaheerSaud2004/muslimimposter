/**
 * Collections: predefined groups of categories for quick selection.
 * Tapping a collection on Game Setup selects all its category IDs at once.
 */

export type PlaylistId = 'most-popular' | 'ramadan';

export type Playlist = {
  id: PlaylistId;
  nameKey: string; // locale key, e.g. 'gameSetup.playlistsRamadan'
  categoryIds: string[];
};

export const playlists: Playlist[] = [
  {
    id: 'most-popular',
    nameKey: 'gameSetup.playlistsMostPopular',
    // Ramadan collection plus one: worship
    categoryIds: [
      'quran-concepts',
      'quran-surahs',
      'quran-stories',
      'animals-quran',
      'creation-nature',
      'angels',
      'prophets',
      'companions',
      'seerah',
      'worship',
    ],
  },
  {
    id: 'ramadan',
    nameKey: 'gameSetup.playlistsRamadan',
    categoryIds: [
      'quran-concepts',
      'quran-surahs',
      'quran-stories',
      'animals-quran',
      'creation-nature',
      'angels',
      'prophets',
      'companions',
      'seerah',
    ],
  },
];

export const getPlaylistById = (id: PlaylistId): Playlist | undefined =>
  playlists.find(p => p.id === id);
