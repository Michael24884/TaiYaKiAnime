/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {FC, useEffect, useRef, useState} from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {StretchyScrollView} from 'react-native-stretchy';
import {useSimklRequests} from '../../../Hooks';
import {
  TaiyakiUserListModel,
  TrackingServiceTypes,
  WatchingStatus,
} from '../../../Models';
import {SimklUserModel} from '../../../Models/SIMKL';
import {useSimklStore, useTheme, useUserProfiles} from '../../../Stores';
import {MapWatchingStatusToNative} from '../../../Util';
import {Avatars, ThemedSurface, ThemedText} from '../../Components';
import {JewelStatusPreviewCards} from '../../Components/jewels';

const {height, width} = Dimensions.get('window');

export const MyProfileSimkl: FC<{
  route: {params: {tracker: TrackingServiceTypes}};
}> = (props) => {
  const {
    route: {
      params: {tracker},
    },
  } = props;
  const theme = useTheme((_) => _.theme);
  const navigation = useNavigation();
  const simklList = useSimklStore((_) => _.list);
  const user = useUserProfiles((_) =>
    _.profiles.find((i) => i.source === 'SIMKL'),
  );

  const {
    query: {data: simklBackground},
  } = useSimklRequests<{fanart?: string; title: string}>(
    'my_simkl_background',
    '/users/recently-watched-background/' + user?.profile.id,
    undefined,
    '0',
    false,
  );

  const [availableStatus, setAvailableStatus] = useState<WatchingStatus[]>([]);

  // const {
  //   query: {data: simklStats},
  // } = useSimklRequests<SimklStats>(
  //   ['my_simkl_stats'],
  //   '/users/' + auth!.userID + '/stats',
  // );

  const scrollY = useRef(new Animated.Value(0)).current;

  // const opacity = scrollY.interpolate({
  //   inputRange: [0, 150],
  //   outputRange: [0, 1],
  // });
  // const translateY = scrollY.interpolate({
  //   inputRange: [0, 235],
  //   outputRange: [height * 0.1, 0],
  //   extrapolate: 'clamp',
  // });

  // const backgroundColor = scrollY.interpolate({
  //   inputRange: [0, 150],
  //   outputRange: ['transparent', theme.colors.primary],
  //   extrapolateRight: 'clamp',
  // });

  useEffect(() => {
    _determineListStatus();
  }, []);

  const _determineListStatus = () => {
    const box: WatchingStatus[] = [];
    if (simklList.length > 0)
      simklList.map((p) => {
        if (!box.includes(p.status)) box.push(p.status);
      });
    setAvailableStatus(box);
  };

  if (!user?.profile)
    return (
      <View style={{flex: 1}}>
        <ActivityIndicator />
      </View>
    );

  const {id, username, image} = user.profile;

  const flattenSimkl = (): TaiyakiUserListModel[] => {
    const item: TaiyakiUserListModel[] = simklList.map((i) => ({
      ids: {mal: i.ids.mal},
      coverImage: i.coverImage,
      title: i.title,
      progress: i.progress,
      score: i.score,
      totalEpisodes: i.totalEpisodes,
      status: i.status ?? 'Add to List',
    }));
    return item;
  };

  const _renderWatchJewels = ({item}: {item: WatchingStatus}) => {
    return (
      <JewelStatusPreviewCards
        onTap={() => {
          navigation.navigate('TrackerList', {
            tracker,
            list: flattenSimkl().filter((i) => i.status === item),
          });
        }}
        status={item}
        itemCount={simklList.filter((i) => i.status === item).length}
        images={simklList
          .filter((i) => i.status === item)
          .slice(0, 3)
          .map((i) => i.coverImage)}
      />
    );
  };

  // const _buildMinorStats = () => {
  //   if (!simklStats) return null;
  //   const {
  //     anime: {
  //       total_mins,
  //       watching: {left_to_watch_mins},
  //     },
  //     watched_last_week: {anime_mins},
  //   } = simklStats;

  //   const infoView = (title: string, desc: string) => {
  //     return (
  //       <View style={{marginVertical: 5}}>
  //         <ThemedText
  //           style={[
  //             styles.subtitle,
  //             {color: theme.colors.primary, marginBottom: 4},
  //           ]}>
  //           {title}
  //         </ThemedText>
  //         <ThemedText style={styles.minorStatsDesc}>{desc}</ThemedText>
  //       </View>
  //     );
  //   };
  //   return (
  //     <ThemedSurface
  //       style={[
  //         styles.surface,
  //         {
  //           padding: 8,
  //           flexDirection: 'row',
  //           flexWrap: 'wrap',
  //           justifyContent: 'space-between',
  //         },
  //       ]}>
  //       {total_mins > 0
  //         ? infoView(
  //             'Total minutes of anime watched',
  //             total_mins.toLocaleString(),
  //           )
  //         : null}
  //       {left_to_watch_mins > 0
  //         ? infoView(
  //             'Total minutes left to watch',
  //             left_to_watch_mins.toLocaleString(),
  //           )
  //         : null}
  //       {anime_mins > 0
  //         ? infoView(
  //             'Total minutes of anime watched last week',
  //             anime_mins.toLocaleString(),
  //           )
  //         : null}
  //     </ThemedSurface>
  //   );
  // };

  return (
    <View style={{flex: 1}}>
      <StretchyScrollView
        image={
          simklBackground?.fanart
            ? {
                uri: simklBackground.fanart,
              }
            : require('../../../assets/images/icon_round.png')
        }
        imageHeight={height * 0.25}
        onScroll={(position) => {
          scrollY.setValue(position);
        }}
        imageOverlay={
          <LinearGradient
            style={{flex: 1}}
            colors={['transparent', 'rgba(0,0,0,0.65)']}
          />
        }
        foreground={
          <ThemedText
            numberOfLines={1}
            style={{
              color: theme.colors.accent,
              position: 'absolute',
              bottom: height * 0.01,
              right: width * 0.05,
            }}>
            {simklBackground?.title ?? ''}
          </ThemedText>
        }
        scrollEventThrottle={15}
        showsVerticalScrollIndicator={false}>
        <ThemedSurface style={styles.surface}>
          <View
            style={{
              marginBottom: -height * 0.03,
              transform: [
                {translateY: -height * 0.05},
                {translateX: width * 0.035},
              ],
            }}>
            <Avatars url={image} size={height * 0.12} />
          </View>
          <ThemedText style={styles.username}>{username}</ThemedText>
          <ThemedText style={styles.tracker}>{tracker}</ThemedText>
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
              {(simklList.length ?? 0).toString() + ' total'}
            </ThemedText>
          </View>
          <View
            style={{
              paddingHorizontal: 8,
            }}>
            {availableStatus.length > 0 && simklList.length > 0 ? (
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

        {/* {_buildMinorStats()} */}
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
