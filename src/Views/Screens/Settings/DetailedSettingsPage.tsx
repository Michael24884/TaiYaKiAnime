/* eslint-disable react-native/no-inline-styles */
import React, {createRef, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Switch,
  View,
  Platform,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useSettingsStore, useTheme} from '../../../Stores';
import {ThemedButton, ThemedSurface, ThemedText} from '../../Components';
import Slider from '@react-native-community/slider';
import {minutesToHours} from '../../../Util';
import {Modalize} from 'react-native-modalize';
import GoogleCast, {CastButton} from 'react-native-google-cast';

//NOTE: Its possible to reuse the same components for different settings. But would probably result in an ugly looking tree.

const {width, height} = Dimensions.get('window');

interface Props {
  route: {params: {mainTitle: string}};
}

export const VideoCoverSettingsPage = () => {
  const set = useSettingsStore((state) => state.set);
  const autoPlaySettings = useSettingsStore((_) => _.settings);
  const [sliderValue, setSliderValue] = useState<string>(
    autoPlaySettings.customization.cover.delay.toString(),
  );

  const sliderTimer = useRef<NodeJS.Timer>();

  return (
    <ThemedSurface style={styles.view}>
      <ScrollView>
        <View style={styles.objectView}>
          <ThemedText style={styles.mainTitle}>{'Show Cover'}</ThemedText>
          <ThemedText style={styles.desc}>
            {/* If enabled and your Queue list is empty, Taiyaki will automatically
            add the remaining episodes if any to the Up Next list */}
            When ON, Shows the episode thumbnail on the screen. This will cross
            fade between the player and the image. If the episode does not have
            a thumbnail then it will not be displayed.
          </ThemedText>
          <Switch
            style={styles.switch}
            value={autoPlaySettings.customization.cover.showVideoCover}
            onValueChange={(value) =>
              set((state: any) => {
                state.settings.customization.cover.showVideoCover = value;
              })
            }
          />
        </View>
        <View style={styles.objectView}>
          <ThemedText style={styles.secondaryTitle}>Cover delay</ThemedText>
          <ThemedText style={styles.desc}>
            Set a custom delay before the player is transitioned to the cover
          </ThemedText>
          <Slider
            value={Number(sliderValue)}
            minimumValue={0}
            maximumValue={12}
            onSlidingComplete={(value) => {
              const fixedValue = Math.ceil(value).toFixed(0);
              setSliderValue(fixedValue);
              set((state) => {
                state.settings.customization.cover.delay = fixedValue;
              });
            }}
          />
          <ThemedText style={[styles.desc, {textAlign: 'right'}]}>
            {sliderValue} seconds
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedSurface>
  );
};

export const AutoPlaySettingsPage = () => {
  const set = useSettingsStore((state) => state.set);
  const autoPlaySettings = useSettingsStore((_) => _.settings.general.autoPlay);
  return (
    <ThemedSurface style={styles.view}>
      <ScrollView>
        <View style={styles.objectView}>
          <ThemedText style={styles.mainTitle}>{'Auto Play'}</ThemedText>
          <ThemedText style={styles.desc}>
            If enabled and your Queue list is empty, Taiyaki will automatically
            add the remaining episodes if any to the Up Next list. This will
            only grab the current section. (e.g Episodes 1-50)
          </ThemedText>
          <Switch
            style={styles.switch}
            value={autoPlaySettings.enabled}
            onValueChange={(value) => {
              set((state: any) => {
                state.settings.general.autoPlay.enabled = value;
              });
            }}
          />
        </View>

        <View style={styles.objectView}>
          <ThemedText style={styles.secondaryTitle}>
            Show a timer at 94%
          </ThemedText>
          <ThemedText style={styles.desc}>
            Show a 10 second auto cancelable timer that changes the current
            episode once the interval has completed
          </ThemedText>
          <Switch
            style={styles.switch}
            value={autoPlaySettings.timerAt94}
            onValueChange={(value) =>
              set((state: any) => {
                state.settings.general.autoPlay.timerAt94 = value;
              })
            }
          />
        </View>

        <View style={styles.objectView}>
          <ThemedText style={styles.secondaryTitle}>
            Auto change at 100%
          </ThemedText>
          <ThemedText style={styles.desc}>
            Continue to the next episode on episode completion
          </ThemedText>
          <Switch
            style={styles.switch}
            value={autoPlaySettings.changeAt100}
            onValueChange={(value) =>
              set((state: any) => {
                state.settings.general.autoPlay.changeAt100 = value;
              })
            }
          />
        </View>
      </ScrollView>
    </ThemedSurface>
  );
};

export const SyncSettingsPage = () => {
  const set = useSettingsStore((state) => state.set);
  const syncSettings = useSettingsStore((_) => _.settings.sync);

  return (
    <ThemedSurface style={styles.view}>
      <ScrollView>
        <View style={styles.objectView}>
          <ThemedText style={styles.mainTitle}>{'Auto Sync'}</ThemedText>
          <ThemedText style={styles.desc}>
            Auto sync your episode to all third party trackers (if at least one
            is signed into)
          </ThemedText>
          <Switch
            style={styles.switch}
            value={syncSettings.autoSync}
            onValueChange={(value) => {
              set((state: any) => {
                state.settings.sync.autoSync = value;
              });
            }}
          />
        </View>

        <View style={styles.objectView}>
          <ThemedText style={styles.secondaryTitle}>
            Wait until 75% finished
          </ThemedText>
          <ThemedText style={styles.desc}>
            Sync only when the current episode is 75% completed, instead of from
            the start. This is not supported for external players.
          </ThemedText>
          <Switch
            style={styles.switch}
            disabled={!syncSettings.autoSync}
            value={syncSettings.autoSync && syncSettings.syncAt75}
            onValueChange={(value) =>
              set((state: any) => {
                state.settings.sync.syncAt75 = value;
              })
            }
          />
        </View>
        {/*         
        <View style={styles.objectView}>
          <ThemedText style={styles.secondaryTitle}>
            Override next to watch
          </ThemedText>
          <ThemedText style={styles.desc}>
            Override Taiyaki's next to watch data with third party tracker's
            highest watched episode. This will get all third tracker connected
            to and use the one with the highest watched episode progress.
          </ThemedText>
          <Switch
            style={styles.switch}
            value={syncSettings.overrideWatchNext}
            onValueChange={(value) =>
              set((state: any) => {
                state.settings.sync.overrideWatchNext = value;
              })
            }
          />
        </View> */}
      </ScrollView>
    </ThemedSurface>
  );
};

export const VideoSettingsPage = () => {
  const set = useSettingsStore((state) => state.set);
  const videoSettings = useSettingsStore((_) => _.settings.general.video);

  useEffect(() => {
    GoogleCast.showIntroductoryOverlay();
  }, []);

  return (
    <ThemedSurface style={styles.view}>
      <ScrollView>
        <View style={styles.objectView}>
          <ThemedText style={styles.mainTitle}>{'PiP'}</ThemedText>
          <ThemedText style={styles.desc}>
            If ON, enables Player in Player support. Only supported with the
            In-App player (and iOS at the moment). This by default will enable
            background play. (Experimental Support)
          </ThemedText>
          <Switch
            style={styles.switch}
            value={videoSettings.pip}
            disabled={Platform.OS !== 'ios'}
            onValueChange={(value) => {
              set((state: any) => {
                state.settings.general.video.pip = value;
              });
            }}
          />
        </View>

        {/* <View style={styles.objectView}>
          <ThemedText style={styles.secondaryTitle}>
            Set up ChromeCast
          </ThemedText>
          <ThemedText style={styles.desc}>
            Tap the cast button to get started
          </ThemedText>
          <CastButton style={[styles.switch]} />
        </View> */}

        <View style={styles.objectView}>
          <ThemedText style={styles.secondaryTitle}>
            Preload the next episode
          </ThemedText>
          <ThemedText style={styles.desc}>
            Preload the next video, saving time. This only affects the next
            episode and not the entire list. If you're on limited or prefer to
            save data you should turn this off
          </ThemedText>
          <Switch
            style={styles.switch}
            value={videoSettings.preloadUpNext}
            onValueChange={(value) =>
              set((state: any) => {
                state.settings.general.video.preloadUpNext = value;
              })
            }
          />
        </View>

        <View style={styles.objectView}>
          <ThemedText style={styles.secondaryTitle}>
            Follow natural aspect ratio
          </ThemedText>
          <ThemedText style={styles.desc}>
            The In-App player will respect the current video's aspect ratio
            instead of the fullscreen. Best use for old anime series.
          </ThemedText>
          <Switch
            style={styles.switch}
            value={videoSettings.followAspectRatio}
            onValueChange={(value) =>
              set((state: any) => {
                state.settings.general.video.followAspectRatio = value;
              })
            }
          />
        </View>
      </ScrollView>
    </ThemedSurface>
  );
};
export const NotificationsSettingsPage = () => {
  const set = useSettingsStore((state) => state.set);
  const notificationSettings = useSettingsStore(
    (_) => _.settings.notifications,
  );
  const theme = useTheme((_) => _.theme);
  const modalizeRef = createRef<Modalize>();

  const _renderNotificationOptions = ({item}: {item: number}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          set((state: any) => {
            state.settings.notifications.frequency = item;
          });
          modalizeRef.current?.close();
        }}>
        <View
          style={{
            height: height * 0.08,
            paddingVertical: height * 0.02,
            paddingLeft: 12,
            backgroundColor:
              item === notificationSettings.frequency
                ? theme.colors.accent
                : undefined,
          }}>
          <ThemedText
            style={{
              fontSize: 16,
              fontWeight: '500',
              color:
                item === notificationSettings.frequency
                  ? 'white'
                  : theme.colors.text,
            }}>
            {minutesToHours.get(item)}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedSurface style={styles.view}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.objectView}>
          <ThemedText style={styles.mainTitle}>
            Notification Frequency
          </ThemedText>
          <ThemedText style={styles.desc}>
            Frequency to background fetching for checking new episodes
          </ThemedText>
          <TouchableOpacity
            onPress={() => {
              modalizeRef.current?.open();
            }}>
            <ThemedText style={[styles.desc, {textAlign: 'right'}]}>
              {minutesToHours.get(notificationSettings.frequency)}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.objectView}>
          <ThemedText style={styles.secondaryTitle}>Network Type</ThemedText>
          <ThemedText style={styles.desc}>
            If ON, Taiyaki will also use Cellular data to fetch. Otherwise
            fetching will only happen on WiFi
          </ThemedText>
          <Switch
            style={styles.switch}
            value={notificationSettings.canUseCellularNetwork}
            onValueChange={(value) =>
              set((state: any) => {
                state.settings.notifications.canUseCellularNetwork = value;
              })
            }
          />
        </View>

        <View style={styles.objectView}>
          <ThemedText style={styles.secondaryTitle}>
            Allow fetching on low power
          </ThemedText>
          <ThemedText style={styles.desc}>
            Allow to fetch in the background even when the device is low on
            battery power
          </ThemedText>
          <Switch
            style={styles.switch}
            value={notificationSettings.requiresCharging}
            onValueChange={(value) =>
              set((state: any) => {
                state.settings.notifications.requiresCharging = value;
              })
            }
          />
        </View>
        <View style={styles.objectView}>
          <ThemedText style={styles.secondaryTitle}>
            Requires charging
          </ThemedText>
          <ThemedText style={styles.desc}>
            Taiyaki will not fetch unless the device is connected to a power
            source
          </ThemedText>
          <Switch
            style={styles.switch}
            value={notificationSettings.requiresCharging}
            onValueChange={(value) =>
              set((state: any) => {
                state.settings.notifications.requiresCharging = value;
              })
            }
          />
        </View>
      </ScrollView>
      <Modalize
        modalStyle={{backgroundColor: theme.colors.backgroundColor}}
        modalHeight={height * 0.5}
        ref={modalizeRef}
        flatListProps={{
          data: [60, 120, 360, 720, 1440, 10080],
          renderItem: _renderNotificationOptions,
          keyExtractor: (item) => item.toString(),
        }}
      />
    </ThemedSurface>
  );
};

export const VideoBufferSettingsPage = () => {
  const set = useSettingsStore((state) => state.set);
  const devSettings = useSettingsStore((_) => _.settings.dev);
  const theme = useTheme((_) => _.theme);

  const [one, setOne] = useState<number | undefined>();
  const [two, setTwo] = useState<number | undefined>();
  const [three, setThree] = useState<number | undefined>();
  const [four, setFour] = useState<number | undefined>();

  const TapField = (value: number, callBack: (text: number) => void) => (
    <TextInput
      keyboardType={'number-pad'}
      placeholder={value.toString()}
      style={{
        alignSelf: 'flex-end',
        width: '35%',
        borderBottomColor: theme.colors.text,
        color: theme.colors.text,
      }}
      onChangeText={(text) => callBack(Number(text))}
    />
  );

  return (
    <ThemedSurface style={styles.view}>
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}>
        <View style={styles.objectView}>
          <ThemedText style={styles.mainTitle}>{'Video Buffer'}</ThemedText>
          <ThemedText style={styles.desc}>
            These settings modifies the in app video player. If you break it,
            you pay it. Or just press the reset button. Leave settings to 0 for
            default values.
          </ThemedText>
        </View>

        <View style={styles.objectView}>
          <ThemedText style={styles.secondaryTitle}>Max Bit Rate</ThemedText>
          <ThemedText style={styles.desc}>
            Sets the desired limit, in bits per second, of network bandwidth
            consumption when multiple video streams are available for a
            playlist. 0 - (Default) means do not limit.
          </ThemedText>
          {TapField(devSettings.maxBitRate ?? 0, (value) =>
            set((state: any) => {
              state.settings.dev.maxBitRate = value;
            }),
          )}
        </View>

        <View style={styles.objectView}>
          <ThemedText style={styles.secondaryTitle}>
            Automatically waits to minimize stalling
          </ThemedText>
          <ThemedText style={styles.desc}>
            A Boolean value that indicates whether the player should
            automatically delay playback in order to minimize stalling. For
            clients linked against iOS 10.0 and later false - Immediately starts
            playback OR true (Default) - Delays playback in order to minimize
            stalling
          </ThemedText>
          <Switch
            value={devSettings.automaticallyWaitsToMinimizeStalling}
            style={styles.switch}
            onValueChange={(v) => {
              set((state: any) => {
                state.settings.dev.automaticallyWaitsToMinimizeStalling = v;
              });
            }}
          />
        </View>

        <View style={styles.objectView}>
          <ThemedText style={styles.secondaryTitle}>
            Minimum buffer in milliseconds
          </ThemedText>
          <ThemedText style={styles.desc}>
            The default minimum duration of media that the player will attempt
            to ensure is buffered at all times, in milliseconds.
          </ThemedText>
          {TapField(devSettings.videoBuffer.minBufferMs ?? 0, (value) =>
            setOne(value === 0 ? undefined : value),
          )}

          <View style={styles.objectView}>
            <ThemedText style={styles.secondaryTitle}>
              Minimum buffer in milliseconds
            </ThemedText>
            <ThemedText style={styles.desc}>
              The default maximum duration of media that the player will attempt
              to buffer, in milliseconds.
            </ThemedText>
            {TapField(devSettings.videoBuffer.maxBufferMs ?? 0, (value) =>
              setTwo(value === 0 ? undefined : value),
            )}
          </View>

          <View style={styles.objectView}>
            <ThemedText style={styles.secondaryTitle}>
              Buffer for playback in milliseconds
            </ThemedText>
            <ThemedText style={styles.desc}>
              The default duration of media that must be buffered for playback
              to start or resume following a user action such as a seek, in
              milliseconds.
            </ThemedText>
            {TapField(
              devSettings.videoBuffer.bufferForPlaybackMs ?? 0,
              (value) => setThree(value === 0 ? undefined : value),
            )}
          </View>

          <View style={styles.objectView}>
            <ThemedText style={styles.secondaryTitle}>
              Buffer for playback after rebufferering in milliseconds
            </ThemedText>
            <ThemedText style={styles.desc}>
              The default duration of media that must be buffered for playback
              to resume after a rebuffer, in milliseconds. A rebuffer is defined
              to be caused by buffer depletion rather than a user action.
            </ThemedText>
            {TapField(
              devSettings.videoBuffer.bufferForPlaybackAfterRebufferMs ?? 0,
              (value) => setFour(value === 0 ? undefined : value),
            )}
          </View>

          <ThemedButton
            title={'save'}
            onPress={() => {
              set((state: any) => {
                state.settings.dev.videoBuffer = {
                  bufferForPlaybackAfterRebufferMs: four,
                  bufferForPlaybackMs: three,
                  maxBufferMs: two,
                  minBufferMs: one,
                };
              });
            }}
          />
          <ThemedButton
            title={'reset'}
            color={'red'}
            onPress={() => {
              set((state: any) => {
                state.settings.dev.videoBuffer = {
                  bufferForPlaybackAfterRebufferMs: undefined,
                  bufferForPlaybackMs: undefined,
                  maxBufferMs: undefined,
                  minBufferMs: undefined,
                };
              });
            }}
          />
        </View>
        {/*         
        <View style={styles.objectView}>
          <ThemedText style={styles.secondaryTitle}>
            Override next to watch
          </ThemedText>
          <ThemedText style={styles.desc}>
            Override Taiyaki's next to watch data with third party tracker's
            highest watched episode. This will get all third tracker connected
            to and use the one with the highest watched episode progress.
          </ThemedText>
          <Switch
            style={styles.switch}
            value={syncSettings.overrideWatchNext}
            onValueChange={(value) =>
              set((state: any) => {
                state.settings.sync.overrideWatchNext = value;
              })
            }
          />
        </View> */}
      </ScrollView>
    </ThemedSurface>
  );
};

const styles = StyleSheet.create({
  switch: {
    alignSelf: 'flex-end',
  },
  view: {
    flex: 1,
    paddingLeft: width * 0.04,
    paddingRight: width * 0.04,
  },
  mainTitle: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: height * 0.01,
  },
  secondaryTitle: {
    fontSize: 17,
    marginBottom: height * 0.01,
  },
  desc: {
    color: 'grey',
    fontSize: 14,
    marginBottom: height * 0.02,
  },
  objectView: {
    marginVertical: height * 0.03,
  },
});
