import React from 'react';
import { View, Animated } from 'react-native';
import { commonStyles as styles } from './styles';
import { WithStretchy, } from './withStretchy';
const StretchySectionList = ({ foreground, imageHeight, onScroll, stretchy, style, ...otherProps }) => (React.createElement(Animated.SectionList, Object.assign({}, otherProps, { style: [style, styles.contentContainer], scrollEventThrottle: 1, onScroll: stretchy.onScroll, ListHeaderComponent: React.createElement(View, { style: [
            styles.foregroundContainer,
            { height: imageHeight || stretchy.heightBasedOnRatio },
        ] }, foreground) })));
export default WithStretchy(StretchySectionList);
