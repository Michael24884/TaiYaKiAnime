import React, {useState} from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { ThemedSurface } from '../../Components';
import { useThemeComponentState, useSettingsComponentState } from '../../Components/storeConnect';
import { BaseSettingsPickers, BaseSettingsSwitch } from './BaseComponent';

const QueueSettingsPage = () => {
    const {theme } = useThemeComponentState();

    const settings = useSettingsComponentState().settings;
    const updateSettings = useSettingsComponentState().setSettings;
    const {saveQueue} = settings;
	const _update = (key: string, value: any) => 
	updateSettings({...settings, [key]: value});  

    const [_saveQueue, setSaveQueue] = useState<boolean>(saveQueue);

    return (
        <ScrollView style={{flex: 1, backgroundColor: theme.colors.backgroundColor }}>
            <ThemedSurface style={{flex: 1, padding: heightPercentageToDP(2)}}>
            <BaseSettingsSwitch title={'Persist Queue to Storage'} desc={'Keep your last queue on every app restart instead of removing it'}  value={_saveQueue} onValue={(v) => {setSaveQueue(v); _update('saveQueue', v)}} />
        </ThemedSurface>
        </ScrollView>
    )
}

export default QueueSettingsPage;
