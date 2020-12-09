import {useNavigation} from '@react-navigation/native';
import React, {FC, useEffect} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  LogBox,
  StyleSheet,
  View,
} from 'react-native';
import {useInifiniteAnilistRequest} from '../../Hooks';
import {
  AnilistPagedData,
  AnilistRequestTypes,
  Media,
} from '../../Models/Anilist';
import {ListRow, ThemedSurface, ThemedText} from '../Components';
const {height} = Dimensions.get('window');

interface Props {
  route: {params: {key: AnilistRequestTypes; path: string}};
}

LogBox.ignoreLogs(['Encountered two']);

const MoreItemsScreen: FC<Props> = (props) => {
  const {key} = props.route.params;
  const navigation = useNavigation();

  const {
    query: {data, fetchMore, canFetchMore},
    controller,
  } = useInifiniteAnilistRequest<AnilistPagedData>(key);

  useEffect(() => {
    navigation.setOptions({title: key});
    return () => controller.abort();
  }, []);

  const renderItem = ({item}: {item: Media}) => {
    return (
      <ListRow
        image={item.coverImage.extraLarge}
        title={item.title.romaji}
        onPress={() => navigation.push('Detail', {id: item.id})}
      />
    );
  };

  if (!data)
    return (
      <ThemedSurface style={styles.empty.view}>
        <ActivityIndicator />
      </ThemedSurface>
    );

  const list = ([] as Media[]).concat.apply(
    [],
    Array.isArray(data)
      ? data.map((i) => i.data.Page.media)
      : (data as AnilistPagedData).data.Page.media,
  );

  return (
    <ThemedSurface>
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={() => {
          fetchMore();
        }}
        onEndReachedThreshold={0.25}
        ListFooterComponent={
          canFetchMore ? (
            <View style={styles.cards.footerView}>
              <ActivityIndicator />
              <ThemedText style={styles.cards.footerText}>
                Fetching More...
              </ThemedText>
            </View>
          ) : null
        }
      />
    </ThemedSurface>
  );
};

const styles = {
  empty: StyleSheet.create({
    view: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
  cards: StyleSheet.create({
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
  }),
};

export default MoreItemsScreen;
