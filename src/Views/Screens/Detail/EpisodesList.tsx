import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {createRef, FC, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {SimklEpisodes} from '../../../Models/SIMKL';
import {DetailedDatabaseModel, MyQueueModel} from '../../../Models/taiyaki';
import {useQueueStore, useTheme, useUpNextStore} from '../../../Stores';
import {ThemedCard, ThemedSurface, ThemedText} from '../../Components';
import {EpisodeTiles} from '../../Components/list_cards';
import {Modalize} from 'react-native-modalize';

const {height, width} = Dimensions.get('window');

type FilterBlocks = {
  episodes: string;
  data: SimklEpisodes[];
};

interface Props {
  route: {
    params: {
      episodes: SimklEpisodes[];
      database: DetailedDatabaseModel;
      updateRequested: (arg0: boolean) => void;
    };
  };
}

const EpisodesList: FC<Props> = (props) => {
  const {episodes, database} = props.route.params;
  const navigation = useNavigation();
  const [currentEpisode, setEpisode] = useState<number>(
    database.lastWatching?.episode ?? 1,
  );
  const theme = useTheme((_) => _.theme);
  const canUpdate = useRef<boolean>(false);

  const episodeRefs = createRef<Modalize>();

  const addUpNext = useUpNextStore((_) => _.addAll);

  const {queueLength} = useQueueStore();

  const controller = createRef<FlatList<SimklEpisodes>>();

  //const [filterBlocks, setFilterBlocks] = useState<FilterBlocks[]>([]);
  const filterBlocks = useRef<FilterBlocks[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterBlocks>();

  useEffect(() => {
    navigation.setOptions({title: database.title});
    navigation.addListener('beforeRemove', () => {
      props.route.params.updateRequested.call(null, true);
    });
    return () => {};
  }, []);

  useEffect(() => {
    _buildBlocks();
  }, []);

  const _renderItem = ({item, index}: {item: SimklEpisodes; index: number}) => {
    return (
      <EpisodeTiles
        currentEpisode={currentEpisode}
        title={item.title}
        counter={database.totalEpisodes}
        episode={item}
        detail={database}
        onPlay={() => {
          if (queueLength === 0) {
            const next = index + 1;
            if (next <= currentFilter!.data.length) {
              const portion = currentFilter!.data.slice(next);
              addUpNext(portion);
            }
          }
          const episode: MyQueueModel = {
            detail: database,
            episode: item,
          };
          // MOVE TO VIDEO PAGE
          navigation.navigate('Video', {
            episode,
            updateRequested: (newIndex?: number) => {
              if (canUpdate.current === false) canUpdate.current = true;
              if (newIndex) {
                setEpisode(newIndex);
                controller.current?.scrollToItem({
                  animated: true,
                  item:
                    episodes.find((i) => i.episode === newIndex) ??
                    episodes.splice(-1)[0],
                });
              }
            },
          });
        }}
      />
    );
  };

  const _buildBlocks = () => {
    filterBlocks.current = [];
    let i: number = 0,
      chunk = 50;

    let tempItem = filterBlocks.current.slice(0);
    for (i; i < episodes.length; i += chunk) {
      const _data = episodes.slice(i, i + chunk);
      tempItem.push({episodes: `${i + 1}-${i + _data.length}`, data: _data});
    }
    filterBlocks.current = tempItem;
    setCurrentFilter(tempItem[0]);
    AsyncStorage.mergeItem(
      database.ids.anilist!.toString(),
      JSON.stringify({totalAvailableEpisodes: episodes.length}),
    );
  };

  const _renderFilterBlocks = ({item}: {item: FilterBlocks}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setCurrentFilter(item);
          episodeRefs.current?.close();
        }}>
        <View
          style={[
            styles.listView,
            {
              backgroundColor:
                item === currentFilter ? theme.colors.accent : undefined,
            },
          ]}>
          <ThemedText
            style={[
              styles.listViewText,
              {color: item === currentFilter ? 'white' : theme.colors.text},
            ]}>
            {item.episodes}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedSurface style={styles.view}>
      {filterBlocks.current.length > 1 ? (
        <TouchableOpacity onPress={() => episodeRefs.current?.open()}>
          <ThemedCard
            style={[styles.filterRowView, {borderColor: theme.colors.card}]}>
            <ThemedText style={styles.filterRowViewText}>
              Showing episodes • {currentFilter?.episodes ?? 'Loading...'}
            </ThemedText>
          </ThemedCard>
        </TouchableOpacity>
      ) : null}
      <FlatList
        ref={controller}
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText style={styles.text}>Data provided by SIMKL</ThemedText>
          </View>
        }
        data={currentFilter?.data}
        renderItem={_renderItem}
        keyExtractor={(item) => item.episode.toString()}
      />
      <Modalize
        modalStyle={{backgroundColor: theme.colors.backgroundColor}}
        modalHeight={height * 0.6}
        ref={episodeRefs}
        flatListProps={{
          data: filterBlocks.current,
          renderItem: _renderFilterBlocks,
          keyExtractor: (item) => item.episodes,
        }}
      />
    </ThemedSurface>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  filterRowView: {
    height: height * 0.08,
    justifyContent: 'center',
    borderWidth: 1,
    paddingHorizontal: width * 0.03,
    margin: height * 0.02,
    marginBottom: 0,
  },
  filterRowViewText: {
    fontSize: 16,
    fontWeight: '700',
  },
  listView: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.03,
  },
  listViewText: {
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  text: {
    fontWeight: '600',
    fontSize: 12,
  },
});

export default EpisodesList;
