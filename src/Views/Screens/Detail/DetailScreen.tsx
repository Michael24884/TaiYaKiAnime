/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Dimensions,
  LogBox,
  Platform,
  StyleSheet,
  Animated,
  View,
  Modal,
} from 'react-native';
import Icon from 'react-native-dynamic-vector-icons';
import {FlatList} from 'react-native-gesture-handler';
import {StretchyScrollView} from 'react-native-stretchy';
import {useAnilistRequest, useDetailedHook} from '../../../Hooks';
import {
  AnilistCharacterModel,
  AnilistDetailedGraph,
  AnilistRecommendationPageEdgeModel,
  Media,
} from '../../../Models/Anilist';
import {useSettingsStore, useTheme, useUserProfiles} from '../../../Stores';
import {
  dateNumToString,
  MapAnilistSeasonsToString,
  MapAnilistSourceToString,
  MapAnilistStatusToString,
} from '../../../Util';
import {
  BaseCards,
  BindTitleBlock,
  DangoImage,
  Divider,
  TaiyakiHeader,
  ThemedButton,
  ThemedCard,
  ThemedSurface,
  ThemedText,
  WatchTile,
} from '../../Components';
import {SynopsisExpander} from '../../Components/header';
import StatusPage from './StatusPage';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {DetailedDatabaseModel, MyQueueModel} from '../../../Models/taiyaki';
import {useQueueStore, useUpNextStore} from '../../../Stores/queue';
import {StatusCards} from '../../Components/detailedParts';

const {height, width} = Dimensions.get('window');
const ITEM_HEIGHT = height * 0.26;

interface Props {
  route: {
    params: {
      id: number;
      malID?: string;
      embedLink?: string;
      updateRequested?: boolean;
    };
  };
}

LogBox.ignoreLogs(['Aborted']);

const DetailScreen: FC<Props> = (props) => {
  const {malID} = props.route.params;
  const settings = useSettingsStore((_) => _.settings);
  const profiles = useUserProfiles((_) => _.profiles);
  const [statusPageVisible, setStatusPageVisibility] = useState<boolean>(false);
  const navigation = useNavigation();
  const scrollValue = useRef(new Animated.Value(0)).current;
  const theme = useTheme((_) => _.theme);

  const [id, setID] = useState<number>(props.route.params.id);

  const [database, setDatabase] = useState<DetailedDatabaseModel>();

  const {
    query: {data},
    controller,
  } = useAnilistRequest<{data: {Media: Media}}>(
    'Detailed' + (malID ?? id.toString()),
    AnilistDetailedGraph(id, malID),
  );

  // const {
  //   query: {data: SimklEpisodeData},
  //   controller: SimklEpisodeController,
  // } = useSimklRequests<SimklEpisodes[]>(
  //   'simkl' + id,
  //   '/anime/episodes/',
  //   data?.data.Media.idMal,
  //   database !== undefined && database.link !== undefined,
  // );

  const detailedHook = useDetailedHook(id, database, data?.data.Media.idMal);
  const addUpNext = useUpNextStore((_) => _.addAll);
  const {queueLength, addAllToQueue} = useQueueStore((_) => _);

  useEffect(() => {
    //getDatabase();
    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (data) {
      setID(data.data.Media.id);
    }
  }, [data]);

  useEffect(() => {
    navigation.setOptions({
      title: data?.data.Media.title.romaji ?? ' ',
    });
  }, [navigation, data]);

  const opacity = scrollValue.interpolate({
    inputRange: [0, height * 0.4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const AnimatedHeader = Animated.createAnimatedComponent(TaiyakiHeader);

  const styles = StyleSheet.create({
    empty: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rowView: {flexDirection: 'row'},
    titleView: {
      paddingHorizontal: width * 0.02,
      paddingTop: 10,
      marginBottom: height * 0.03,
      flexShrink: 0.8,
      height: height * 0.14,
    },
    scroller: {
      flex: 1,
      // transform: [{translateY: -height * 0.13}],
    },
    surface: {
      backgroundColor: theme.colors.backgroundColor,
      marginHorizontal: width * 0.025,
      paddingHorizontal: width * 0.03,
      borderRadius: 4,
      ...Platform.select({
        android: {elevation: 4},
        ios: {
          shadowColor: 'black',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 5,
        },
      }),
      paddingBottom: 5,
      marginBottom: height * 0.022,
    },
    subTitle: {
      fontSize: 19,
      fontWeight: '700',
      marginTop: height * 0.01,
      marginBottom: height * 0.02,
    },
    shadowView: {
      ...Platform.select({
        android: {elevation: 4},
        ios: {
          shadowColor: 'black',
          shadowOffset: {width: -1, height: 2},
          shadowOpacity: 0.3,
          shadowRadius: 5,
        },
      }),
      // position: 'absolute',
      marginTop: -height * 0.07,
      marginLeft: width * 0.04,
    },
    image: {
      width: width * 0.34,
      height: height * 0.21,
    },
    title: {
      fontSize: 17,
      fontWeight: 'bold',
    },
    englishTitle: {
      color: 'grey',
      fontSize: 13,
      fontWeight: '400',
    },
    synopsis: {
      fontSize: 13,
    },
    genresContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    genrePills: {
      margin: 4,
      backgroundColor: theme.colors.accent,
      borderRadius: 4,
      justifyContent: 'center',
      padding: 8,
    },
    genreText: {
      color: 'white',
      fontSize: 13,
      fontWeight: '600',
    },
    infoRowView: {
      justifyContent: 'space-around',
    },
    infoRowTitle: {
      textAlign: 'center',
      fontSize: 22,
      fontWeight: '700',
      color: 'grey',
    },
    infoRowData: {
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '400',
      color: 'grey',
      marginVertical: 4,
    },
    infoParentChildWrap: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 15,
    },
    imageItems: {
      height: height * 0.26,
      width: width * 0.34,
      marginHorizontal: width * 0.02,
      marginBottom: 5,
    },
    titleItems: {
      fontSize: 14,
      marginTop: 8,
    },
  });

  const {getItem, mergeItem, removeItem} = useAsyncStorage(`${id}`);

  const getDatabase = async () => {
    const file = await getItem();
    if (file) {
      const model = JSON.parse(file) as DetailedDatabaseModel;
      setDatabase(model);
    }
  };

  useEffect(() => {
    if (props.route.params.embedLink) {
      mergeItem(
        JSON.stringify({
          title: data?.data.Media.title.romaji,
          coverImage: data?.data.Media.coverImage.extraLarge,
        }),
      ).finally(getDatabase);
    }
  }, [props.route.params.embedLink]);

  useFocusEffect(
    useCallback(() => {
      getDatabase();
    }, [id]),
  );

  //Save the simkl id if its missing from the database
  useEffect(() => {
    const saveIDS = async () => {
      if (detailedHook && detailedHook.ids && database && !database.ids.simkl) {
        await mergeItem(
          JSON.stringify({
            ids: detailedHook.ids,
            totalEpisodes: detailedHook.data.length,
          }),
        );
        setDatabase((database) => {
          if (database) {
            database.ids = {...database.ids, ...detailedHook.ids};
            database.totalEpisodes = detailedHook.data.length;
            return database;
          }
        });
      }
    };
    saveIDS();
  }, [detailedHook]);

  if (!data || !id)
    return (
      <ThemedSurface
        style={[styles.empty, {backgroundColor: theme.colors.backgroundColor}]}>
        <ActivityIndicator />
      </ThemedSurface>
    );

  const IconRow = (name: string | number, data: string) => {
    return (
      <View style={{justifyContent: 'space-between', alignItems: 'center'}}>
        {typeof name === 'string' ? (
          <Icon name={name} type={'MaterialIcons'} color={'grey'} size={30} />
        ) : (
          <ThemedText
            shouldShrink
            numberOfLines={1}
            style={styles.infoRowTitle}>
            {(name ?? 'N/A').toString()}
          </ThemedText>
        )}
        <ThemedText style={styles.infoRowData}>{data}</ThemedText>
      </View>
    );
  };

  const InfoParentChild = (title: string, data: string) => {
    return (
      <View
        style={{
          width: width * 0.27,
          height: height * 0.05,
          marginHorizontal: width * 0.01,
          marginVertical: height * 0.016,
        }}>
        <ThemedText style={{textAlign: 'center', fontSize: 13}}>
          {title}
        </ThemedText>
        <ThemedText
          style={{
            textAlign: 'center',
            marginTop: 4,
            color: 'grey',
            fontSize: 13,
          }}>
          {data ?? 'N/A'}
        </ThemedText>
      </View>
    );
  };

  const _renderCharacters = ({item}: {item: AnilistCharacterModel}) => {
    const {name, image, id} = item;
    return (
      <View style={[styles.imageItems]}>
        <DangoImage url={image.large} style={{height: '74%', width: '100%'}} />
        <ThemedText style={styles.titleItems} numberOfLines={2}>
          {name.full}
        </ThemedText>
      </View>
    );
  };
  const _renderRec = ({item}: {item: AnilistRecommendationPageEdgeModel}) => {
    const {title, coverImage, id} = item.node.mediaRecommendation;
    return (
      <View style={{marginTop: 10}}>
        <BaseCards image={coverImage.extraLarge} title={title.romaji} id={id} />
      </View>
    );
  };

  const _addUpNext = () => {
    if (!database || !detailedHook) return;
    if (queueLength === 0) {
      const next =
        database.lastWatching?.episode ??
        database.lastWatching?.data?.episode ??
        1;
      const portion: number = detailedHook.data.findIndex(
        (i) => i.episode === next,
      );
      if (portion + 1 < detailedHook.data.length) {
        addUpNext(detailedHook.data.slice(portion + 1));
      }
    }
  };

  const {
    bannerImage,
    coverImage,
    title,
    description,
    genres,
    idMal,
    status,
    episodes,
    meanScore,
    format,
    popularity,
    source,
    hashtag,
    countryOfOrigin,
    duration,
    season,
    seasonYear,
    characters,
    recommendations,
    startDate,
    endDate,
    nextAiringEpisode,
  } = data.data.Media;

  const PageOne = () => (
    <StretchyScrollView
      style={{marginBottom: height * 0.1}}
      backgroundColor={theme.colors.backgroundColor}
      image={
        bannerImage
          ? {uri: bannerImage}
          : require('../../../assets/images/icon_round.png')
      }
      imageHeight={height * 0.3}
      imageResizeMode={'cover'}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={(position) => scrollValue.setValue(position)}>
      <View>
        <View style={styles.rowView}>
          <View style={styles.shadowView}>
            <DangoImage url={coverImage.extraLarge} style={styles.image} />
          </View>
          <View
            style={[
              styles.titleView,
              // {backgroundColor: theme.colors.backgroundColor},
            ]}>
            <ThemedText shouldShrink numberOfLines={3} style={styles.title}>
              {title.romaji}
            </ThemedText>
            {title.english ? (
              <ThemedText
                shouldShrink
                style={styles.englishTitle}
                numberOfLines={3}>
                {title.english}
              </ThemedText>
            ) : null}
          </View>
        </View>
        {/* //Synopsis */}
        <SynopsisExpander
          synopsis={description}
          nextAiringEpisode={nextAiringEpisode}
        />
        {/* //Bind or Episode */}
        {!database || !database.link ? (
          <BindTitleBlock title={title.romaji} id={id} />
        ) : detailedHook ? (
          !detailedHook.error ? (
            <WatchTile
              episode={
                detailedHook.data.find((i) => {
                  if (settings.sync.overrideWatchNext) {
                    return (
                      i.episode ===
                      (database.lastWatching?.episode ??
                        database.lastWatching?.data?.episode ??
                        1)
                    );
                  }
                  return (
                    i.episode ===
                    (database.lastWatching?.episode ??
                      database.lastWatching?.data?.episode ??
                      1)
                  );
                }) ?? detailedHook.data[detailedHook.data.length - 1]
              }
              detail={database}
              onPress={() => {
                navigation.navigate('EpisodesList', {
                  episodes: detailedHook.data,
                  database: database,
                  updateRequested: () => {
                    //if (value) getDatabase();
                  },
                });
              }}
              onPlay={() => {
                _addUpNext();
                const nowPlaying =
                  detailedHook.data.find(
                    (i) =>
                      i.episode ===
                      (database.lastWatching?.episode ??
                        database.lastWatching?.data?.episode ??
                        1),
                  ) ?? detailedHook.data.splice(-1)[0];
                const episode: MyQueueModel = {
                  detail: database,
                  episode: nowPlaying,
                };
                // MOVE TO VIDEO PAGE
                navigation.navigate('Video', {
                  episode,
                  updateRequested: () => {
                    //  getDatabase();
                  },
                });
              }}
              onContinueWatching={() => {
                _addUpNext();
                const episode: MyQueueModel = {
                  detail: database,
                  episode: database.lastWatching.data,
                };
                navigation.navigate('Video', {
                  episode,
                  updateRequested: () => {
                    // getDatabase();
                  },
                });
              }}
              isFollowing={database?.isFollowing}
              onFollow={async (following) => {
                console.log('following', following);
                setDatabase((database) => {
                  if (database) return {...database, isFollowing: following};
                });
                await mergeItem(JSON.stringify({isFollowing: following}));
              }}
              onRemoveSavedLink={async () => {
                await removeItem();
                setDatabase(undefined);
              }}
              onAddAllToQueue={() => {
                const queue: {
                  key: string;
                  data: MyQueueModel;
                }[] = detailedHook.data.map((i) => ({
                  key: database.title,
                  data: {episode: i, detail: database},
                }));
                addAllToQueue(queue);
              }}
              onAddUnwatchedToQueue={() => {
                const check = database.lastWatching.episode;
                if (!check) {
                  const queue: {
                    key: string;
                    data: MyQueueModel;
                  }[] = detailedHook.data.map((i) => ({
                    key: database.title,
                    data: {episode: i, detail: database},
                  }));
                  addAllToQueue(queue);
                } else {
                  const queue: {
                    key: string;
                    data: MyQueueModel;
                  }[] = detailedHook.data.slice(check).map((i) => ({
                    key: database.title,
                    data: {episode: i, detail: database},
                  }));
                  addAllToQueue(queue);
                }
              }}
            />
          ) : (
            <ThemedCard style={{padding: 8}}>
              <ThemedText
                style={{fontWeight: '700', textAlign: 'center', fontSize: 18}}>
                An error has occured. Reason:
              </ThemedText>
              <ThemedText
                style={{fontWeight: '700', textAlign: 'center', fontSize: 16}}>
                {detailedHook.error}
              </ThemedText>
              <ThemedButton
                title={'Retry'}
                onPress={detailedHook.retry}
                color={'red'}
              />
            </ThemedCard>
          )
        ) : null}

        {profiles.length > 0 ? (
          <StatusCards onPress={() => setStatusPageVisibility(true)} />
        ) : null}

        {/* //Genres */}
        {genres.length > 0 ? (
          <View style={styles.surface}>
            <ThemedText style={styles.subTitle}>Genres</ThemedText>
            <View style={styles.genresContainer}>
              {genres.map((i) => (
                <View key={i} style={styles.genrePills}>
                  <ThemedText style={styles.genreText}>{i}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* //More Info */}
        <View style={styles.surface}>
          <ThemedText style={styles.subTitle}>More Information</ThemedText>
          <View style={[styles.rowView, styles.infoRowView]}>
            {IconRow(Number((meanScore * 0.1).toFixed(1)), 'Mean')}
            {IconRow('new-releases', MapAnilistStatusToString.get(status)!)}
            {IconRow(episodes, episodes === 1 ? 'Episode' : 'Episodes')}
            {IconRow('tv', format)}
          </View>
          <Divider />
          <View style={styles.infoParentChildWrap}>
            {InfoParentChild('Origin Country', countryOfOrigin)}
            {InfoParentChild('Hashtag', hashtag)}
            {InfoParentChild(
              'Source',
              MapAnilistSourceToString.get(source) ?? '???',
            )}
            {InfoParentChild('Duration', `${duration} minutes`)}
            {InfoParentChild('Anime ID', id.toString())}
            {InfoParentChild('Popularity', popularity.toLocaleString())}
            {InfoParentChild(
              'Season',
              (MapAnilistSeasonsToString.get(season) ?? '?') +
                ' ' +
                (seasonYear ?? 'N/A').toString(),
            )}
            {InfoParentChild('Start Date', dateNumToString(startDate))}
            {InfoParentChild('End Date', dateNumToString(endDate))}
          </View>
        </View>
        {characters.nodes.length > 0 ? (
          <View style={[styles.surface]}>
            <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
              <ThemedText style={styles.subTitle}>Characters</ThemedText>
              <Button
                title={'See All'}
                color={theme.colors.accent}
                onPress={() => navigation.push('Characters', {id})}
              />
            </View>
            <FlatList
              data={characters.nodes}
              renderItem={_renderCharacters}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              contentContainerStyle={{height: height * 0.26}}
              getItemLayout={(data, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
            />
          </View>
        ) : null}
        {/* //Recommendations */}
        {recommendations.edges.length > 0 ? (
          <View style={[styles.surface, {paddingBottom: 12}]}>
            <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
              <ThemedText style={styles.subTitle}>Recommendations</ThemedText>
              <Button
                title={'See All'}
                color={theme.colors.accent}
                onPress={() => navigation.push('Recommendations', {id})}
              />
            </View>
            <FlatList
              data={recommendations.edges.filter(
                (i) => i.node.mediaRecommendation,
              )}
              renderItem={_renderRec}
              keyExtractor={(item) =>
                item.node.mediaRecommendation.id.toString()
              }
              horizontal
              contentContainerStyle={{height: ITEM_HEIGHT + 50}}
              getItemLayout={(data, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
            />
          </View>
        ) : null}
      </View>
    </StretchyScrollView>
  );

  return (
    <>
      <Modal
        visible={statusPageVisible}
        hardwareAccelerated
        presentationStyle={'formSheet'}
        animationType={'slide'}>
        <StatusPage
          totalEpisode={episodes}
          onClose={() => setStatusPageVisibility(false)}
          banner={bannerImage ?? coverImage.extraLarge}
          key={'status'}
          idMal={idMal}
          id={id}
          title={title.romaji}
        />
      </Modal>
      <AnimatedHeader
        onPress={() => navigation.goBack()}
        opacity={opacity}
        color={theme.dark ? theme.colors.card : theme.colors.primary}
        headerColor={theme.colors.text}
      />
      <View
        style={{
          height,
          width,
          marginTop: -height * 0.13,
        }}>
        {PageOne()}
      </View>
      {/* <StatusPage
          banner={bannerImage ?? coverImage.extraLarge}
          key={'status'}
          anilistEntry={mappedEntry}
          idMal={idMal}
          id={id}
          title={title.romaji}
        /> */}
    </>
  );
};

export default DetailScreen;
