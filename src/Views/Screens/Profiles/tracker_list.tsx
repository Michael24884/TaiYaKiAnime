/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {FC, useEffect, useState} from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {QueryCache} from 'react-query';
import {
  TaiyakiUserListModel,
  TrackingServiceTypes,
  WatchingStatus,
} from '../../../Models';
import {useTheme} from '../../../Stores';
import {ThemedCard, ThemedSurface, ThemedText} from '../../Components';
import {SearchBar} from '../../Components/searchBar';

interface Props {
  route: {
    params: {
      tracker: TrackingServiceTypes;
      isLoading: boolean;
      list: TaiyakiUserListModel[];
    };
  };
}
const {width, height} = Dimensions.get('window');

const TrackerList: FC<Props> = (props) => {
  const {tracker, isLoading, list} = props.route.params;
  const navigation = useNavigation();

  const [userList, setUserList] = useState<TaiyakiUserListModel[]>([]);

  const [searchFilter, setSearchFilter] = useState<string>('');

  const theme = useTheme((_) => _.theme);
  useEffect(() => {
    if (searchFilter.length === 0) {
      setUserList([]);
    } else {
      const reg = new RegExp(searchFilter, 'gi');
      const match = list.filter((i) => i.title.match(reg));
      if (match.length > 0) setUserList(match);
    }
  }, [searchFilter]);

  useEffect(() => {
    if (list.length > 0) {
      navigation.setOptions({
        title: list[0].status,
      });
    }
  }, []);

  // const refill = () => {
  // 	if (tracker === "SIMKL") {
  // 		setIsLoading(false);
  // 		setUserList(flattenSimkl());
  // 	} else if (tracker === "Anilist" && aniResponder.query.data) {
  // 		setIsLoading(false);
  // 		const list = aniResponder.query.data as AnilistUserListBase;
  // 		const userList = list.data.MediaListCollection.lists;
  // 	} else if (tracker === "MyAnimeList" && malResponder.query.data) {
  // 		setIsLoading(false);
  // 		const list = malResponder.query.data;
  // 		setUserList(flattenMal(list.data));
  // 	}
  // };

  // const flattenMal = (_data: MyAnimeListUserList[]): MyListModel[] => {
  // 	const item: MyListModel[] = _data.map((i) => ({
  // 		id: i.node.id,
  // 		image: i.node.main_picture?.large ?? i.node.main_picture.medium,
  // 		title: i.node.title,
  // 		tracker: "MyAnimeList",
  // 		progress: i.node.my_list_status.num_episodes_watched ?? 0,
  // 		score: i.node.my_list_status?.score ?? 0,
  // 		totalEpisodes: i.node.num_episodes,
  // 		status: StringToWatchStatus.get(i.node.my_list_status.status)!,
  // 	}));
  // 	return item;
  // };

  // const flattenSimkl = (): MyListModel[] => {
  // 	const item: MyListModel[] = simklList.map((i) => ({
  // 		id: Number(i.show.ids.mal),
  // 		image: simklThumbnailCreator(i.show.poster, true),
  // 		title: i.show.title,
  // 		tracker: "SIMKL",
  // 		progress: i.watched_episodes_count,
  // 		score: i.user_rating,
  // 		totalEpisodes: i.total_episodes_count,
  // 		status: StringToWatchStatus.get(i.status) ?? "Add to List",
  // 	}));
  // 	return item;
  // };

  const _progress = (
    watched: number | undefined,
    total: number | undefined,
  ): number => {
    let numerator: number = 0;
    let denominator: number = 1;
    if (watched) numerator = watched;
    if (total) denominator = total;
    return numerator / denominator;
  };

  const _renderItem = ({item}: {item: TaiyakiUserListModel}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (tracker === 'Anilist') {
            navigation.push('Detail', {
              id: item.ids.anilist,
            });
          } else if (tracker === 'MyAnimeList' || tracker === 'SIMKL') {
            navigation.push('Detail', {
              malID: item.ids.mal,
            });
          }
        }}>
        <ThemedCard style={[styles.view]}>
          <Image
            source={{uri: item.coverImage}}
            style={[
              styles.image,
              {
                height: height * 0.15,
                width: width * 0.24,
              },
            ]}
          />
          <View
            style={{
              padding: 8,
              flexShrink: 0.8,
              justifyContent: 'space-between',
              width: '100%',
              paddingHorizontal: 8,
            }}>
            <ThemedText numberOfLines={2} style={styles.title}>
              {item.title}
            </ThemedText>
            <View>
              <View />
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                  paddingBottom: 5,
                }}>
                <ThemedText>{`${item.progress ?? '??'} / ${
                  item.totalEpisodes ?? '??'
                }`}</ThemedText>
                {item.score && item.score !== 0 ? (
                  <ThemedText>{`${item.score ?? '-'}`}</ThemedText>
                ) : null}
              </View>
              {/* <ProgressBar
                progress={_progress(item.progress, item.totalEpisodes)}
              /> */}
            </View>
          </View>
        </ThemedCard>
      </TouchableOpacity>
    );
  };

  // const _refresh = async () => {
  // 	await cache.invalidateQueries(["my_anilist_list", "my_mal_list"]);
  // 	if (tracker === "SIMKL") {
  // 		simklFetcher(user.simkl!.bearerToken!, true);
  // 		setLocalList(simklCachedStore((_) => _.simklList));
  // 	} else if (tracker === "Anilist")
  // 		aniResponder.query.refetch().then((d) => (aniResponder.query.data = d));
  // 	else if (tracker === "MyAnimeList")
  // 		malResponder.query.refetch().then((d) => (malResponder.query.data = d));
  // };

  const _flatList = (status: WatchingStatus) => (
    <FlatList
      scrollEnabled={false}
      data={
        userList.length === 0
          ? tracker === 'SIMKL'
            ? list.reverse()
            : list
          : userList
      }
      renderItem={_renderItem}
      keyExtractor={(item) => item.title}
    />
  );

  return (
    <ThemedSurface style={{flex: 1}}>
      <SearchBar
        onSubmit={setSearchFilter}
        onClear={() => setSearchFilter('')}
        placeholder={'Find an anime in your list'}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
        {!isLoading || tracker === 'SIMKL' ? (
          <>{_flatList(list[0].status)}</>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator />
          </View>
        )}
      </ScrollView>
    </ThemedSurface>
  );
};

const styles = StyleSheet.create({
  view: {
    borderRadius: 6,
    flexDirection: 'row',
    paddingRight: 8,
    marginHorizontal: 8,
    height: height * 0.15,
  },
  image: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    height: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TrackerList;
