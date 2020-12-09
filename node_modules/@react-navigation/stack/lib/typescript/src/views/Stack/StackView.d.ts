import * as React from 'react';
import { StackNavigationState, Route, ParamListBase } from '@react-navigation/native';
import type { StackNavigationHelpers, StackNavigationConfig, StackDescriptorMap } from '../../types';
declare type Props = StackNavigationConfig & {
    state: StackNavigationState<ParamListBase>;
    navigation: StackNavigationHelpers;
    descriptors: StackDescriptorMap;
};
declare type State = {
    routes: Route<string>[];
    previousRoutes: Route<string>[];
    previousDescriptors: StackDescriptorMap;
    openingRouteKeys: string[];
    closingRouteKeys: string[];
    replacingRouteKeys: string[];
    descriptors: StackDescriptorMap;
};
export default class StackView extends React.Component<Props, State> {
    static getDerivedStateFromProps(props: Readonly<Props>, state: Readonly<State>): {
        routes: Route<string, object | undefined>[];
        previousRoutes: Route<string, object | undefined>[];
        descriptors: StackDescriptorMap;
        previousDescriptors: StackDescriptorMap;
        openingRouteKeys?: undefined;
        closingRouteKeys?: undefined;
        replacingRouteKeys?: undefined;
    } | {
        routes: (Readonly<{
            key: string;
            name: string;
        }> & Readonly<{
            params?: object | undefined;
        }> & {
            state?: Readonly<{
                key: string;
                index: number;
                routeNames: string[];
                history?: unknown[] | undefined;
                routes: (Readonly<{
                    key: string;
                    name: string;
                }> & Readonly<{
                    params?: object | undefined;
                }> & any)[];
                type: string;
                stale: false;
            }> | import("@react-navigation/native").PartialState<Readonly<{
                key: string;
                index: number;
                routeNames: string[];
                history?: unknown[] | undefined;
                routes: (Readonly<{
                    key: string;
                    name: string;
                }> & Readonly<{
                    params?: object | undefined;
                }> & any)[];
                type: string;
                stale: false;
            }>> | undefined;
        })[];
        previousRoutes: (Readonly<{
            key: string;
            name: string;
        }> & Readonly<{
            params?: object | undefined;
        }> & {
            state?: Readonly<{
                key: string;
                index: number;
                routeNames: string[];
                history?: unknown[] | undefined;
                routes: (Readonly<{
                    key: string;
                    name: string;
                }> & Readonly<{
                    params?: object | undefined;
                }> & any)[];
                type: string;
                stale: false;
            }> | import("@react-navigation/native").PartialState<Readonly<{
                key: string;
                index: number;
                routeNames: string[];
                history?: unknown[] | undefined;
                routes: (Readonly<{
                    key: string;
                    name: string;
                }> & Readonly<{
                    params?: object | undefined;
                }> & any)[];
                type: string;
                stale: false;
            }>> | undefined;
        })[];
        previousDescriptors: StackDescriptorMap;
        openingRouteKeys: string[];
        closingRouteKeys: string[];
        replacingRouteKeys: string[];
        descriptors: StackDescriptorMap;
    };
    state: State;
    private getGesturesEnabled;
    private getPreviousRoute;
    private renderScene;
    private renderHeader;
    private handleOpenRoute;
    private handleCloseRoute;
    private handleTransitionStart;
    private handleTransitionEnd;
    private handleGestureStart;
    private handleGestureEnd;
    private handleGestureCancel;
    render(): JSX.Element;
}
export {};
