import AsyncStorage from '@react-native-async-storage/async-storage';
import produce from 'immer';
import create from 'zustand';
const _ = require('lodash');
import {TaiyakiDefaultSettings, TaiyakiSettingsModel} from '../Models/taiyaki';

type SettingsStore = {
  settings: TaiyakiSettingsModel;
  setSettings: (state: TaiyakiSettingsModel) => void;
  initSettings: () => Promise<void>;
  set: (fn: any) => void;
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  set: async (fn) => {
    set(produce(fn));
    await AsyncStorage.mergeItem('settings', JSON.stringify(get().settings));
  },
  settings: TaiyakiDefaultSettings,
  setSettings: async (settings) => {
    //set((state) => ({...state, settings}));

    await AsyncStorage.mergeItem('settings', JSON.stringify(settings));
  },
  initSettings: async () => {
    const file = await AsyncStorage.getItem('settings');
    if (file) {
      const settings = JSON.parse(file) as TaiyakiSettingsModel;
      set((state) => ({
        ...state,
        settings: _.merge({}, TaiyakiDefaultSettings, settings),
      }));
    }
  },
}));
