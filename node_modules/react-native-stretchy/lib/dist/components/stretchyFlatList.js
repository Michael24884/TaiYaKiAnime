import React from 'react';
import { View, Animated } from 'react-native';
import { commonStyles as styles } from './styles';
import { WithStretchy, } from './withStretchy';
const StretchyFlatList = ({ foreground, imageHeight, onScroll, stretchy, style, ...otherProps }) => (React.createElement(Animated.FlatList, Object.assign({}, otherProps, { style: [style, styles.contentContainer], scrollEventThrottle: 1, onScroll: stretchy.onScroll, ListHeaderComponent: React.createElement(View, { style: [
            styles.foregroundContainer,
            { height: imageHeight || stretchy.heightBasedOnRatio },
        ] }, foreground) })));
export default WithStretchy(StretchyFlatList);
