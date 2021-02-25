// /* eslint-disable react-native/no-inline-styles */
// import { DarkTheme, useNavigation } from '@react-navigation/native';
// import React, { createRef, useEffect, useState } from 'react';
// import {
// 	Dimensions,
// 	Linking,
// 	Modal,
// 	StyleSheet,
// 	View,
// 	TouchableWithoutFeedback,
// 	TouchableOpacity,
// } from 'react-native';
// import { ScrollView, Switch } from 'react-native-gesture-handler';
// import {
// 	BaseTheme,
// 	LightTheme,
// 	TaiyakiBlackTheme,
// 	TaiyakiDarkTheme,
// } from '../../Models';
// import { useSettingsStore, useTheme, useUserProfiles } from '../../Stores';
// import { colors, minutesToHours } from '../../Util';
// import { ThemedText } from '../Components';
// import { DiscordLink } from './../../Models';
// import { version, build } from '../../../package.json';
// import {
// 	SettingsHead,
// 	SettingsRow,
// 	TaiyakiSettingsHeader,
// } from '../Components/Settings';
// import { useAsyncStorage } from '@react-native-async-storage/async-storage';
// import { Modalize } from 'react-native-modalize';
// import { sourceAbstractList, TaiyakiSourceLanguage } from '../../Classes/Sources';
// import Icon from 'react-native-dynamic-vector-icons';
// import {useConnect} from 'remx';
// import {themeStore, ThemeActions} from '../../Stores/Theme/';
// import {settingsStore, SettingsActions} from '../../Stores/Settings/';
// import { useAccentComponentState, useThemeComponentState } from '../Components/storeConnect';
// import { ThemeModal } from '../Components/Settings/themeComponent';
// import { heightPercentageToDP } from 'react-native-responsive-screen';

// const { width, height } = Dimensions.get('window');

// const useSettingsConnectComponent = () => useConnect(() => {
// 		return {
// 			theme: themeStore.getTheme(),
// 			accent: themeStore.getTheme().colors.accent,
// 			settings: settingsStore.getSettings(),
// 			getGeneral: settingsStore.getGeneralSettings(),
// 			getSync: settingsStore.getSyncSettings(),
// 			getCustomization: settingsStore.getCustomizationSettings(),
// 			getExperimental: settingsStore.getExperimentalSettings(),
// 			getNotifications: settingsStore.getNotificationSettings(),
// 			getDev: settingsStore.getDevSettings(),
// 			getQueue: settingsStore.getQueueSettings(),
// 			setTheme: ThemeActions.changeTheme,
// 			setAccent: ThemeActions.changeAccent,
// 			setSettings: SettingsActions.setSettings,
			
// 		}
// });

// const SettingsScreen = () => {
// 	const navigation = useNavigation();
// 	const {
// 		settings, 
// 		getCustomization,
// 		getDev,
// 		getExperimental,
// 		getGeneral,
// 		getNotifications,
// 		getQueue,
// 		getSync,
		
// 		setSettings, 
// 	} = useSettingsConnectComponent();

// 	const {accent, setAccent} = useAccentComponentState();
// 	const {theme, setTheme} = useThemeComponentState();

// 	const profiles = useUserProfiles((_) => _.profiles);
// 	const [themeOpen, setThemeOpen] = useState<boolean>(false);
// 	const { getItem, setItem } = useAsyncStorage('dev');

// 	const [count, setCount] = useState<number | undefined>(0);
// 	const [devEnabled, setDevMode] = useState<boolean>(false);
	
// 	const _accentRef = createRef<Modalize>();
// 	const _sourceLanguageRef = createRef<Modalize>();
// 	const _themeRef = createRef<Modalize>();

// 	useEffect(() => {
// 		getItem().then((value) => {
// 			if (value && value === 'true') setDevMode(true);
// 		});
// 	}, []);
// 	useEffect(() => {
// 		if (count && count === 7) {
// 			setCount(undefined);
// 			setDevMode(true);
// 		}
// 	}, [count]);

// 	const _renderAccents = ({ item }: { item: string }) => {
// 		return (
// 			<TouchableOpacity onPress={() => setAccent(item)}>
// 				<View
// 					style={{
// 						backgroundColor: item,
// 						borderWidth: 1,
// 						borderColor: theme.colors.text,
// 						height: 50,
// 						aspectRatio: 1 / 1,
// 						borderRadius: 25,
// 						margin: 8,
// 					}}
// 				/>
// 			</TouchableOpacity>
// 		);
// 	};

// 	const _renderLanguages = ({item} : {item: TaiyakiSourceLanguage | 'All'}) => {
// 		return (
// 			<TouchableOpacity
// 			onPress={() => {
// 				_sourceLanguageRef.current?.close();
// 				setTimeout(() => setSettings({...settings, general: {...settings.general, sourceLanguage: item}}), 500)
				
// 			}}
// 			>
// 				<View style={{margin: 12, height: height * 0.08, paddingHorizontal: height * 0.02, paddingTop: height * 0.01}}>
// 					<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
// 					<View>
// 					<ThemedText style={styles.title}>{item}</ThemedText>
// 					<ThemedText style={styles.subtitle}>{item === 'All' ? sourceAbstractList.length :sourceAbstractList.filter((i) => i.language === item).length} available</ThemedText>
// 					</View>
// 					{settings.general.sourceLanguage === item && <Icon name={'check'} type={'MaterialCommunityIcons'} size={30} color={accent} />}
// 					</View>
// 				</View>
// 			</TouchableOpacity>
// 		)
// 	}


// 	// const _colorView = (thisTheme: BaseTheme) => {
// 	// 	console.log('this theme', thisTheme)
// 	// 	return (
// 	// 		<TouchableWithoutFeedback
// 	// 			onPress={() => {
// 	// 				setTheme(thisTheme);
// 	// 				setThemeOpen(false);
// 	// 			}}>
// 	// 			<View
// 	// 				style={{
// 	// 					width: '100%',
// 	// 					height: height * 0.12,
// 	// 					backgroundColor: thisTheme.colors.backgroundColor,
// 	// 					justifyContent: 'center',
// 	// 					paddingHorizontal: width * 0.1,
// 	// 				}}>
// 	// 				<ThemedText
// 	// 					style={{
// 	// 						fontWeight: '800',
// 	// 						fontSize: 18,
// 	// 						color: thisTheme.colors.text,
// 	// 					}}>
// 	// 					{thisTheme.name}
// 	// 				</ThemedText>
// 	// 			</View>
// 	// 		</TouchableWithoutFeedback>
// 	// 	);
// 	// };

// 	return (
// 		<>
// 			<Modalize modalStyle={{backgroundColor: TaiyakiDarkTheme.colors.secondaryBackgroundColor}} modalHeight={heightPercentageToDP(75)} ref={_themeRef}>
// 					<ThemeModal onPress={setTheme} />
// 			</Modalize>
// 			<ScrollView
// 				style={[
// 					styles.view,
// 					{ backgroundColor: theme.colors.backgroundColor, paddingTop: 12 },
// 				]}>
// 				<TaiyakiSettingsHeader />

// 				<SettingsHead iconName={'format-paint'} title={'Customization'}>
// 					<SettingsRow
// 						title={'Theme'}
// 						value={theme.name}
// 						onPress={() => _themeRef.current?.open()}
// 					/>
// 					<SettingsRow
// 						title={'Accent'}
// 						value={accent}
// 						onPress={() => _accentRef.current?.open()}
// 					/>
// 					<ThemedText>{accent}</ThemedText>
// 					<SettingsRow
// 						title={'Video cover'}
// 						value={getCustomization.cover.showVideoCover}
// 						onPress={() => navigation.navigate('VideoCoverSettingsPage')}
// 					/>
// 				</SettingsHead>

// 				<SettingsHead iconName={'cog'} title={'General'} community>
// 					<SettingsRow
// 						title={'Auto Play'}
// 						value={getGeneral.autoPlay.enabled}
// 						onPress={() => navigation.navigate('AutoPlaySettingsPage')}
// 					/>
// 					<SettingsRow
// 						title={'Video'}
// 						onPress={() => navigation.navigate('VideoSettingsPage')}
// 					/>
// 					<View style={{flexDirection: 'row', width: '100%', height: height * 0.08, paddingHorizontal: width * 0.05, justifyContent: 'space-between', alignItems: 'center'}}>
// 						<ThemedText style={styles.subtitle}>Persist Queue to Storage</ThemedText>
						
// 					<Switch
//             style={{alignSelf: 'flex-end'}}
//             value={settings.queue.saveQueue}
//             onValueChange={(value) => {
// 				setSettings({...settings, queue: {...settings.queue, saveQueue: value}});
//             }}
//           />
		  
// 		  </View>
// 		  <View style={{flexDirection: 'row', width: '100%', height: height * 0.08, paddingHorizontal: width * 0.05, justifyContent: 'space-between', alignItems: 'center'}}>
// 						<ThemedText style={styles.subtitle}>Blur unwatched episodes</ThemedText>
						
// 					<Switch
//             style={{alignSelf: 'flex-end'}}
//             value={getGeneral.blurSpoilers}
//             onValueChange={(value) => {
// 				setSettings({...settings, general: {...settings.general, blurSpoilers: value}});
//             }}
//           />
		  
// 		  </View>
// 				</SettingsHead>

// 				<SettingsHead title={'Sources'} iconName={'package'} community>
// 					<SettingsRow
// 						title={'Filter source language'}
// 						value={settings.general.sourceLanguage}
// 						onPress={() => _sourceLanguageRef.current?.open()}
// 					/>
// 					<SettingsRow
// 						title={'Third Party Trackers'}
// 						value={'Signed into ' + profiles.length + ' services'}
// 						onPress={() => navigation.navigate('Trackers')}
// 					/>

// 					{/* <SettingsRow
// 						title={'View available sources'}
// 						onPress={() => navigation.navigate('ArchivePage')}
// 					/> */}
// 				</SettingsHead>

// 				<SettingsHead title={'Sync'} iconName={'database'} community>
// 					<SettingsRow
// 						title={'Auto Sync'}
// 						value={getSync.autoSync}
// 						onPress={() => navigation.navigate('SyncSettingsPage')}
// 					/>
// 				</SettingsHead>

// 				<SettingsHead title={'Notifications'} iconName={'bell-alert'} community>
// 					<SettingsRow
// 						title={'Background fetch'}
// 						value={minutesToHours.get(getNotifications.frequency)}
// 						onPress={() => navigation.navigate('NotificationsSettingsPage')}
// 					/>
// 				</SettingsHead>
// 				{devEnabled ? (
// 					<SettingsHead title={'Developer Mode'} iconName={'developer-mode'}>
// 						<SettingsRow
// 							title={'Configure Video Buffer'}
// 							onPress={() => navigation.navigate('VideoBufferingSettingsPage')}
// 						/>
// 					</SettingsHead>
// 				) : null}
// 				<SettingsHead title={'About'} iconName={'information'} community>
// 					<SettingsRow
// 						title={'Join the Discord server'}
// 						value={DiscordLink}
// 						onPress={() => Linking.openURL(DiscordLink)}
// 					/>
// 					<SettingsRow
// 						title={'Github'}
// 						onPress={() =>
// 							Linking.openURL('https://github.com/Michael24884/TaiYaKiAnime')
// 						}
// 					/>
// 					<TouchableWithoutFeedback
// 						disabled={!count}
// 						onPress={() => {
// 							setCount((c) => c! + 1);
// 						}}>
// 						<View>
// 							<SettingsRow title={'Version'} value={version + '•' + build} />
// 						</View>
// 					</TouchableWithoutFeedback>
// 				</SettingsHead>
// 			</ScrollView>
// 			<Modalize
// 				ref={_accentRef}
// 				adjustToContentHeight
// 				flatListProps={{
// 					data: colors,
// 					renderItem: _renderAccents,
// 					keyExtractor: (item) => item,
// 					contentContainerStyle: {
// 						flexWrap: 'wrap',
// 						flexDirection: 'row',
// 						justifyContent: 'center',
// 						paddingTop: 20,
// 					},
// 				}}
// 				modalStyle={{ backgroundColor: theme.colors.card }}
// 			/>
// 			<Modalize
// 				ref={_sourceLanguageRef}
// 				modalHeight={height * 0.45}
// 				flatListProps={{
// 					data: ['All', 'English', 'Spanish'],
// 					renderItem: _renderLanguages,
// 					keyExtractor: (item) => item,
// 				}}
// 				modalStyle={{ backgroundColor: theme.colors.card }}
// 			/>
// 		</>
// 	);
// };

// const styles = StyleSheet.create({
// 	view: {
// 		flex: 1,
// 	},
// 	title: {
// 		fontSize: 15,
// 		fontWeight: '600',
// 	},
// 	subtitle: {
// 		fontSize: 15,
// 		fontWeight: '400',
// 	  }
// });

// export default SettingsScreen;

import { useNavigation } from '@react-navigation/native';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-dynamic-vector-icons';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { ThemedText } from '../Components';
import { TaiyakiSettingsHeader } from '../Components/Settings';
import { useAccentComponentState, useThemeComponentState } from '../Components/storeConnect';

type IconType = "AntDesign" | "MaterialIcons" | "EvilIcons" | "Entypo" | "FontAwesome" | "Foundation" | "Ionicons" | "MaterialCommunityIcons" | "Zocial" | "Octicons" | "SimpleLineIcons" | "Fontisto" | "Feather" | "FontAwesome5";

const SettingsTiles: FC<{name: string, iconName: string, iconType: IconType}> = (props) => {
	const {iconName, iconType, name} = props;
	const {accent} = useAccentComponentState();
	const navigation = useNavigation();

	return (
		<TouchableOpacity onPress={() => navigation.push(name)}>
			<View style={styles.tiles.view}>
			<View style={{flexDirection: 'row'}}>
			<Icon color={accent} name={iconName} type={iconType} size={heightPercentageToDP(3.5)} />
			<ThemedText style={styles.tiles.title}>{name}</ThemedText>
			</View>
			<Icon color={'grey'} name={'chevron-right'} type={'MaterialIcons'} size={heightPercentageToDP(2.9)}/>
		</View>
		</TouchableOpacity>
	)

}

const SettingsScreen = () => {
const {theme} = useThemeComponentState();

return <ScrollView style={{backgroundColor: theme.colors.backgroundColor}}>
	<TaiyakiSettingsHeader />
	<SettingsTiles iconName={'cog'} iconType={'MaterialCommunityIcons'} name={'General'} />
	<SettingsTiles iconName={'format-paint'} iconType={'MaterialIcons'} name={'Customization'} />
	<SettingsTiles iconName={'login'} iconType={'MaterialIcons'} name={'Trackers'} />
	<SettingsTiles iconName={'notifications'} iconType={'MaterialIcons'} name={'Notifications'} />
	<SettingsTiles iconName={'cloud-sync'} iconType={'MaterialCommunityIcons'} name={'Sync'} />
	<SettingsTiles iconName={'queue-play-next'} iconType={'MaterialIcons'} name={'Queue'} />
	<SettingsTiles iconName={'flask'} iconType={'MaterialCommunityIcons'} name={'Experimental'} />
	{/* <SettingsTiles iconName={'atom'} iconType={'MaterialCommunityIcons'} name={'Dev'} /> */}
	<SettingsTiles iconName={'information'} iconType={'MaterialCommunityIcons'} name={'About'} />

</ScrollView>
}

const styles = {
	tiles: StyleSheet.create({
		view: {
			flexDirection: 'row',
			height: heightPercentageToDP(8),
			width: '100%',
			alignItems: 'center',
			paddingHorizontal: heightPercentageToDP(2),
			justifyContent: 'space-between',
		},
		title: {
			marginLeft: heightPercentageToDP(1.5),
			fontSize: heightPercentageToDP(2.1),
			fontWeight: '500',
		}
	}),
	main: StyleSheet.create({
		view: {
			
		}
	})
}

export default SettingsScreen;
