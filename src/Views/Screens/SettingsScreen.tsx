/* eslint-disable react-native/no-inline-styles */
import { useNavigation } from '@react-navigation/native';
import React, { createRef, useEffect, useState } from 'react';
import {
	Dimensions,
	Linking,
	Modal,
	StyleSheet,
	View,
	TouchableWithoutFeedback,
	TouchableOpacity,
} from 'react-native';
import { ScrollView, Switch } from 'react-native-gesture-handler';
import {
	BaseTheme,
	LightTheme,
	TaiyakiBlackTheme,
	TaiyakiDarkTheme,
} from '../../Models';
import { useSettingsStore, useTheme, useUserProfiles } from '../../Stores';
import { colors, minutesToHours } from '../../Util';
import { ThemedText } from '../Components';
import { DiscordLink } from './../../Models';
import { version, build } from '../../../package.json';
import {
	SettingsHead,
	SettingsRow,
	TaiyakiSettingsHeader,
} from '../Components/Settings';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { Modalize } from 'react-native-modalize';
import { sourceAbstractList, TaiyakiSourceLanguage } from '../../Classes/Sources';
import Icon from 'react-native-dynamic-vector-icons';
const { width, height } = Dimensions.get('window');


const SettingsScreen = () => {
	const navigation = useNavigation();
	const setTheme = useTheme((_) => _.setTheme);
	const setAccent = useTheme((_) => _.setAccent);
	const theme = useTheme((_) => _.theme);
	const settings = useSettingsStore((_) => _.settings);
	const setSettings = useSettingsStore((_) => _.setSettings);
	const profiles = useUserProfiles((_) => _.profiles);
	const [themeOpen, setThemeOpen] = useState<boolean>(false);
	const { getItem, setItem } = useAsyncStorage('dev');

	const [count, setCount] = useState<number | undefined>(0);
	const [devEnabled, setDevMode] = useState<boolean>(false);

	const { general, customization, notifications, sync, queue } = settings;
	
	const _accentRef = createRef<Modalize>();
	const _sourceLanguageRef = createRef<Modalize>();

	useEffect(() => {
		getItem().then((value) => {
			if (value && value === 'true') setDevMode(true);
		});
	}, []);
	useEffect(() => {
		if (count && count === 7) {
			setCount(undefined);
			setDevMode(true);
			setItem('true');
		}
	}, [count]);

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

	const _renderLanguages = ({item} : {item: TaiyakiSourceLanguage | 'All'}) => {
		return (
			<TouchableOpacity
			onPress={() => {
				_sourceLanguageRef.current?.close();
				setTimeout(() => setSettings({...settings, general: {...settings.general, sourceLanguage: item}}), 500)
				
			}}
			>
				<View style={{margin: 12, height: height * 0.08, paddingHorizontal: height * 0.02, paddingTop: height * 0.01}}>
					<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
					<View>
					<ThemedText style={styles.title}>{item}</ThemedText>
					<ThemedText style={styles.subtitle}>{item === 'All' ? sourceAbstractList.length :sourceAbstractList.filter((i) => i.language === item).length} available</ThemedText>
					</View>
					{settings.general.sourceLanguage === item && <Icon name={'check'} type={'MaterialCommunityIcons'} size={30} color={theme.colors.accent} />}
					</View>
				</View>
			</TouchableOpacity>
		)
	}


	const _colorView = (theme: BaseTheme) => {
		return (
			<TouchableWithoutFeedback
				onPress={() => {
					setTheme(theme);
					setThemeOpen(false);
				}}>
				<View
					style={{
						width: '100%',
						height: height * 0.12,
						backgroundColor: theme.colors.backgroundColor,
						justifyContent: 'center',
						paddingHorizontal: width * 0.1,
					}}>
					<ThemedText
						style={{
							fontWeight: '800',
							fontSize: 18,
							color: theme.colors.text,
						}}>
						{theme.name}
					</ThemedText>
				</View>
			</TouchableWithoutFeedback>
		);
	};

	return (
		<>
			<Modal
				transparent
				visible={themeOpen}
				animationType={'slide'}
				hardwareAccelerated>
				<View
					style={{
						flex: 1,
						justifyContent: 'flex-end',
						backgroundColor: 'rgba(0,0,0,0.7)',
					}}>
					<View style={{ height: height * 0.5 }}>
						{_colorView(LightTheme)}
						{_colorView(TaiyakiDarkTheme)}
						{_colorView(TaiyakiBlackTheme)}
					</View>
				</View>
			</Modal>
			<ScrollView
				style={[
					styles.view,
					{ backgroundColor: theme.colors.backgroundColor, paddingTop: 12 },
				]}>
				<TaiyakiSettingsHeader />

				<SettingsHead iconName={'format-paint'} title={'Customization'}>
					<SettingsRow
						title={'Theme'}
						value={theme.name}
						onPress={() => setThemeOpen(true)}
					/>
					<SettingsRow
						title={'Accent'}
						value={theme.colors.accent}
						onPress={() => _accentRef.current?.open()}
					/>
					<SettingsRow
						title={'Video cover'}
						value={customization.cover.showVideoCover}
						onPress={() => navigation.navigate('VideoCoverSettingsPage')}
					/>
				</SettingsHead>

				<SettingsHead iconName={'cog'} title={'General'} community>
					<SettingsRow
						title={'Auto Play'}
						value={general.autoPlay.enabled}
						onPress={() => navigation.navigate('AutoPlaySettingsPage')}
					/>
					<SettingsRow
						title={'Video'}
						onPress={() => navigation.navigate('VideoSettingsPage')}
					/>
					<View style={{flexDirection: 'row', width: '100%', height: height * 0.08, paddingHorizontal: width * 0.05, justifyContent: 'space-between', alignItems: 'center'}}>
						<ThemedText style={styles.subtitle}>Persist Queue to Storage</ThemedText>
						
					<Switch
            style={{alignSelf: 'flex-end'}}
            value={settings.queue.saveQueue}
            onValueChange={(value) => {
				setSettings({...settings, queue: {...settings.queue, saveQueue: value}});
            }}
          />
		  
		  </View>
		  <View style={{flexDirection: 'row', width: '100%', height: height * 0.08, paddingHorizontal: width * 0.05, justifyContent: 'space-between', alignItems: 'center'}}>
						<ThemedText style={styles.subtitle}>Blur unwatched episodes</ThemedText>
						
					<Switch
            style={{alignSelf: 'flex-end'}}
            value={settings.general.blurSpoilers}
            onValueChange={(value) => {
				setSettings({...settings, general: {...settings.general, blurSpoilers: value}});
            }}
          />
		  
		  </View>
				</SettingsHead>

				<SettingsHead title={'Sources'} iconName={'package'} community>
					<SettingsRow
						title={'Filter source language'}
						value={settings.general.sourceLanguage}
						onPress={() => _sourceLanguageRef.current?.open()}
					/>
					<SettingsRow
						title={'Third Party Trackers'}
						value={'Signed into ' + profiles.length + ' services'}
						onPress={() => navigation.navigate('Trackers')}
					/>

					{/* <SettingsRow
						title={'View available sources'}
						onPress={() => navigation.navigate('ArchivePage')}
					/> */}
				</SettingsHead>

				<SettingsHead title={'Sync'} iconName={'database'} community>
					<SettingsRow
						title={'Auto Sync'}
						value={sync.autoSync}
						onPress={() => navigation.navigate('SyncSettingsPage')}
					/>
				</SettingsHead>

				<SettingsHead title={'Notifications'} iconName={'bell-alert'} community>
					<SettingsRow
						title={'Background fetch'}
						value={minutesToHours.get(notifications.frequency)}
						onPress={() => navigation.navigate('NotificationsSettingsPage')}
					/>
				</SettingsHead>
				{devEnabled ? (
					<SettingsHead title={'Developer Mode'} iconName={'developer-mode'}>
						<SettingsRow
							title={'Configure Video Buffer'}
							onPress={() => navigation.navigate('VideoBufferingSettingsPage')}
						/>
					</SettingsHead>
				) : null}
				<SettingsHead title={'About'} iconName={'information'} community>
					<SettingsRow
						title={'Join the Discord server'}
						value={DiscordLink}
						onPress={() => Linking.openURL(DiscordLink)}
					/>
					<SettingsRow
						title={'Github'}
						onPress={() =>
							Linking.openURL('https://github.com/Michael24884/TaiYaKiAnime')
						}
					/>
					<TouchableWithoutFeedback
						disabled={!count}
						onPress={() => {
							setCount((c) => c! + 1);
						}}>
						<View>
							<SettingsRow title={'Version'} value={version + '•' + build} />
						</View>
					</TouchableWithoutFeedback>
				</SettingsHead>
			</ScrollView>
			<Modalize
				ref={_accentRef}
				adjustToContentHeight
				flatListProps={{
					data: colors,
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
				ref={_sourceLanguageRef}
				modalHeight={height * 0.45}
				flatListProps={{
					data: ['All', 'English', 'Spanish'],
					renderItem: _renderLanguages,
					keyExtractor: (item) => item,
				}}
				modalStyle={{ backgroundColor: theme.colors.card }}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	view: {
		flex: 1,
	},
	title: {
		fontSize: 15,
		fontWeight: '600',
	},
	subtitle: {
		fontSize: 15,
		fontWeight: '400',
	  }
});

export default SettingsScreen;
