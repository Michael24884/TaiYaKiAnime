import { useConnect } from 'remx';
import { BaseTheme, TaiyakiSettingsModel } from '../../Models';
import {themeStore} from '../../Stores/Theme/';
import {settingsStore} from '../../Stores/Settings/';

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
            initTheme: themeStore.initTheme,
        }
    });
    export const useSettingsComponentState = () => useConnect(() => ({
        settings: settingsStore.getSettings(),
        setSettings: settingsStore.setSettings,
        // general: settingsStore.getGeneralSettings(),
        // customization: settingsStore.getCustomizationSettings(),
        // notifications: settingsStore.getNotificationSettings(),
        initSettigs: settingsStore.initSettings,
    }));