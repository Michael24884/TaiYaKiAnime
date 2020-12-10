import React from 'react';
import { View } from 'react-native';
import { commonStyles } from './styles';
import { StretchyImage } from './stretchyImage';
import { useStretchy } from '../hooks/useStretchy';
export const WithStretchy = (WrappedComponent) => {
    const EnhancedComponent = React.forwardRef((props, ref) => {
        const { backgroundColor, image, imageOverlay, imageHeight, imageWrapperStyle, imageResizeMode, onScroll, } = props;
        const stretchy = useStretchy({
            image,
            scrollListener: onScroll,
        });
        return (React.createElement(View, { style: [commonStyles.container, { backgroundColor }] },
            React.createElement(StretchyImage, { image: image, imageResizeMode: imageResizeMode, imageWrapperStyle: imageWrapperStyle, animation: stretchy.animation, imageHeight: imageHeight || stretchy.heightBasedOnRatio, imageOverlay: imageOverlay, onLayout: stretchy.onImageWrapperLayout }),
            React.createElement(WrappedComponent, Object.assign({}, props, { stretchy: stretchy, ref: ref }))));
    });
    return EnhancedComponent;
};
