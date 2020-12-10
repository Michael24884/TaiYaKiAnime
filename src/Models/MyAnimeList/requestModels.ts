import {StatusInfo} from '../../Views/Components';

export type MALUserModel = {
  id: number;
  name: string;
  picture?: string;
  joined_at: string;
  anime_statistics: {
    num_days: number;
    num_episodes: number;
  };
};

export type MALDetailed = {
  id: number;
  num_episodes: number;
  my_list_status?: MALListStatus;
  mappedEntry: StatusInfo;
};

export type MALListStatus = {
  status: string;
  score: number;
  num_episodes_watched: number;
  start_date?: string;
  end_date?: string;
};

export type MyAnimeListUserListModel = {
  data: MyAnimeListCombinedListModel[];
};

export type MyAnimeListCombinedListModel = {
  node: MyAnimeListNode;
  list_status: MyAnimeListListStatusModel;
};

export type MyAnimeListNode = {
  id: number;
  title: string;
  num_episodes: number;
  main_picture: {
    medium: string;
    large?: string;
  };
};

export type MyAnimeListListStatusModel = {
  status: string;
  score: number;
  num_episodes_watched: number;
};
