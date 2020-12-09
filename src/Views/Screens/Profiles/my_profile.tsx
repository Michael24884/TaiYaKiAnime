/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {FC, useEffect, useRef, useState} from 'react';
import {
  Image,
  View,
  Animated,
  StyleSheet,
  RefreshControl,
  LayoutAnimation,
  Dimensions,
  ActivityIndicator,
  Button,
} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {StretchyScrollView} from 'react-native-stretchy';
import {queryCache} from 'react-query';
import {
  TaiyakiUserListModel,
  TrackingServiceTypes,
  WatchingStatus,
} from '../../../Models';
import {useTheme, useUserProfiles} from '../../../Stores';
import {useAnilistRequest} from '../../../Hooks';
import {MapWatchingStatusToNative} from '../../../Util';
import {JewelStatusPreviewCards} from '../../Components/jewels';
import {
  Avatars,
  TaiyakiParsedText,
  ThemedSurface,
  ThemedText,
} from '../../Components';
import {
  AnilistMediaListCollectionEntriesModel,
  AnilistMediaListCollectionGraph,
  AnilistMediaListCollectionModel,
  AnilistViewerGraph,
  AnilistViewerModel,
  Media,
} from '../../../Models/Anilist';

interface Props {
  route: {params: {tracker: TrackingServiceTypes; id?: number}};
}

type Profile = {
  username: string;
  avatar?: string;
  bannerImage?: string;
  about?: string;
  id: number;
};
const {height, width} = Dimensions.get('window');

const MyProfileScreen: FC<Props> = (props) => {
  const navigation = useNavigation();
  const user = useUserProfiles((_) =>
    _.profiles.find((i) => i.source === 'Anilist'),
  )!;
  const theme = useTheme((_) => _.theme);
  const {
    route: {
      params: {tracker, id},
    },
  } = props;

  const [profile, setProfile] = useState<Profile>();
  const [myList, setMyList] = useState<TaiyakiUserListModel[]>([]);

  const [availableStatus, setAvailableStatus] = useState<WatchingStatus[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [aboutExpanded, setAboutExpanded] = useState<boolean>(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  const opacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
  });
  const translateY = scrollY.interpolate({
    inputRange: [0, 235],
    outputRange: [height * 0.1, 0],
    extrapolate: 'clamp',
  });

  const backgroundColor = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: ['transparent', theme.colors.primary],
    extrapolateRight: 'clamp',
  });

  const {
    query: {data: anilistQuery, refetch: refetchAnilistProfile},
  } = useAnilistRequest<AnilistViewerModel>(
    `anilist_profile+${id}`,
    AnilistViewerGraph,
  );

  const {
    query: {data: anilistList, refetch: refetchAnilist},
  } = useAnilistRequest<AnilistMediaListCollectionModel>(
    'my_anilist',
    AnilistMediaListCollectionGraph(Number(user.profile.id)!),
    {enabled: anilistQuery !== undefined},
  );

  useEffect(() => {
    if (anilistQuery) choiceMaker();
  }, [anilistQuery]);

  useEffect(() => {
    if (anilistList) refill();
  }, [anilistList]);

  const flattenAnilist = (_data: AnilistMediaListCollectionEntriesModel[]) => {
    let _list: TaiyakiUserListModel[] = [];
    for (var i = 0; i < _data.length; i++) {
      const entries = _data[i].entries as Array<{
        media: Media;
        progress: number;
        score: number;
        status: string;
      }>;
      for (var e = 0; e < entries.length; e++) {
        const data = entries[e];
        _list.push({
          title: data.media.title.romaji,
          coverImage: data.media.coverImage.extraLarge,
          ids: {anilist: data.media.id},
          status: MapWatchingStatusToNative.get(data.status)!,
          progress: data.progress,
          score: data.score,
          totalEpisodes: data.media.episodes,
        });
      }
    }
    return _list;
  };

  useEffect(() => {
    if (myList.length > 0) {
      _determineListStatus();
    }
  }, [myList]);

  const refill = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (tracker === 'SIMKL') {
      setIsLoading(false);
      //setUserList(flattenSimkl());
    } else if (tracker === 'Anilist' && anilistList) {
      setIsLoading(false);
      const list = anilistList as AnilistMediaListCollectionModel;

      const userList = list.data.MediaListCollection;
      if (userList && userList.lists.length > 0) {
        console.log('should refill');
        setMyList(() => flattenAnilist(userList.lists));
      }
    } else if (tracker === 'MyAnimeList') {
      setIsLoading(false);
      //	const list = malResponder.query.data;
      //	setUserList(flattenMal(list.data));
    }
  };
  const _determineListStatus = () => {
    const box: WatchingStatus[] = [];
    if (myList.length > 0)
      myList.map((p) => {
        if (!box.includes(p.status)) box.push(p.status);
      });
    setAvailableStatus(box);
  };

  const choiceMaker = () => {
    switch (tracker) {
      case 'Anilist':
        //if (!anilistQuery) return;
        refill();
        const anilistQ = anilistQuery!.data.Viewer;
        setProfile({
          username: anilistQ.name,
          avatar: anilistQ.avatar.large,
          id: anilistQ.id,
          bannerImage: anilistQ.bannerImage,
        });
        break;
    }
  };

  if (!anilistQuery || !profile) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }

  const _refresh = () => {
    setIsLoading(true);
    switch (tracker) {
      case 'Anilist':
        refetchAnilistProfile().then((_) => setIsLoading(false));
        refetchAnilist();
        break;
    }
  };

  const _renderWatchJewels = ({item}: {item: WatchingStatus}) => {
    return (
      <JewelStatusPreviewCards
        onTap={() => {
          navigation.navigate('TrackerList', {
            tracker,
            isLoading,
            list: myList.filter((i) => i.status === item),
          });
        }}
        status={item}
        itemCount={myList.filter((i) => i.status === item).length}
        images={myList
          .filter((i) => i.status === item)
          .slice(0, 3)
          .map((i) => i.coverImage)}
      />
    );
  };

  //   const _buildFollowerAndFriends = () => {
  //     if (anilistQuery.data.Page.followers.length === 0) return null;
  //     const {
  //       data: {
  //         Page: {followers},
  //       },
  //     } = anilistQuery;
  //     const _renderItem = ({
  //       item,
  //     }: {
  //       item: {
  //         name: string;
  //         id: number;
  //         avatar: {
  //           large: string;
  //         };
  //       };
  //     }) => {
  //       return (
  //         <TouchableOpacity
  //           onPress={() =>
  //             navigation.push('ProfileHost', {
  //               tracker,
  //               id: item.id,
  //             })
  //           }>
  //           <View style={[styles.friendBubbleView, {width: width * 0.25}]}>
  //             <Avatars url={item.avatar.large} />
  //             <ThemedText
  //               style={[styles.friendBubbleText]}
  //               numberOfLines={2}
  //               shouldShrink>
  //               {item.name}
  //             </ThemedText>
  //           </View>
  //         </TouchableOpacity>
  //       );
  //     };
  //     return (
  //       <View>
  //         <View
  //           style={{
  //             flexDirection: 'row',
  //             justifyContent: 'space-between',
  //             alignContent: 'flex-start',
  //             marginRight: 8,
  //           }}>
  //           <ThemedText style={[styles.subtitle, {color: theme.colors.primary}]}>
  //             Top {tracker === 'Anilist' ? 'Followers' : 'Friends'}
  //           </ThemedText>
  //           {/* <Button
  // 						style={{
  // 							transform: [{ scale: 0.85 }, { translateY: -height * 0.015 }],
  // 						}}>
  // 						See All
  // 					</Button> */}
  //         </View>
  //         <FlatList
  //           data={followers}
  //           renderItem={_renderItem}
  //           keyExtractor={(i) => i.name}
  //           horizontal
  //         />
  //       </View>
  //     );
  //   };

  //   const _buildFavouritesAnime = () => {
  //     if (
  //       (anilistQuery.data.Viewer?.favourites?.anime?.nodes ?? []).length === 0 &&
  //       (anilistQuery.data.User?.favourites?.anime?.nodes ?? []).length === 0
  //     )
  //       return null;
  //     const anime = !id
  //       ? anilistQuery.data.Viewer?.favourites?.anime
  //       : anilistQuery.data.User?.favourites?.anime;
  //     const _renderItem = ({item}: {item: AnilistNode}) => {
  //       return (
  //         <TouchableOpacity
  //           onPress={() =>
  //             navigation.push('Detailed', {
  //               title: item.title.romaji,
  //               image: item.coverImage.extraLarge,
  //               id: item.id,
  //             })
  //           }>
  //           <View
  //             style={{
  //               height: height * 0.28,
  //               width: width * 0.3,
  //               marginHorizontal: 8,
  //             }}>
  //             <Image
  //               source={{uri: item.coverImage.extraLarge}}
  //               style={{height: '68%', width: '100%'}}
  //             />
  //             <Text style={styles.favouritesTitle}>{item.title.romaji}</Text>
  //           </View>
  //         </TouchableOpacity>
  //       );
  //     };

  //     return (
  //       <ThemedSurface style={styles.surface}>
  //         <ThemedText style={[styles.subtitle, {color: theme.colors.primary}]}>
  //           Anime Favourites
  //         </ThemedText>
  //         <FlatList
  //           data={anime.nodes}
  //           renderItem={_renderItem}
  //           keyExtractor={(i) => i.id.toString()}
  //           horizontal
  //         />
  //       </ThemedSurface>
  //     );
  //   };
  //   const _buildFavouritesCharacters = () => {
  //     if (
  //       (anilistQuery.data.Viewer?.favourites?.characters?.nodes ?? []).length ===
  //         0 &&
  //       (anilistQuery.data.User?.favourites?.characters?.nodes ?? []).length === 0
  //     )
  //       return null;
  //     const characters = !id
  //       ? anilistQuery.data.Viewer?.favourites?.characters
  //       : anilistQuery.data.User?.favourites?.characters;
  //     const _renderItem = ({
  //       item,
  //     }: {
  //       item: {name: {full: string}; id: number; image: {large: string}};
  //     }) => {
  //       return (
  //         <TouchableOpacity
  //         // onPress={() =>
  //         // 	navigation.navigate("Detailed", {
  //         // 		title: item.title.romaji,
  //         // 		image: item.coverImage.extraLarge,
  //         // 		id: item.id,
  //         // 	})
  //         >
  //           <View
  //             style={{
  //               height: height * 0.28,
  //               width: width * 0.3,
  //               marginHorizontal: 8,
  //             }}>
  //             <Image
  //               source={{uri: item.image.large}}
  //               style={{height: '68%', width: '100%'}}
  //             />
  //             <Text style={styles.favouritesTitle}>{item.name.full}</Text>
  //           </View>
  //         </TouchableOpacity>
  //       );
  //     };
  //     return (
  //       <ThemedSurface style={styles.surface}>
  //         <ThemedText style={[styles.subtitle, {color: theme.colors.primary}]}>
  //           Character Favourites
  //         </ThemedText>
  //         <FlatList
  //           data={characters.nodes}
  //           renderItem={_renderItem}
  //           keyExtractor={(i) => i.id.toString()}
  //           horizontal
  //         />
  //       </ThemedSurface>
  //     );
  //   };

  //   const _buildStats = () => {
  //     const tags = !id
  //       ? anilistQuery.data.Viewer.statistics.anime.tags
  //       : anilistQuery.data.User.statistics.anime.tags;

  //     if (tags.length === 0)
  //       return (
  //         <ThemedSurface style={styles.surface}>
  //           <ThemedText
  //             style={{
  //               fontSize: 21,
  //               fontWeight: 'bold',
  //               textAlign: 'center',
  //               margin: 8,
  //               color: 'grey',
  //             }}>
  //             No Data to display. Anilist will build up enough once it collects
  //             info information
  //           </ThemedText>
  //         </ThemedSurface>
  //       );
  //     // return (
  //     //   <Surface style={[styles.surface]}>
  //     //     <Text style={styles.chartTitles}>Top 10 Tags</Text>
  //     //     <VictoryPie
  //     //       width={width}
  //     //       padding={isTablet() ? width * 0.11 : width * 0.2}
  //     //       height={isTablet() ? height * 0.6 : height * 0.4}
  //     //       style={{
  //     //         parent: {marginBottom: -height * 0.045},
  //     //         labels: {fill: theme.colors.text},
  //     //       }}
  //     //       labelPlacement={'vertical'}
  //     //       labels={({datum}) => `${datum.x}: ${datum.y.toFixed(0)}`}
  //     //       data={tags.slice(0, 10).map((i) => ({x: i.tag.name, y: i.count}))}
  //     //       colorScale={[
  //     //         '#6761a8',
  //     //         '#63d2ff',
  //     //         '#3ddc97',
  //     //         '#46237a',
  //     //         '#ff0f80',
  //     //         '#467599',
  //     //         '#5dfdcb',
  //     //         '#a30015',
  //     //         '#256eff',
  //     //         '#ff7f11',
  //     //       ]}
  //     //       animate={{duration: 1500}}
  //     //     />
  //     //   </Surface>
  //     // );
  //   };

  //   const _buildMinorStats = () => {
  //     const stats = id
  //       ? anilistQuery.data.User.statistics.anime
  //       : anilistQuery.data.Viewer.statistics.anime;

  //     const infoView = (title: string, desc: string) => {
  //       return (
  //         <View style={{marginVertical: 5}}>
  //           <ThemedText
  //             style={[
  //               styles.subtitle,
  //               {color: theme.colors.primary, marginBottom: 4},
  //             ]}>
  //             {title}
  //           </ThemedText>
  //           <ThemedText style={styles.minorStatsDesc}>{desc}</ThemedText>
  //         </View>
  //       );
  //     };
  //     if (
  //       stats.genres.length === 0 &&
  //       stats.minutesWatched < 1 &&
  //       stats.episodesWatched < 1
  //     )
  //       return null;
  //     return (
  //       <ThemedSurface
  //         style={[
  //           styles.surface,
  //           {
  //             padding: 8,
  //             flexDirection: 'row',
  //             flexWrap: 'wrap',
  //             justifyContent: 'space-between',
  //           },
  //         ]}>
  //         {stats.genres.length > 0
  //           ? infoView('Top Favorited Genre', stats.genres[0].genre)
  //           : null}
  //         {stats.genres.length >= 2
  //           ? infoView('Least Favorited Genre', stats.genres.splice(-1)[0].genre)
  //           : null}
  //         {stats.minutesWatched > 0
  //           ? infoView(
  //               'Total Minutes Watched',
  //               stats.minutesWatched.toLocaleString(),
  //             )
  //           : null}
  //         {stats.episodesWatched > 0
  //           ? infoView(
  //               'Total Episodes Watched',
  //               stats.episodesWatched.toLocaleString(),
  //             )
  //           : null}
  //       </ThemedSurface>
  //     );
  //   };

  return (
    <>
      <View
        style={{
          position: 'absolute',
          zIndex: 100,
          top: 0,
          left: 0,
          right: 0,
        }}>
        {/* <AnimatedHeader
          style={{
            opacity,
            backgroundColor,
            overflow: 'hidden',
          }}>
          <Appbar.BackAction color={'transparent'} />
          <AnimatedTitle
            style={{
              overflow: 'hidden',
              transform: [{translateY}],
            }}
            titleStyle={{fontSize: 18, fontWeight: '600'}}
            title={profile.username}
          />
        </AnimatedHeader> */}
      </View>

      <View style={{flex: 1}}>
        <StretchyScrollView
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => {
                queryCache
                  .invalidateQueries([
                    `anilist_profile+${id}`,
                    `my_anilist_list+${id}`,
                  ])
                  .then(_refresh);
              }}
            />
          }
          image={
            profile.bannerImage
              ? {
                  uri: profile.bannerImage,
                }
              : require('../../../assets/images/icon_round.png')
          }
          onScroll={(position) => {
            scrollY.setValue(position);
          }}
          imageHeight={height * 0.25}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}>
          <ThemedSurface style={styles.surface}>
            <Avatars url={profile.avatar} size={height * 0.12} />
            <ThemedText style={styles.username}>{profile.username}</ThemedText>
            <ThemedText style={styles.tracker}>{tracker}</ThemedText>
            {profile.about ? (
              <View>
                <TaiyakiParsedText
                  numberOfLines={aboutExpanded ? undefined : 6}
                  color={'grey'}
                  style={styles.about}>
                  {profile.about}
                </TaiyakiParsedText>
                {profile.about.length > 100 ? (
                  <Button
                    onPress={() => {
                      LayoutAnimation.configureNext(
                        LayoutAnimation.Presets.spring,
                      );
                      setAboutExpanded((i) => !i);
                    }}
                    title={aboutExpanded ? 'Close' : 'Expand'}
                  />
                ) : null}
              </View>
            ) : null}
          </ThemedSurface>
          <ThemedSurface style={styles.surface}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <ThemedText
                style={[styles.subtitle, {color: theme.colors.primary}]}>
                Anime List
              </ThemedText>
              <ThemedText
                style={[
                  styles.subtitle,
                  {color: theme.colors.primary, marginRight: 8},
                ]}>
                {(myList.length ?? 0).toString() + ' total'}
              </ThemedText>
            </View>
            <View
              style={{
                paddingHorizontal: 8,
              }}>
              {availableStatus.length > 0 && myList.length > 0 ? (
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  data={availableStatus}
                  keyExtractor={(i) => i}
                  renderItem={_renderWatchJewels}
                  horizontal
                />
              ) : (
                // <ScrollView hor>
                // 	<View style={{ flexDirection: "row" }}>
                // 	{availableStatus.map((i) => _renderWatchJewels({ item: i }))}
                // </View>
                // </ScrollView>
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
          {/* {_buildFollowerAndFriends()}
          {_buildFavouritesAnime()}
          {_buildFavouritesCharacters()}
          {_buildStats()}
          {_buildMinorStats()} */}
        </StretchyScrollView>
      </View>
    </>
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
  about: {
    fontSize: 15,
    color: 'grey',
    marginTop: 8,
  },
  surface: {
    paddingVertical: 12,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 12,
    marginBottom: 12,
  },
  chartTitles: {
    fontSize: 21,
    fontWeight: '700',
    marginLeft: 8,
  },
  favouritesTitle: {
    fontSize: 14,
    marginTop: 5,
  },
  friendBubbleView: {
    marginVertical: 12,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendBubbleText: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  minorStatsDesc: {
    fontSize: 12,
    fontWeight: '600',
    color: 'grey',
    marginLeft: 12,
  },
});

export default MyProfileScreen;
