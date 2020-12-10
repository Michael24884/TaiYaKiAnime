import AsyncStorage from '@react-native-async-storage/async-storage';
import { LayoutAnimation } from 'react-native';
import create from 'zustand';
import {useSettingsStore} from '.';
import {SimklEpisodes} from '../Models/SIMKL';
import {MyQueueModel} from '../Models/taiyaki';

export type MyQueueItems = {
  [key: string]: MyQueueModel[];
};

export interface QueueState {
  // myQueue: {
  // 	id: number;
  // 	data: MyQueueModel[];
  // }[];
  // hasItem: boolean;
}

type QueueEvents = {
  myQueue: MyQueueItems;
  addToQueue: (arg0: {key: string; data: MyQueueModel}) => Promise<void>;
  addAllToQueue: (arg0: {key: string; data: MyQueueModel}[]) => Promise<void>;
  emptyList: () => void;
  queueLength: number;
  addDirectQueue: (arg0: MyQueueItems) => void;
};

export const useQueueStore = create<QueueEvents>((set, get) => ({
  myQueue: {},
  addAllToQueue: async (value) => {
    const canSaveQueue = useSettingsStore.getState().settings.queue.saveQueue;
    const {myQueue} = get();
    for (let valve in value) {
      const {key, data} = value[valve];
      function _checkInList(): boolean {
        console.log('check');
        if (Object.keys(myQueue).length === 0) return false;
        if (myQueue?.hasOwnProperty(key) ?? false) {
          for (var i = 0; i < myQueue[key].length; i++) {
            if (myQueue[key][i].episode.episode == data.episode.episode) {
              console.log('matched');
              return true;
            }
          }
        }
        return false;
      }

      if (myQueue?.hasOwnProperty(key) ?? false) {
        if (_checkInList()) {
          const d: MyQueueModel = myQueue[key].filter(
            (i) => i.episode.episode == data.episode.episode,
          )[0];
          myQueue[key].splice(myQueue[key].indexOf(d), 1);
          if (myQueue[key].length == 0) {
            delete myQueue[key];
          }
          //set { ...state, myQueue };
          const obj = Object.keys(myQueue)
            .map((i) => myQueue[i].length)
            .reduce((prev, c) => prev + c);

          set((state) => ({...state, myQueue, queueLength: obj}));
        } else {
          myQueue[key].push(data);
          // return { ...state, myQueue };
          const obj = Object.keys(myQueue)
            .map((i) => myQueue[i].length)
            .reduce((prev, c) => prev + c);

          set((state) => ({...state, myQueue, queueLength: obj}));
        }
      } else {
        myQueue[key] = [data];
        const obj = Object.keys(myQueue)
          .map((i) => myQueue[i].length)
          .reduce((prev, c) => prev + c);

        set((state) => ({...state, myQueue, queueLength: obj}));
      }
      //set((state) => ({...state, queueLength: Object.values(get()?.myQueue ?? {}).length}))
      //   const canSaveQueue =
      //     useSettingsStore.getState().settings.queue?.saveMyQueue ?? true;
      if (canSaveQueue)
        await AsyncStorage.setItem('my_queue_storage', JSON.stringify(myQueue));
    }
  },
  addToQueue: async (value) => {
    const canSaveQueue = useSettingsStore.getState().settings.queue.saveQueue;
    const {myQueue} = get();
    const {key, data} = value;
    function _checkInList(): boolean {
      console.log('check');
      if (Object.keys(myQueue).length === 0) return false;
      if (myQueue?.hasOwnProperty(key) ?? false) {
        for (var i = 0; i < myQueue[key].length; i++) {
          if (myQueue[key][i].episode.episode == data.episode.episode) {
            console.log('matched');
            return true;
          }
        }
      }
      return false;
    }

    if (myQueue?.hasOwnProperty(key) ?? false) {
      if (_checkInList()) {
        const d: MyQueueModel = myQueue[key].filter(
          (i) => i.episode.episode == data.episode.episode,
        )[0];
        myQueue[key].splice(myQueue[key].indexOf(d), 1);
        if (myQueue[key].length == 0) {
          delete myQueue[key];
        }
        //set { ...state, myQueue };
        set((state) => ({...state, myQueue}));
      } else {
        myQueue[key].push(data);
        // return { ...state, myQueue };
        set((state) => ({...state, myQueue}));
      }
    } else {
      myQueue[key] = [data];
      // return { ...state, myQueue };
      set((state) => ({...state, myQueue}));
    }
    if (Object.keys(myQueue).length > 0) {
      const obj = Object.keys(myQueue)
        .map((i) => myQueue[i].length)
        .reduce((prev, c) => prev + c);

      set((state) => ({...state, queueLength: obj}));
    } else set((state) => ({...state, queueLength: 0}));
    // const canSaveQueue =
    //   useSettingsStore.getState().settings.queue?.saveMyQueue ?? true;
    if (canSaveQueue)
      await AsyncStorage.setItem(
        'my_queue_storage',
        JSON.stringify(get().myQueue),
      );
  },
  emptyList: async () => {
    set((state) => ({...state, myQueue: {}, queueLength: 0}))
    await AsyncStorage.removeItem('my_queue_storage')
  },
  queueLength: 0,
  addDirectQueue: (value) =>
    set((state) => ({
      ...state,
      myQueue: value,
      queueLength: Object.keys(value)
        .map((i) => value[i].length)
        .reduce((prev, c) => prev + c),
    })),
}));

type UpNextState = {
  upNext: SimklEpisodes[];
  addAll: (arg0: SimklEpisodes[]) => void;
  removeAll: () => void;
  removeSingle: (arg0: number) => void;
};

export const useUpNextStore = create<UpNextState>((set, get) => ({
  upNext: [],
  addAll: (episodes) => set((state) => ({...state, upNext: episodes})),
  removeAll: () => set((state) => ({...state, upNext: []})),

  removeSingle: (episodeNumber) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const next = episodeNumber + 1;
    const upNextList = get().upNext;
    if (next <= upNextList[upNextList.length - 1].episode) {
      const slice = upNextList.findIndex((v) => v.episode === next);
      set((state) => ({...state, upNext: upNextList.slice(slice)}));
    } else set((state) => ({...state, upNext: []}));
    // const future = number + 1;
    // if (future >= get().upNext[0].episode)
    //   return set((state) => ({...state, upNext: []}));
    // const upNext = get().upNext.slice(future);
    // return set((state) => ({...state, upNext}));
  },
}));
