import React, {FC, useEffect} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Platform,
  View,
  ActivityIndicator,
} from 'react-native';
import {useInifiniteAnilistRequest} from '../../../../Hooks';
import {
  AnilistCharacterPageEdgeModel,
  AnilistCharacterPageModel,
} from '../../../../Models/Anilist';
import {ThemedSurface, ThemedText} from '../../../Components';
import {CharacterCard} from '../../../Components/list_cards';

const {height, width} = Dimensions.get('window');
interface Props {
  route: {params: {id: number}};
}

const CharacterListScreen: FC<Props> = (props) => {
  const {id} = props.route.params;
  const _renderItem = ({item}: {item: AnilistCharacterPageEdgeModel}) => {
    return <CharacterCard character={item} />;
  };
  const {
    query: {data, fetchMore, canFetchMore},
    controller,
  } = useInifiniteAnilistRequest<AnilistCharacterPageModel>('Character', id);

  useEffect(() => {
    return () => controller.abort();
  }, []);

  if (!data)
    return (
      <View style={styles.cards.empty}>
        <ActivityIndicator />
      </View>
    );
  const list: AnilistCharacterPageEdgeModel[] = ([] as AnilistCharacterPageEdgeModel[]).concat.apply(
    [],
    data.map((i) => {
      if (!i) return {} as AnilistCharacterPageEdgeModel;
      return i?.data.Media.characters.edges ?? [];
    }),
  );

  return (
    <ThemedSurface>
      <FlatList
        data={list}
        renderItem={_renderItem}
        keyExtractor={(item) => item.node.name.full}
        numColumns={3}
        onEndReachedThreshold={0.2}
        onEndReached={() => fetchMore()}
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
  cards: StyleSheet.create({
    empty: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    view: {
      ...Platform.select({
        android: {elevation: 4},
        ios: {
          shadowOffset: {width: 0, height: 2},
          shadowColor: 'black',
          shadowOpacity: 0.25,
          shadowRadius: 5,
        },
      }),
      height: height * 0.25,
      width: width * 0.36,
      marginHorizontal: width * 0.02,
    },
    image: {
      height: '85%',
      width: '100%',
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
  }),
};

export default CharacterListScreen;
