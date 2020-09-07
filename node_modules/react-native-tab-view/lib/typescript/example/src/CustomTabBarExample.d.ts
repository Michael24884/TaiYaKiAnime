import * as React from 'react';
import { NavigationState } from 'react-native-tab-view';
declare type Route = {
    key: string;
    title: string;
    icon: string;
};
declare type State = NavigationState<Route>;
export default class CustomTabBarExample extends React.Component<{}, State> {
    static title: string;
    static backgroundColor: string;
    static tintColor: string;
    static appbarElevation: number;
    static statusBarStyle: "dark-content";
    state: {
        index: number;
        routes: {
            key: string;
            title: string;
            icon: string;
        }[];
    };
    private handleIndexChange;
    private renderItem;
    private renderTabBar;
    private renderScene;
    render(): JSX.Element;
}
export {};
