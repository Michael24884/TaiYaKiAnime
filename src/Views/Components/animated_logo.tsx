import React, { FC, useEffect, useRef } from 'react';
import { Animated, Image, ImageProps, ImageStyle, StyleProp } from 'react-native';
import { Easing } from 'react-native-reanimated';

interface AnimatedLogoProps {
    height: number;
    duration?: number;
    delay?: number;
    style?: StyleProp<ImageStyle>;
 }

export const AnimatedLogo: FC<AnimatedLogoProps> = (props) => {
    const {height, style, duration, delay} = props;

    const controller = useRef(new Animated.Value(0)).current;

    const rotateY = controller.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg']
    })
    

    useEffect(() => {
        Animated.timing(controller, {
            toValue: 1,
            useNativeDriver: true,
            duration: duration ?? 1250,
            delay: delay ?? 500,
            easing: Easing.out(Easing.circle)
        }).start()
    }, []);

    return (
        <Animated.Image 
        source={require('../../assets/images/icon_round.png')}
        style={[{height, backfaceVisibility: 'hidden', aspectRatio: 1 / 1, transform: [{rotateY}]}, style]}
        />
    )
};
