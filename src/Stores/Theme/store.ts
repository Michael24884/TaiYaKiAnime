import AsyncStorage from '@react-native-async-storage/async-storage';
import * as remx from 'remx';
import { BaseTheme, LightTheme } from '../../Models';
import produce from 'immer';

const state = remx.state(LightTheme);
const getters = remx.getters({
    getTheme() {
        return state;
    },
    getBackground() {
        return state.colors.backgroundColor
    },
    getText() {
        return state.colors.text
    },
    getSecondary() {
        return state.colors.secondaryBackgroundColor;
    },
    isDark() {
        return state.dark;
    },
    getAccent() {
        return state.colors.accent;
    }
});

const setters = remx.setters({
    async setTheme(theme: BaseTheme) {
        // const newColors = produce(state.colors, draft => { return draft = {...theme.colors}});
        state.colors = {...theme.colors}
        state.dark = theme.dark;
        state.name = theme.name;
        await AsyncStorage.mergeItem('theme', JSON.stringify(state));
    },
    async setAccent(accent: string) {
        state.colors.accent = accent
        await AsyncStorage.mergeItem('theme', JSON.stringify(state))
    }
})

export const themeStore = {
    ...getters,
    ...setters,
}