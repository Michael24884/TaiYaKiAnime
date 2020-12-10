/// <reference types="react" />
import { DefaultNavigatorOptions, StackRouterOptions, StackNavigationState } from '@react-navigation/native';
import type { StackNavigationConfig, StackNavigationOptions, StackNavigationEventMap } from '../types';
declare type Props = DefaultNavigatorOptions<StackNavigationOptions> & StackRouterOptions & StackNavigationConfig;
declare function StackNavigator({ initialRouteName, children, screenOptions, ...rest }: Props): JSX.Element;
declare const _default: <ParamList extends Record<string, object | undefined>>() => import("@react-navigation/native").TypedNavigator<ParamList, StackNavigationState<Record<string, object | undefined>>, StackNavigationOptions, StackNavigationEventMap, typeof StackNavigator>;
export default _default;
