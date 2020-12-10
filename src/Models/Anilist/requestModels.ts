import {AnilistRequestTypes} from '.';
import {StatusInfo} from '../../Views/Components';

export type AnilistStatusTypes = 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED';
export type AnilistSeasonsTypes = 'WINTER' | 'FALL' | 'SUMMER' | 'SPRING';
export type AnilistSourceTypes =
  | 'ORIGINAL'
  | 'MANGA'
  | 'LIGHT_NOVEL'
  | 'VISUAL_NOVEL'
  | 'VIDEO_GAME'
  | 'OTHER'
  | 'NOVEL'
  | 'DOUJINSHI'
  | 'ANIME';

export type AnilistCharacterRoleTypes = 'SUPPORTING' | 'MAIN' | 'BACKGROUND';
export type AnilistGenresTypes =
  | 'Action'
  | 'Adventure'
  | 'Comedy'
  | 'Drama'
  | 'Ecchi'
  | 'Fantasy'
  | 'Horror'
  | 'Mahou Shoujo'
  | 'Mecha'
  | 'Music'
  | 'Mystery'
  | 'Psychological'
  | 'Romance'
  | 'Sci-Fi'
  | 'Slice of Life'
  | 'Sports'
  | 'Supernatural'
  | 'Thriller';
export type AnilistFormatTypes =
  | 'TV'
  | 'TV_SHORT'
  | 'MOVIE'
  | 'SPECIAL'
  | 'OVA'
  | 'ONA'
  | 'MUSIC';
export type AnilistSortTypes =
  | 'TITLE_ROMAJI'
  | 'POPULARITY_DESC'
  | 'SCORE_DESC'
  | 'TRENDING_DESC'
  | 'FAVOURITES_DESC';
export type AnilistPagedData = {
  data: {
    Page: {
      pageInfo: PageInfo;
      media: Media[];
    };
  };
  type: AnilistRequestTypes;
};
export type AnilistPagedUserRecData = {
  data: {
    Page: {
      pageInfo: PageInfo;
      recommendations: {media: Media}[];
    };
  };
  type: AnilistRequestTypes;
};

export type PageInfo = {
  hasNextPage: boolean;
  currentPage: number;
};

export type Media = {
  id: number;
  idMal: string;
  isAdult: boolean;
  description?: string;
  genres: string[];
  meanScore: number;
  format: string;
  popularity: number;
  status: AnilistStatusTypes;
  countryOfOrigin: string;
  hashtag: string;
  source: AnilistSourceTypes;
  duration: number;
  season: AnilistSeasonsTypes;
  seasonYear: number;
  episodes: number;
  nextAiringEpisode?: {
    episode: number;
    timeUntilAiring: number;
  };
  title: {
    romaji: string;
    english?: string;
  };
  coverImage: {
    extraLarge: string;
  };
  bannerImage?: string;
  characters: {
    nodes: AnilistCharacterModel[];
  };
  recommendations: {
    edges: AnilistRecommendationPageEdgeModel[];
  };
  startDate: AnilistDates;
  endDate: AnilistDates;
  mappedEntry: StatusInfo;
};

export type AnilistMediaListEntry = {
  progress: number;
  score: number;
  status: string;
  startedAt: AnilistDates;
  completedAt: AnilistDates;
};

export type AnilistCharacterModel = {
  name: {full: string};
  image: {large: string};
  id: number;
};

export type AnilistDates = {
  year?: number;
  day?: number;
  month?: number;
};

export type AnilistViewerModel = {
  data: {
    Viewer: {
      name: string;
      id: number;
      avatar: {large: string};
      bannerImage?: string;
    };
  };
};

export type AnilistMediaListCollectionModel = {
  data: {
    MediaListCollection: {
      lists: AnilistMediaListCollectionEntriesModel[];
    };
  };
};

export type AnilistMediaListCollectionEntriesModel = {
  entries: {
    media: Media;
    progress: number;
    score: number;
    status: string;
  }[];
};

export type AnilistCharacterPageEdgeModel = {
  role: AnilistCharacterRoleTypes;
  node: AnilistCharacterModel;
};

export type AnilistRecommendationPageEdgeModel = {
  node: {
    mediaRecommendation: Media;
  };
  type: AnilistRequestTypes;
};

export type AnilistRecommendationPageModel = {
  data: {
    Media: {
      recommendations: {
        pageInfo: PageInfo;
        edges: AnilistRecommendationPageEdgeModel[];
      };
    };
  };
};

export type AnilistCharacterPageModel = {
  data: {
    Media: {
      characters: {
        pageInfo: PageInfo;
        edges: AnilistCharacterPageEdgeModel[];
      };
    };
  };
};

export type AnilistSearchModel = {
  data: {
    Page: {
      pageInfo: PageInfo;
      media: Media[];
    };
  };
};

export type AnilistUserModel = {

 }