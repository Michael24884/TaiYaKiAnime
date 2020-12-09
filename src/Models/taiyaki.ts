import {TrackerBase} from '../Classes/Trackers';
import {SimklEpisodes} from './SIMKL';

export const DiscordLink: string = 'https://discord.gg/8fzmNSB';
export type TrackingServiceTypes = 'MyAnimeList' | 'Anilist' | 'SIMKL';
export type SourceTypes = 'vidstreaming' | '4anime' | 'animeowl';

export type EmbededResolvedModel = {
  quality: string;
  link: string;
  headers?: {[key: string]: string};
};

export type TaiyakiUserModel = {
  source: TrackingServiceTypes;
  bearerToken: string;
  refreshToken?: string;
  expiresIn?: Date;
  class: TrackerBase;
  profile: Partial<UserModel>;
};

export type UserModel = {
  username: string;
  image?: string;
  id: number | string;
};

export type LoginConfigModel = {
  authUrl: string;
  tokenUrl?: string;
  redirectUri: string;
  clientId: string;
  clientSecret?: string;
  randomCode?: string;
};

export type WatchingStatus =
  | 'Watching'
  | 'Planning'
  | 'Completed'
  | 'Paused'
  | 'Dropped'
  | 'Add to List';

export type DetailedDatabaseModel = {
  title: string;
  coverImage: string;
  link?: string;
  totalEpisodes: number;
  isFollowing: boolean;
  lastWatching: LastWatchingModel;
  source: TaiyakiArchiveModel;
  ids: DetailedDatabaseIDSModel;
};

export type MyQueueModel = {
  detail: DetailedDatabaseModel;
  episode: SimklEpisodes;
};

export type HistoryModel = {
  data: MyQueueModel;
  lastModified: Date;
};

export type DetailedDatabaseIDSModel = Partial<{
  anilist: number;
  simkl?: number;
  myanimelist: number;
}>;

export type LastWatchingModel = {
  data: SimklEpisodes;
  episode?: number;
  progress?: number;
  videoProgress?: number;
};

export type TaiyakiArchiveModel = {
  name: string;
  imageURL: string | null;
  developer?: string;
  description?: string;
  hasOptions: boolean;
  userOptions?: {};
  requiredOptions?: {
    id: string;
    requiresAuth: boolean;
    displaysWebview: boolean;
  };
  language: string;
  url: string;
  extraDataTitles: string;
  searchTitles: string;
  scrapeEpisodes: string;
  scrapeLinks: string;
  version: string;
  contraVersion: number;
  baseUrl: string;
  hasCloudflare: boolean;
  headers: {[key: string]: string};
};

export type TaiyakiScrapedTitleModel = {
  title: string;
  image?: string;
  embedLink: string;
};

export type TaiyakiSettingsModel = {
  customization: {
    cover: {
      showVideoCover: boolean;
      delay: number;
    };
    matchPosterColor: boolean;
  };
  general: {
    blurSpoilers: boolean;
    autoPlay: {
      enabled: boolean;
      timerAt94: boolean;
      changeAt100: boolean;
    };
    video: {
      pip: boolean;
      followAspectRatio: boolean;
      preloadUpNext: boolean;
    };
  };
  sync: {
    autoSync: boolean;
    syncAt75: boolean;
    overrideWatchNext: boolean;
  };
  notifications: {
    frequency: number;
    requiresCharging: boolean;
    allowOnLowPower: boolean;
    canUseCellularNetwork: boolean;
  };
  queue: {
    saveQueue: boolean;
  };
  experimental: {
    allowBugReports: boolean;
  };
  about: {};
  dev: {
    videoBuffer: {
      minBufferMs?: number;
      maxBufferMs?: number;
      bufferForPlaybackMs?: number;
      bufferForPlaybackAfterRebufferMs?: number;
    };
    maxBitRate: number;
    automaticallyWaitsToMinimizeStalling: boolean;
  };
};

export const TaiyakiDefaultSettings: TaiyakiSettingsModel = {
  customization: {
    cover: {
      showVideoCover: true,
      delay: 8,
    },
    matchPosterColor: false,
  },
  general: {
    blurSpoilers: true,
    autoPlay: {
      enabled: true,
      timerAt94: true,
      changeAt100: true,
    },
    video: {
      pip: false,
      followAspectRatio: true,
      preloadUpNext: true,
    },
  },
  sync: {
    autoSync: false,
    syncAt75: false,
    overrideWatchNext: false,
  },
  notifications: {
    frequency: 60,
    allowOnLowPower: true,
    canUseCellularNetwork: true,
    requiresCharging: false,
  },
  queue: {
    saveQueue: true,
  },
  experimental: {
    allowBugReports: true,
  },
  about: {},
  dev: {
    videoBuffer: {
      bufferForPlaybackAfterRebufferMs: undefined,
      bufferForPlaybackMs: undefined,
      maxBufferMs: undefined,
      minBufferMs: undefined,
    },
    maxBitRate: 0,
    automaticallyWaitsToMinimizeStalling: true,
  },
};

export type TaiyakiUserListModel = {
  status: WatchingStatus;
  progress: number;
  score?: number;
  coverImage: string;
  title: string;
  totalEpisodes?: number;
  ids: {anilist?: number; mal?: string};
};
