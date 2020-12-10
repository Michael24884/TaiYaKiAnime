import create from 'zustand';
import {SIMKL} from '../Classes/Trackers/SIMKL';
import {TaiyakiUserListModel} from '../Models';
import _ from 'lodash';
import {StatusInfo} from '../Views/Components';

type SimklStoreType = {
  list: TaiyakiUserListModel[];
  initList: () => Promise<void>;
  updateAnime: (arg0: TaiyakiUserListModel) => void;
  getAnime: (arg0: string) => StatusInfo | undefined;
  emptyList: () => void;
};

export const useSimklStore = create<SimklStoreType>((set, get) => ({
  list: [],
  initList: async () => {
    const list = await new SIMKL().initList();
    set((state) => ({...state, list}));
  },
  updateAnime: (newAnime) => {
    let list = get().list.find(
      (i) => Number(i.ids.mal) === Number(newAnime.ids.mal),
    );
    if (list) {
      list = _.merge(list, newAnime);
      set((state) => ({...state, list: [list, ...state.list]}));
    } else {
      set((state) => ({...state, list: [newAnime, ...state.list]}));
    }
  },
  getAnime: (malID: string) => {
    const list = get().list.filter((i) => Number(i.ids.mal!) === Number(malID));
    if (list.length !== 0)
      return {
        progress: list[0].progress,
        totalEpisodes: list[0].totalEpisodes,
        status: list[0].status,
        score: list[0].score,
      } as StatusInfo;
  },
  emptyList: () => set((state) => ({...state, list: []})),
}));
