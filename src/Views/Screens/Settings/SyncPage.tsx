import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { ThemedSurface } from '../../Components';
import { useSettingsComponentState, useThemeComponentState } from '../../Components/storeConnect';
import { BaseSettingsPickers, BaseSettingsSwitch } from './BaseComponent';

const SyncSettingsPage = () => {
    const {theme } = useThemeComponentState();

    const settings = useSettingsComponentState().settings;
    const updateSettings = useSettingsComponentState().setSettings;
    const {autoSync, syncAt75} = settings;
	const _update = (key: string, value: any) => 
	updateSettings({...settings, [key]: value});  

    const [_autoSync, setAutoSync] = useState<boolean>(autoSync);
    const [_syncAt75, setSyncAt75] = useState<boolean>(syncAt75);



    return (
        <ScrollView style={{flex: 1, backgroundColor: theme.colors.backgroundColor }}>
            <ThemedSurface style={{flex: 1, padding: heightPercentageToDP(2)}}>
            <BaseSettingsSwitch title={'Auto Sync Watched Episodes'} desc={'Automatically sync to ALL your trackers currently signed in to'}  value={_autoSync} onValue={(v) => {setAutoSync(v); _update('autoSync', v)}} />
            <BaseSettingsSwitch title={'Delay Until 75% Completed'} desc={'Will auto sync your progress when you have watched 75% of the episode.'}  value={_syncAt75} onValue={(v) => {setSyncAt75(v); _update('syncAt75', v)}} />
        </ThemedSurface>
        </ScrollView>
    )
}

export default SyncSettingsPage;
