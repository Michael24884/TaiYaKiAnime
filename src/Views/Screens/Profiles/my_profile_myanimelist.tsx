/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {StretchyScrollView} from 'react-native-stretchy';
import {QueryStatus} from 'react-query';
import {useMalRequests} from '../../../Hooks';
import {TaiyakiUserListModel, WatchingStatus} from '../../../Models';
import {
  MALUserModel,
  MyAnimeListCombinedListModel,
} from '../../../Models/MyAnimeList';
import {useTheme, useUserProfiles} from '../../../Stores';
import {MapWatchingStatusToNative} from '../../../Util';
import {Avatars, ThemedSurface, ThemedText} from '../../Components';
import {JewelStatusPreviewCards} from '../../Components/jewels';

const {height, width} = Dimensions.get('window');

type Profile = {
  name: string;
  picture?: string;
  id: number;
  joined_at: string;
  myList: TaiyakiUserListModel[];
};

export const MyProfileMal = () => {
  const theme = useTheme((_) => _.theme);
  const navigation = useNavigation();
  const auth = useUserProfiles((_) =>
    _.profiles.find((i) => i.source === 'MyAnimeList'),
  )!;
  const {
    query: {data: myProfile, status, isLoading: ProfileLoading},
  } = useMalRequests<MALUserModel>(
    'my_anime_list_profile',
    '/users/@me?fields=picture,anime_statistics,joined_at',
  );

  const {
    query: {data: myAnimeList, isLoading: ListLoading},
  } = useMalRequests<{data: MyAnimeListCombinedListModel[]}>(
    'my_anime_list',
    '/users/@me/animelist?limit=1000&sort=list_updated_at&fields=list_status,num_episodes',
  );

  const [profile, setProfile] = useState<Profile>();
  const [availableStatus, setAvailableStatus] = useState<WatchingStatus[]>([]);

  const flattenMal = (
    _data: MyAnimeListCombinedListModel[],
  ): TaiyakiUserListModel[] => {
    const item: TaiyakiUserListModel[] = _data.map((i) => ({
      ids: {mal: i.node.id.toString()},
      coverImage: i.node.main_picture?.large ?? i.node.main_picture.medium,
      title: i.node.title,
      progress: i.list_status.num_episodes_watched ?? 0,
      score: i.list_status?.score ?? 0,
      totalEpisodes: i.node.num_episodes,
      status: MapWatchingStatusToNative.get(i.list_status.status)!,
    }));
    return item;
  };

  const _determineListStatus = () => {
    const box: WatchingStatus[] = [];
    if (profile && profile.myList.length > 0)
      profile.myList.map((p) => {
        if (!box.includes(p.status)) box.push(p.status);
      });
    setAvailableStatus(box);
  };

  useEffect(() => {
    if (myProfile)
      setProfile({
        id: myProfile.id,
        name: myProfile.name,
        picture: myProfile.picture,
        joined_at: myProfile.joined_at,
        myList: [],
      });
  }, [myProfile]);

  useEffect(() => {
    if (myAnimeList)
      setProfile((i) => {
        if (i) return {...i, myList: flattenMal(myAnimeList.data)};
      });
  }, [myAnimeList]);

  useEffect(() => {
    _determineListStatus();
  }, [profile]);

  if (status === QueryStatus.Loading || !profile)
    return (
      <View style={{flex: 1}}>
        <ActivityIndicator />
      </View>
    );

  const {name, picture, joined_at} = profile;

  const _renderWatchJewels = ({item}: {item: WatchingStatus}) => {
    return (
      <JewelStatusPreviewCards
        onTap={() => {
          navigation.navigate('TrackerList', {
            tracker: 'MyAnimeList',
            isLoading: ProfileLoading && ListLoading,
            list: profile.myList.filter((i) => i.status === item),
          });
        }}
        status={item}
        itemCount={profile.myList.filter((i) => i.status === item).length}
        images={profile.myList
          .filter((i) => i.status === item)
          .slice(0, 3)
          .map((i) => i.coverImage)}
      />
    );
  };

  const _buildMinorStats = () => {
    const stats = myProfile?.anime_statistics;
    const infoView = (title: string, desc: string) => {
      return (
        <View style={{marginVertical: 5}}>
          <ThemedText
            style={[
              styles.subtitle,
              {color: theme.colors.primary, marginBottom: 4},
            ]}>
            {title}
          </ThemedText>
          <ThemedText style={styles.minorStatsDesc}>{desc}</ThemedText>
        </View>
      );
    };
    return (
      <ThemedSurface
        style={[
          styles.surface,
          {
            padding: 8,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          },
        ]}>
        {stats?.num_days
          ? infoView(
              'Total days of anime watched',
              stats.num_days.toLocaleString(),
            )
          : null}
        {stats?.num_episodes
          ? infoView(
              'Total number of episodes watched',
              stats.num_episodes.toLocaleString(),
            )
          : null}
      </ThemedSurface>
    );
  };

  return (
    <View style={{flex: 1}}>
      <StretchyScrollView>
        <ThemedSurface style={styles.surface}>
          <View
            style={{
              marginBottom: 8,
              marginLeft: width * 0.035,
            }}>
            <Avatars size={height * 0.12} url={picture} />
          </View>
          <ThemedText style={styles.username}>{name}</ThemedText>
          <ThemedText style={styles.tracker}>MyAnimeList</ThemedText>
          <ThemedText style={[styles.tracker, {marginTop: 5}]}>
            Joined{' '}
            {new Date(joined_at).toLocaleDateString([], {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </ThemedText>
        </ThemedSurface>
        <ThemedSurface style={styles.surface}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <ThemedText
              style={[styles.subtitle, {color: theme.colors.primary}]}>
              Anime List
            </ThemedText>
            <ThemedText
              style={[
                styles.subtitle,
                {color: theme.colors.primary, marginRight: 8},
              ]}>
              {(profile?.myList?.length ?? 0).toString() + ' total'}
            </ThemedText>
          </View>
          <View
            style={{
              paddingHorizontal: 8,
            }}>
            {availableStatus.length > 0 && profile.myList.length > 0 ? (
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={availableStatus}
                keyExtractor={(i) => i}
                renderItem={_renderWatchJewels}
                horizontal
              />
            ) : (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  alignSelf: 'center',
                  marginTop: 4,
                }}>
                <ThemedText
                  style={{
                    fontSize: 21,
                    fontWeight: '800',
                    color: 'grey',
                    textAlign: 'center',
                  }}>
                  Anime list may be empty or private
                </ThemedText>
              </View>
            )}
          </View>
        </ThemedSurface>

        {_buildMinorStats()}
      </StretchyScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  username: {
    fontSize: 21,
    fontWeight: '600',
    marginLeft: 12,
  },
  tracker: {
    fontSize: 14,
    color: 'grey',
    marginLeft: 12,
  },
  surface: {
    paddingVertical: 12,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 12,
    marginBottom: 12,
  },
  minorStatsDesc: {
    fontSize: 12,
    fontWeight: '600',
    color: 'grey',
    marginLeft: 12,
  },
});
