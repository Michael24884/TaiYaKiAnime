import AsyncStorage from '@react-native-async-storage/async-storage';
import constate from 'constate';
import { useCallback, useState } from 'react';
import * as remx from 'remx';
import { TaiyakiDefaultSettings, TaiyakiSettingsModel } from '../../Models';

const state = remx.state(TaiyakiDefaultSettings);

const getters = remx.getters({
    getSettings() {
        return state;
    },
    // getGeneralSettings() {
    //     return state.general;
    // },
    // getCustomizationSettings() {
    //     return state.customization;
    // },
    // getNotificationSettings() {
    //     return state.notifications;
    // },
    // getDevSettings() {
    //     return state.dev;
    // },
    // getSyncSettings() {
    //     return state.sync;
    // },
    // getQueueSettings() {
    //     return state.queue;
    // },
    // getExperimentalSettings() {
    //     return state.experimental;
    // }
});

const setters = remx.setters({
   async setSettings(settings: TaiyakiSettingsModel) {
       const {
           about,
           allowBugReports,
           allowOnLowPower,
           autoSync,
           blurSpoilers,
           canUseCellularNetwork,
           changeAt100,
           delay,
           dev,
           enabled,
           followAspectRatio,
           frequency,
           matchPosterColor,
           overrideWatchNext,
           pip,
           preloadUpNext,
           requiresCharging,
           saveQueue,
           showVideoCover,
           sourceLanguage,
           syncAt75,
           timerAt94,
       } = settings;
        state.about = about;
        state.allowBugReports = allowBugReports,
       state.allowOnLowPower = allowOnLowPower,
       state.autoSync = autoSync,
       state.blurSpoilers = blurSpoilers,
       state.canUseCellularNetwork = canUseCellularNetwork,
       state.changeAt100 = changeAt100,
       state.delay = delay,
       state.enabled = enabled;
       state.followAspectRatio = followAspectRatio;
       state.frequency = frequency;
       state.matchPosterColor = matchPosterColor;
       state.overrideWatchNext = overrideWatchNext;
       state.pip = pip;
       state.preloadUpNext = preloadUpNext;
       state.requiresCharging = requiresCharging;
       state.saveQueue = saveQueue;
       state.showVideoCover = showVideoCover;
       state.sourceLanguage = sourceLanguage;
       state.syncAt75 = syncAt75;
       state.timerAt94 = timerAt94;
        state.dev = dev;
        
        
        
       await AsyncStorage.setItem('settings', JSON.stringify(settings));
    },
    async initSettings() {
        const file = await AsyncStorage.getItem('settings');
        if (file) {
          const settings = JSON.parse(file) as TaiyakiSettingsModel;
          const {
            about,
            allowBugReports,
            allowOnLowPower,
            autoSync,
            blurSpoilers,
            canUseCellularNetwork,
            changeAt100,
            delay,
            dev,
            enabled,
            followAspectRatio,
            frequency,
            matchPosterColor,
            overrideWatchNext,
            pip,
            preloadUpNext,
            requiresCharging,
            saveQueue,
            showVideoCover,
            sourceLanguage,
            syncAt75,
            timerAt94,
        } = settings;



         state.about = about;
         state.allowBugReports = allowBugReports,
        state.allowOnLowPower = allowOnLowPower,
        state.autoSync = autoSync,
        state.blurSpoilers = blurSpoilers,
        state.canUseCellularNetwork = canUseCellularNetwork,
        state.changeAt100 = changeAt100,
        state.delay = delay,
        state.enabled = enabled;
        state.followAspectRatio = followAspectRatio;
        state.frequency = frequency;
        state.matchPosterColor = matchPosterColor;
        state.overrideWatchNext = overrideWatchNext;
        state.pip = pip;
        state.preloadUpNext = preloadUpNext;
        state.requiresCharging = requiresCharging;
        state.saveQueue = saveQueue;
        state.showVideoCover = showVideoCover;
        state.sourceLanguage = sourceLanguage;
        state.syncAt75 = syncAt75;
        state.timerAt94 = timerAt94;
         state.dev = dev;
         
         
         console.log(blurSpoilers, 'is blurring?')
        }
    }
})

export const settingsStore = {
    ...getters,
    ...setters,
};

// function useSettings() {
//     const [settings, setSettings] = useState<TaiyakiSettingsModel>(TaiyakiDefaultSettings);

//     const updateSettings = useCallback((setting: TaiyakiSettingsModel) => setSettings(setting), [])
    

//     const initSettings = async () => {
//         const file = await AsyncStorage.getItem('settings');
//         if (file) {
//           const nsettings = JSON.parse(file) as TaiyakiSettingsModel;
//           console.log('the settings', nsettings);
//           setSettings(nsettings);
//         }
//     }
    
//     return {settings, updateSettings, initSettings}
// }

// export const [SettingProvider, useSettingsContext] = constate(useSettings);