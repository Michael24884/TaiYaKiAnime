import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { Props as TabBarProps } from './TabBar';
import { Layout, NavigationState, Route, SceneRendererProps, PagerCommonProps } from './types';
import { Props as ChildProps } from './Pager';
export declare type Props<T extends Route> = PagerCommonProps & {
    position?: Animated.Value<number>;
    onIndexChange: (index: number) => void;
    navigationState: NavigationState<T>;
    renderScene: (props: SceneRendererProps & {
        route: T;
    }) => React.ReactNode;
    renderLazyPlaceholder: (props: {
        route: T;
    }) => React.ReactNode;
    renderTabBar: (props: SceneRendererProps & {
        navigationState: NavigationState<T>;
    }) => React.ReactNode;
    tabBarPosition: 'top' | 'bottom';
    initialLayout?: {
        width?: number;
        height?: number;
    };
    lazy: boolean;
    lazyPreloadDistance: number;
    removeClippedSubviews?: boolean;
    sceneContainerStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    gestureHandlerProps: React.ComponentProps<typeof PanGestureHandler>;
    renderPager: (props: ChildProps<T>) => React.ReactNode;
};
declare type State = {
    layout: Layout;
};
export default class TabView<T extends Route> extends React.Component<Props<T>, State> {
    static defaultProps: {
        tabBarPosition: string;
        renderTabBar: <P extends Route>(props: TabBarProps<P>) => JSX.Element;
        renderLazyPlaceholder: () => null;
        keyboardDismissMode: string;
        swipeEnabled: boolean;
        lazy: boolean;
        lazyPreloadDistance: number;
        removeClippedSubviews: boolean;
        springConfig: {};
        timingConfig: {};
        gestureHandlerProps: {};
        renderPager: (props: ChildProps<any>) => JSX.Element;
    };
    state: {
        layout: {
            width: number;
            height: number;
        };
    };
    private jumpToIndex;
    private handleLayout;
    render(): JSX.Element;
}
export {};
