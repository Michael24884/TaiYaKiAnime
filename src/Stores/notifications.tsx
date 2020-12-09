import AsyncStorage from '@react-native-async-storage/async-storage';
import create from 'zustand';
import {DetailedDatabaseIDSModel, DetailedDatabaseModel} from '../Models';

type NotificationType = {
  notifications: DetailedDatabaseModel[];
  removeNotification: (arg0: DetailedDatabaseIDSModel) => Promise<void>;
  setNotifications: (arg0: DetailedDatabaseModel) => Promise<void>;
  initNotifications: () => Promise<void>;
};

export const useNotificationStore = create<NotificationType>((set, get) => ({
  notifications: [],
  removeNotification: async (ids) => {
    const anime = get().notifications.find(
      (i) => i.ids.anilist === ids.anilist,
    );
    if (anime) {
      const newAnimeBox = get().notifications.filter(
        (i) => i.ids.anilist !== ids.anilist,
      );
      set((state) => ({...state, notifications: newAnimeBox}));
      await AsyncStorage.setItem('notifications', JSON.stringify(newAnimeBox));
    }
  },
  setNotifications: async (anime) => {
    const item = get().notifications.find(
      (i) => i.ids.anilist === anime.ids.anilist,
    );
    if (item) {
      const box = get().notifications.filter((i) => i.link !== anime.link);
      set((state) => ({...state, notifications: [anime, ...box]}));
      await AsyncStorage.setItem(
        'notifications',
        JSON.stringify([anime, ...get().notifications]),
      );
    } else {
      set((state) => ({
        ...state,
        notifications: [...state.notifications, anime],
      }));
      await AsyncStorage.setItem(
        'notifications',
        JSON.stringify([...get().notifications, anime]),
      );
    }
  },
  initNotifications: async () => {
    const file = await AsyncStorage.getItem('notifications');
    if (file) {
      const notifications = JSON.parse(file) as DetailedDatabaseModel[];
      console.log(notifications.length, ' amount in history');
      set((state) => ({...state, notifications}));
    }
  },
}));
