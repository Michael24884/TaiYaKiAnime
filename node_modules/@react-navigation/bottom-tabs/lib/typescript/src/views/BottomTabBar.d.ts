/// <reference types="react" />
import { Animated, StyleProp, ViewStyle } from 'react-native';
import { TabNavigationState, ParamListBase } from '@react-navigation/native';
import { EdgeInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps, LabelPosition } from '../types';
declare type Props = BottomTabBarProps & {
    activeTintColor?: string;
    inactiveTintColor?: string;
};
declare type Options = {
    state: TabNavigationState<ParamListBase>;
    layout: {
        height: number;
        width: number;
    };
    dimensions: {
        height: number;
        width: number;
    };
    tabStyle: StyleProp<ViewStyle>;
    labelPosition: LabelPosition | undefined;
    adaptive: boolean | undefined;
};
export declare const getTabBarHeight: ({ dimensions, insets, style, ...rest }: Options & {
    insets: EdgeInsets;
    style: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
}) => number;
export default function BottomTabBar({ state, navigation, descriptors, activeBackgroundColor, activeTintColor, adaptive, allowFontScaling, inactiveBackgroundColor, inactiveTintColor, keyboardHidesTabBar, labelPosition, labelStyle, iconStyle, safeAreaInsets, showLabel, style, tabStyle, }: Props): JSX.Element;
export {};
