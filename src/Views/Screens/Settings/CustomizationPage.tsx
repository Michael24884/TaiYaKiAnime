import React, { createRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { TaiyakiBlackTheme, TaiyakiDarkTheme, TaiyakiLightTheme } from '../../../Models';
import { ThemedSurface, ThemedText } from '../../Components';
import { useAccentComponentState, useSettingsComponentState, useThemeComponentState } from '../../Components/storeConnect';
import { BaseSettingsPickers, BaseSettingsSwitch } from './BaseComponent';
import {colors as accentColors} from '../../../Util/colors';
import { ThemeModal } from '../../Components/Settings/themeComponent';
import { Modalize } from 'react-native-modalize';

const CustomizationSettingsPage = () => {
    const {theme, setTheme } = useThemeComponentState();
    const _accentRef = createRef<Modalize>();
    const _themeRef = createRef<Modalize>();
    const {accent, setAccent} = useAccentComponentState();
    const updateSettings = useSettingsComponentState().setSettings;
	const settings = useSettingsComponentState().settings;
    const {delay, showVideoCover} = settings;
	const delayRef = createRef<Modalize>();

	const [_showVideoCover, setShowVideoCover] = useState<boolean>(showVideoCover);
	const [_delay, setDelay] = useState<number>(delay);

    const _renderAccents = ({ item }: { item: string }) => {
		return (
			<TouchableOpacity onPress={() => setAccent(item)}>
				<View
					style={{
						backgroundColor: item,
						borderWidth: 1,
						borderColor: theme.colors.text,
						height: 50,
						aspectRatio: 1 / 1,
						borderRadius: 25,
						margin: 8,
					}}
				/>
			</TouchableOpacity>
		);
	};

	const _update = (key: string, value: any) => 
	updateSettings({...settings, [key]: value});   
    
    return (
        <>
        <ScrollView style={{flex: 1, backgroundColor: theme.colors.backgroundColor }}>
            <ThemedSurface style={{flex: 1, padding: heightPercentageToDP(2)}}>
            <BaseSettingsPickers title={'Theme'} value={[TaiyakiLightTheme, TaiyakiDarkTheme, TaiyakiBlackTheme]} currentChoice={(theme.name).toString()} handled={() => _themeRef.current?.open()}/>
            <BaseSettingsPickers title={'Accent'} value={accentColors} currentChoice={(accentColors.find((i) => i === accent) ?? 'error').toString()} handled={() => _accentRef.current?.open()}/>
            <BaseSettingsSwitch title={'Show Video Cover'} desc={'Shows episode cover when the video player is paused. Does not show if there is not an episode thumbnail'} value={_showVideoCover} onValue={(v) => {setShowVideoCover(v); _update('showVideoCover', v)}} />
            <BaseSettingsPickers title={'Delay'} value={[]} currentChoice={(delay).toString() + ' seconds'} handled={() => delayRef.current?.open()}/>
            
            
        </ThemedSurface>
        </ScrollView>
        <Modalize modalHeight={heightPercentageToDP(75)} ref={_themeRef} modalStyle={{backgroundColor: theme.colors.backgroundColor}}>
        <ThemeModal onPress={setTheme}  />
        </Modalize>
        <Modalize
				ref={_accentRef}
				adjustToContentHeight
				flatListProps={{
					data: accentColors,
					renderItem: _renderAccents,
					keyExtractor: (item) => item,
					contentContainerStyle: {
						flexWrap: 'wrap',
						flexDirection: 'row',
						justifyContent: 'center',
						paddingTop: 20,
					},
				}}
				modalStyle={{ backgroundColor: theme.colors.card }}
			/>
			  <Modalize
        modalStyle={{backgroundColor: theme.colors.backgroundColor}}
        modalHeight={heightPercentageToDP(75)}
        ref={delayRef}
        flatListProps={{
            data: [0, 1 ,2 ,3 ,4 ,5, 6 ,7, 8, 9, 10, 11, 12],
            renderItem: ({item} : {item: number}) => <TouchableOpacity onPress={() => {_update('delay', item); setDelay(item); delayRef.current?.close();}}>
                <View style={{marginTop: heightPercentageToDP(4),height: heightPercentageToDP(5), backgroundColor: item === delay ? theme.colors.accent : undefined, justifyContent: 'center', paddingHorizontal: 5}}>
                <ThemedText>{item.toString() + ' seconds'}</ThemedText>
            </View>
            </TouchableOpacity>,
            keyExtractor: (_, index) => index.toString(),
        }}
        />
        </>
		
    )
}

export default CustomizationSettingsPage;
