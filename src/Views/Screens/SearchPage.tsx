import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Modal,
} from 'react-native';
import Icon from 'react-native-dynamic-vector-icons';
import {useInifiniteAnilistRequest} from '../../Hooks';
import {
  AnilistSearchModel,
  AnilistSeasonsTypes,
  AnilistSortTypes,
  AnilistSourceTypes,
  AnilistStatusTypes,
  Media,
} from '../../Models/Anilist';
import {ListRow, ThemedButton, ThemedText} from '../Components';
import {SearchBar} from '../Components/searchBar';
import RNPickerSelect from 'react-native-picker-select';
import {useTheme} from '../../Stores';

const sortArray: AnilistSortTypes[] = [
  'FAVOURITES_DESC',
  'POPULARITY_DESC',
  'SCORE_DESC',
  'TITLE_ROMAJI',
  'TRENDING_DESC',
];

const seasonArray: AnilistSeasonsTypes[] = [
  'WINTER',
  'SUMMER',
  'FALL',
  'SPRING',
];

const statusArray: AnilistStatusTypes[] = [
  'FINISHED',
  'AIRING',
  'NOT_YET_RELEASED',
];

const sourceArray: AnilistSourceTypes[] = [
  'ANIME',
  'DOUJINSHI',
  'LIGHT_NOVEL',
  'MANGA',
  'NOVEL',
  'ORIGINAL',
  'OTHER',
  'VIDEO_GAME',
  'VISUAL_NOVEL',
];

const {height, width} = Dimensions.get('window');
const SearchPage = () => {
  const [query, setQuery] = useState<string>('');
  const navigation = useNavigation();
  const [filterVisible, setFilterVisibility] = useState<boolean>(false);

  //Filters
  const [sort, setSort] = useState<AnilistSortTypes>();
  const [season, setSeason] = useState<AnilistSeasonsTypes>();
  const [year, setYear] = useState<number>();
  const [status, setStatus] = useState<AnilistStatusTypes>();
  const [source, setSource] = useState<AnilistSourceTypes>();

  const {
    query: {data, isLoading, isFetched, refetch},
    controller,
  } = useInifiniteAnilistRequest<AnilistSearchModel>('Search', undefined, {
    query,
    filters: {sort, season, year, source, status},
  });

  const theme = useTheme((_) => _.theme);
  useEffect(() => {
    return () => controller.abort();
  }, []);

  const _renderItem = ({item}: {item: Media}) => {
    return (
      <ListRow
        image={item.coverImage.extraLarge}
        title={item.title.romaji}
        onPress={() => navigation.navigate('Detail', {id: item.id})}
      />
    );
  };

  const range = (start: number, stop: number) => {
    let a = [start],
      b = start;
    while (b < stop) a.push((b += 1));
    return a;
  };

  let list: Media[] = ([] as Media[]).concat.apply(
    [],
    data && query.length > 0 ? data.map((i) => i.data?.Page?.media) : [],
  );
  const filterSheet = () => {
    return (
      <View
        style={[
          styles.view,
          {
            justifyContent: 'space-between',
            backgroundColor: theme.colors.card,
          },
        ]}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              padding: 18,
            }}>
            <Icon
              name={'close'}
              type={'MaterialCommunityIcons'}
              size={25}
              color={'red'}
              onPress={() => setFilterVisibility(false)}
            />
          </View>
          <View style={styles.filterView}>
            <ThemedText style={styles.filterTitle}>Sort</ThemedText>
            <RNPickerSelect
              value={sort}
              onValueChange={(value) => setSort(value)}
              items={sortArray.map((i) => ({label: i, value: i}))}
            />
          </View>
          <View style={styles.filterView}>
            <ThemedText style={styles.filterTitle}>Season</ThemedText>
            <RNPickerSelect
              value={season}
              onValueChange={(value) => setSeason(value)}
              items={seasonArray.map((i) => ({label: i, value: i}))}
            />
          </View>
          <View style={styles.filterView}>
            <ThemedText style={styles.filterTitle}>Year</ThemedText>
            <RNPickerSelect
              value={year}
              onValueChange={(value) => setYear(value)}
              items={range(1940, 2021)
                .map((i) => ({
                  label: i.toString(),
                  value: i,
                }))
                .reverse()}
            />
          </View>
          <View style={styles.filterView}>
            <ThemedText style={styles.filterTitle}>Status</ThemedText>
            <RNPickerSelect
              value={status}
              onValueChange={(value) => setStatus(value)}
              items={statusArray.map((i) => ({label: i, value: i}))}
            />
          </View>
          <View style={styles.filterView}>
            <ThemedText style={styles.filterTitle}>Source</ThemedText>
            <RNPickerSelect
              value={source}
              onValueChange={(value) => setSource(value)}
              items={sourceArray.map((i) => ({label: i, value: i}))}
            />
          </View>
        </View>

        <View style={{marginBottom: height * 0.04}}>
          <ThemedButton
            title={'FIlter'}
            onPress={() => {
              setFilterVisibility(false);
              refetch();
            }}
          />
          <ThemedButton
            title={'clear'}
            color={'red'}
            onPress={() => {
              setSort(undefined);
              setYear(undefined);
              setSource(undefined);
              setStatus(undefined);
              setSeason(undefined);
              setFilterVisibility(false);
              refetch();
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <>
      <Modal
        visible={filterVisible}
        hardwareAccelerated
        presentationStyle={'formSheet'}
        onRequestClose={() => setFilterVisibility(false)}
        animationType={'slide'}>
        {filterSheet()}
      </Modal>
      <View style={[styles.view, {backgroundColor: theme.colors.card}]}>
        <View style={styles.searchBar}>
          <SearchBar
            style={{width: width * 0.82, marginRight: 15}}
            onSubmit={setQuery}
            onClear={() => setQuery('')}
          />
          <Icon
            name={'filter-menu'}
            type={'MaterialCommunityIcons'}
            size={30}
            onPress={() => setFilterVisibility((v) => !v)}
          />
        </View>
        {isLoading && query?.length !== 0 ? (
          <View style={styles.empty}>
            <ActivityIndicator />
          </View>
        ) : isFetched && list.length === 0 ? (
          <View style={styles.empty}>
            <Icon
              name={'error'}
              type={'MaterialIcons'}
              size={height * 0.09}
              color={'red'}
            />
            <ThemedText style={styles.noResults}>No results found</ThemedText>
          </View>
        ) : (
          <FlatList
            style={{flex: 1}}
            data={list}
            renderItem={_renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  noResults: {
    fontSize: 18,
    fontWeight: '600',
    color: 'grey',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerView: {
    height: height * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'grey',
    marginTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  filterView: {
    paddingHorizontal: width * 0.05,
    marginVertical: height * 0.02,
  },
  filterTitle: {
    fontSize: 21,
    fontWeight: '600',
  },
  filterText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SearchPage;
