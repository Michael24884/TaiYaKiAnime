import React, {useState} from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { ThemedSurface } from '../../Components';
import { useThemeComponentState, useSettingsComponentState } from '../../Components/storeConnect';
import { BaseSettingsPickers, BaseSettingsSwitch } from './BaseComponent';

const ExperimentalSettingsPage = () => {
    const {theme } = useThemeComponentState();
    const settings = useSettingsComponentState().settings;
    const updateSettings = useSettingsComponentState().setSettings;
    const {allowBugReports} = settings;
	const _update = (key: string, value: any) => 
	updateSettings({...settings, [key]: value});  


    const [_allowBugReports, setAllowBugReports] = useState<boolean>(allowBugReports);

    return (
        <ScrollView style={{flex: 1, backgroundColor: theme.colors.backgroundColor }}>
            <ThemedSurface style={{flex: 1, padding: heightPercentageToDP(2)}}>
            <BaseSettingsSwitch title={'Allow Bug Reporting'} value={_allowBugReports} onValue={(v) => {setAllowBugReports(v); _update('allowBugReports', v)} } />
        </ThemedSurface>
        </ScrollView>
    )
}

export default ExperimentalSettingsPage;
