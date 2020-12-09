import {useNavigation} from '@react-navigation/native';
import React, {createRef, memo, useEffect, useState} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import Dimension from '../../Classes/Dimensions';
import {useAnilistRequest} from '../../Hooks';
import {
  AnilistPagedData,
  AnilistPopularGraph,
  AnilistRecommendationPageEdgeModel,
  AnilistRequestTypes,
  AnilistSeasonalGraph,
  AnilistTrendingGraph,
} from '../../Models/Anilist';
import {useNotificationStore} from '../../Stores/notifications';
import {useTheme} from '../../Stores/theme';
import {MapKeyToPaths, MapRequestsToTitle} from '../../Util';
import {BaseRows, BaseRowsSimple, ThemedSurface} from '../Components';
import {InstagramAvatars} from '../Components/animated';
import {RecCards} from '../Components/list_cards';

const {height, width} = Dimension.size;

const DiscoveryScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme((_) => _.theme);
  const notifications = useNotificationStore((_) => _.notifications);
  const setNotifications = useNotificationStore((_) => _.setNotifications);

  const [data, setData] = useState<AnilistPagedData[]>([]);

  const profileModalize = createRef<Modalize>();
  const {
    query: {data: PopularData},
  } = useAnilistRequest<AnilistPagedData>('Popular', AnilistPopularGraph());
  const {
    query: {data: TrendingData},
  } = useAnilistRequest<AnilistPagedData>('Trending', AnilistTrendingGraph(), {
    refreshInterval: 3600000,
  });
  const {
    query: {data: SeasonalData},
  } = useAnilistRequest<AnilistPagedData>('Seasonal', AnilistSeasonalGraph());

  const canAdd = (type: AnilistRequestTypes): boolean => {
    const exists = data.find((i) => i.type === type);
    return exists === undefined;
  };
  useEffect(() => {
    if (PopularData && canAdd('Popular'))
      setData((list) => list.concat(PopularData));
    if (TrendingData && canAdd('Trending'))
      setData((list) => list.concat(TrendingData));
    if (SeasonalData && canAdd('Seasonal'))
      setData((list) => list.concat(SeasonalData));
    // if (Rec) {
    //   const sheep: AnilistPagedData = {
    //     type: 'User Rec',
    //     data: {
    //       Page: {
    //         pageInfo: Rec.data.Page.pageInfo,
    //         media: [{...Rec.data.Page.recommendations[0].media}],
    //       },
    //     },
    //   };
    //   setData((i) => )
    // }
  }, [PopularData, TrendingData, SeasonalData]);

  const _renderItem = ({item}: {item: AnilistPagedData; index: number}) => {
    const {type} = item;

    if (type === 'User Rec') {
      const newItem: AnilistRecommendationPageEdgeModel = {
        node: {mediaRecommendation: {...item.data.Page.media[0]}},
      };
      return <RecCards items={newItem} />;
    }

    const {title, subTitle} = MapRequestsToTitle.get(type)!;
    return (
      <BaseRows
        title={title}
        subtitle={subTitle}
        data={item as AnilistPagedData}
        type={type}
        path={MapKeyToPaths.get(type)!}
      />
    );
  };

  return (
    <>
      {/* {userProfiles.length > 0 ? (
        <TransitionedProfilesSmall profiles={userProfiles} />
      ) : null} */}
      {/* <FlatList
        style={{backgroundColor: theme.colors.backgroundColor}}
        data={data}
        renderItem={_renderItem}
        keyExtractor={(item) => item.type}
      /> */}
      <ThemedSurface style={{flex: 1}}>
        <ScrollView>
          <InstagramAvatars />

          {notifications.length > 0 && (
            <BaseRowsSimple
              title={'Following'}
              subtitle={"New episodes on anime you're following"}
              data={notifications}
            />
          )}
          {data.map((i) => {
            const {title, subTitle} = MapRequestsToTitle.get(i.type)!;
            return (
              <BaseRows
                key={i.type}
                title={title}
                subtitle={subTitle}
                data={i}
                path={MapKeyToPaths.get(i.type)!}
                type={i.type}
              />
            );
          })}
        </ScrollView>
      </ThemedSurface>
      <Modalize ref={profileModalize} modalHeight={height * 0.6}>
        <View style={{backgroundColor: 'orange'}} />
      </Modalize>
    </>
  );
};

export default memo(DiscoveryScreen);
