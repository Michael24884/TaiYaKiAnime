import React, { useMemo } from 'react';
import { Animated, View, Dimensions } from 'react-native';
import { commonStyles as styles } from './styles';
import { WithStretchy, } from './withStretchy';
const WINDOW_HEIGHT = Dimensions.get('window').height;
const StretchyScrollView = ({ backgroundColor, children, foreground, imageHeight, onScroll, stretchy, style, ...otherProps }) => {
    const contentMinHeight = useMemo(() => stretchy.heightBasedOnRatio
        ? WINDOW_HEIGHT - stretchy.heightBasedOnRatio
        : 0, [stretchy.heightBasedOnRatio]);
    return (React.createElement(Animated.ScrollView, Object.assign({}, otherProps, { style: [style, styles.contentContainer], scrollEventThrottle: 1, onScroll: stretchy.onScroll }),
        React.createElement(View, { style: [
                styles.foregroundContainer,
                { height: imageHeight || stretchy.heightBasedOnRatio },
            ] }, foreground),
        React.createElement(View, { style: {
                backgroundColor,
                minHeight: contentMinHeight,
            } }, children)));
};
export default WithStretchy(StretchyScrollView);
