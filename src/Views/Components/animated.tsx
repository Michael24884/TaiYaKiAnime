/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {FC, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Easing,
  StyleSheet,
  View,
  Animated,
  FlatList,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {TaiyakiUserModel} from '../../Models/taiyaki';
import {useUserProfiles} from '../../Stores';
import {useTheme} from '../../Stores/theme';
import {ThemedSurface, ThemedText} from './base';
import {Avatars} from './image';

type Marker = {
  image: string;
  name: string;
  source: string;
};

const {height, width} = Dimensions.get('window');

const marker: Marker[] = [];

export const GroupedProfileBadges = () => {
  const profiles = useUserProfiles((_) => _.profiles);

  if (profiles.length === 0) return null;
  return (
    <View style={{flexDirection: 'row'}}>
      <View>
        {profiles.slice(0, 3).map((i, index) => (
          <View
            key={index.toString()}
            style={{position: 'absolute', left: 16 * index, marginLeft: 10}}>
            <Avatars url={i.profile.image} key={index.toString()} size={35} />
          </View>
        ))}
        {profiles.length > 3 ? (
          <View
            key={'4'}
            style={{position: 'absolute', left: 16 * 3, marginLeft: 10}}>
            <Avatars url={profiles.length - 3 + '+'} key={'4'} size={35} />
          </View>
        ) : null}
      </View>
    </View>
  );
};

export const InstagramAvatars = () => {
  const profiles = useUserProfiles((_) => _.profiles);
  const theme = useTheme((_) => _.theme);
  const controller = useRef(new Animated.Value(0.5)).current;
  const navigation = useNavigation();

  useEffect(() => {
    if (profiles.length > 0)
      Animated.spring(controller, {
        useNativeDriver: true,
        tension: 169,
        friction: 6,
        velocity: 9,
        toValue: 1,
      }).start();
  }, [profiles]);

  if (profiles.length === 0) return null;

  const _renderItem = ({
    item,
    index,
  }: {
    item: TaiyakiUserModel;
    index: number;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.source === 'Anilist')
            navigation.navigate('AnilistProfile', {tracker: 'Anilist'});
          else if (item.source === 'MyAnimeList')
            navigation.navigate('MyAnimeListProfile', {tracker: 'MyAnimeList'});
          else navigation.navigate('SimklProfile', {tracker: 'SIMKL'});
        }}>
        <View
          style={{
            height: height * 0.14,
            width: width * 0.25,
            marginHorizontal: width * 0.03,
            marginLeft: index === 0 ? width * 0.06 : undefined,
          }}>
          <Animated.View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              transform: [{scale: controller}],
            }}>
            <Avatars
              url={item.profile.image}
              size={height * 0.085}
              borderWidth={2}
              borderColor={theme.colors.primary}
            />
            <ThemedText
              numberOfLines={1}
              shouldShrink
              style={{textAlign: 'center', color: 'grey', marginTop: 5}}>
              {item.source}
            </ThemedText>
          </Animated.View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <ThemedSurface
      style={{width: '100%', height: height * 0.15, paddingTop: 8}}>
      <FlatList
        horizontal
        data={profiles}
        showsHorizontalScrollIndicator={false}
        renderItem={_renderItem}
        keyExtractor={(item) => item.source}
      />
    </ThemedSurface>
  );
};

export const TransitionedProfilesSmall: FC<{profiles: TaiyakiUserModel[]}> = (
  props,
) => {
  const {profiles} = props;
  const theme = useTheme((_) => _.theme);
  const entranceController = useRef(new Animated.Value(0)).current;
  const textController = useRef(new Animated.Value(0)).current;

  const [currentIndex, setIndex] = useState<number>(0);
  let currentMarker: TaiyakiUserModel = profiles[currentIndex];

  let timer = useRef<NodeJS.Timeout>();

  const Animate = () => {
    Animated.sequence([
      Animated.timing(entranceController, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.timing(textController, {
        useNativeDriver: true,
        toValue: 1,
        duration: 1250,
        easing: Easing.inOut(Easing.circle),
      }),
      Animated.timing(textController, {
        useNativeDriver: true,
        toValue: 0,
        duration: 1250,
        easing: Easing.inOut(Easing.circle),
        delay: 5000,
      }),
      Animated.timing(entranceController, {
        toValue: 2,
        duration: 1500,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start(_onEnd);
  };

  const AnimateSingle = () => {
    Animated.sequence([
      Animated.timing(entranceController, {
        toValue: 1,
        duration: 1500,
        delay: 250,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.timing(textController, {
        useNativeDriver: true,
        toValue: 1,
        duration: 1250,
        easing: Easing.inOut(Easing.circle),
      }),
    ]).start();
  };

  const intoStyle = entranceController.interpolate({
    inputRange: [0, 1],
    outputRange: [150, 0],
  });

  const textStyle = textController.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [-250, 0, 250],
  });

  const _onEnd = () => {
    entranceController.setValue(0);
    setIndex((indx) => {
      if (indx + 1 > marker.length - 2) return 0;
      return indx + 1;
    });
  };

  //   useEffect(() => {
  //     current
  //   }, [currentIndex])

  //TOOD: Requires crash fix on profile dependency!
  useEffect(() => {
    if (profiles.length === 1) AnimateSingle();
    if (profiles.length > 1) {
      Animate();
      timer.current = setInterval(Animate, 9500);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      style={[
        styles.smallTransition.view,
        {backgroundColor: theme.colors.backgroundColor},
      ]}>
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            transform: [
              {
                translateY: intoStyle,
              },
            ],
          },
        ]}>
        <Avatars url={currentMarker.profile?.image} size={55} />
        <View style={{overflow: 'hidden'}}>
          <Animated.View
            style={[
              styles.smallTransition.nameView,
              {transform: [{translateX: textStyle}]},
            ]}>
            <ThemedText style={styles.smallTransition.sourceName}>
              {currentMarker.source}
            </ThemedText>
            <ThemedText style={styles.smallTransition.username}>
              {currentMarker.profile?.username ?? '???'}
            </ThemedText>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = {
  smallTransition: StyleSheet.create({
    view: {
      height: height * 0.08,
      width,
      padding: width * 0.01,
      alignItems: 'center',
      flexDirection: 'row',
      shadowColor: 'black',
      shadowOpacity: 0.25,
      shadowOffset: {width: 0, height: 1},
      shadowRadius: 5,
    },
    nameView: {
      paddingHorizontal: width * 0.03,
    },
    sourceName: {
      fontSize: 13,
      fontWeight: '300',
      color: 'grey',
    },
    username: {
      fontSize: 15,
      fontWeight: '700',
    },
  }),
};
