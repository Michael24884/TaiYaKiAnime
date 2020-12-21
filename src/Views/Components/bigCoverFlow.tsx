import { useNavigation } from '@react-navigation/native';
import React, { FC, useEffect, useRef } from 'react';
import { Animated, Easing, Dimensions, StyleSheet, View, ActivityIndicator, Platform } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { useAnilistRequest } from '../../Hooks';
import { AnilistDetailedGraph, Media } from '../../Models/Anilist';
import { useTheme } from '../../Stores';
import { hexToRGBA } from '../../Util';
import { ThemedText } from './base';
import DangoImage from './image';

const {height, width} = Dimensions.get('window');

interface Props {
  id: number;
};

const BigCoverFlow: FC<Props> = (props) => {
    //TODO: Create type
    const {query: {data: dataResult}} = useAnilistRequest<{data: {Media: Media}}>('discordPick', AnilistDetailedGraph(props.id));

    const theme = useTheme((_) => _.theme);
    const controller = useRef(new Animated.Value(0)).current
    const scaleController = useRef(new Animated.Value(0.85)).current;


    const scaleAnimation = Animated.timing(scaleController, {
        toValue: 1,
        duration: 1250,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
    });

    const opacity = Animated.timing(controller, {
        toValue: 1,
        useNativeDriver: true,
        duration: 1200,
        easing: Easing.out(Easing.ease),
    })


    useEffect(() => {
    if (dataResult)
       Animated.stagger(150, [
           opacity,
           scaleAnimation,
       ]).start();
    }, [dataResult]);

    if (!dataResult || !dataResult.data) return <View style={[styles.view, {alignItems: 'center', justifyContent: 'center'}]}><ActivityIndicator /></View>

    const {
        bannerImage,
    } = dataResult.data.Media;
  
  

    return (
            <View style={styles.view}>
            <View>
                <Animated.View style={[styles.imageView, { transform: [{scale: scaleController }], opacity: controller  }]}>
                    <DangoImage url={bannerImage!} style={styles.image}  />
                </Animated.View>
                <LinearGradient style={styles.absolute} colors={[hexToRGBA(theme.colors.backgroundColor, 0.65), 'transparent', hexToRGBA(theme.colors.backgroundColor, 0.9)]} locations={[0.2, 0.6, 0.80]}  />
            </View>
        </View>
    )
}

export const BigCoverFlowText: FC<Props> = (props) => {
    const navigation = useNavigation();
    const theme = useTheme((_) => _.theme);

    const flyController1 = useRef(new Animated.Value(0)).current;
    const flyController2 = useRef(new Animated.Value(0)).current;

  
    const flyTitleAnimation = Animated.timing(flyController1, {
        toValue: 1,
        duration: 1550,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.circle),
    });
    const flyTitleAnimation2 = Animated.timing(flyController2, {
        toValue: 1,
        duration: 1750,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.circle),
    });

    const {query: {data: dataResult}} = useAnilistRequest<{data: {Media: Media}}>('discordPick', AnilistDetailedGraph(props.id));

    useEffect(() => {
        if (dataResult)
           Animated.stagger(175, [
               flyTitleAnimation,
               flyTitleAnimation2,
           ]).start();
        }, [dataResult]);

    if (!dataResult) return null;

    const {
        id,
        title,
        episodes,
        meanScore,
        nextAiringEpisode,
        status,

    } = dataResult.data.Media;

    const transformX = flyController1.interpolate({
        inputRange: [0, 1],
        outputRange: [-500, 0]
    });
    
    const transformX2 = flyController2.interpolate({
        inputRange: [0, 1],
        outputRange: [-500, 0]
    });


    const currentEpisode = nextAiringEpisode ? (nextAiringEpisode.episode === 0 ? 2 : nextAiringEpisode.episode) - 1 : episodes;
    const currentStatus = status[0] + status.slice(1).toLowerCase();
    return (
       <TouchableWithoutFeedback onPress={() => navigation.push('Detail', {id})}>
            <View style={styles.view}>

            <View style={[styles.absolute, {top: null, bottom: 20, paddingHorizontal: 8}]}>
                    <Animated.View style={{transform: [{translateX: transformX}]}}>
                        <ThemedText style={styles.discord}>Highest on Discord</ThemedText>
                        <ThemedText style={styles.title} numberOfLines={2} >{title.romaji}</ThemedText>
                    </Animated.View>
                    <Animated.View style={{transform: [{translateX: transformX2}]}}>
                    <ThemedText numberOfLines={2} shouldShrink >Episode {currentEpisode} • Mean {meanScore}% • {currentStatus}</ThemedText>
                    </Animated.View>
                </View>
        </View>
       </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    view: {
        width,
        height: height * 0.45,
        overflow: 'hidden',
        marginBottom: height * 0.04 
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    imageView: {
        height: '100%',
        width: '100%'
    },
    image: {
        flex: 1,
    },
    discord: {
        color: '#7289d9',
        fontSize: 11,
        fontWeight: '600'
    },
    title: {
        fontSize: 21,
        fontWeight: '800',
    }
});

export default BigCoverFlow;
