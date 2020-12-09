/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  LayoutAnimation,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-dynamic-vector-icons';
import {SimklEpisodes} from '../../Models/SIMKL';
import {MyQueueModel, TaiyakiArchiveModel} from '../../Models/taiyaki';
import {useTheme} from '../../Stores';
import {useQueueStore} from '../../Stores/queue';
import {
  DangoImage,
  EpisodeSliders,
  ThemedSurface,
  ThemedText,
} from '../Components';
import {EmptyScreen} from './empty_screen';

const {height} = Dimensions.get('window');

export type QueueRefAction = {playNext: () => void};

interface QueueProps {
  isPlayer?: boolean;
  playNow?: (arg0: MyQueueModel) => void;
}

const MyQueueScreen: FC<QueueProps> = (props) => {
  const {isPlayer, playNow} = props;
  const theme = useTheme((_) => _.theme);
  //const { dispatch, myQueue } = dynamicQueueStore("myQueue");
  const {addToQueue, myQueue, emptyList, queueLength} = useQueueStore();

  const mimicConstructor = () => {
    if (Object.keys(myQueue).length !== 0) {
      return Object.entries(myQueue).map((_, index) => {
        const o = Object.keys(myQueue)[index];
        const d = Object.values(myQueue)[index];
        const m = {
          title: o,
          data: d,
        };
        return m;
      });
    }
    return [];
  };

  const [mimic, setMimic] = useState(mimicConstructor());
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      setMimic(mimicConstructor());
    }, [myQueue]),
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: ({tintColor}: {tintColor: string | undefined}) =>
        queueLength > 0 ? (
          <Icon
            name={'trash-can'}
            type={'MaterialCommunityIcons'}
            color={tintColor}
            style={{marginRight: 20}}
            onPress={() =>
              Alert.alert(
                'Remove Queue?',
                'Your queue will be removed, this cannot be undone',
                [
                  {text: 'Cancel'},
                  {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: emptyList,
                  },
                ],
              )
            }
          />
        ) : null,
    });
  }, [queueLength]);

  const _renderSections = ({
    item,
    index,
  }: {
    item: MyQueueModel;
    index: number;
    section: any;
  }) => {
    if (index === 0 && mimic[0].title === item.detail.title && !isPlayer) {
      return (
        <View style={{padding: 8, marginBottom: height * 0.02}}>
          <ThemedText
            style={{
              fontWeight: '800',
              fontSize: 21,
              marginBottom: 8,
            }}>
            Playing Next
          </ThemedText>
          <TouchableOpacity
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              //		dispatch("addToQueue", { key: item.title, data: item });
              addToQueue({key: item.detail.title, data: item});
              //   const s: SimklEpisodes = {
              //     embedLink: item.episode.link,
              //     episode: item.episode.episode,
              //     img: item.episode.thumbnail ?? '',
              //     ids: {simkl_id: 0, anilist: item.id.anilist},
              //     title: item.episodeTitle,
              //   };
              //   if (isPlayer) {
              //     playNow?.call(null, {
              //       animeTitle: item.detail.title,
              //       archive: item.detail.source,
              //       playingItem: item.episode,
              //       image: item.detail.coverImage,
              //     });
              //   } else
              //     navigation.navigate('VideoPlayer', {
              //       image: item.originalImage,
              //       animeTitle: item.title,
              //       totalEpisodes: item.totalEpisodes,
              //       playingItem: s,
              //       archive: item.archive,
              //       ids: {anilist: item.id.anilist, myanimelist: item.id.mal},
              //     });

              navigation.push('Video', {episode: item});
            }}>
            <View
              style={{height: height * 0.3, width: '100%', marginBottom: 5}}>
              {item.episode.img ? (
                <DangoImage
                  url={item.episode.img}
                  style={{height: '80%', width: '100%', borderRadius: 4}}
                />
              ) : (
                <Image
                  source={require('../../assets/images/icon_round.png')}
                  style={{height: '80%', width: '100%', borderRadius: 4}}
                />
              )}

              <ThemedText
                style={{
                  marginTop: 8,
                  marginBottom: 2,
                  color: theme.colors.accent,
                }}>
                Episode {item.episode.episode}
              </ThemedText>
              {item.episode.title &&
              item.episode.title !== `Episode ${item.episode.episode}` ? (
                <ThemedText
                  style={{
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                  {item.episode.title}
                </ThemedText>
              ) : null}
            </View>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <EpisodeSliders
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          //dispatch("addToQueue", { key: item.title, data: item });
          addToQueue({key: item.detail.title, data: item});
          //   const s: SimklEpisodes = {
          //     embedLink: item.episode.link,
          //     episode: item.episode.episode,
          //     img: item.episode.img ?? '',
          //     ids: {simkl_id: 0, anilist: item.id.anilist},
          //     title: item.episodeTitle,
          //   };
          if (isPlayer) {
            playNow?.call(null, item);
            // playNow?.call(null, {
            //   animeTitle: item.episode.title,
            //   archive: item.detail.source,
            //   playingItem: item.episode,
            //   ids: {anilist: item.id.anilist, myanimelist: item.id.mal},
            //   image: item.originalImage,
            // });
          } else {
            navigation.navigate('Video', {episode: item});
          }
          //     navigation.navigate('VideoPlayer', {
          //       image: item.originalImage,
          //       animeTitle: item.title,
          //       totalEpisodes: item.totalEpisodes,
          //       playingItem: s,
          //       archive: item.archive,
          //       ids: {anilist: item.id.anilist, myanimelist: item.id.mal},
          //     });
        }}
        item={item}
      />
    );
  };

  const _openDrawer = () => {
    //@ts-ignore
    navigation.openDrawer();
  };

  const _clearQueue = () => {
    Alert.alert('Empty Queue?', undefined, [
      {
        text: 'Cancel',
      },
      {
        text: 'Empty',
        onPress: async () => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          emptyList();
          await AsyncStorage.removeItem('my_queue_storage');
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.backgroundColor}}>
      {mimic.length === 0 && !isPlayer ? (
        <EmptyScreen message={'Your queue list is empty'} hasHeader />
      ) : (
        <>
          <SectionList
            scrollEnabled={!isPlayer}
            style={[{height: '100%', width: '100%', flexGrow: 0}]}
            sections={mimic}
            keyExtractor={(_, index) => String(index)}
            renderSectionHeader={({section: {title}}) => (
              <ThemedSurface style={{paddingHorizontal: 8, paddingTop: 10}}>
                <ThemedText style={styles.header}>{title}</ThemedText>
                <View
                  style={{
                    width: '95%',
                    height: 1,
                    backgroundColor: 'gray',
                    marginVertical: 5,
                  }}
                />
              </ThemedSurface>
            )}
            renderItem={_renderSections}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    color: 'gray',
    fontSize: 14,
  },
  upNextView: {
    marginHorizontal: 10,
  },
  upNextImage: {
    borderRadius: 6,
    marginBottom: 5,
  },
  upNextEpisode: {
    fontSize: 13,
  },
  upNextTitle: {
    fontWeight: '600',
    fontSize: 18,
  },
  upNextDesc: {
    fontWeight: '400',
    color: 'gray',
    fontSize: 15,
  },
  emptyMessage: {
    fontSize: 21,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  queueItemImage: {
    marginRight: 5,
  },
  queueItemTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  queueItemNumber: {
    fontSize: 15,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: 15,
  },

  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
});

export default MyQueueScreen;
