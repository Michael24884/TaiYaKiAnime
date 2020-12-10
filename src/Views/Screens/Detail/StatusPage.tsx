/* eslint-disable react-native/no-inline-styles */
import React, {FC, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Easing,
  Animated,
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-dynamic-vector-icons';
import {StretchyScrollView} from 'react-native-stretchy';
import {useAnilistRequest, useMalRequests} from '../../../Hooks';
import {AnilistMediaListGrapqh} from '../../../Models/Anilist';
import {MALDetailed} from '../../../Models/MyAnimeList';
import {TrackingServiceTypes} from '../../../Models/taiyaki';

import {useSimklStore, useTheme, useUserProfiles} from '../../../Stores';
import {
  StatusInfo,
  StatusTiles,
  ThemedButton,
  ThemedSurface,
  ThemedText,
} from '../../Components';
import {UpdatingAnimeStatusPage} from '../../Components/detailedParts';

const {height, width} = Dimensions.get('window');

interface Props {
  totalEpisode: number;
  banner: string;
  onClose: () => void;
  title: string;
  id: number;
  idMal?: string;
}
const StatusPage: FC<Props> = (props) => {
  const theme = useTheme((_) => _.theme);
  const {banner, idMal, id, totalEpisode, title, onClose} = props;
  const profiles = useUserProfiles((_) => _.profiles);
  const controller = useRef(new Animated.Value(0)).current;
  const [open, setOpen] = useState<boolean>(false);
  const [tracker, setTracker] = useState<TrackingServiceTypes>();

  const {
    query: {
      data: AnilistData,
      refetch: RefetchAnilist,
      isLoading: AnilistLoading,
    },
    controller: AnilistController,
  } = useAnilistRequest<StatusInfo>('Sync' + id, AnilistMediaListGrapqh(id));

  const {
    query: {data: MyAnimeListData, isLoading: MalLoading, refetch: RefetchMAL},
    controller: MalController,
  } = useMalRequests<MALDetailed>(
    'mal' + idMal,
    '/anime/' +
      idMal +
      '?fields={my_list_status{start_date,end_date}},num_episodes',
  );

  //WARNING: UNSAFE
  const simklData = useSimklStore((_) => _.getAnime)(idMal!);

  useEffect(() => {
    return () => {
      MalController.abort();
      AnilistController.abort();
    };
  }, []);

  const _renderMyStatus = (
    tracker: TrackingServiceTypes,
    onManualEdit: () => void,
    item?: StatusInfo,
  ) => {
    return (
      <StatusTiles data={item} tracker={tracker} onManualEdit={onManualEdit} />
    );
  };

  useEffect(() => {
    _Animate();
  }, [open]);

  useEffect(() => {
    if (tracker) setOpen(true);
  }, [tracker]);

  const _Animate = () => {
    const Animate: Animated.TimingAnimationConfig = {
      toValue: open ? 1 : 0,
      useNativeDriver: false,
      duration: 250,
      easing: Easing.inOut(Easing.ease),
    };
    Animated.timing(controller, Animate).start();
  };

  const profileRevealer = () => {
    if (profiles.length === 0)
      return (
        <ThemedSurface style={{justifyContent: 'center', alignItems: 'center'}}>
          <Icon name={'error'} type={'MaterialIcons'} size={45} color={'red'} />
          <ThemedText
            style={{
              fontWeight: '600',
              fontSize: 18,
              textAlign: 'center',
              marginTop: 10,
            }}>
            You're not signed in to any tracking service
          </ThemedText>
        </ThemedSurface>
      );
    return (
      <ThemedSurface style={{justifyContent: 'space-between'}}>
        {profiles.find((i) => i.source === 'Anilist') ? (
          AnilistLoading ? (
            <View style={styles.loadingStatus}>
              <ActivityIndicator />
            </View>
          ) : (
            _renderMyStatus(
              'Anilist',
              () => {
                setTracker('Anilist');
              },
              AnilistData,
            )
          )
        ) : null}
        {profiles.find((i) => i.source === 'MyAnimeList') ? (
          MalLoading ? (
            <View style={styles.loadingStatus}>
              <ActivityIndicator />
            </View>
          ) : (
            _renderMyStatus(
              'MyAnimeList',
              () => {
                setTracker('MyAnimeList');
              },
              MyAnimeListData?.mappedEntry,
            )
          )
        ) : null}
        {profiles.find((i) => i.source === 'SIMKL')
          ? _renderMyStatus(
              'SIMKL',
              () => {
                setTracker('SIMKL');
              },
              simklData,
            )
          : null}

        <View
          style={{
            backgroundColor: theme.colors.backgroundColor,
            alignSelf: 'center',
            marginBottom: height * 0.05,
          }}>
          <ThemedText
            style={{
              color: 'grey',
              fontSize: 13,
              fontWeight: '300',
              alignSelf: 'center',
            }}>
            This will update all your sources
          </ThemedText>
          <ThemedButton
            onPress={() => setOpen(true)}
            title={'Update'}
            style={{alignSelf: 'center'}}
          />
          <ThemedButton
            onPress={onClose}
            title={'Close'}
            style={{alignSelf: 'center'}}
          />
        </View>
      </ThemedSurface>
    );
  };

  return (
    <ThemedSurface style={{flex: 1}}>
      <Modal
        visible={open}
        animationType={'slide'}
        hardwareAccelerated
        presentationStyle={'formSheet'}
        onRequestClose={() => setOpen(false)}>
        <View style={{flex: 1}}>
          <UpdatingAnimeStatusPage
            totalEpisodes={totalEpisode}
            tracker={tracker}
            ids={{anilist: id, myanimelist: idMal}}
            update={() => {
              RefetchAnilist();
              RefetchMAL();
              setTracker(undefined);
              setOpen(false);
            }}
            initialData={
              !tracker
                ? AnilistData ??
                  MyAnimeListData?.mappedEntry ?? {
                    status: 'Add to List',
                    progress: 0,
                    totalEpisodes: 0,
                  }
                : tracker === 'Anilist'
                ? AnilistData ?? {
                    status: 'Add to List',
                    progress: 0,
                    totalEpisodes: 0,
                  }
                : tracker === 'MyAnimeList'
                ? MyAnimeListData?.mappedEntry ?? {
                    status: 'Add to List',
                    progress: 0,
                    totalEpisodes: 0,
                  }
                : simklData
            }
            dismiss={() => {
              setTracker(undefined);
              setOpen(false);
            }}
          />
        </View>
      </Modal>
      <StretchyScrollView
        image={{uri: banner}}
        imageHeight={height * 0.25}
        imageOverlay={
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.6)',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 8,
            }}>
            <ThemedText
              style={{
                color: 'white',
                fontSize: 18,
                fontWeight: '600',
                textAlign: 'center',
              }}>
              {title}
            </ThemedText>
          </View>
        }
        scrollEnabled={profiles.length > 0 && !open}
        style={{
          backgroundColor: theme.colors.backgroundColor,
        }}>
        {profileRevealer()}
      </StretchyScrollView>
    </ThemedSurface>
  );
};

const styles = StyleSheet.create({
  view: {
    height: height * 0.3,
    width,
    overflow: 'hidden',
  },
  bannerImage: {
    height: '100%',
    width: '100%',
  },
  coverView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  blurView: {
    zIndex: 100,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  onBlurTitle: {
    color: 'white',
    fontSize: 21,
    fontWeight: '700',
    marginTop: height * 0.15,
    textAlign: 'center',
  },
  loadingStatus: {
    height: height * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StatusPage;
