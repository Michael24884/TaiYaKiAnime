import React, {FC, useEffect} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useInifiniteAnilistRequest} from '../../../../Hooks';
import {
  AnilistRecommendationPageEdgeModel,
  AnilistRecommendationPageModel,
} from '../../../../Models/Anilist';
import {ThemedSurface, ThemedText} from '../../../Components';
import {RecCards} from '../../../Components/list_cards';

const {height, width} = Dimensions.get('window');

interface Props {
  route: {params: {id: number}};
}

const RecommendationList: FC<Props> = (props) => {
  const {id} = props.route.params;

  const {
    query: {data, fetchMore, canFetchMore},
    controller,
  } = useInifiniteAnilistRequest<AnilistRecommendationPageModel>(
    'Recommendations',
    id,
  );

  useEffect(() => {
    return () => controller.abort();
  }, []);

  if (!data)
    return (
      <View style={styles.cards.empty}>
        <ActivityIndicator />
      </View>
    );

  const _renderRec = ({item}: {item: AnilistRecommendationPageEdgeModel}) => {
    return <RecCards items={item} />;
  };
  const list: AnilistRecommendationPageEdgeModel[] = ([] as AnilistRecommendationPageEdgeModel[]).concat.apply(
    [],
    data.map((i) => {
      return i.data.Media.recommendations.edges.filter(
        (i) => i.node.mediaRecommendation,
      );
    }),
  );

  return (
    <ThemedSurface>
      <FlatList
        data={list}
        renderItem={_renderRec}
        keyExtractor={(item) => item.node.mediaRecommendation.id.toString()}
        onEndReachedThreshold={0.25}
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

export default RecommendationList;
