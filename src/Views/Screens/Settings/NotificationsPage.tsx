import React, { createRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { ThemedSurface, ThemedText } from '../../Components';
import { useSettingsComponentState, useThemeComponentState } from '../../Components/storeConnect';
import { BaseSettingsPickers, BaseSettingsSwitch } from './BaseComponent';
import { setSettingsAction } from '../../../Stores/Settings/actions';
import { Modalize } from 'react-native-modalize';
import { NotificationFrequencyToString } from '../../../Util';


const NotificationsSettingsPage = () => {
    const {theme } = useThemeComponentState();
    const notificationRef = createRef<Modalize>();
    const settings = useSettingsComponentState().settings;
    const updateSettings = useSettingsComponentState().setSettings;
    const {allowOnLowPower, canUseCellularNetwork, frequency, requiresCharging} = settings;

    const [_allowOnLowPower, setLowPower] = useState<boolean>(allowOnLowPower);
    const [_frequency, setFrequency] = useState<number>(frequency);
    const [_requiresCharging, setRequiresCharging] = useState<boolean>(requiresCharging);
    const [_canUseCellularNetwork, setCanUseCellularNetwork] = useState<boolean>(canUseCellularNetwork);

	const _update = (key: string, value: any) => 
	updateSettings({...settings, [key]: value});
    


    return (
        <>
        <ScrollView style={{flex: 1, backgroundColor: theme.colors.backgroundColor }}>
            <ThemedSurface style={{flex: 1, padding: heightPercentageToDP(2)}}>
            <BaseSettingsPickers title={'Notification Frequency'} desc={'Frequency to background fetching. This allows for checking new episodes'} value={[]} currentChoice={NotificationFrequencyToString.get(_frequency) ?? 'Error'} handled={() => notificationRef.current?.open()} />
            <BaseSettingsSwitch title={'Network Type'} desc={'If ON, Taiyaki will also use Cellular data to fetch. Otherwise will only fetch on WiFi'}  value={_canUseCellularNetwork} onValue={(v) => {setCanUseCellularNetwork(v); _update('canUseCellularNetwork', v)}} />
            <BaseSettingsSwitch title={'Allow Fetching on Low Power'}  value={_allowOnLowPower} onValue={(v) => {setLowPower(v); _update('allowOnLowPower', v)}}/>
            <BaseSettingsSwitch title={'Requires Charging'} desc={'Only fetch when plugged in to a power source'}  value={_requiresCharging} onValue={(v) => {setRequiresCharging(v); _update('requiresCharging', v)}} />
        </ThemedSurface>
        </ScrollView>
        <Modalize
        modalStyle={{backgroundColor: theme.colors.backgroundColor}}
        modalHeight={heightPercentageToDP(75)}
        ref={notificationRef}
        flatListProps={{
            data: [60 , 120 , 360 , 720],
            renderItem: ({item} : {item: number}) => <TouchableOpacity onPress={() => {_update('frequency', item); setFrequency(item); notificationRef.current?.close();}}>
                <View style={{marginTop: heightPercentageToDP(4),height: heightPercentageToDP(5), backgroundColor: item === frequency ? theme.colors.accent : undefined, justifyContent: 'center', paddingHorizontal: 5}}>
                <ThemedText>{NotificationFrequencyToString.get(item) ?? 'Error'}</ThemedText>
            </View>
            </TouchableOpacity>,
            keyExtractor: (_, index) => index.toString(),
        }}
        />
        </>
    )
}

export default NotificationsSettingsPage;
