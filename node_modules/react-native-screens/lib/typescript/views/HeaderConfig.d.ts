import { Route } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '../types';
declare type Props = NativeStackNavigationOptions & {
    route: Route<string>;
};
export default function HeaderConfig({ backButtonImage, backButtonInCustomView, direction, headerBackTitle, headerBackTitleStyle, headerBackTitleVisible, headerCenter, headerHideBackButton, headerHideShadow, headerLargeStyle, headerLargeTitle, headerLargeTitleHideShadow, headerLargeTitleStyle, headerLeft, headerRight, headerShown, headerStyle, headerTintColor, headerTitle, headerTitleStyle, headerTopInsetEnabled, headerTranslucent, route, statusBarAnimation, statusBarHidden, statusBarStyle, title, }: Props): JSX.Element;
export {};
