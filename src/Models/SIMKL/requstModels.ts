export type SimklEpisodes = {
  title: string;
  description?: string;
  episode: number;
  aired: boolean;
  img: string | undefined;
  ids: {
    simkl_id: number;
  };
  link: string;
  sourceName: string;
};

export type SimklIDConversionModel = {
  type: string;
  ids: {
    simkl: number;
    slug: string;
  };
};

export type SimklUserModel = {
  user: {
    name: string;
    avatar: string;
    bio: string;
  };
  account: {
    id: number;
  };
};

export type SimklUserListModel = {
  anime: {
    status: string;
    user_rating: number;
    watched_episodes_count: number;
    total_episodes_count: number;
    show: SimklMediaModel;
  }[];
};

export type SimklMediaModel = {
  title: string;
  poster: string;
  ids: {
    simkl: number;
    mal: string;
  };
};
