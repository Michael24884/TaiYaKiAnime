import {useNavigation} from '@react-navigation/native';
import React, {FC, memo, useState} from 'react';
import {
  Dimensions,
  Image,
  LayoutAnimation,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  AnilistCharacterPageEdgeModel,
  AnilistRecommendationPageEdgeModel,
  AnilistRecommendationPageModel,
} from '../../Models/Anilist';
import {SimklEpisodes} from '../../Models/SIMKL';
import {DetailedDatabaseModel, MyQueueModel} from '../../Models/taiyaki';
import {useSettingsStore, useTheme} from '../../Stores';
import {useQueueStore} from '../../Stores/queue';
import {TaiyakiParsedText, ThemedCard, ThemedText} from './base';
import DangoImage from './image';
import {FlavoredButtons} from './rows';

const {height, width} = Dimensions.get('window');

export const CharacterCard: FC<{character: AnilistCharacterPageEdgeModel}> = (
  props,
) => {
  const {
    character: {role, node},
  } = props;

  return (
    <View style={styles.cards.view}>
      <View style={styles.cards.shadow}>
        <DangoImage url={node.image.large} style={styles.cards.image} />
      </View>
      <ThemedText style={styles.cards.role}>{role}</ThemedText>
      <ThemedText numberOfLines={2} style={styles.cards.name}>
        {node.name.full}
      </ThemedText>
    </View>
  );
};

export const RecCards: FC<{items: AnilistRecommendationPageEdgeModel}> = (
  props,
) => {
  const theme = useTheme((_) => _.theme);
  const {
    coverImage,
    title,
    id,
    bannerImage,
    description,
  } = props.items.node.mediaRecommendation;

  const [expanded, setExpanded] = useState<boolean>(false);
  const navigation = useNavigation();

  return (
    <ThemedCard
      style={{
        height:
          expanded || (description?.length ?? 0) < 85
            ? undefined
            : height * 0.46,
      }}>
      <>
        {bannerImage ? (
          <DangoImage url={bannerImage} style={styles.rec.banner} />
        ) : (
          <Image
            source={require('../../assets/images/icon_round.png')}
            style={styles.rec.banner}
          />
        )}
        <View
          style={[styles.rec.absolute, {backgroundColor: 'rgba(0,0,0, 0.25)'}]}
        />
      </>
      <View style={styles.rec.textView}>
        <View style={[styles.rec.imageView, styles.rec.shadow]}>
          <DangoImage url={coverImage.extraLarge} style={styles.rec.image} />
        </View>
        <View style={{padding: 6, flexShrink: 0.8}}>
          <ThemedText style={styles.rec.title} shouldShrink numberOfLines={3}>
            {title.romaji}
          </ThemedText>
        </View>
      </View>
      <View style={{flex: 1, padding: 8}}>
        <TaiyakiParsedText
          color={theme.colors.text}
          style={{}}
          numberOfLines={expanded ? undefined : 4}>
          {description ?? 'No description for this anime at this time'}
        </TaiyakiParsedText>
        <View
          style={{
            alignItems: 'flex-end',
            flex: 1,
            justifyContent: 'flex-end',
            flexDirection: 'row',
            marginTop: 4,
          }}>
          <FlavoredButtons
            size={40}
            name={'page-next'}
            onPress={() => navigation.push('Detail', {id})}
          />
          {(description?.length ?? 0) > 85 ? (
            <FlavoredButtons
              size={40}
              name={expanded ? 'arrow-up' : 'arrow-down'}
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                setExpanded((ex) => !ex);
              }}
            />
          ) : null}
        </View>
      </View>
    </ThemedCard>
  );
};

const _EpisodeTiles: FC<{
  episode: SimklEpisodes;
  onPlay: () => void;
  title: string;
  counter: number;
  detail: DetailedDatabaseModel;
  currentEpisode: number;
}> = (props) => {
  const {episode, onPlay, detail, currentEpisode} = props;
  const {title} = detail;
  const isBlurred = useSettingsStore((_) => _.settings.general.blurSpoilers);

  const [hidden, setHidden] = useState<boolean>(isBlurred);
  const [descExpanded, setExpanded] = useState<boolean>(false);
  const theme = useTheme((_) => _.theme);

  const {addToQueue} = useQueueStore((_) => _);

  const queue = useQueueStore((_) => _.myQueue);
  const inList: boolean =
    queue[title] &&
    queue[title].find((i) => i.episode.episode === episode.episode) !==
      undefined;

  return (
    <ThemedCard style={styles.tiles.view}>
      {hidden && currentEpisode < episode.episode ? (
        <TouchableOpacity
          onLongPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );
            setHidden(false);
          }}>
          <View style={{height: height * 0.25}}>
            <Image
              source={require('../../assets/images/icon_round.png')}
              style={styles.rec.image}
              fadeDuration={1250}
            />
            <View
              style={[
                styles.tiles.absolute,
                {backgroundColor: 'rgba(0,0,0,0.56)'},
              ]}
            />
            <View
              style={[
                styles.tiles.absolute,
                {justifyContent: 'center', alignItems: 'center'},
              ]}>
              <ThemedText
                style={[
                  styles.tiles.episodeNumber,
                  {color: theme.colors.accent},
                ]}>
                Episode {episode.episode}
              </ThemedText>
              <ThemedText
                style={[styles.tiles.episodeNumber, {color: 'white'}]}>
                Long press to reveal
              </ThemedText>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <View>
          {
            <DangoImage
              url={episode.img ? episode.img : detail.coverImage}
              style={styles.tiles.image}
            />
          }
          <View style={styles.tiles.textView}>
            <ThemedText
              style={[
                styles.tiles.episodeNumberReveal,
                {color: theme.colors.accent},
              ]}>
              Episode {episode.episode}
            </ThemedText>
            <ThemedText
              numberOfLines={
                !episode.description ||
                descExpanded ||
                (episode.description?.length ?? 0) < 650
                  ? undefined
                  : 1
              }
              style={[
                styles.tiles.episodeTitle,
                {color: theme.colors.primary},
              ]}>
              {episode.title}
            </ThemedText>
            {inList ? (
              <ThemedText style={styles.tiles.queueMarker}>In Queue</ThemedText>
            ) : null}
            <ThemedText
              style={styles.tiles.desc}
              numberOfLines={descExpanded ? undefined : 3}>
              {episode.description ??
                'No description provided for this episode at this time'}
            </ThemedText>
            <View
              style={{
                flexDirection: 'row',
                padding: 8,
                justifyContent: 'space-between',
                alignItems: 'flex-end',

                flex: 1,
              }}>
              {episode.description?.length ?? 0 > 650 ? (
                <FlavoredButtons
                  size={40}
                  name={descExpanded ? 'arrow-up' : 'arrow-down'}
                  onPress={() => {
                    LayoutAnimation.configureNext(
                      LayoutAnimation.Presets.easeInEaseOut,
                    );
                    setExpanded((ex) => !ex);
                  }}
                />
              ) : (
                <View />
              )}
              <View
                style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                <FlavoredButtons name={'play'} onPress={onPlay} />
                <FlavoredButtons
                  name={inList ? 'playlist-remove' : 'playlist-plus'}
                  onPress={() => {
                    LayoutAnimation.configureNext(
                      LayoutAnimation.Presets.easeInEaseOut,
                    );
                    const queueModel: MyQueueModel = {detail, episode};
                    addToQueue({key: title, data: queueModel});
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      )}
    </ThemedCard>
  );
};

export const EpisodeTiles = memo(_EpisodeTiles);

const styles = {
  tiles: StyleSheet.create({
    view: {
      width: width * 0.95,
      alignSelf: 'center',
    },
    absolute: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    queueMarker: {
      color: 'green',
      fontWeight: '700',
      fontSize: 13,
    },
    image: {
      height: height * 0.25,
      width: '100%',
    },
    episodeNumber: {
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    textView: {
      padding: 8,
    },
    episodeNumberReveal: {
      fontSize: 15,
      fontWeight: '400',
    },
    episodeTitle: {
      fontSize: 19,
      fontWeight: '600',
    },
    desc: {
      color: 'grey',
      fontSize: 14,
      fontWeight: '400',
      marginTop: 5,
    },
  }),
  rec: StyleSheet.create({
    view: {},
    textView: {
      flexDirection: 'row',
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
    },
    absolute: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      height: height * 0.18,
    },
    shadow: {
      ...Platform.select({
        android: {elevation: 4},
        ios: {
          shadowOffset: {width: 0, height: 2},
          shadowColor: 'black',
          shadowOpacity: 0.25,
          shadowRadius: 5,
        },
      }),
    },
    banner: {
      width: '100%',
      height: height * 0.18,
      borderTopRightRadius: 6,
      borderTopLeftRadius: 6,
    },
    imageView: {
      marginTop: -height * 0.08,
      marginLeft: width * 0.02,
      height: height * 0.17,
      width: '30%',
    },
    image: {
      height: '100%',
      width: '100%',
    },
  }),
  cards: StyleSheet.create({
    empty: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    role: {
      color: 'grey',
      fontWeight: '300',
      fontSize: 12,
      marginTop: 4,
    },
    name: {
      fontSize: 15,
      fontWeight: '400',
    },
    view: {
      height: height * 0.27,
      flex: 1 / 3,
      marginHorizontal: width * 0.01,
      marginVertical: height * 0.01,
    },
    shadow: {
      ...Platform.select({
        android: {elevation: 4},
        ios: {
          shadowOffset: {width: 0, height: 2},
          shadowColor: 'black',
          shadowOpacity: 0.25,
          shadowRadius: 5,
        },
      }),
      height: '70%',
      width: '100%',
    },
    image: {
      height: '100%',
      width: '100%',
    },
  }),
};
