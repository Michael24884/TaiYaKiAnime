/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {createRef, FC, memo, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import Icon from 'react-native-dynamic-vector-icons';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {
  AnilistPagedData,
  AnilistRequestTypes,
  Media,
} from '../../Models/Anilist';
import {SimklEpisodes} from '../../Models/SIMKL';
import {
  DetailedDatabaseModel,
  TrackingServiceTypes,
  WatchingStatus,
} from '../../Models/taiyaki';
import {useQueueStore} from '../../Stores/queue';
import {useTheme} from '../../Stores/theme';
import {
  MapTrackingServiceToAssets,
  MapTrackingServiceToColors,
} from '../../Util';
import {ThemedButton, ThemedCard, ThemedText} from './base';
import DangoImage from './image';
import ViewPager from '@react-native-community/viewpager';
import {ContinueWatchingTile} from '.';
import Dimension from '../../Classes/Dimensions';
import {useNotificationStore} from '../../Stores';

const {height, width} = Dimensions.get('window');

interface BaseCardProps {
  image: string;
  title: string;
  id: number;
  hasBadge?: boolean;
  badgeContent?: string;
  onPress?: () => void;
}

const _BaseCards: FC<BaseCardProps> = (props) => {
  const {image, title, id, hasBadge, badgeContent, onPress} = props;
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={onPress ? onPress : () => navigation.push('Detail', {id})}>
      <View style={styles.card.view}>
        <View style={styles.card.view}>
          <View style={styles.card.image}>
            <DangoImage url={image} style={{flex: 1}} />
            {hasBadge && badgeContent ? (
              <View
                style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    height: height * 0.03,
                  }}
                />
                <View
                  style={{position: 'absolute', bottom: 1, left: 0, right: 0}}>
                  <ThemedText
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      textAlign: 'center',
                    }}>
                    {badgeContent}
                  </ThemedText>
                </View>
              </View>
            ) : null}
          </View>
          <ThemedText numberOfLines={3} style={styles.card.title}>
            {title}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export const BaseCards = memo(_BaseCards);

interface BaseRowProps {
  type: AnilistRequestTypes;
  path: string;
  title: string;
  subtitle?: string;
  data: AnilistPagedData;
  hideSeeAll?: boolean;
}

export const BaseRows: FC<BaseRowProps> = (props) => {
  const theme = useTheme((_) => _.theme.colors);
  const ITEM_HEIGHT = height * 0.25;
  const {title, subtitle, data, type, hideSeeAll} = props;
  const navigation = useNavigation();
  const renderItem = ({item}: {item: Media}) => {
    return (
      <BaseCards
        title={item.title.romaji}
        image={item.coverImage.extraLarge}
        id={item.id}
      />
    );
  };
  return (
    <View style={styles.row.container}>
      <View style={styles.row.titleView}>
        <View>
          <ThemedText style={styles.row.title}>{title}</ThemedText>
          <ThemedText style={styles.row.subTitle}>{subtitle}</ThemedText>
        </View>
        {!hideSeeAll ? (
          <Button
            title={'See All'}
            onPress={() => navigation.navigate('See More', {key: type})}
            color={theme.accent}
          />
        ) : null}
      </View>
      <FlatList
        data={data.data.Page.media}
        renderItem={renderItem}
        horizontal
        contentContainerStyle={{height: ITEM_HEIGHT}}
        keyExtractor={(item) => item.id.toString()}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
};
interface BaseRowSimpleProps {
  title: string;
  subtitle?: string;
  data: DetailedDatabaseModel[];
}
export const BaseRowsSimple: FC<BaseRowSimpleProps> = (props) => {
  const ITEM_HEIGHT = height * 0.25;
  const {title, subtitle, data} = props;
  const navigation = useNavigation();
  const removeNotification = useNotificationStore((_) => _.removeNotification);
  const renderItem = ({item}: {item: DetailedDatabaseModel}) => {
    return (
      <BaseCards
        title={item.title}
        image={item.coverImage}
        id={item.ids.anilist!}
        hasBadge
        badgeContent={'Episode ' + item.totalEpisodes}
        onPress={() => {
          removeNotification({anilist: item.ids.anilist});
          navigation.push('Detail', {id: item.ids.anilist});
        }}
      />
    );
  };
  return (
    <View style={styles.row.container}>
      <View style={styles.row.titleView}>
        <View>
          <ThemedText style={styles.row.title}>{title}</ThemedText>
          <ThemedText style={styles.row.subTitle}>{subtitle}</ThemedText>
        </View>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        horizontal
        contentContainerStyle={{height: ITEM_HEIGHT}}
        keyExtractor={(item) => item.ids.anilist!.toString()}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
};

export type StatusInfo = {
  status?: WatchingStatus;
  progress: number;
  totalEpisodes: number;
  started?: string;
  ended?: string;
  score?: number;
};
const _StatusTiles: FC<{
  data?: StatusInfo;
  tracker: TrackingServiceTypes;
  onManualEdit: () => void;
}> = (props) => {
  const theme = useTheme((_) => _.theme);
  const {tracker} = props;
  const emptyResults = () => (
    <View style={{paddingTop: 10}}>
      <View
        style={{
          backgroundColor: 'red',
          width: '90%',
          alignSelf: 'center',
          padding: height * 0.03,
          borderRadius: 4,
          marginBottom: height * 0.05,
        }}>
        <ThemedText style={{color: 'white', fontSize: 18, fontWeight: '700'}}>
          Not in your list
        </ThemedText>
      </View>
    </View>
  );

  const IconText = (iconName: string, data: string) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          padding: 5,
          alignItems: 'center',
        }}>
        <Icon
          name={iconName}
          type={'MaterialIcons'}
          color={'white'}
          size={35}
        />
        <ThemedText
          style={{
            color: 'white',
            fontSize: 15,
            fontWeight: '500',
            marginLeft: 4,
            flex: 1,
            textAlign: 'center',
          }}>
          {data}
        </ThemedText>
      </View>
    );
  };

  const removeInvalids = (day: string): string => {
    if (day === 'Invalid Date') return '-';
    else return day;
  };

  const dater = (
    pick: 'day' | 'month' | 'year',
    chrono: 'started' | 'ended',
  ): string => {
    const {started, ended} = props.data!;

    let picker = chrono === 'started' ? started : ended;
    if (tracker === 'MyAnimeList' && picker) {
      const picks = picker.split('-');
      picker = picks[1] + '/' + picks[2] + '/' + picks[0];
    }
    if (!picker) return '-';
    const date = new Date(picker);
    if (pick === 'day') return date.toLocaleDateString([], {day: 'numeric'});
    if (pick === 'month') return date.toLocaleDateString([], {month: 'long'});
    if (pick === 'year') return date.toLocaleDateString([], {year: 'numeric'});
    return '-';
  };

  const _renderFirstBlock = (): JSX.Element => {
    const {status, score, progress, totalEpisodes} = props.data!;

    return (
      <View style={styles.tiles.shadowView}>
        <View
          style={[
            styles.tiles.view,
            {backgroundColor: MapTrackingServiceToColors.get(tracker)},
          ]}>
          {IconText('remove-red-eye', status || 'Add to List')}
          {IconText(
            'subscriptions',
            (progress || '-') + ' / ' + (totalEpisodes || '-'),
          )}
          {IconText('star', (!score || score === 0 ? '-' : score).toString())}
        </View>
      </View>
    );
  };

  const _renderSecondBlock = (): JSX.Element => {
    return (
      <View style={styles.tiles.shadowView}>
        <View
          style={[
            styles.tiles.view,
            {
              backgroundColor: MapTrackingServiceToColors.get(tracker),
              alignItems: 'center',
              justifyContent: 'space-around',
            },
          ]}>
          <ThemedText style={{fontSize: 21, fontWeight: '400', color: 'white'}}>
            Started
          </ThemedText>
          <ThemedText style={{fontSize: 20, fontWeight: '600', color: 'white'}}>
            {removeInvalids(dater('month', 'started'))}
          </ThemedText>
          <ThemedText style={{fontSize: 30, fontWeight: '700', color: 'white'}}>
            {removeInvalids(dater('day', 'started'))}
          </ThemedText>
          <ThemedText style={{fontSize: 23, fontWeight: '600', color: 'white'}}>
            {removeInvalids(dater('year', 'started'))}
          </ThemedText>
        </View>
      </View>
    );
  };
  const _renderThirdBlock = (): JSX.Element => {
    return (
      <View style={styles.tiles.shadowView}>
        <View
          style={[
            styles.tiles.view,
            {
              backgroundColor: MapTrackingServiceToColors.get(tracker),
              alignItems: 'center',
              justifyContent: 'space-around',
            },
          ]}>
          <ThemedText style={{fontSize: 21, fontWeight: '400', color: 'white'}}>
            Completed
          </ThemedText>
          <ThemedText style={{fontSize: 20, fontWeight: '600', color: 'white'}}>
            {removeInvalids(dater('month', 'ended'))}
          </ThemedText>
          <ThemedText style={{fontSize: 30, fontWeight: '700', color: 'white'}}>
            {removeInvalids(dater('day', 'ended'))}
          </ThemedText>
          <ThemedText style={{fontSize: 23, fontWeight: '600', color: 'white'}}>
            {removeInvalids(dater('year', 'ended'))}
          </ThemedText>
        </View>
      </View>
    );
  };

  return (
    <View>
      <View style={[styles.tiles.rowView]}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={MapTrackingServiceToAssets.get(tracker)!}
            style={styles.tiles.assetImage}
          />
          <ThemedText style={styles.tiles.rowTitle}>{tracker}</ThemedText>
        </View>
        <Button
          title={'Edit'}
          onPress={props.onManualEdit}
          color={theme.colors.accent}
        />
      </View>
      {props.data ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{paddingVertical: height * 0.02}}>
          {_renderFirstBlock()}
          {_renderSecondBlock()}
          {_renderThirdBlock()}
        </ScrollView>
      ) : (
        emptyResults()
      )}
    </View>
  );
};
export const StatusTiles = memo(_StatusTiles);

const _WatchTile: FC<{
  episode: SimklEpisodes;
  detail: DetailedDatabaseModel;
  onPress: () => void;
  onFollow: (arg0: boolean) => void;
  isFollowing: boolean;
  onPlay: () => void;
  onContinueWatching: () => void;
  onAddAllToQueue: () => void;
  onAddUnwatchedToQueue: () => void;
  onRemoveSavedLink: () => void;
}> = (props) => {
  const theme = useTheme((_) => _.theme);
  const queue = useQueueStore((_) => _.myQueue);
  const queueLength = useQueueStore((_) => _.queueLength);
  const pagerController = createRef<ViewPager>();
  const [index, setIndex] = useState<number>(0);

  const inQueue = (): boolean => {
    if (queue[detail.title]) {
      const match = queue[detail.title].find(
        (i) => i.episode.episode === props.episode.episode,
      );
      if (match) return true;
    }
    return false;
  };

  useEffect(() => {
    if (detail) inQueue();
  }, [queueLength, queue]);

  useEffect(() => {
    pagerController.current?.setPage(0);
  }, []);

  if (!props.episode)
    return (
      <View
        style={{
          height: height * 0.2,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator />
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: '600',
            textAlign: 'center',
            color: 'grey',
          }}>
          Finding your next episode
        </ThemedText>
      </View>
    );

  const {title, episode, img, description} = props.episode;
  const {
    onPress,
    onFollow,
    isFollowing,
    detail,
    onPlay,
    onContinueWatching,
  } = props;

  const OptionsView = (title: string, onPress: () => void) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <ThemedCard
          style={{
            flexDirection: 'row',
            padding: width * 0.05,
            marginHorizontal: width * 0.02,
            backgroundColor: title.startsWith('Remove')
              ? 'red'
              : theme.colors.backgroundColor,
          }}>
          <ThemedText style={{fontWeight: '600'}}>{title}</ThemedText>
        </ThemedCard>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{height: height * 0.38}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <ThemedText style={[styles.card.subTitle, {marginLeft: width * 0.04}]}>
          Watch Next
        </ThemedText>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          }}>
          <FlavoredButtons name={'play'} onPress={onPlay} />
          <FlavoredButtons
            name={isFollowing ? 'bell' : 'bell-outline'}
            onPress={() => {
              onFollow(!isFollowing);
            }}
          />
          <FlavoredButtons
            name={'cog'}
            onPress={() => {
              if (!pagerController.current) return;
              if (index !== 0) {
                setIndex(0);
                pagerController.current.setPage(0);
              } else {
                setIndex(1);
                pagerController.current.setPage(1);
              }
            }}
          />
        </View>
      </View>
      <ViewPager
        style={{height: height * 0.3}}
        showPageIndicator
        initialPage={0}
        ref={pagerController}>
        {detail.lastWatching &&
          detail.lastWatching.progress &&
          detail.lastWatching.progress !== 0 && (
            <View key={'0'}>
              <ContinueWatchingTile
                onPress={onContinueWatching}
                progress={detail.lastWatching.progress}
                title={
                  'Episode ' +
                  detail.lastWatching.data.episode +
                  ' - ' +
                  detail.lastWatching.data.title
                }
                image={detail.lastWatching.data.img}
              />
            </View>
          )}
        {/* //Page One/Two */}
        <View style={styles.tiles.shadowView} key={'1'}>
          <View
            style={[
              styles.watchTile.view,
              {backgroundColor: theme.colors.backgroundColor},
            ]}>
            <View style={styles.watchTile.image}>
              {img ? (
                <DangoImage url={img} style={styles.watchTile.thumbnail} />
              ) : (
                <Image
                  source={require('../../assets/images/icon_round.png')}
                  style={styles.watchTile.thumbnail}
                />
              )}
            </View>
            <View style={styles.watchTile.textView}>
              <ThemedText
                style={styles.watchTile.title}
                numberOfLines={2}
                shouldShrink>
                {title}
              </ThemedText>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <ThemedText style={{color: theme.colors.accent}}>
                  Episode {episode}
                </ThemedText>
                {inQueue() ? (
                  <ThemedText style={{fontWeight: '700', color: 'green'}}>
                    In Queue
                  </ThemedText>
                ) : null}
              </View>
              <ScrollView style={{marginTop: 10}}>
                <ThemedText style={styles.watchTile.desc}>
                  {description ??
                    'No description provided for this anime at this time'}
                </ThemedText>
              </ScrollView>
            </View>
          </View>
          <ThemedButton
            title={'View all episodes'}
            onPress={onPress}
            style={{alignSelf: 'center', marginBottom: 20}}
          />
        </View>

        {/* //Page Two/Three */}
        <View
          key={'2'}
          style={{marginTop: height * 0.02, justifyContent: 'center'}}>
          {OptionsView('Add all to Queue', props.onAddAllToQueue)}
          {/* {OptionsView('Add unwatched to Queue', props.onAddUnwatchedToQueue)} */}
          {OptionsView('Remove saved link', () => {
            Alert.alert(
              'Are you sure?',
              'Removing saved link will allow you to select a new link. This will remove the current "continue watching" and notifications',
              [
                {
                  text: 'Cancel',
                },
                {
                  text: 'Remove',
                  onPress: props.onRemoveSavedLink,
                  style: 'destructive',
                },
              ],
            );
          })}
        </View>
      </ViewPager>
    </View>
  );
};
export const WatchTile = _WatchTile;

export const FlavoredButtons: FC<{
  name: string;
  onPress: () => void;
  size?: number;
}> = (props) => {
  const {size, name, onPress} = props;
  const theme = useTheme((_) => _.theme);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.tiles.shadowView}>
        <View
          style={{
            height: size ?? height * 0.06,
            aspectRatio: 1 / 1,
            borderRadius: (size ?? height * 0.1) / 2,
            backgroundColor: theme.colors.accent,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: width * 0.04,
          }}>
          <Icon
            name={name}
            type={'MaterialCommunityIcons'}
            size={30}
            color={'white'}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const BindTitleBlock: FC<{
  title: string;
  id: number;
}> = (props) => {
  const {title, id} = props;
  const navigation = useNavigation();

  return (
    <ThemedCard style={{marginVertical: width * 0.01, padding: 8}}>
      <View style={{padding: 12}}>
        <ThemedText
          style={{fontWeight: '700', fontSize: 15, textAlign: 'center'}}>
          Bind an anime from a source to Taiyaki to start watching
        </ThemedText>
        <ThemedButton
          title={'Bind An Anime!'}
          onPress={() => navigation.navigate('BindPage', {title, id})}
          style={{alignSelf: 'center', marginVertical: height * 0.014}}
        />
      </View>
    </ThemedCard>
  );
};

const styles = {
  row: StyleSheet.create({
    container: {
      height: height * 0.41,
      width,
      marginVertical: height * 0.01,
    },
    titleView: {
      marginBottom: height * 0.025,
      paddingHorizontal: width * 0.02,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 21,
      fontWeight: 'bold',
    },
    subTitle: {
      fontSize: 14,
      fontWeight: '400',
      color: 'grey',
    },
  }),
  card: StyleSheet.create({
    view: {
      height: height * 0.25,
      width: width * 0.36,
      marginHorizontal: width * 0.02,
    },
    image: {
      height: '94%',
      width: '100%',
      ...Platform.select({
        android: {elevation: 4},
        ios: {
          shadowOpacity: 0.2,
          shadowOffset: {width: 0, height: 1},
          shadowRadius: 6,
          shadowColor: 'black',
        },
      }),
    },
    title: {
      fontSize: 14,
      marginTop: 8,
    },
    subTitle: {
      fontSize: 19,
      fontWeight: '700',
      marginTop: height * 0.01,
      marginBottom: height * 0.01,
    },
  }),
  tiles: StyleSheet.create({
    shadowView: {
      marginBottom: 10,
      ...Platform.select({
        android: {elevation: 4},
        ios: {
          shadowOpacity: 0.2,
          shadowOffset: {width: 0, height: 1},
          shadowRadius: 6,
          shadowColor: 'black',
        },
      }),
    },
    view: {
      borderRadius: 6,
      height: height * 0.21,
      aspectRatio: 1 / 1,
      marginHorizontal: width * 0.02,
    },
    rowView: {
      flexDirection: 'row',
      flex: 1,
      padding: height * 0.01,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    emptyView: {
      flexDirection: 'row',
      width: '95%',
      padding: height * 0.01,
      alignItems: 'center',
    },
    rowTitle: {
      fontSize: 20,
      fontWeight: '700',
      marginHorizontal: width * 0.02,
    },
    assetImage: {
      width: width * 0.1,
      aspectRatio: 1 / 1,
    },
  }),
  watchTile: StyleSheet.create({
    view: {
      flex: 1,
      width: '95%',
      borderRadius: 6,
      overflow: 'hidden',
      flexDirection: 'row',
      height: height * 0.2,
      alignSelf: 'center',
      marginTop: height * 0.01,
      marginBottom: height * 0.02,
    },
    image: {
      width: width * 0.3,
    },
    thumbnail: {
      height: '100%',
      width: '100%',
    },
    textView: {
      paddingHorizontal: width * 0.02,
      flexShrink: 0.9,
    },
    title: {
      fontWeight: '600',
      fontSize: 16,
    },
    desc: {
      color: 'grey',
      fontSize: 12,
    },
  }),
};
