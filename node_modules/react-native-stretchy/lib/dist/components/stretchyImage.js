import React, { useMemo } from 'react';
import { View } from 'react-native';
import { AnimatedImageBackground } from './animatedImageBackground';
import { stretchyImageStyles as styles } from './styles';
export const StretchyImage = ({ animation, image, imageResizeMode, imageWrapperStyle, imageHeight, imageOverlay, onLayout, }) => {
    const transformStyles = useMemo(() => ({
        transform: [
            {
                translateY: animation.interpolate({
                    inputRange: [-imageHeight, 0, imageHeight],
                    outputRange: [imageHeight / 2, 0, -imageHeight / 2],
                }),
            },
            {
                scale: animation.interpolate({
                    inputRange: [-imageHeight, 0, imageHeight],
                    outputRange: [2, 1, 1],
                }),
            },
        ],
    }), [animation, imageHeight]);
    return (React.createElement(View, { style: [imageWrapperStyle, styles.wrapper, { height: imageHeight }], onLayout: onLayout },
        React.createElement(AnimatedImageBackground, { source: image || {}, resizeMode: imageResizeMode, style: [styles.animatedImageBackground, transformStyles] }, Boolean(imageOverlay) && imageOverlay)));
};
