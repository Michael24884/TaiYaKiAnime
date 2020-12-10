/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
import {useNavigation} from '@react-navigation/native';
import React, {createRef, FC, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  LayoutAnimation,
  LogBox,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-dynamic-vector-icons';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import OrientationLocker from 'react-native-orientation-locker';
import {LoadError} from 'react-native-video';
import {SourceBase} from '../../Classes/SourceBase';
import {AnilistBase, MyAnimeList} from '../../Classes/Trackers';
import {SimklEpisodes} from '../../Models/SIMKL';
import GoogleCast, {CastState} from 'react-native-google-cast';
import {
  EmbededResolvedModel,
  HistoryModel,
  MyQueueModel,
} from '../../Models/taiyaki';
import {
  useQueueStore,
  useSettingsStore,
  useTheme,
  useUpNextStore,
  useUserProfiles,
} from '../../Stores';
import {
  DangoImage,
  Divider,
  EpisodeSliders,
  TaiyakiHeader,
  ThemedText,
} from '../Components';
import {TaiyakiVideoPlayer} from '../Components/TaiyakiPlayer/video';
import MyQueueScreen from './QueuePage';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {QueryCache} from 'react-query';
import {Modalize} from 'react-native-modalize';
import {SIMKL} from '../../Classes/Trackers/SIMKL';
import {isTablet} from 'react-native-device-info';

LogBox.ignoreLogs(['Virtualized']);

//Vidstreaming added way more servers requires looking into them
const tempAvailableServer: string[] = [
  'kwik',
  'animeowl',
  'multi quality',
  'cloud9',
  'xstreamcdn',
  'mp4upload',
  'bp',
  'ld',
  'sd',
  'hd',
  'fullhd',
  'custom',
];

type ScrapingProgress = 'SCRAPING' | 'FINISHED' | 'ERROR';

const {width, height} = Dimensions.get('window');

interface Props {
  route: {
    params: {
      episode: MyQueueModel;
      updateRequested: (newIndex?: number) => void;
    };
  };
}

const VideoPlayerScreen: FC<Props> = (props) => {
  const {episode} = props.route.params;
  const theme = useTheme((_) => _.theme);
  const {getItem, setItem} = useAsyncStorage('history');
  const profiles = useUserProfiles((_) => _.profiles);
  const upNextItems = useUpNextStore((_) => _.upNext);
  const queueLength = useQueueStore((_) => _.queueLength);
  const settings = useSettingsStore((_) => _.settings);
  const removeUpNextItems = useUpNextStore((_) => _.removeAll);
  const removeUpNextSingle = useUpNextStore((_) => _.removeSingle);
  const navigation = useNavigation();
  const queryCache = new QueryCache();

  const [descExpanded, setDescExpanded] = useState<boolean>(false);
  const [isFullScreen, setFullScreen] = useState<boolean>(false);
  const [error, setError] = useState<string | LoadError>();
  const [castState, setCastState] = useState<
    'No Devices Available' | 'Devices Available'
  >('No Devices Available');
  //Refs
  const optionsModal = createRef<Modalize>();
  const serverModal = createRef<Modalize>();
  const qualityModal = createRef<Modalize>();
  const castModal = createRef<Modalize>();
  const preloadedVideoRef = useRef<
    | {episode: SimklEpisodes; links: {link: string; server: string}[]}
    | undefined
  >();

  const updateRequested = useRef<boolean>(false);
  //Video Properties
  const [scrapingProgress, setScrapingProgress] = useState<ScrapingProgress>(
    'SCRAPING',
  );

  //All Servers available
  const [allAvailableServers, setAvailableServers] = useState<
    {link: string; server: string}[]
  >([]);
  const [allScrapedServers, setScrapedServers] = useState<
    EmbededResolvedModel[]
  >([]);
  //Current Properties
  const [currentEpisode, setEpisode] = useState<MyQueueModel>(episode);
  const [currentServer, setCurrentServer] = useState<{
    link: string;
    server: string;
  }>();
  const [currentQuality, setCurrentQuality] = useState<EmbededResolvedModel>();

  const [nextIndex, setIndex] = useState<number>(
    currentEpisode.episode.episode,
  );

  const castListener = GoogleCast.onCastStateChanged((state) => {
    if (state !== CastState.NO_DEVICES_AVAILABLE) {
      setCastState('Devices Available');
    } else setCastState('No Devices Available');
  });

  useEffect(() => {
    navigation.dangerouslyGetParent()?.setOptions({tabBarVisible: false});
    GoogleCast.showIntroductoryOverlay();
    return () => {
      OrientationLocker.lockToPortrait();
      navigation.dangerouslyGetParent()?.setOptions({tabBarVisible: true});
      removeUpNextItems();
      castListener.remove();
    };
  }, []);

  useEffect(() => {
    navigation.addListener('beforeRemove', () => {
      if (updateRequested.current)
        if (props.route.params?.updateRequested)
          props.route.params.updateRequested(nextIndex);
    });
    return () => {};
  }, []);

  useEffect(() => {
    if (isFullScreen) OrientationLocker.lockToLandscape();
    else OrientationLocker.lockToPortrait();
  }, [isFullScreen]);

  //Step 1: Scrape Links, finds available servers and filters only ones with proper links
  const sourceRequests = new SourceBase(currentEpisode.detail.source);
  useEffect(() => {
    setScrapingProgress('SCRAPING');
    setDescExpanded(false);
    if (
      preloadedVideoRef.current &&
      preloadedVideoRef.current.episode.link === currentEpisode.episode.link
    ) {
      setAvailableServers(preloadedVideoRef.current.links);
      setCurrentServer(preloadedVideoRef.current.links[0]);
      preloadedVideoRef.current = undefined;
    } else scrapeLinks();
  }, [currentEpisode]);

  const scrapeLinks = async (
    isRef: boolean = false,
    refEpisode?: SimklEpisodes,
  ) => {
    const {link} = currentEpisode.episode;

    const linkRequests = await sourceRequests.scrapeLinks(
      isRef && refEpisode ? refEpisode.link : link!,
    );
    if (linkRequests.length === 0 && !isRef) {
      setScrapingProgress('ERROR');
      return;
    }
    const filteredList = linkRequests.filter((i) =>
      tempAvailableServer.includes(i.server.toLocaleLowerCase()),
    );
    if (!isRef) {
      setAvailableServers(filteredList);
      //TODO: Look for previous references
      setCurrentServer(filteredList[0]);
    } else {
      console.log(
        'SUCCESS: Taiyaki finished preloading Episode',
        refEpisode?.episode,
      );
      preloadedVideoRef.current = {episode: refEpisode!, links: filteredList};
    }
  };

  //Step 2: Selects the first link(or if a ref exists uses a previous server) and sets to load
  useEffect(() => {
    setScrapingProgress('SCRAPING');
    const findServer = async () => {
      const servers = await sourceRequests.scrapeEmbedLinks(currentServer!);
      setScrapedServers(servers);

      //TODO: Look for previous references
      setCurrentQuality(servers[0]);
      setScrapingProgress('FINISHED');
    };
    if (currentServer) {
      findServer();
    }

    //Preload the next episode if ref is empty and user has opted in
    _preloadUpNext();
  }, [currentServer]);

  const _preloadUpNext = () => {
    if (!settings.general.video.preloadUpNext || preloadedVideoRef.current)
      return;
    if (upNextItems.length > 0) {
      const nextEpisode: SimklEpisodes = upNextItems[0];
      scrapeLinks(true, nextEpisode);
    }
  };

  /**
   * Functions
   */

  const saveHistory = () => {
    const {detail} = currentEpisode;
    const history: HistoryModel = {
      data: currentEpisode,
      lastModified: new Date(Date.now()),
    };

    getItem().then((items) => {
      if (items) {
        const json = JSON.parse(items) as HistoryModel[];

        for (let m = 0; m < json.length; m++) {
          if (json[m].data.detail.title === detail.title) {
            json.splice(m, 1);
            break;
          }
        }
        setItem(JSON.stringify([history, ...json]));
      } else {
        setItem(JSON.stringify([history]));
      }
    });
  };

  const updateToTrackers = () => {
    const {detail, episode} = currentEpisode;
    const {ids, totalEpisodes} = detail;
    const status = totalEpisodes === episode.episode ? 'Completed' : 'Watching';
    const startedAt: Date | undefined =
      episode.episode === 1 ? new Date(Date.now()) : undefined;
    const completedAt: Date | undefined =
      episode.episode === totalEpisodes ? new Date(Date.now()) : undefined;

    const trackers = profiles.map((i) => i.source);

    if (trackers.includes('Anilist')) {
      new AnilistBase()
        .updateStatus(
          ids.anilist!,
          episode.episode,
          status,
          undefined,
          startedAt,
          completedAt,
        )
        .finally(() => {
          queryCache.invalidateQueries('Sync' + ids.anilist, {
            refetchActive: true,
          });
        });
    }
    if (trackers.includes('MyAnimeList')) {
      new MyAnimeList()
        .updateStatus(ids.myanimelist!, episode.episode, status, undefined)
        .finally(() =>
          queryCache.invalidateQueries('mal' + ids.myanimelist!, {
            refetchActive: true,
          }),
        );
    }
    //TODO:SIMKL
    if (trackers.includes('SIMKL')) {
      new SIMKL().updateStatus(
        ids.myanimelist!,
        episode.episode,
        status,
        undefined,
      );
      //No need to refetch the status, it's automatically done right after modifying any data
    }
  };

  /**
   * Views
   */
  const _renderUpNext = ({item}: {item: SimklEpisodes; index: number}) => {
    const model: MyQueueModel = {episode: item, detail: currentEpisode.detail};
    return (
      <EpisodeSliders
        item={model}
        onPress={() => {
          setEpisode(model);
          removeUpNextSingle(item.episode);
        }}
      />
    );
  };

  const Block = (
    name: string,
    title: string,
    onPress: () => void,
    subTitle?: string,
  ) => {
    return (
      <View
        style={{
          paddingHorizontal: width * 0.05,
          paddingTop: height * 0.02,
          width: '100%',
        }}>
        <TouchableHighlight
          underlayColor={theme.colors.backgroundColor}
          onPress={onPress}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
            }}>
            <Icon
              name={name}
              type={'MaterialCommunityIcons'}
              color={'grey'}
              size={25}
            />
            <ThemedText
              style={{
                marginLeft: width * 0.04,
                fontSize: 15,
                fontWeight: '600',
              }}>
              {title}
            </ThemedText>
            {subTitle ? (
              <ThemedText style={{color: 'grey', fontSize: 15}}>
                {' '}
                • {subTitle}
              </ThemedText>
            ) : null}
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  const _renderOptions = () => {
    return (
      <View style={{height: height * 0.35}}>
        {Block(
          'video',
          'Quality',
          () => {
            qualityModal.current?.open();
            optionsModal.current?.close();
          },
          currentQuality?.quality,
        )}
        {Block(
          'server',
          'Server',
          () => {
            serverModal.current?.open();
            optionsModal.current?.close();
          },
          currentServer?.server,
        )}
        {/* {Block(
          'cast',
          'Cast',
          () => {
            GoogleCast.showCastDialog();
          },
          castState,
        )} */}
        {/* Airplay is not working  */}
        {/* {Platform.OS === 'ios' ? (
          <View
            style={{
              paddingHorizontal: width * 0.05,
              paddingTop: height * 0.02,
              width: '100%',
            }}>
            <RAirPlayButton
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
          </View>
        ) : null} */}
        <View style={{marginTop: 10}}>
          <Divider />
        </View>
        {Block('cancel', 'Cancel', () => optionsModal.current?.close())}
        <View style={{marginBottom: height * 0.08}} />
      </View>
    );
  };

  const _renderQualities = ({item}: {item: EmbededResolvedModel}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setCurrentQuality(item);
          qualityModal.current?.close();
        }}>
        <View
          style={{
            paddingHorizontal: width * 0.05,
            padding: height * 0.02,
            width: '100%',
            backgroundColor:
              item === currentQuality ? theme.colors.accent : undefined,
          }}>
          <ThemedText
            style={{
              marginLeft: width * 0.04,
              fontSize: 15,
              fontWeight: '600',
              color: item === currentQuality ? 'white' : theme.colors.text,
            }}>
            {item.quality}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };
  const _renderServers = ({item}: {item: {link: string; server: string}}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setCurrentServer(item);
          serverModal.current?.close();
        }}>
        <View
          style={{
            paddingHorizontal: width * 0.05,
            padding: height * 0.02,
            width: '100%',
            backgroundColor:
              item === currentServer ? theme.colors.accent : undefined,
          }}>
          <ThemedText
            style={{
              marginLeft: width * 0.04,
              fontSize: 15,
              fontWeight: '600',
              color: item === currentServer ? 'white' : theme.colors.text,
            }}>
            {item.server}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar hidden={isFullScreen} />
      {!isFullScreen && (
        <TaiyakiHeader
          color={theme.dark ? theme.colors.card : theme.colors.primary}
          onPress={() => navigation.goBack()}
          headerColor={theme.dark ? theme.colors.text : 'black'}
        />
      )}
      <View
        style={[styles.view, {backgroundColor: theme.colors.backgroundColor}]}>
        <View
          style={
            isFullScreen ? styles.videoPlayerFullScreen : styles.videoPlayer
          }>
          {scrapingProgress === 'ERROR' ? (
            <View style={styles.errorView}>
              <Icon
                name={'error'}
                type={'MaterialIcons'}
                size={35}
                color={'white'}
              />
              <ThemedText style={styles.errorText}>
                An error has occurred:
              </ThemedText>
              <ThemedText>{(error ?? 'Reason unknown').toString()}</ThemedText>
            </View>
          ) : scrapingProgress === 'SCRAPING' ? (
            <View style={styles.loadingView}>
              {currentEpisode.episode.img ? (
                <DangoImage
                  url={currentEpisode.episode.img}
                  style={{height: '100%', width: '100%'}}
                />
              ) : null}
              <View
                style={[
                  styles.loadingView,
                  {backgroundColor: 'rgba(0,0,0,0.64)'},
                ]}>
                <ActivityIndicator />
                <ThemedText style={styles.scrapingText}>
                  Scraping links...
                </ThemedText>
              </View>
            </View>
          ) : (
            <>
              {currentQuality ? (
                <TaiyakiVideoPlayer
                  url={currentQuality.link}
                  progress={
                    currentEpisode.detail?.lastWatching?.episode ===
                    currentEpisode.episode.episode
                      ? currentEpisode.detail?.lastWatching?.videoProgress
                      : undefined
                  }
                  headers={currentQuality.headers}
                  animeInfo={currentEpisode}
                  isFullScreen={isFullScreen}
                  onEnd={() => {}}
                  //Scraper error only. Video error not yet integrated
                  onError={setError}
                  onOptionsTapped={() => optionsModal.current?.open()}
                  onFullScreen={() => setFullScreen((fs) => !fs)}
                  //Save to history
                  saveHistory={saveHistory}
                  //Sync user's progress to third parties
                  syncProgress={updateToTrackers}
                  //Up Next Tapped
                  tappedUpNextItem={(upNext) => {
                    //If its contains detail then we know its a Queue
                    if (upNext.hasOwnProperty('detail')) {
                      setEpisode(upNext as MyQueueModel);
                    } //Otherwise its the same anime but a different episode
                    else {
                      setEpisode((anime) => ({
                        ...anime,
                        episode: upNext as SimklEpisodes,
                      }));
                    }
                  }}
                  //Changed the progress in percentage
                  timeProgress={(value) => {
                    if (value >= 80 && !nextIndex)
                      setIndex(currentEpisode.episode.episode + 1);
                  }}
                  //Updated and saved the new database, requires calling parent to update database in local store
                  databaseUpdateRequested={() => {
                    //Ensures we only change the value once to prevent flooding
                    if (updateRequested.current === false)
                      updateRequested.current = true;
                  }}
                />
              ) : (
                <View />
              )}
            </>
          )}
        </View>
        {isFullScreen ? null : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.detailedView}>
            <ThemedText style={[styles.episode, {color: theme.colors.accent}]}>
              Episode {currentEpisode.episode.episode}
            </ThemedText>
            <ThemedText style={styles.episodeTitle}>
              {currentEpisode.episode.title}
            </ThemedText>
            <ThemedText style={{fontSize: 13, color: 'orange'}}>
              {currentEpisode.episode.sourceName}
            </ThemedText>
            <TouchableWithoutFeedback
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );
                setDescExpanded((ex) => !ex);
              }}>
              <View style={{backgroundColor: theme.colors.backgroundColor}}>
                <ThemedText
                  style={styles.desc}
                  numberOfLines={descExpanded ? undefined : 3}>
                  {currentEpisode.episode.description ?? ' '}
                </ThemedText>
              </View>
            </TouchableWithoutFeedback>
            {queueLength > 0 ? (
              <>
                <ThemedText style={styles.upNextQueueTitle}>
                  In Queue
                </ThemedText>
                <MyQueueScreen isPlayer playNow={setEpisode} />
              </>
            ) : null}
            {upNextItems.length > 0 ? (
              <View style={{flex: 1}}>
                <ThemedText style={styles.upNextQueueTitle}>Up Next</ThemedText>
                <FlatList
                  scrollEnabled={false}
                  data={upNextItems}
                  renderItem={_renderUpNext}
                  keyExtractor={(item) => item.link}
                />
              </View>
            ) : null}
          </ScrollView>
        )}
        <Modalize
          ref={optionsModal}
          withHandle={false}
          adjustToContentHeight
          modalStyle={{
            backgroundColor: theme.colors.card,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
          scrollViewProps={{scrollEnabled: false}}>
          {_renderOptions()}
        </Modalize>
        {/* //Quality */}
        <Modalize
          ref={qualityModal}
          withHandle={false}
          modalHeight={height * 0.45}
          modalStyle={{
            backgroundColor: theme.colors.card,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
          flatListProps={{
            renderItem: _renderQualities,
            data: allScrapedServers,
            keyExtractor: (item) => item.quality,
          }}
        />
        {/* //Servers */}
        <Modalize
          ref={serverModal}
          withHandle={false}
          modalHeight={height * 0.45}
          modalStyle={{
            backgroundColor: theme.colors.card,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
          flatListProps={{
            renderItem: _renderServers,
            data: allAvailableServers,
            keyExtractor: (item) => item.server,
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  videoPlayer: {
    width,
    height: height * 0.3,
  },
  videoPlayerFullScreen: {
    width: '100%',
    height: '100%',
  },
  errorView: {
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontWeight: '700',
    fontSize: 18,
  },
  loadingView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrapingText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginTop: 6,
  },
  detailedView: {
    padding: 12,
  },
  episode: {
    fontWeight: '500',
  },
  episodeTitle: {
    fontWeight: '600',
    fontSize: 18,
  },
  desc: {
    marginTop: 8,
    color: 'grey',
    fontSize: 14,
    fontWeight: '400',
  },
  upNextQueueTitle: {
    fontSize: 19,
    fontWeight: '700',
    marginLeft: 8,
    marginTop: height * 0.025,
    marginBottom: height * 0.02,
  },
});

export default VideoPlayerScreen;
