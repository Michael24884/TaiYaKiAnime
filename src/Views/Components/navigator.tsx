import React from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import {DetailScreen, DiscoveryScreen, SettingsScreen} from '../Screens';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTheme} from '../../Stores';
import {TrackerPage} from './Settings';
import GeneralPage from './Settings/general';
import {StatusBar} from 'react-native';
import SearchBindPage from './detailedParts';
import {ArchiveListScreen} from '../Screens/archive_list';
import Icon from 'react-native-dynamic-vector-icons';
import MyQueueScreen from '../Screens/QueuePage';
import EpisodesList from '../Screens/Detail/EpisodesList';
import CharacterListScreen from '../Screens/Detail/ViewMore/CharacterListScreen';
import RecommendationList from '../Screens/Detail/ViewMore/RecommendationListScreen';
import MoreItemsScreen from '../Screens/MoreItemsScreen';
import SearchPage from '../Screens/SearchPage';
import VideoPlayerScreen from '../Screens/VideoPlayerScreen';
import HistoryScreen from '../Screens/HistoryScreen';
import {
  AutoPlaySettingsPage,
  NotificationsSettingsPage,
  SyncSettingsPage,
  VideoBufferSettingsPage,
  VideoCoverSettingsPage,
  VideoSettingsPage,
} from '../Screens/Settings/DetailedSettingsPage';
import MyProfileScreen from '../Screens/Profiles/my_profile';
import TrackerList from '../Screens/Profiles/tracker_list';
import {MyProfileMal} from '../Screens/Profiles/my_profile_myanimelist';
import {MyProfileSimkl} from '../Screens/Profiles/my_profile_simkl';

export const Navigator = () => {
  const theme = useTheme((_) => _.theme);

  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  function HomeStack() {
    const navigation = useNavigation();
    return (
      <Stack.Navigator initialRouteName={'Home'}>
        <Stack.Screen
          name={'Home'}
          component={DiscoveryScreen}
          options={{
            headerRight: () => (
              <Icon
                size={25}
                style={{marginRight: 15}}
                name={'search'}
                type={'MaterialIcons'}
                onPress={() => navigation.navigate('SearchPage')}
              />
            ),
          }}
        />
        <Stack.Screen name={'BindPage'} component={SearchBindPage} />
        <Stack.Screen name={'EpisodesList'} component={EpisodesList} />
        <Stack.Screen name={'See More'} component={MoreItemsScreen} />
        <Stack.Screen
          name={'SearchPage'}
          component={SearchPage}
          options={{
            title: 'Search',
          }}
        />
        <Stack.Screen
          name={'Characters'}
          component={CharacterListScreen}
          options={{title: 'All Characters'}}
        />
        <Stack.Screen name={'Recommendations'} component={RecommendationList} />
        <Stack.Screen
          name={'Detail'}
          component={DetailScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'Video'}
          component={VideoPlayerScreen}
          options={{title: ' ', gestureEnabled: false, headerShown: false}}
        />
        {/* <Stack.Screen name={'MoreItems'} component={MoreItemsScreen} /> */}

        <Stack.Screen
          name={'AnilistProfile'}
          component={MyProfileScreen}
          options={{title: 'Anilist'}}
        />
        <Stack.Screen
          name={'MyAnimeListProfile'}
          component={MyProfileMal}
          options={{title: 'MyAnimeList'}}
        />
        <Stack.Screen
          name={'SimklProfile'}
          component={MyProfileSimkl}
          options={{title: 'SIMKL'}}
        />
        <Stack.Screen name={'TrackerList'} component={TrackerList} />
      </Stack.Navigator>
    );
  }

  function HistoryStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen component={HistoryScreen} name={'History'} />
        <Stack.Screen
          name={'Characters'}
          component={CharacterListScreen}
          options={{title: 'All Characters'}}
        />
        <Stack.Screen name={'Recommendations'} component={RecommendationList} />
        <Stack.Screen name={'BindPage'} component={SearchBindPage} />
        <Stack.Screen name={'EpisodesList'} component={EpisodesList} />
        <Stack.Screen
          name={'Detail'}
          component={DetailScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={'Video'}
          component={VideoPlayerScreen}
          options={{title: ' ', gestureEnabled: false, headerShown: false}}
        />
      </Stack.Navigator>
    );
  }

  function QueueStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name={'My Queue'} component={MyQueueScreen} />
        <Stack.Screen
          name={'Video'}
          component={VideoPlayerScreen}
          options={{title: ' ', gestureEnabled: false, headerShown: false}}
        />
      </Stack.Navigator>
    );
  }

  function SettingsStack() {
    const options: StackNavigationOptions = {title: 'More Setting'};
    return (
      <Stack.Navigator initialRouteName={'Settings'}>
        <Stack.Screen name={'Settings'} component={SettingsScreen} />
        <Stack.Screen name={'Trackers'} component={TrackerPage} />
        <Stack.Screen
          name={'VideoCoverSettingsPage'}
          component={VideoCoverSettingsPage}
          options={options}
        />
        <Stack.Screen
          name={'AutoPlaySettingsPage'}
          component={AutoPlaySettingsPage}
          options={options}
        />
        <Stack.Screen
          name={'NotificationsSettingsPage'}
          component={NotificationsSettingsPage}
          options={options}
        />
        <Stack.Screen
          name={'SyncSettingsPage'}
          component={SyncSettingsPage}
          options={options}
        />
        <Stack.Screen
          name={'VideoSettingsPage'}
          component={VideoSettingsPage}
          options={options}
        />
        <Stack.Screen
          name={'VideoBufferingSettingsPage'}
          component={VideoBufferSettingsPage}
          options={options}
        />
        <Stack.Screen
          name={'GeneralPage'}
          component={GeneralPage}
          options={{title: 'General'}}
        />
        <Stack.Screen
          name={'ArchivePage'}
          component={ArchiveListScreen}
          options={{title: 'Sources'}}
        />
      </Stack.Navigator>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        // barStyle={'light-content'}
        backgroundColor={theme.colors.card}
      />
      <NavigationContainer theme={theme}>
        <Tab.Navigator initialRouteName={'Discover'}>
          <Tab.Screen
            name={'Discover'}
            component={HomeStack}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon
                  name={'google-earth'}
                  type={'MaterialCommunityIcons'}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name={'History'}
            component={HistoryStack}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon
                  name={'history'}
                  type={'MaterialCommunityIcons'}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name={'Queue'}
            component={QueueStack}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon
                  name={'animation-play'}
                  type={'MaterialCommunityIcons'}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name={'Settings'}
            component={SettingsStack}
            options={{
              tabBarIcon: ({color, size}) => (
                <Icon
                  name={'cog'}
                  type={'MaterialCommunityIcons'}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};
