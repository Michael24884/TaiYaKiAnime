import { useConnect } from 'remx';
import { BaseTheme } from '../../Models';
import {themeStore} from '../../Stores/Theme/';

// export const useThemeStoreConnect = (props: any) => useConnect(() => {

    export const useAccentComponentState = () => useConnect(() => {
        return {
            accent: themeStore.getAccent(),
            setAccent: themeStore.setAccent,
        }
    })
    export const useThemeComponentState = () => useConnect(() => {
        return {
            theme: themeStore.getTheme(),
            background: themeStore.getBackground(),
            text: themeStore.getText(),
            secondary: themeStore.getSecondary(),
            setTheme: themeStore.setTheme,
        }
    })