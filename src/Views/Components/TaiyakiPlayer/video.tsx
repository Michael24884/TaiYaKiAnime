/* eslint-disable react-native/no-inline-styles */
import Slider from '@react-native-community/slider';
//import Slider from 'react-native-reanimated-slider';
import React, {createRef, FC, memo, useEffect, useRef, useState} from 'react';
import {HomeIndicator} from 'react-native-home-indicator';
import {
  View,
  StyleSheet,
  Text,
  Easing,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  Platform,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import ReAnimated from 'react-native-reanimated';
import Icon from 'react-native-dynamic-vector-icons';
import LinearGradient from 'react-native-linear-gradient';
import Video, {
  LoadError,
  OnLoadData,
  OnProgressData,
  OnSeekData,
} from 'react-native-video';
import {Modalize} from 'react-native-modalize';
import {isTablet} from 'react-native-device-info';
import {SimklEpisodes} from '../../../Models/SIMKL';
import {LastWatchingModel, MyQueueModel} from '../../../Models/taiyaki';
import {useSettingsStore, useTheme} from '../../../Stores';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useQueueStore, useUpNextStore} from '../../../Stores/queue';
import DangoImage from '../image';
import {ThemedButton} from '..';

const {width, height} = Dimensions.get('window');

interface Props {
  progress?: number;
  headers?: {[key: string]: string};
  onFullScreen: () => void;
  onError: (error: LoadError | string) => void;
  isFullScreen: boolean;
  animeInfo: MyQueueModel;
  tappedUpNextItem: (arg0: MyQueueModel | SimklEpisodes) => void;
  saveHistory: () => void;
  syncProgress: () => void;
  onEnd: () => void;
  timeProgress: (value: number) => void;
  url: string;
  databaseUpdateRequested: () => void;
  onOptionsTapped: () => void;
}

const _TaiyakiVideoPlayer: FC<Props> = (props) => {
  const {
    onFullScreen,
    isFullScreen,
    onError,
    animeInfo,
    onOptionsTapped,
    url,
    progress,
    tappedUpNextItem,
    saveHistory,
    syncProgress,
    headers,
    onEnd,
    databaseUpdateRequested,
    timeProgress,
  } = props;

  const {episode, detail} = animeInfo;
  const {lastWatching} = detail;

  const theme = useTheme((_) => _.theme);
  // const {mergeItem} = useAsyncStorage(`${detail.ids.anilist}`);
  const settings = useSettingsStore((_) => _.settings);
  const upNextItems = useUpNextStore((_) => _.upNext);
  const removeSingle = useUpNextStore((_) => _.removeSingle);

  const upNextQueueItems = Object.values(
    useQueueStore((_) => _.myQueue),
  ).reduce((a, v) => a.concat(v), []);
  const removeQueueSingle = useQueueStore((_) => _.addToQueue);

  const [resizeCover, setResizeCover] = useState<'cover' | 'contain'>(
    'contain',
  );

  const [controlsVisible, setControlsVisible] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>();
  const [cacheableTime, setCacheableTime] = useState<number>();
  const [duration, setDuration] = useState<number>();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [didUpdate, setDidUpdate] = useState<boolean>(false);
  const [videoAspect, setAspectRatio] = useState<{
    height: number;
    width: number;
  }>();

  const [loading, setLoading] = useState<boolean>(true);

  const [coverExposed, setCoverExposed] = useState<boolean>(false);
  const animationController = useRef(new Animated.Value(0)).current;
  const coverController = useRef(new Animated.Value(0)).current;
  let autoPlayTimerController = useRef(new Animated.Value(0)).current;

  const [animationTimer, setTimerAnimationSet] = useState<boolean>(false);
  const [timerExhaused, setTimerExhaused] = useState<boolean>(false);

  const [autoPlayTimerValue, setAutoPlayerTimerValue] = useState<number>(10);

  //Refs
  const videoPlayerController = createRef<Video>();
  const upNextModal = createRef<Modalize>();

  /**
   * Functions
   */

  const _animatePlayNext = async (): Promise<void> => {
    if (settings.general.autoPlay.timerAt94 && isFullScreen) {
      Animated.timing(autoPlayTimerController, {
        toValue: 1,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
        duration: 1200,
      }).start();
    }
  };

  const _onProgress = async (progress: OnProgressData) => {
    setCurrentTime(progress.currentTime);
    setCacheableTime(progress.playableDuration);
    if (duration && progress.currentTime)
      timeProgress(progress.currentTime / duration);
    _updateListener(progress.currentTime);
    if (
      settings.general.autoPlay.timerAt94 &&
      duration &&
      progress.currentTime > 10 &&
      ((progress.currentTime / (duration ?? 0)) * 100).toFixed(0) === '94' &&
      (upNextItems.length > 0 || upNextQueueItems.length > 0) &&
      autoPlayTimerValue !== -1 &&
      !animationTimer &&
      isFullScreen
    ) {
      _animatePlayNext().finally(() => {
        setTimerAnimationSet(true);
        autoPlayTimer.current = setInterval(() => {
          setAutoPlayerTimerValue((value) => value - 1);
        }, 1000);
      });
    }

    //Save progress every 8 seconds;
    if (duration) {
      if (
        progress.currentTime >= 15 &&
        (progress.currentTime % 15).toFixed(2).endsWith('.00') &&
        Number((progress.currentTime % 15).toFixed(0)) === 0
      ) {
        console.log('saving progress @', progress.currentTime);
        const newProgress = progress.currentTime / duration;
        const _lastWatchingModel: LastWatchingModel = {
          ...lastWatching,
          data: episode,
          progress: newProgress,
          videoProgress: progress.currentTime,
          episode: episode.episode,
        };
        animeInfo.detail.lastWatching = _lastWatchingModel;
        try {
          await AsyncStorage.mergeItem(
            `${detail.ids.anilist}`,
            JSON.stringify({lastWatching: _lastWatchingModel}),
          ).catch((e) => console.log(e));
        } catch (e) {
          throw `an error occured saving this fiile ${e}`;
        }
      } else if (progress.currentTime / duration >= 0.85) {
        //Otherwise if passed or equal to 85% remove it
        const _modifiedNewModel: LastWatchingModel = {
          ...lastWatching,
          data: episode,
          episode: episode.episode + 1,
          progress: 0,
          videoProgress: 0,
        };

        //Must await otherwise Async Storage will fail to close storage after writing
        await AsyncStorage.mergeItem(
          `${detail.ids.anilist}`,
          JSON.stringify({lastWatching: _modifiedNewModel}),
        ).catch((e) => console.log(e));
      }
    }
  };

  const _onLoad = (load: OnLoadData) => {
    const {duration, naturalSize} = load;
    const {height, width} = Dimensions.get('screen');
    if (naturalSize.width < width && naturalSize.height < height)
      setAspectRatio({height: naturalSize.height, width: naturalSize.width});
    setDuration(duration);
    //Save History
    saveHistory();
    setIsPlaying(true);
    if (progress) {
      videoPlayerController.current?.seek(progress);
    }
  };

  const _formatMilliToHHMMSS = (time: number): string => {
    const timer = new Date(time * 1000).toISOString().slice(11, -5);
    if (timer.startsWith('00:')) {
      return timer.slice(3);
    }
    return timer;
  };

  const _toggleControls = () => {
    const controls = !controlsVisible;

    if (controls) {
      setControlsVisible(true);
    }

    if (controls) {
      _animateControlsIn();
    } else {
      _animateControlsOut().finally(() => setControlsVisible(false));
    }
  };

  const _updateListener = (time: number) => {
    if (!duration) {
      return;
    }
    if (settings.sync.autoSync && !didUpdate) {
      if (settings.sync.syncAt75) {
        if (time >= duration * 0.75) {
          console.log('now auto syncing at 75%');
          setDidUpdate(true);
          syncProgress();
        }
      } else {
        //sync at startup
        setDidUpdate(true);
        syncProgress();
      }
    }
  };

  useEffect(() => {
    setCoverExposed(false);
  }, []);

  useEffect(() => {
    setDidUpdate(false);
  }, [episode]);

  let transitionTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (episode && episode.img && !isDragging) {
      if (
        !isPlaying &&
        settings.customization.cover.showVideoCover &&
        isFullScreen
      ) {
        animateCoverIn();
      } else if (settings.customization.cover.showVideoCover && isFullScreen) {
        animateCoverOut();
      }
    }
  }, [isPlaying]);

  //Cover
  const animateCoverIn = () => {
    transitionTimer.current = setTimeout(() => {
      setTimerExhaused(true);
      setCoverExposed(true);
      Animated.parallel([
        Animated.timing(coverController, {
          toValue: 1,
          useNativeDriver: true,
          duration: 1250,
          easing: Easing.out(Easing.ease),
        }),
      ]).start();
    }, settings.customization.cover.delay * 1000);
  };
  const animateCoverOut = () => {
    if (transitionTimer.current) {
      clearTimeout(transitionTimer.current);
    }
    setTimerExhaused(false);
    setCoverExposed(false);
    Animated.timing(coverController, {
      toValue: 0,
      useNativeDriver: true,
      duration: 200,
      easing: Easing.out(Easing.ease),
    }).start();

    setTimeout(() => setControlsVisible(false), 510);
  };

  //Controls

  const _animateControlsIn = () => {
    Animated.parallel([
      Animated.timing(animationController, {
        toValue: 1,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
        duration: 1500,
      }),
    ]).start();
  };

  const _animateControlsOut = async (): Promise<void> => {
    Animated.parallel([
      Animated.timing(animationController, {
        toValue: 0,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
        duration: 1500,
      }),
    ]).start();
  };

  useEffect(() => {
    if (autoPlayTimerValue === 0) {
      _tappedUpNext(0);
    }
  }, [autoPlayTimerValue]);

  const _onSeek = (data: OnSeekData) => {
    setCurrentTime(data.seekTime);
    videoPlayerController.current?.seek(data.seekTime);
  };

  const _tappedUpNext = (index: number) => {
    if (upNextItems.length === 0 && upNextQueueItems.length === 0) {
      return;
    }

    if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    if (upNextQueueItems.length > 0) {
      removeQueueSingle({
        key: upNextQueueItems[index].detail.title,
        data: upNextQueueItems[index],
      });

      const item = upNextQueueItems[index];
      //   tappedUpNextItem(item.episode, {
      //     animeTitle: item.detail.title,
      //     archive: item.detail.source,
      //     image: item.detail.coverImage,
      //     malID: item.detail.ids.myanimelist,
      //   });
      tappedUpNextItem(item);
    } else {
      tappedUpNextItem(upNextItems[index]);
      removeSingle(upNextItems[index].episode);
    }
    setAutoPlayerTimerValue(-1);
  };

  /**
   * Views
   */
  const _renderTopControls = () => {
    return !settings.customization.cover.showVideoCover ||
      isPlaying ||
      !timerExhaused ||
      isDragging ||
      (!isPlaying && !episode) ? (
      <Animated.View
        pointerEvents={'box-none'}
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            opacity: settings.customization.cover.showVideoCover
              ? animationController
              : 1,
            flexDirection: 'row',

            alignItems: 'flex-start',
          },
          styles.controlsView,
        ]}>
        <LinearGradient
          style={{
            width: isFullScreen ? '100%' : width,
            ...Platform.select({
              ios: {
                marginLeft: isFullScreen ? 0 : -15,
              },
              android: {
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
              },
            }),
            flexDirection: 'row',
            paddingHorizontal: 10,
            justifyContent: 'space-between',
            paddingTop: 8,
          }}
          colors={['rgba(0,0,0,0.65)', 'transparent']}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            {isFullScreen ? (
              <View style={{maxWidth: width * 0.8}}>
                <Text numberOfLines={1} style={styles.topControlsTitle}>
                  {detail.title}
                </Text>
                <Text numberOfLines={1} style={styles.topControlsDescription}>
                  Episode {episode.episode}
                  {episode.title ? ' - ' + episode.title : ''}
                </Text>
              </View>
            ) : (
              <View />
            )}
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Icon
                name={'resize'}
                type={'MaterialCommunityIcons'}
                size={35}
                color={'white'}
                onPress={() => {
                  setResizeCover((pre) => {
                    if (pre === 'contain') {
                      return 'cover';
                    }
                    return 'contain';
                  });
                }}
              />
              <Icon
                name={'cog'}
                type={'MaterialCommunityIcons'}
                size={35}
                color={'white'}
                onPress={onOptionsTapped}
                style={{marginHorizontal: width * 0.04}}
              />

              <Icon
                name={isFullScreen ? 'fullscreen-exit' : 'fullscreen'}
                type={'MaterialCommunityIcons'}
                size={35}
                color={'white'}
                onPress={onFullScreen}
              />
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    ) : null;
  };

  const _renderBottomControls = () => {
    return !settings.customization.cover.showVideoCover ||
      !timerExhaused ||
      isPlaying ||
      isDragging ||
      (!isPlaying && !episode) ? (
      <Animated.View
        style={[
          {
            width: '100%',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            opacity: animationController,
          },
        ]}>
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.75)']}>
          <View style={{paddingBottom: height * 0.06}}>
            <Slider
              minimumValue={0}
              maximumValue={duration}
              style={{marginHorizontal: width * 0.12}}
              value={!isDragging ? currentTime : undefined}
              onSlidingStart={() => {
                setIsDragging(true);
                setIsPlaying(false);
              }}
              onSlidingComplete={(value) => {
                setIsPlaying(true);
                setIsDragging(false);

                // _onSeek({
                //   seekTime: value,
                //   currentTime: currentTime ?? 0,
                //   target: 0.25,
                // });
              }}
              minimumTrackTintColor={theme.colors.accent}
              step={1}
              onValueChange={(value) =>
                _onSeek({
                  seekTime: value,
                  currentTime: currentTime ?? 0,
                  target: 0.15,
                })
              }
            />
            {/* <Slider
              style={{marginHorizontal: width * 0.12}}
              minimumTrackTintColor={theme.colors.accent}
              ballon={(value: number) => _formatMilliToHHMMSS(value)}
              progress={new ReAnimated.Value(currentTime ?? 0)}
              cache={new ReAnimated.Value(cacheableTime ?? 0)}
              min={new ReAnimated.Value(0)}
              max={new ReAnimated.Value(duration ?? 0)}
              onSlidingStart={() => {
                setIsDragging(true);
                setIsPlaying(false);
              }}
              onSlidingComplete={(value: number) => {
                setIsPlaying(true);
                setIsDragging(false);
                // _onSeek({
                //   seekTime: value,
                //   currentTime: currentTime ?? 0,
                //   target: 0.25,
                // });
                videoPlayerController.current?.seek(value);
                setCurrentTime(value);
              }}
            /> */}
            <View
              style={{
                paddingHorizontal: 16,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Text style={styles.currentTime}>
                {_formatMilliToHHMMSS(currentTime ?? 0)}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                {isFullScreen ? (
                  <Text style={styles.percentage}>
                    {(((currentTime ?? 0) / (duration ?? 0)) * 100).toFixed(0)}%
                    completed
                  </Text>
                ) : null}
                <Text style={styles.currentTime}>
                  {_formatMilliToHHMMSS(duration ?? 0)}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    ) : null;
  };

  const _renderCenterControls = () => {
    return (
      <Animated.View
        pointerEvents={'box-none'}
        style={{
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',

          top: 0,
          left: 0,
          right: 0,
          bottom: 0,

          alignSelf: 'center',
          transform:
            isFullScreen && settings.customization.cover.showVideoCover
              ? [
                  {
                    scale: coverController.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.6],
                    }),
                  },
                  {
                    translateX: coverController.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        0,
                        Platform.OS === 'android'
                          ? -(width * 1.2)
                          : isTablet()
                          ? -(width * 0.64)
                          : -(width * 1.3),
                      ],
                    }),
                  },
                  {
                    translateY: coverController.interpolate({
                      inputRange: [0, 1],
                      outputRange:
                        Platform.OS === 'android'
                          ? [0, -(height * 0.28)]
                          : [
                              0,
                              isTablet() ? -(height * 0.32) : -(height * 0.3),
                            ],
                    }),
                  },
                ]
              : [],
        }}>
        <View
          style={{
            flexDirection: 'row',
            maxWidth: width * 0.5,
            justifyContent: 'space-between',
          }}>
          {!(coverExposed && settings.customization.cover.showVideoCover) && (
            <Icon
              name={'rewind'}
              type={'MaterialCommunityIcons'}
              size={isFullScreen ? 65 : 50}
              color={'white'}
              onPress={() => {
                setCurrentTime((time) => (time ?? 0) - 15);
                videoPlayerController.current?.seek((currentTime ?? 0) - 15);
              }}
            />
          )}
          <TouchableOpacity onPress={() => setIsPlaying((playing) => !playing)}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor:
                  coverExposed && settings.customization.cover.showVideoCover
                    ? theme.colors.accent
                    : 'transparent',
                borderRadius: 40,
                paddingLeft:
                  coverExposed && settings.customization.cover.showVideoCover
                    ? 10
                    : 0,
                paddingHorizontal:
                  coverExposed && settings.customization.cover.showVideoCover
                    ? width * 0.2
                    : 0,
              }}>
              <Icon
                name={!isPlaying ? 'play' : 'pause'}
                type={'MaterialCommunityIcons'}
                size={isFullScreen ? 65 : 50}
                color={'white'}
              />

              {coverExposed &&
              isFullScreen &&
              settings.customization.cover.showVideoCover ? (
                <Animated.Text
                  style={[styles.stoppedmessage, {opacity: coverController}]}>
                  Paused - tap to resume
                </Animated.Text>
              ) : null}
            </View>
          </TouchableOpacity>
          {!(coverExposed && settings.customization.cover.showVideoCover) ? (
            <Icon
              name={'fast-forward'}
              type={'MaterialCommunityIcons'}
              size={isFullScreen ? 65 : 50}
              color={'white'}
              onPress={() => {
                setCurrentTime((time) => (time ?? 0) + 15);
                videoPlayerController.current?.seek((currentTime ?? 0) + 15);
              }}
            />
          ) : null}
        </View>
      </Animated.View>
    );
  };

  const renderQueue = ({item, index}: {item: SimklEpisodes; index: number}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          _tappedUpNext(index);
        }}>
        <View
          style={[
            {
              paddingVertical: 5,
              height: Platform.OS === 'ios' ? height * 0.19 : height * 0.25,
              width: width * 0.52,
              marginLeft: index === 0 ? MARGIN_LEFT : 15,
            },
          ]}>
          {item?.img ? (
            <DangoImage
              url={item.img}
              style={[
                styles.upNextImage,
                {
                  borderColor: theme.colors.primary,
                  borderWidth: index === 0 ? 1 : 0,
                },
              ]}
            />
          ) : (
            <Image
              source={require('../../../assets/images/icon_round.png')}
              style={[
                styles.upNextImage,
                {
                  borderColor: theme.colors.primary,
                  borderWidth: index === 0 ? 1 : 0,
                },
              ]}
            />
          )}

          <View style={{paddingHorizontal: 4}}>
            <View style={{flexDirection: 'row'}}>
              <Text numberOfLines={1} style={styles.upNextEpTitle}>
                Episode {item.episode}
              </Text>
            </View>
            <Text numberOfLines={1} style={styles.upNextTitle}>
              {item.title ?? 'N/A'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const SCREEN_HEIGHT = Platform.OS === 'ios' ? height * 0.25 : height * 0.4;
  const ALWAYS_OPEN_HEIGHT = height * 0.065;
  const MARGIN_LEFT = width * 0.15;

  const renderUpNextList = () => {
    return (
      <Modalize
        tapGestureEnabled={false}
        withHandle={false}
        alwaysOpen={ALWAYS_OPEN_HEIGHT}
        useNativeDriver
        modalStyle={{
          backgroundColor: 'transparent',
          zIndex: 100,
          elevation: 0,
        }}
        modalHeight={SCREEN_HEIGHT}
        onOverlayPress={() => {}}
        ref={upNextModal}>
        <View
          style={{
            width: '100%',
            height: SCREEN_HEIGHT,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                color: 'white',
                fontSize: 26,
                fontWeight: '900',
                marginLeft: Platform.OS === 'ios' ? width * 0.16 : width * 0.04,
              }}>
              {upNextQueueItems.length > 0 ? 'Your Queue' : 'Up Next'}
            </Text>
            {upNextItems.length > 0 || upNextQueueItems.length > 0 ? (
              <Text
                style={{
                  color: 'white',
                  fontSize: 17,
                  fontWeight: '500',
                  marginLeft: 8,
                }}>
                -{' '}
                {upNextQueueItems.length > 0
                  ? upNextQueueItems.length
                  : upNextItems.length}{' '}
                episodes
              </Text>
            ) : null}
          </View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={
              upNextQueueItems.length > 0
                ? upNextQueueItems.map((i) => i.episode)
                : upNextItems
            }
            renderItem={renderQueue}
            keyExtractor={(_, index) => String(index)}
          />
        </View>
      </Modalize>
    );
  };

  const autoPlayTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (autoPlayTimerValue === -1) {
      Animated.timing(autoPlayTimerController, {
        toValue: 0,
        useNativeDriver: true,
        duration: 800,
        easing: Easing.in(Easing.linear),
      }).start();
    }
  }, [autoPlayTimerValue]);

  const _renderAutoPlay = () => {
    const upNext =
      upNextQueueItems.length === 0
        ? upNextItems[0]
        : upNextQueueItems[0].episode;

    return (
      <Animated.View
        style={{
          paddingVertical: 5,
          height: Platform.OS === 'ios' ? height * 0.19 : height * 0.25,
          width: width * 0.52,
          position: 'absolute',
          right: width * 0.2,

          transform: [
            {
              translateY: autoPlayTimerController.interpolate({
                inputRange: [0, 1],
                outputRange: [-height + 150, height * 0.01],
              }),
            },
          ],
        }}>
        <Animated.View
          style={{
            opacity: autoPlayTimerController.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.75],
            }),
          }}>
          <DangoImage url={upNext.img} style={{width: '100%', height: '90%'}} />
          <LinearGradient
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            colors={['rgba(0,0,0,0.8)', 'transparent']}
          />
          <View style={{position: 'absolute', top: 0, right: 0}}>
            <Text style={[styles.upNextTitle, {color: theme.colors.accent}]}>
              Episode {upNext.episode}
            </Text>
          </View>
        </Animated.View>
        <ThemedButton
          color={theme.colors.accent}
          style={{
            marginVertical: 5,
            borderRadius: 6,
            width: '100%',
            height: height * 0.05,
          }}
          onPress={() => {
            _tappedUpNext(0);
          }}
          title={
            autoPlayTimerValue !== -1
              ? `Auto Playing in ${autoPlayTimerValue}`
              : 'Canceled'
          }
        />
        <ThemedButton
          style={{borderRadius: 6, width: '100%', height: height * 0.05}}
          color={'red'}
          onPress={() => {
            if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
            setAutoPlayerTimerValue(-1);
          }}
          title={'Cancel'}
        />
      </Animated.View>
    );
  };

  return (
    <>
      <View style={{width: '100%', height: '100%', backgroundColor: 'black'}}>
        <HomeIndicator autoHidden />
        <TouchableWithoutFeedback onPress={_toggleControls}>
          <View
            style={
              settings.general.video.followAspectRatio &&
              videoAspect &&
              isFullScreen
                ? {
                    height: videoAspect.height,
                    width: videoAspect.width,
                    alignSelf: 'center',
                  }
                : undefined
            }>
            {/* <VLCPlayer
							style={{ height: "100%", width: "100%" }}
							ref={vlcController}
							paused={!isPlaying}
							source={{
								uri: url,
								autoPlay: true,
								initType: 1,

								initOptions: [
									"--adaptive-use-access",
									"--force-dolby-surround=1",
									"--stereo-mode=6",
									"--network-caching=250",
									"--role=animation",
									"--spatialaudio-headphones",
									"--deinterlace=-1",
									"--deinterlace-mode=yadifx2",
									"--codec=avcodec",
								],
							}}
						/> */}
            <Video
              style={{height: '100%', width: '100%'}}
              ignoreSilentSwitch={'ignore'}
              ref={videoPlayerController}
              pictureInPicture={settings.general.video.pip}
              playWhenInactive={true}
              allowsExternalPlayback
              bufferConfig={settings.dev.videoBuffer}
              maxBitRate={settings.dev.maxBitRate}
              automaticallyWaitsToMinimizeStalling={
                settings.dev.automaticallyWaitsToMinimizeStalling
              }
              minLoadRetryCount={5}
              onProgress={_onProgress}
              onLoad={_onLoad}
              onError={onError}
              onVideoError={() => onError('The video could not be played')}
              resizeMode={resizeCover}
              paused={!isPlaying}
              onPlaybackResume={() => {}}
              onPlaybackStalled={() => {
                console.log('stalling');
              }}
              onVideoLoad={() => setLoading(true)}
              onReadyForDisplay={() => {
                setLoading(false);
              }}
              source={{
                uri: url,
                headers,
              }}
              onEnd={() => {
                onEnd();
                if (settings.general.autoPlay.changeAt100 ?? false) {
                  _tappedUpNext(0);
                }
              }}
              onRestoreUserInterfaceForPictureInPictureStop={() => {
                console.log('pip requested stop');
              }}
            />
            {loading ? (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator />
              </View>
            ) : null}
          </View>
        </TouchableWithoutFeedback>
        {!isPlaying &&
          !isDragging &&
          isFullScreen &&
          coverExposed &&
          episode.img &&
          settings.customization.cover.showVideoCover &&
          !loading && (
            <VideoCover
              episodeData={episode}
              duration={duration}
              currentTime={currentTime}
              onFullscreen={onFullScreen}
            />
          )}
        {controlsVisible ? (
          <>
            {_renderTopControls()}
            {_renderCenterControls()}
            {_renderBottomControls()}
          </>
        ) : null}
        {isFullScreen &&
        (upNextItems.length > 0 || upNextQueueItems.length > 0) &&
        controlsVisible
          ? renderUpNextList()
          : null}

        {settings.general.autoPlay.timerAt94 &&
        isFullScreen &&
        (upNextItems.length > 0 || upNextQueueItems.length > 0) &&
        autoPlayTimerValue !== -1
          ? _renderAutoPlay()
          : null}
      </View>
    </>
  );
};

interface VideoCoverProps {
  episodeData: Partial<SimklEpisodes>;
  duration?: number;
  currentTime?: number;
  onFullscreen: () => void;
}

const VideoCover: FC<VideoCoverProps> = (props) => {
  const theme = useTheme((_) => _.theme);
  const {episodeData, duration, currentTime, onFullscreen} = props;
  const {img, description, episode} = episodeData;

  const imageController = useRef(new Animated.Value(0)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;

  const [estimatedTime, setEstimatedTime] = useState<string>();

  const timer = useRef<NodeJS.Timeout>();

  const scale = imageController.interpolate({
    inputRange: [0, 1],
    outputRange: [1.1, 1],
  });
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    Animated.timing(imageController, {
      toValue: 1,
      useNativeDriver: true,
      duration: 500,
      easing: Easing.out(Easing.sin),
    }).start();
  }, []);

  useEffect(() => {
    if (value === 0 || value === 1) {
      timer.current = setTimeout(() => {
        _flipImage();
      }, 9500);
    }

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [value]);

  const _flipImage = () => {
    Animated.timing(imageOpacity, {
      toValue: value === 0 ? 1 : 0,
      useNativeDriver: true,
      duration: 2500,
      easing: Easing.out(Easing.ease),
    }).start();
    setValue(value === 0 ? 1 : 0);
  };

  useEffect(() => {
    setInterval(() => {
      if (currentTime && duration) {
        const completionPercent = duration - currentTime;

        const total = new Date(
          Date.now() + completionPercent * 1000,
        ).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        setEstimatedTime(total);
      }
    }, 1000);
  }, []);
  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}>
      <Animated.View style={{transform: [{scale}], opacity: imageOpacity}}>
        <DangoImage url={img!} style={{height: '100%', width: '100%'}} />
      </Animated.View>
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,0.45)',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: Platform.OS === 'ios' ? width * 0.2 : 0,
          ...Platform.select({
            android: {
              paddingLeft: width * 0.03,
              paddingTop: height * 0.18,
            },
          }),
        }}>
        <Text
          style={[
            styles.episodeNumberCover,
            {marginTop: height * 0.04, color: theme.colors.accent},
          ]}>
          Episode {episode ?? '??'}
        </Text>
        <ScrollView
          style={{
            marginTop: 15,
            maxWidth: width * 0.65,
            maxHeight: height * 0.18,
            overflow: 'hidden',
          }}>
          <Text style={styles.episodeDesc}>
            {description && description.length > 0
              ? description
              : 'This anime has not been given a description. Come back later, or wait for the SIMKL team to add one'}
          </Text>
        </ScrollView>
        {estimatedTime ? (
          <Text style={styles.timeUntilComplete}>
            ~ Finishes at: {estimatedTime}
          </Text>
        ) : null}
      </View>
      <Icon
        style={{position: 'absolute', top: 10, right: 10}}
        name={'fullscreen-exit'}
        type={'MaterialCommunityIcons'}
        size={35}
        color={'white'}
        onPress={onFullscreen}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  controlsView: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    paddingHorizontal: 15,
  },
  topControlsTitle: {
    color: 'white',
    fontSize: 21,
    fontWeight: '800',
  },
  topControlsDescription: {
    fontSize: 15,
    color: 'white',
    fontWeight: '600',
  },
  currentTime: {
    color: 'white',
  },
  percentage: {
    color: 'orange',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 15,
  },
  stoppedmessage: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
    marginLeft: 8,
  },
  episodeNumberCover: {
    fontSize: 16,
    fontWeight: '700',
  },
  episodeDesc: {
    color: 'white',
    fontSize: 15,
    fontWeight: '400',
  },

  upNextImage: {
    height: '80%',
    width: '100%',
    borderRadius: 4,
    marginBottom: 5,
  },
  upNextTitle: {
    color: 'white',
    fontWeight: '300',
    fontSize: 12,
  },
  upNextEpTitle: {
    flexShrink: 0.8,
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },

  timeUntilComplete: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
  },
});

const _onlyChange = (op: Props, np: Props): boolean => {
  return op === np;
};
export const TaiyakiVideoPlayer = memo(_TaiyakiVideoPlayer, _onlyChange);
