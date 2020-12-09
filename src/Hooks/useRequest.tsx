/* eslint-disable no-undef */
import {useState} from 'react';
import {LayoutAnimation, Platform, UIManager} from 'react-native';
import {QueryConfig, useQuery, useInfiniteQuery} from 'react-query';
import {MyAnimeList} from '../Classes/Trackers';
import {
  AnilistCharacterPageGraph,
  AnilistCharacterPageModel,
  AnilistFormatTypes,
  AnilistGenresTypes,
  AnilistMediaListEntry,
  AnilistPagedData,
  AnilistPopularGraph,
  AnilistRecommendationPageGraph,
  AnilistRecommendationPageModel,
  AnilistRequestTypes,
  AnilistSearchGraph,
  AnilistSeasonalGraph,
  AnilistSeasonsTypes,
  AnilistSortTypes,
  AnilistSourceTypes,
  AnilistStatusTypes,
  AnilistTrendingGraph,
  Media,
} from '../Models/Anilist';
import {MALDetailed} from '../Models/MyAnimeList';
import {SimklEpisodes, SimklIDConversionModel} from '../Models/SIMKL';
import {useUserProfiles} from '../Stores';
import {MapWatchingStatusToNative, simklThumbnails} from '../Util';
import {StatusInfo} from '../Views/Components';

if (Platform.OS === 'android')
  if (UIManager.setLayoutAnimationEnabledExperimental)
    UIManager.setLayoutAnimationEnabledExperimental(true);

type RequestConfig = {
  animated?: boolean;
  enabled?: boolean;
  refreshInterval?: number;
};

const defaultConfigs: RequestConfig = {
  animated: true,
  enabled: true,
  refreshInterval: undefined,
};

export function useAnilistRequest<T = AnilistPagedData | Media>(
  key: AnilistRequestTypes | string,
  path: string,
  baserequestConfig: RequestConfig = defaultConfigs,
) {
  const anilistConfig = useUserProfiles((_) => _.profiles).find(
    (i) => i.source === 'Anilist',
  );
  const requestConfig = Object.assign(defaultConfigs, baserequestConfig);
  const {animated, enabled} = requestConfig;
  const baseUrl = 'https://graphql.anilist.co';
  // eslint-disable-next-line no-undef
  const controller = new AbortController();
  const fetcher = (_: string) => {
    const json = JSON.stringify({query: path});
    const headers: {[key: string]: string} = {
      'Content-Type': 'application/json',
    };
    if (anilistConfig)
      headers['Authorization'] = 'Bearer ' + anilistConfig.bearerToken;
    return fetch(baseUrl, {
      method: 'POST',
      body: json,
      headers,
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (key.startsWith('Sync')) {
          const data = responseJson as {
            data: {
              Media: {mediaListEntry: AnilistMediaListEntry; episodes: number};
            };
          };
          if (!data.data.Media.mediaListEntry) return;
          const {
            data: {
              Media: {
                mediaListEntry: {
                  progress,
                  startedAt,
                  status,
                  completedAt,
                  score,
                },
                episodes,
              },
            },
          } = data;
          let end: string | undefined;
          let start: string | undefined;
          if (startedAt.day && startedAt.month && startedAt.year)
            start =
              startedAt.month + '/' + startedAt.day + '/' + startedAt.year;
          if (completedAt.day && completedAt.month && completedAt.year)
            start =
              completedAt.month +
              '/' +
              completedAt.day +
              '/' +
              completedAt.year;
          return {
            progress,
            ended: end,
            score,
            status: MapWatchingStatusToNative.get(status),
            started: start,
            totalEpisodes: episodes,
          } as StatusInfo;
        }
        if (key === 'Popular' || key === 'Trending' || key === 'Seasonal') {
          const modifiedData = responseJson as AnilistPagedData;
          modifiedData.type = key;
          modifiedData.data.Page.media.filter((i) => !i.isAdult);
          return modifiedData;
        } else return responseJson as T;
      });
  };

  const config: QueryConfig<Media | AnilistPagedData, any> = {
    onSuccess: () => {
      if (animated)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    },
    refetchInterval:
      Platform.OS === 'android' ? undefined : requestConfig.refreshInterval,
    staleTime: 25000,
    enabled: enabled,
  };

  return {
    query: useQuery<T>(key, fetcher, config),
    controller,
  };
}
export function useInifiniteAnilistRequest<T>(
  key: AnilistRequestTypes,
  id?: number,
  filters?: {
    query: string;
    filters: {
      sort?: AnilistSortTypes;
      season?: AnilistSeasonsTypes;
      year?: number;
      genres?: AnilistGenresTypes[];
      formats?: AnilistFormatTypes[];
      status?: AnilistStatusTypes;
      source?: AnilistSourceTypes;
    };
  },
) {
  // const {animated} = requestConfig;
  const baseUrl = 'https://graphql.anilist.co';
  // eslint-disable-next-line no-undef
  const controller = new AbortController();

  const switcher = (index: number): string => {
    switch (key) {
      case 'Popular':
        return AnilistPopularGraph(index);
      case 'Seasonal':
        return AnilistSeasonalGraph(index);
      case 'Trending':
        return AnilistTrendingGraph(index);
      case 'Character':
        return AnilistCharacterPageGraph(id!, index);
      case 'Recommendations':
        return AnilistRecommendationPageGraph(id!, index);
      case 'Search':
        const {
          genres,
          status,
          season,
          year,
          sort,
          formats,
          source,
        } = filters!.filters;
        return AnilistSearchGraph(
          filters!.query,
          index,
          genres,
          year,
          season,
          formats,
          sort,
          status,
          source,
        );
      default:
        throw 'This property does not exist';
    }
  };

  const fetcher = (key: string, page = 0) => {
    const json = JSON.stringify({query: switcher(page)});
    const headers = {
      'Content-Type': 'application/json',
    };
    return fetch(baseUrl, {
      method: 'POST',
      body: json,
      headers,
      signal: controller.signal,
    }).then((response) => response.json());
  };

  const keyGen = (): string | null => {
    if (key === 'Character') return 'characters' + id!;
    if (key === 'Recommendations') return 'recommendations' + id!;
    if (key === 'Search') return 'search' + filters?.query;
    return key;
  };

  const isMedia = () => {
    if (key === 'Character' || key === 'Recommendations') {
      return true;
    }
    return false;
  };

  return {
    query: useInfiniteQuery(keyGen(), fetcher, {
      onSettled: () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      },
      notifyOnStatusChange: false,
      getFetchMore: (lastGroup) => {
        if (!lastGroup) return 1;
        if (isMedia()) {
          let dGroup;
          if (key === 'Character') {
            dGroup = (lastGroup as unknown) as AnilistCharacterPageModel;
            if (dGroup.data.Media.characters.pageInfo.hasNextPage)
              return dGroup.data.Media.characters.pageInfo.currentPage + 1;
          } else {
            dGroup = (lastGroup as unknown) as AnilistRecommendationPageModel;
            if (dGroup.data.Media.recommendations.pageInfo.hasNextPage)
              return dGroup.data.Media.recommendations.pageInfo.currentPage + 1;
          }
          return null;
        } else {
          const oGroup = (lastGroup as unknown) as AnilistPagedData;
          if (key === 'Trending' && oGroup.data.Page.pageInfo.currentPage === 4)
            return null;
          if (oGroup.data.Page.pageInfo.hasNextPage) {
            return oGroup.data.Page.pageInfo.currentPage + 1;
          }
        }
        return null;
      },
    }),
    controller,
  };
}

export function useMalRequests<T>(key: string, path: string) {
  const controller = new AbortController();
  const baseUrl = 'https://api.myanimelist.net/v2';
  const [token, setToken] = useState<string | undefined>();
  const user = useUserProfiles((_) => _.profiles).find(
    (i) => i.source === 'MyAnimeList',
  );

  if (user && user.bearerToken) new MyAnimeList().tokenWatch().then(setToken);

  const headers = {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
  };

  const fetcher = (_: string) => {
    return fetch(baseUrl + path, {headers})
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (path.startsWith('/anime')) {
          const media = data as MALDetailed;
          if (media.my_list_status) {
            const {
              num_episodes_watched,
              score,
              end_date,
              status,
              start_date,
            } = media.my_list_status;
            media.mappedEntry = {
              progress: num_episodes_watched,
              totalEpisodes: media.num_episodes,
              ended: end_date,
              score: score,
              started: start_date,
              status: MapWatchingStatusToNative.get(status),
            };
          }
          return media;
        }
        const modifiedData = data as T;
        return modifiedData;
      });
  };
  const config: QueryConfig<T, any> = {
    enabled: token,
    onSettled: () =>
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut),
    onError: (error) => {
      console.log('error obtained from mal', error);
    },
    notifyOnStatusChange: false,
  };

  return {
    query: useQuery<T>(key, fetcher, config),
    controller,
  };
}

export function useSimklRequests<T>(
  key: string,
  path: string,
  simklID?: number,
  malID?: string,
  requiresConversion = true,
  enabled: boolean = true,
) {
  const baseUrl = 'https://api.simkl.com';
  const controller = new AbortController();
  const headers = {
    'simkl-api-key':
      'b3392816b2f405397aa0721dc2af589e2ed6f71d333abd6200ae19a56d9bc685',
    'Content-Type': 'application/json',
  };
  const [animeID, setAnimeID] = useState<number | undefined>(simklID);

  if (requiresConversion && !animeID && enabled && malID) {
    fetch(baseUrl + '/search/id?mal=' + malID, {headers})
      .then((response) => response.json())
      .then((json: SimklIDConversionModel[]) => {
        setAnimeID(json[0].ids.simkl);
      });
  }

  const fetcher = () => {
    return fetch(
      requiresConversion
        ? baseUrl + path + animeID + '?extended=full'
        : baseUrl + path,
      {
        signal: controller.signal,
        headers,
      },
    )
      .then((response) => response.json())
      .then((data) => {
        if (path.includes('recently-watched-background')) {
          const media = data as {
            fanart?: string;
            poster?: string;
            title: string;
          };
          media.fanart = simklThumbnails(media.fanart, 'fanart');
          media.poster = simklThumbnails(media.poster);
          return media;
        }
        if (path.includes('/episodes/')) {
          const media = data as SimklEpisodes[];
          media.map((i) => (i.img = simklThumbnails(i.img, 'episode')));
          return media;
        }
        return data;
      });
  };
  const config: QueryConfig<T, any> = {
    enabled: malID && enabled,
    onSuccess: () =>
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut),
    notifyOnStatusChange: false,
  };

  return {
    query: useQuery<T>([key, animeID], fetcher, config),
    controller,
    ids: {simkl: animeID, myanimelist: Number(malID)},
  };
}
