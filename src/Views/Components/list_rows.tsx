/* eslint-disable react-native/no-inline-styles */
import React, {FC} from 'react';
import {Dimensions, Image, Platform, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ThemedSurface} from '.';
import {MyQueueModel} from '../../Models/taiyaki';
import {useTheme} from '../../Stores';
import {ThemedButton, ThemedCard, ThemedText} from './base';
import DangoImage from './image';
import ProgressBar from 'react-native-progress/Bar';

const {height, width} = Dimensions.get('window');

interface ListRowProps {
  image?: string;
  title: string;
  onPress?: () => void;
  bottomComponent?: JSX.Element;
}

export const ListRow: FC<ListRowProps> = (props) => {
  const {image, title, onPress, bottomComponent} = props;
  const theme = useTheme((_) => _.theme);
  return (
    <TouchableOpacity disabled={!onPress} onPress={onPress}>
      <View
        style={[styles.listRow.shadowView, {marginHorizontal: width * 0.0055}]}>
        <ThemedSurface style={[styles.listRow.view]}>
          {image ? (
            <DangoImage url={image} style={styles.listRow.image} />
          ) : (
            <Image
              source={require('../../assets/images/icon_round.png')}
              style={styles.listRow.image}
            />
          )}
          <View style={styles.listRow.textView}>
            <ThemedText style={styles.listRow.title}>{title}</ThemedText>
            {bottomComponent}
          </View>
        </ThemedSurface>
      </View>
    </TouchableOpacity>
  );
};

export const EpisodeSliders: FC<{
  onPress: () => void;
  item: MyQueueModel;
}> = (props) => {
  const {onPress, item} = props;
  const theme = useTheme((_) => _.theme);
  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedCard>
        <View
          style={{
            flexDirection: 'row',
            height: height * 0.12,
            marginHorizontal: 8,
            ...Platform.select({android: {elevation: 3}}),
            backgroundColor: theme.colors.backgroundColor,
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Image
              source={
                item.episode.img !== null
                  ? {uri: item.episode.img}
                  : require('../../assets/images/icon_round.png')
              }
              style={[
                queueStyle.queueItemImage,
                {height: '100%', width: '45%'},
              ]}
            />

            <View
              style={{
                flexDirection: 'column',
                flexShrink: 0.8,
                width: '55%',
                paddingVertical: 6,
              }}>
              <ThemedText
                style={[
                  queueStyle.queueItemNumber,
                  {color: theme.colors.accent},
                ]}>
                Episode {item.episode.episode}
              </ThemedText>
              <ThemedText
                numberOfLines={3}
                shouldShrink
                style={queueStyle.queueItemTitle}>
                {item.episode.title ?? '???'}
              </ThemedText>
            </View>
          </View>
        </View>
      </ThemedCard>
    </TouchableOpacity>
  );
};

export const ContinueWatchingTile: FC<{
  title: string;
  progress: number;
  onPress: () => void;
  image?: string;
}> = (props) => {
  const {title, image, progress, onPress} = props;
  const theme = useTheme((_) => _.theme);
  return (
    <>
      <ListRow
        title={title}
        image={image}
        bottomComponent={
          <View style={styles.continueTile.view}>
            <ThemedText
              style={[styles.continueTile.text, {color: theme.colors.accent}]}>
              {progress.toFixed(2)} % Completed
            </ThemedText>
            <ProgressBar
              color={theme.colors.accent}
              width={width * 0.64}
              progress={progress}
              useNativeDriver
            />
          </View>
        }
      />
      <ThemedButton title={'Continue Watching'} onPress={onPress} />
    </>
  );
};

const styles = {
  continueTile: StyleSheet.create({
    view: {
      width: '100%',
      paddingBottom: 5,
    },
    text: {
      fontSize: 14,
      fontWeight: '400',
      marginBottom: 5,
      alignSelf: 'flex-end',
    },
  }),
  listRow: StyleSheet.create({
    shadowView: {
      ...Platform.select({
        android: {elevation: 4},
        ios: {
          shadowColor: 'black',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.3,
          shadowRadius: 5,
        },
      }),
    },
    view: {
      borderRadius: 6,
      overflow: 'hidden',
      flexDirection: 'row',
      height: height * 0.15,
      margin: width * 0.02,
    },
    image: {
      height: '100%',
      width: '28%',
    },
    textView: {
      paddingVertical: height * 0.005,
      paddingHorizontal: width * 0.02,
      flexShrink: 0.9,
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 15,
      fontWeight: '500',
    },
  }),
};

const queueStyle = StyleSheet.create({
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
    marginLeft: -10,
  },
  queueItemTitle: {
    fontSize: 15,
    fontWeight: '400',
  },
  queueItemNumber: {
    fontSize: 15,
    marginBottom: 4,
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
