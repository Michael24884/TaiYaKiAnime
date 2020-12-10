import {ImageRequireSource} from 'react-native';
import {
  AnilistPopularGraph,
  AnilistRequestTypes,
  AnilistSeasonalGraph,
  AnilistSeasonsTypes,
  AnilistSourceTypes,
  AnilistStatusTypes,
  AnilistTrendingGraph,
} from '../Models/Anilist';
import {TrackingServiceTypes, WatchingStatus} from '../Models/taiyaki';

export const MapRequestsToTitle = new Map<
  AnilistRequestTypes,
  {title: string; subTitle: string}
>([
  [
    'Popular',
    {title: 'Popular Anime', subTitle: 'Highest voted anime by the users'},
  ],
  ['Trending', {title: 'Now Trending', subTitle: 'Anime on the rise'}],
  ['Seasonal', {title: 'This Season', subTitle: 'Fall 2020'}],
]);

export const MapKeyToPaths = new Map<AnilistRequestTypes, string>([
  ['Popular', AnilistPopularGraph()],
  ['Seasonal', AnilistSeasonalGraph()],
  ['Trending', AnilistTrendingGraph()],
]);

export const dynamicMapPaths = (
  key: AnilistRequestTypes,
  index: number,
): string => {
  switch (key) {
    case 'Popular':
      return AnilistPopularGraph(index);
    case 'Seasonal':
      return AnilistSeasonalGraph(index);
    case 'Trending':
      return AnilistTrendingGraph(index);
    case 'Detail':
      return '';
  }
};

export const MapTrackingServiceToAssets = new Map<
  TrackingServiceTypes,
  ImageRequireSource
>([
  ['Anilist', require('../assets/images/trackers/anilistlogo.png')],
  ['MyAnimeList', require('../assets/images/trackers/mallogo.png')],
  ['SIMKL', require('../assets/images/trackers/simkllogo.png')],
]);

export const MapTrackingServiceToColors = new Map<TrackingServiceTypes, string>(
  [
    ['Anilist', '#00AAFF'],
    ['MyAnimeList', '#2E51A2'],
    ['SIMKL', '#000000'],
  ],
);

export const MapAnilistStatusToString = new Map<AnilistStatusTypes, string>([
  ['FINISHED', 'Finished'],
  ['NOT_YET_RELEASED', 'Not Yet Aired'],
  ['RELEASING', 'Airing'],
]);

export const MapAnilistSeasonsToString = new Map<AnilistSeasonsTypes, string>([
  ['FALL', 'Fall'],
  ['SUMMER', 'Summer'],
  ['SPRING', 'Spring'],
  ['WINTER', 'Winter'],
]);

export const MapAnilistSourceToString = new Map<AnilistSourceTypes, string>([
  ['ANIME', 'Anime'],
  ['DOUJINSHI', 'Doujinshi'],
  ['LIGHT_NOVEL', 'Light Novel'],
  ['MANGA', 'Manga'],
  ['NOVEL', 'Novel'],
  ['ORIGINAL', 'Original'],
  ['OTHER', 'Other'],
  ['VIDEO_GAME', 'Video Game'],
  ['VISUAL_NOVEL', 'Visual Novel'],
]);

export const MapWatchingStatusToNative = new Map<
  string | undefined,
  WatchingStatus
>([
  ['watching', 'Watching'],
  ['CURRENT', 'Watching'],
  ['plan_to_watch', 'Planning'],
  ['plantowatch', 'Planning'],
  ['PLANNING', 'Planning'],
  ['completed', 'Completed'],
  ['COMPLETED', 'Completed'],
  ['on_hold', 'Paused'],
  ['hold', 'Paused'],
  ['PAUSED', 'Paused'],
  ['dropped', 'Dropped'],
  ['notinteresting', 'Dropped'],
  ['DROPPED', 'Dropped'],
  [undefined, 'Add to List'],
]);

export const MapWatchingStatusToAnilist = new Map<WatchingStatus, string>([
  ['Watching', 'CURRENT'],
  ['Planning', 'PLANNING'],
  ['Paused', 'PAUSED'],
  ['Dropped', 'DROPPED'],
  ['Completed', 'COMPLETED'],
]);
export const MapWatchingStatusToSimkl = new Map<WatchingStatus, string>([
  ['Watching', 'watching'],
  ['Planning', 'plantowatch'],
  ['Paused', 'hold'],
  ['Dropped', 'notinteresting'],
  ['Completed', 'completed'],
]);
export const MapWatchingStatusToMAL = new Map<WatchingStatus, string>([
  ['Watching', 'watching'],
  ['Planning', 'plan_to_watch'],
  ['Paused', 'on_hold'],
  ['Dropped', 'dropped'],
  ['Completed', 'completed'],
]);
