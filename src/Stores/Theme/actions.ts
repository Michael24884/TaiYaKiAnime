import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseTheme } from '../../Models';
import {themeStore} from './store';

export const changeTheme = async (theme: BaseTheme) => {
    themeStore.setTheme(theme)
    await AsyncStorage.setItem('theme', JSON.stringify(theme));
};

export const changeAccent = (accent: string) => themeStore.setAccent(accent);