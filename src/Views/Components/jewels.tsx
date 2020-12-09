/* eslint-disable react-native/no-inline-styles */
// import {useNavigation} from '@react-navigation/native';
// import React, {FC, useEffect, useRef, useState} from 'react';
// import {isTablet} from 'react-native-device-info';
// import {
//   Dimensions,
//   StyleSheet,
//   View,
//   Animated,
//   Easing,
//   Image,
//   Platform,
//   Modal,
//   LayoutAnimation,
//   LayoutAnimationConfig,
// } from 'react-native';
// import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
// import {
//   ActivityIndicator,
//   Avatar,
//   Button,
//   IconButton,
//   ProgressBar,
//   Surface,
//   Text,
//   useTheme,
// } from 'react-native-paper';
// import {QueryStatus} from 'react-query';

import {useNavigation} from '@react-navigation/native';
import React, {FC, useState, useEffect} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {ThemedSurface} from '.';
import {WatchingStatus} from '../../Models';
import {useTheme} from '../../Stores';
import {ThemedText} from './base';

const {height, width} = Dimensions.get('window');

// import {useDimension} from '../Util/store';
// import {TaiyakiImage} from './taiyaki_view';
// import TaiyakiRSSParser from '../Classes/parser';
// import Icon from 'react-native-dynamic-vector-icons';

// export const JewelShowcase: FC<{images: string[]}> = (props) => {
//   const data: string[] = [];

//   const _renderItem = ({item, index}: {item: string; index: number}) => {
//     return <View />;
//   };

//   const offset = {
//     x: Dimensions.get('window').width * 0.045,
//     y: Dimensions.get('window').height * 0.06,
//   };

//   return (
//     <View style={styles.shadow}>
//       <View style={[styles.container, {backgroundColor: 'blue'}]}>
//         <FlatList
//           scrollEnabled={false}
//           data={data}
//           renderItem={_renderItem}
//           numColumns={5}
//           keyExtractor={(i) => i}
//           contentOffset={offset}
//           style={{
//             transform: [{rotateZ: '343deg'}],
//             overflow: 'visible',
//           }}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   shadow: {
//     shadowColor: 'black',
//     shadowOffset: {width: 0, height: 1},
//     shadowOpacity: 0.35,
//     shadowRadius: 5,
//   },
//   container: {
//     alignSelf: 'center',
//     width: '95%',
//     overflow: 'hidden',
//     height: Dimensions.get('window').height * 0.2,
//     borderRadius: 12,
//   },
//   floatingView: {
//     height: Dimensions.get('window').height * 0.15,
//     width: Dimensions.get('window').width * 0.25,
//     backgroundColor: 'orange',
//   },
//   floatingImage: {
//     height: '100%',
//     width: '100%',
//   },
//   floatingShadow: {
//     shadowColor: 'black',
//     shadowOffset: {width: 0, height: 1},
//     shadowOpacity: 0.6,
//     shadowRadius: 5,
//   },
// });

export const JewelStatusPreviewCards: FC<{
  status: WatchingStatus;
  itemCount: number;
  images: string[];
  onTap: () => void;
}> = (props) => {
  const {status, images, itemCount, onTap} = props;

  const [image, setImage] = useState<string[]>(images);

  useEffect(() => {
    if (image.length > 3) setImage((i) => i.slice(0, 3));

    if (image.length < 3) {
      for (let im of images) {
        setImage((i) => [...i, im]);
      }
    }
  }, [image]);

  const theme = useTheme((_) => _.theme);
  return (
    <TouchableOpacity onPress={onTap}>
      <View
        style={[
          stylesPreview.view,
          {
            height: height * 0.2,
            width: width * 0.6,
            backgroundColor: theme.colors.backgroundColor,
          },
        ]}>
        <View style={{height: '25%'}}>
          <ThemedText style={stylesPreview.statusTitle}>{status}</ThemedText>
          <ThemedText
            style={[
              stylesPreview.statusTitle,
              {fontSize: 12, color: theme.colors.accent},
            ]}>
            {itemCount} items
          </ThemedText>
        </View>
        <View
          style={{
            flexWrap: 'wrap',
            width: '100%',
            flexDirection: 'row',
            height: '75%',
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          {image.map((i, index) => (
            <Image
              source={{uri: i}}
              style={{
                height: '80%',
                width: '30%',
                marginRight: 5,
                marginLeft: index === 0 ? 5 : 0,
              }}
              key={index.toString()}
            />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const stylesPreview = StyleSheet.create({
  view: {
    borderRadius: 6,

    paddingVertical: 5,
    margin: 8,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 4,
    shadowOpacity: 0.2,
    ...Platform.select({
      android: {elevation: 3},
    }),
  },
  statusTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

// export const JewelFriendsDetailed: FC<{
//   anilistID: number;
//   currentEpisode: number;
// }> = (props) => {
//   const {anilistID, currentEpisode} = props;
//   const navigation = useNavigation();
//   const {width, height} = useDimension();
//   const theme = useTheme();
//   const [friendsExpanded, setFriendsExpanded] = useState<boolean>(false);

//   const {
//     query: {data: anilistFriends, status},
//   } = useAnilistQuery<AnilistFriendsDetailed>(
//     [`anilist_friends+${anilistID}`],
//     `query{Page(page:1,perPage:25){pageInfo{total perPage currentPage lastPage hasNextPage}mediaList(mediaId:${anilistID},isFollowing:true,sort:UPDATED_TIME_DESC){id status score progress completedAt{day, month, year} user{id name avatar{large}mediaListOptions{scoreFormat}}}}}`,
//   );

//   if (status === QueryStatus.Error || !anilistFriends) return null;

//   if (status === QueryStatus.Loading || !anilistFriends)
//     <Surface
//       style={[
//         stylesJF.surface,
//         {justifyContent: 'center', alignItems: 'center'},
//       ]}>
//       <ActivityIndicator />
//     </Surface>;

//   const {mediaList, pageInfo} = anilistFriends.data.Page;
//   if (mediaList.length <= 1) return null;

//   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//   const list =
//     mediaList.length >= 6
//       ? mediaList.slice(0, 6)
//       : mediaList.slice(0, mediaList.length);

//   const percentage = () =>
//     (mediaList.filter((i) => i.progress === currentEpisode).length /
//       mediaList.length) *
//     100;

//   const divide = (value: number) => {
//     if (currentEpisode > 0) return value / currentEpisode;
//     else return 0;
//   };

//   const _renderItem = ({
//     item,
//   }: {
//     item: {
//       id: number;
//       status: string;
//       score: number;
//       progress: number;
//       completedAt: {
//         day: number;
//         month: number;
//         year: number;
//       };
//       user: {
//         id: number;
//         name: string;
//         avatar: {
//           large: string;
//         };
//       };
//     };
//   }) => {
//     return (
//       <TouchableOpacity
//         onPress={() => {
//           setFriendsExpanded(false);
//           navigation.navigate('ProfileHost', {
//             id: item.user.id,
//             tracker: 'Anilist',
//           });
//         }}>
//         <ThemedSurface
//           style={{
//             flexDirection: 'row',
//             height: height * 0.15,
//             paddingRight: 8,
//             marginBottom: 8,
//             borderRadius: 6,
//             marginHorizontal: 4,
//           }}>
//           <Image
//             source={{uri: item.user.avatar.large}}
//             style={{
//               height: '100%',
//               width: width * 0.23,
//               borderBottomLeftRadius: 6,
//               borderTopLeftRadius: 6,
//             }}
//           />
//           <View
//             style={{
//               padding: 8,
//               flex: 1,
//               justifyContent: 'space-between',
//             }}>
//             <View style={{flex: 1, justifyContent: 'space-between'}}>
//               <ThemedText style={stylesJF.modalUsername}>{item.user.name}</ThemedText>
//               <ThemedText
//                 style={{alignSelf: 'flex-end', fontSize: 13, color: 'grey'}}>
//                 {item.completedAt.day
//                   ? new Date(
//                       `${item.completedAt.month}/${item.completedAt.day}/${item.completedAt.year}`,
//                     ).toLocaleDateString([], {
//                       month: 'long',
//                       day: 'numeric',
//                       year: 'numeric',
//                     })
//                   : ' '}
//               </ThemedText>
//             </View>
//             <View>
//               <ProgressBar
//                 style={{height: height * 0.02}}
//                 progress={divide(item.progress)}
//               />
//               <View
//                 style={{
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   right: 0,
//                   bottom: 0,
//                 }}>
//                 <ThemedText style={{alignSelf: 'center'}}>
//                   Progress: Ep {item.progress}
//                 </ThemedText>
//               </View>
//             </View>
//           </View>
//         </ThemedSurface>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <>
//       {/* <Modal
//         visible={friendsExpanded}
//         onRequestClose={() => setFriendsExpanded(false)}
//         hardwareAccelerated
//         presentationStyle={'formSheet'}
//         animationType={'slide'}>
//         <View style={{flex: 1, backgroundColor: theme.colors.background}}>
//           <FlatList
//             data={mediaList}
//             renderItem={_renderItem}
//             keyExtractor={(item) => item.id.toString()}
//           />
//           <IconButton
//             style={{position: 'absolute', top: 5, right: 5}}
//             icon={'close'}
//             size={35}
//             onPress={() => setFriendsExpanded(false)}
//           />
//         </View>
//       </Modal> */}
//       <TouchableOpacity onPress={() => setFriendsExpanded(true)}>
//         <Surface
//           style={[
//             stylesJF.surface,
//             {height: isTablet() ? height * 0.13 : height * 0.15, padding: 8},
//           ]}>
//           <Text style={stylesJF.friendsText}>Following</Text>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               marginTop: 10,
//               alignContent: 'flex-end',
//               paddingHorizontal: 8,
//             }}>
//             <View
//               style={{
//                 flexWrap: 'wrap',
//                 flexDirection: 'row',
//                 height: height * 0.07,
//                 justifyContent: 'center',
//               }}>
//               {list.map((i, index) => (
//                 <Avatar.Image
//                   key={i.id.toString()}
//                   source={{uri: i.user.avatar.large}}
//                   size={isTablet() ? 75 : 45}
//                   style={{
//                     marginRight: width * 0.05,
//                     position: 'absolute',
//                     left: 25 * index,
//                   }}
//                 />
//               ))}
//             </View>
//             <Text style={[stylesJF.totalText, {marginBottom: height * 0.03}]}>
//               + {pageInfo.total.toLocaleString()} total
//             </Text>
//           </View>
//           <Text style={stylesJF.statusText}>
//             {percentage().toFixed(0)}% have seen Episode {currentEpisode}
//           </Text>
//         </Surface>
//       </TouchableOpacity>
//     </>
//   );
// };

// const stylesJF = StyleSheet.create({
//   surface: {
//     borderRadius: 6,
//     width: '95%',
//     alignSelf: 'center',
//   },
//   friendsText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginLeft: 8,
//   },
//   totalText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     alignSelf: 'flex-end',
//   },
//   statusText: {
//     width: '100%',
//     textAlign: 'center',
//     color: 'grey',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   modalUsername: {
//     fontSize: 18,
//     fontWeight: '600',
//   },
// });

// export const JewelsRssNews = () => {
//   const {height, width} = useDimension();
//   const navigation = useNavigation();
//   const [feeds, setFeeds] = useState<TaiyakiRSSModel[]>([]);

//   const url = 'https://myanimelist.net/rss/news.xml';
//   useEffect(() => {
//     fetcher();
//   }, []);

//   const fetcher = async () => {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     new TaiyakiRSSParser(url).fetchRSS().then(setFeeds);
//   };

//   const renderItem = ({item}: {item: TaiyakiRSSModel}) => {
//     return (
//       <TouchableOpacity
//         onPress={() => navigation.navigate('NewsDetailed', {link: item.link})}>
//         <View
//           style={[
//             feedStyles.blocks,
//             {height: height * 0.25, width: width * 0.6},
//           ]}>
//           <Image
//             resizeMode={'cover'}
//             resizeMethod={'scale'}
//             source={
//               item.image ? {uri: item.image} : require('../Assets/icon.png')
//             }
//             style={{height: '100%', width: '100%'}}
//           />
//           <View
//             style={[feedStyles.overhead, {backgroundColor: 'rgba(0,0,0,0.45)'}]}
//           />
//           <Text
//             style={[
//               feedStyles.overhead,
//               {
//                 color: 'white',
//                 top: undefined,
//                 bottom: 8,
//                 padding: 6,
//                 fontSize: 18,
//                 fontWeight: '700',
//               },
//             ]}>
//             {item.title}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <Surface
//       style={{
//         height: height * 0.35,
//         width,
//       }}>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'flex-end',
//           marginBottom: 8,
//           paddingRight: 4,
//         }}>
//         <Text style={[feedStyles.text, {marginLeft: 8}]}>News</Text>
//         <View>
//           <Button>See All</Button>
//         </View>
//       </View>
//       <FlatList
//         data={feeds.length >= 8 ? feeds.slice(0, 8) : feeds}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.link}
//         horizontal
//         ListEmptyComponent={
//           <View
//             style={{
//               flex: 1,
//               width,
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             <Icon
//               name={'newspaper'}
//               type={'MaterialCommunityIcons'}
//               size={35}
//               color={'grey'}
//             />
//             <Text
//               style={{
//                 marginTop: 8,
//                 color: 'grey',
//                 fontSize: 17,
//                 fontWeight: 'bold',
//                 textAlign: 'center',
//               }}>
//               Could not fetch news
//             </Text>
//           </View>
//         }
//       />
//       <Text
//         style={{
//           fontSize: 12,
//           color: 'grey',
//           fontWeight: '300',
//           alignSelf: 'flex-end',
//           marginBottom: 2,
//           marginRight: 5,
//         }}>
//         Provided by MyAnimeList
//       </Text>
//     </Surface>
//   );
// };

// const feedStyles = StyleSheet.create({
//   blocks: {
//     borderRadius: 6,
//     margin: 8,
//     overflow: 'hidden',
//   },
//   text: {
//     fontSize: 20,
//     fontWeight: '700',
//     marginTop: 20,
//   },
//   overhead: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
// });

// type AiringInnerModel = {
//   id: number;
//   episode: number;
//   airingAt: number;
//   media: {
//     title: {romaji: string};
//     id: number;
//     isAdult: boolean;
//     coverImage: {
//       extraLarge: string;
//     };
//   };
// };
// export const JewelsCalendar = () => {
//   const {height, width} = useDimension();
//   const theme = useTheme();
//   const [selectedDate, setDate] = useState<Date>(new Date());

//   const {
//     query: {data},
//   } = useInfinityAnilist<AnilistAiringFull>(
//     ['schedule_full'],
//     `airingSchedules(sort:[TIME], airingAt_greater:$date){ airingAt episode media{isAdult id title{romaji} coverImage{extraLarge} }}}`,
//     '($date: Int)',
//     `variables: {date:${(Date.now() / 1000).toFixed(0)}}`,
//   );

//   const renderItem = ({item}: {item: AiringInnerModel}) => {
//     return <Surface></Surface>;
//   };

//   if (!data)
//     return (
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <ActivityIndicator />
//       </View>
//     );

//   const list: AiringInnerModel[] = ([] as AiringInnerModel[]).concat.apply(
//     [],
//     data.map((group) => {
//       if (!group) return {} as AiringInnerModel;
//       return group.data.Page.airingSchedules;
//     }),
//   );

//   console.log(list[0].media.title.romaji);

//   return (
//     <View style={{flex: 1, backgroundColor: 'orange'}}>
//       <CalendarStrip
//         scrollable
//         style={{
//           height: height * 0.2,
//           width: '100%',
//           paddingTop: height * 0.06,
//         }}
//         highlightDateNameStyle={{color: 'white'}}
//         highlightDateNumberStyle={{color: 'white'}}
//         calendarColor={theme.colors.primary}
//         calendarAnimation={{duration: 500, type: 'parallel'}}
//         startingDate={new Date()}
//         selectedDate={selectedDate}
//         onDateSelected={setDate}
//       />
//       <FlatList data={list} renderItem={renderItem} style={{flex: 1}} />
//     </View>
//   );
// };
