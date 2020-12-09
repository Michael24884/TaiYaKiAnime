/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {
  MyQueueItems,
  useQueueStore,
  useSettingsStore,
  useTheme,
  useUserProfiles,
} from './Stores';
import {Navigator} from './Views/Components/navigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundFetch from 'react-native-background-fetch';
import {
  DetailedDatabaseIDSModel,
  DetailedDatabaseModel,
} from './Models/taiyaki';
import {SourceBase} from './Classes/SourceBase';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {Platform} from 'react-native';
import {useNotificationStore} from './Stores/notifications';
import RNBootSplash from 'react-native-bootsplash';

const App = () => {
  const initTrackers = useUserProfiles((_) => _.init);
  const initQueue = useQueueStore((_) => _.addDirectQueue);
  const initSettings = useSettingsStore((_) => _.initSettings);
  const initNotifications = useNotificationStore((_) => _.initNotifications);
  const setNotifications = useNotificationStore((_) => _.setNotifications);
  const initTheme = useTheme((_) => _.initTheme);
  const settings = useSettingsStore((_) => _.settings);

  useEffect(() => {
    initApp()
      .catch((e) => console.log('error starting up app, ', e))
      .finally(() => RNBootSplash.hide({fade: true}));
    //AsyncStorage.removeItem('notifications');
  }, []);

  async function initApp() {
    initTrackers();
    _initNotifications();
    await initTheme();
    await initSettings();
    await initNotifications();
    await _getQueue();
  }

  const _getQueue = async () => {
    const file = await AsyncStorage.getItem('my_queue_storage');
    if (file) {
      const queue = JSON.parse(file) as MyQueueItems;
      if (Object.keys(queue).length > 0) initQueue(queue);
    }
  };

  const _initNotifications = () => {
    if (Platform.OS === 'ios')
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
    const {
      frequency,
      allowOnLowPower,
      canUseCellularNetwork,
      requiresCharging,
    } = settings.notifications;

    BackgroundFetch.configure(
      {
        minimumFetchInterval: frequency,
        // Android options
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: true,
        requiredNetworkType: canUseCellularNetwork
          ? BackgroundFetch.NETWORK_TYPE_NONE
          : BackgroundFetch.NETWORK_TYPE_UNMETERED,
        requiresCharging,
        requiresBatteryNotLow: !allowOnLowPower,
      },
      async (taskId) => {
        await _fetchFollowingAnime();
        console.log('[js] Background Task Finished: ', taskId);
        // Required: Signal completion of your task to native code
        // If you fail to do this, the OS can terminate your app
        // or assign battery-blame for consuming too much background-time
        BackgroundFetch.finish(taskId);
      },
      (error) => {
        console.log('[js] RNBackgroundFetch failed to start. Error: ', error);
      },
    );
  };

  const _fetchFollowingAnime = async (): Promise<void> => {
    let number = 0;
    const files = (await AsyncStorage.getAllKeys())
      .map((i) => Number(i))
      .filter((i) => i);
    for (const file of files) {
      const database = await AsyncStorage.getItem(file.toString());
      if (!database) return;
      const anime = JSON.parse(database) as DetailedDatabaseModel;
      console.log('anime:', anime.title, ' isfollowing: ', anime.isFollowing);
      if (anime.isFollowing && anime.title) {
        const {source, link, totalEpisodes, title, ids} = anime;
        console.log('looking for', title);
        if (!link) return;
        const sourceBase = new SourceBase(source);
        const newEpisode = (await sourceBase.scrapeAvailableEpisodes(link))
          .length;
        if (newEpisode > totalEpisodes) {
          anime.totalEpisodes = newEpisode;
          await AsyncStorage.setItem(
            anime.ids.anilist!.toString(),
            JSON.stringify(anime),
          );
          //Queue a Local Notification
          LocalNotification(title, newEpisode, ids);
          if (Platform.OS === 'ios')
            PushNotificationIOS.setApplicationIconBadgeNumber(number++);
          await setNotifications(anime);
        }
      }
    }
  };

  PushNotification.configure({
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);

      // (required) Called when a remote is received or opened, or local notification is opened
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    requestPermissions: Platform.OS === 'ios',
  });

  const LocalNotification = (
    title: string,
    episode: number,
    ids: DetailedDatabaseIDSModel,
  ) =>
    PushNotification.localNotification({
      /* iOS and Android properties */
      title, // (optional)
      message: 'Episode ' + episode + ' is now ready to watch', // (required)
      userInfo: ids, // (optional) default: {} (using null throws a JSON value '<null>' error)
      soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    });

  return <Navigator />;
};

export default App;
