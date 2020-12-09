/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {createRef, useEffect, useState} from 'react';
import {
  Dimensions,
  Linking,
  Modal,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  BaseTheme,
  LightTheme,
  TaiyakiBlackTheme,
  TaiyakiDarkTheme,
} from '../../Models';
import {useSettingsStore, useTheme, useUserProfiles} from '../../Stores';
import {colors, minutesToHours} from '../../Util';
import {ThemedText} from '../Components';
import {DiscordLink} from './../../Models';
import {version, build} from '../../../package.json';
import {
  SettingsHead,
  SettingsRow,
  TaiyakiSettingsHeader,
} from '../Components/Settings';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {Modalize} from 'react-native-modalize';
const {width, height} = Dimensions.get('window');

const SettingsScreen = () => {
  const navigation = useNavigation();
  const setTheme = useTheme((_) => _.setTheme);
  const setAccent = useTheme((_) => _.setAccent);
  const theme = useTheme((_) => _.theme);
  const {settings, set} = useSettingsStore();
  const profiles = useUserProfiles((_) => _.profiles);
  const [themeOpen, setThemeOpen] = useState<boolean>(false);
  const {getItem, setItem} = useAsyncStorage('dev');

  const [count, setCount] = useState<number | undefined>(0);
  const [devEnabled, setDevMode] = useState<boolean>(false);

  const {general, customization, notifications, sync, queue} = settings;

  const _accentRef = createRef<Modalize>();

  // const modal = (visible: boolean, setHide: (arg0: boolean) => void,) => {
  //   return (
  //     <Modal>

  //     </Modal>
  //   )
  // }

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

  const _renderAccents = ({item}: {item: string}) => {
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
            style={{fontWeight: '800', fontSize: 18, color: theme.colors.text}}>
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
          <View style={{height: height * 0.5}}>
            {_colorView(LightTheme)}
            {_colorView(TaiyakiDarkTheme)}
            {_colorView(TaiyakiBlackTheme)}
          </View>
        </View>
      </Modal>
      <ScrollView
        style={[
          styles.view,
          {backgroundColor: theme.colors.backgroundColor, paddingTop: 12},
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
          <SettingsRow
            title={'Persist queue to storage'}
            value={queue.saveQueue}
            hasSwitcher
            onValueChange={(value) => {
              set((state: any) => {
                state.settings.queue.saveQueue = value;
              });
            }}
          />
          <SettingsRow
            title={'Blur unwatched episodes'}
            value={general.blurSpoilers}
            hasSwitcher
            onValueChange={(value) => {
              console.log('the new value', value);
              set((state: any) => {
                state.settings.general.blurSpoilers = value;
              });
            }}
          />
        </SettingsHead>

        <SettingsHead title={'Sources'} iconName={'package'} community>
          <SettingsRow
            title={'Third Party Trackers'}
            value={'Signed into ' + profiles.length + ' services'}
            onPress={() => navigation.navigate('Trackers')}
          />

          <SettingsRow
            title={'View available sources'}
            onPress={() => navigation.navigate('ArchivePage')}
          />
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
        {devEnabled ? (
          <SettingsHead title={'Developer Mode'} iconName={'developer-mode'}>
            <SettingsRow
              title={'Configure Video Buffer'}
              onPress={() => navigation.navigate('VideoBufferingSettingsPage')}
            />
          </SettingsHead>
        ) : null}
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
        modalStyle={{backgroundColor: theme.colors.card}}
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
});

export default SettingsScreen;
