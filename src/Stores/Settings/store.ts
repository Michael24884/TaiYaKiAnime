import AsyncStorage from '@react-native-async-storage/async-storage';
import * as remx from 'remx';
import { TaiyakiDefaultSettings, TaiyakiSettingsModel } from '../../Models';

const state = remx.state(TaiyakiDefaultSettings);

const getters = remx.getters({
    getSettings() {
        return state;
    },
    getGeneralSettings() {
        return state.general;
    },
    getCustomizationSettings() {
        return state.customization;
    },
    getNotificationSettings() {
        return state.notifications;
    },
    getDevSettings() {
        return state.dev;
    },
    getSyncSettings() {
        return state.sync;
    },
    getQueueSettings() {
        return state.queue;
    },
    getExperimentalSettings() {
        return state.experimental;
    }
});

const setters = remx.setters({
   async setSettings(settings: TaiyakiSettingsModel) {
        state.about = settings.about;
        state.general = settings.general;
        state.about = settings.about;
        state.customization = settings.customization;
        state.dev = settings.dev;
        state.experimental = settings.experimental;
        state.queue = settings.queue;
        state.sync = settings.sync
       await AsyncStorage.setItem('settings', JSON.stringify(settings));
    }
})

export const settingsStore = {
    ...getters,
    ...setters,
};