import React, { createRef, useEffect } from 'react';
import  { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ViewPager} from 'react-native-viewpager-carousel'
import { useTheme } from '../../../Stores';
import {OnboardChild1} from './OnboardChildren';
import FastImage from 'react-native-fast-image';

const OnboardScreen = () => {
    const theme = useTheme((_) => _.theme);
    const viewPagerController = createRef<ViewPager>();

    useEffect(() => {
        FastImage.preload([
            {uri: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20918-2InvV6EsOScm.png'},
            {uri: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx21459-oZMZ7JwS5Sxq.jpg'},
            {uri: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx114446-H6uxjVi8wBoo.jpg'},
        ])
    }, [])

    const _renderPage = ({_pageIndex} : {_pageIndex: number}) => {
        switch(_pageIndex) {
            case 0: return <OnboardChild1 onNextButton={() => {viewPagerController.current?.scrollToIndex(1)}} />;
            case 1: return <OnboardChild1 onNextButton={() => {viewPagerController.current?.scrollToIndex(0)}} />;
            default: return null;
        }
    }

    return (
        <View style={{flex: 1, backgroundColor: theme.colors.backgroundColor}}>
            <ViewPager 
            ref={viewPagerController}
            renderAsCarousel={false}
            lazyrender={true}
            lazyrenderThreshold={0}
            scrollEnabled={false}
            data={[0, 1]}
            renderPage={_renderPage}
        />
        </View>
        
    );
}


const styles = StyleSheet.create({
    image: {
        height: '100%',
        width: '100%',
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    }
})

export default OnboardScreen;
