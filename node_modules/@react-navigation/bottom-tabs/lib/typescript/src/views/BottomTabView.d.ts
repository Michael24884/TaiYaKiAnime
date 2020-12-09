import * as React from 'react';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import type { BottomTabNavigationConfig, BottomTabDescriptorMap, BottomTabNavigationHelpers } from '../types';
declare type Props = BottomTabNavigationConfig & {
    state: TabNavigationState<ParamListBase>;
    navigation: BottomTabNavigationHelpers;
    descriptors: BottomTabDescriptorMap;
};
declare type State = {
    loaded: string[];
    tabBarHeight: number;
};
export default class BottomTabView extends React.Component<Props, State> {
    static defaultProps: {
        lazy: boolean;
    };
    static getDerivedStateFromProps(nextProps: Props, prevState: State): {
        loaded: string[];
    };
    constructor(props: Props);
    private renderTabBar;
    private handleTabBarHeightChange;
    render(): JSX.Element;
}
export {};
