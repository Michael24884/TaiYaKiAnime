import React, { createRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { SourceBase } from '../../../Classes/SourceBase';
import { TaiyakiSourceLanguageArray } from '../../../Classes/Sources';
import { ThemedSurface, ThemedText } from '../../Components';

import { useSettingsComponentState, useThemeComponentState } from '../../Components/storeConnect';
import { BaseSettingsPickers, BaseSettingsSwitch } from './BaseComponent';


const GeneralSettingsPage = () => {
    
        // const {settings, general } = useSettingsComponentState();
        // let {enabled, changeAt100, timerAt94} = useSettingsComponentState().general.autoPlay;
         const {theme} = useThemeComponentState();
        const settings  = useSettingsComponentState().settings;
        const {blurSpoilers, enabled, changeAt100, timerAt94, sourceLanguage} = settings;
        const updateSettings = useSettingsComponentState().setSettings


        const [_blurSpoilers, setBlurSpoilerss] = useState<boolean>(blurSpoilers);
        const [enabledAutoPlay, setEnabled] = useState<boolean>(enabled);
        const [_changeAt100, setChangeAt100] = useState<boolean>(changeAt100);
        const [_timerAt94, setTimerAt94] = useState<boolean>(timerAt94);
        const [_sourceLanguage, setSourceLanguage] = useState<string>(sourceLanguage);

        const sourceRef = createRef<Modalize>();


        // useEffect(() => {
            
        // }, []);

        // useMemo(() => {
        //     updateSettings({
        //         ...settings,
        //         general: {
        //             ...settings.general,
        //             blurSpoilers: _blurSpoilers,
        //             autoPlay: {
        //                 enabled: enabledAutoPlay,
        //                 changeAt100:_changeAt100,
        //                 timerAt94: _timerAt94
        //             }
        //         }
        //     })
        // }, [_blurSpoilers, enabledAutoPlay, _changeAt100, _timerAt94])

        const _update = (key: string, value: any) => 
            updateSettings({...settings, [key]: value});        

        return (
            <>
            <ScrollView style={{flex: 1, backgroundColor: theme.colors.backgroundColor }}>
                <ThemedSurface style={{flex: 1, padding: heightPercentageToDP(2)}}>
                <BaseSettingsPickers title={'Source Language'} desc={'Language to use for anime episodes'}  value={[]} currentChoice={_sourceLanguage} handled={() => {sourceRef.current?.open()}} />
                <BaseSettingsSwitch title={'Blur Spoilers'} desc={'Info for episodes not yet seen are hidden'}  value={_blurSpoilers} onValue={(v) => {setBlurSpoilerss(v); _update('blurSpoilers', v) }} />
                <BaseSettingsSwitch title={'Auto Play'} desc={'Automatically add up next episodes for you'}  value={enabledAutoPlay} onValue={(v) =>  {setEnabled(v); _update('enabled', v)}} />
                <BaseSettingsSwitch title={'Auto change at 94%'} desc={'Shows a 10 second timer in which Taiyaki will load the next episode'}  value={_timerAt94}  onValue={(v) => {setTimerAt94(v); _update('timerAt94', v)}} />
                <BaseSettingsSwitch title={'Next episode at 100%'} desc={'Automatically plays the next video once done'}  value={_changeAt100} onValue={(v) => { setChangeAt100(v); _update('changeAt100', v)}} />
            </ThemedSurface>
            </ScrollView>
            <Modalize
        modalStyle={{backgroundColor: theme.colors.backgroundColor}}
        modalHeight={heightPercentageToDP(75)}
        ref={sourceRef}
        flatListProps={{
            data: TaiyakiSourceLanguageArray,
            renderItem: ({item} : {item: string}) => <TouchableOpacity onPress={() => {_update('sourceLanguage', item); setSourceLanguage(item); sourceRef.current?.close();}}>
                <View style={{marginTop: heightPercentageToDP(4),height: heightPercentageToDP(5), backgroundColor: item === sourceLanguage ? theme.colors.accent : undefined, justifyContent: 'center', paddingHorizontal: 5}}>
                <ThemedText>{item}</ThemedText>
            </View>
            </TouchableOpacity>,
            keyExtractor: (_, index) => index.toString(),
        }}
        />
            </>
        )
    
}



export default GeneralSettingsPage;
