import create from 'zustand';
import {BaseTheme, LightTheme, TaiyakiDarkTheme} from '../Models/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = {
  theme: BaseTheme;
  setTheme: (arg0: BaseTheme) => void;
  initTheme: () => Promise<void>;
  setAccent: (arg0: string) => void;
};

export const useTheme = create<ThemeType>((set, get) => ({
  theme: LightTheme,
  setTheme: async (theme) => {
    set((state) => ({...state, theme}));
    await AsyncStorage.setItem('theme', JSON.stringify(theme));
  },
  setAccent: async (accent) => {
    set((state) => ({
      ...state,
      theme: {...state.theme, colors: {...state.theme.colors, accent}},
    }));
    await AsyncStorage.setItem('theme', JSON.stringify(get().theme));
  },
  initTheme: async () => {
    const file = await AsyncStorage.getItem('theme');
    if (file) {
      set((state) => ({...state, theme: JSON.parse(file) as BaseTheme}));
    }
  },
}));
