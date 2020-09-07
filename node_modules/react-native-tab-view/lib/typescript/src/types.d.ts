import Animated from 'react-native-reanimated';
export declare type Route = {
    key: string;
    icon?: string;
    title?: string;
    accessible?: boolean;
    accessibilityLabel?: string;
    testID?: string;
};
export declare type Event = {
    defaultPrevented: boolean;
    preventDefault(): void;
};
export declare type Scene<T extends Route> = {
    route: T;
};
export declare type NavigationState<T extends Route> = {
    index: number;
    routes: T[];
};
export declare type Layout = {
    width: number;
    height: number;
};
export declare type Listener = (value: number) => void;
export declare type SceneRendererProps = {
    layout: Layout;
    position: Animated.Node<number>;
    jumpTo: (key: string) => void;
};
export declare type EventEmitterProps = {
    addListener: (type: 'enter', listener: Listener) => void;
    removeListener: (type: 'enter', listener: Listener) => void;
};
export declare type PagerCommonProps = {
    keyboardDismissMode: 'none' | 'on-drag' | 'auto';
    swipeEnabled: boolean;
    swipeVelocityImpact?: number;
    onSwipeStart?: () => void;
    onSwipeEnd?: () => void;
    springVelocityScale?: number;
    springConfig: {
        damping?: number;
        mass?: number;
        stiffness?: number;
        restSpeedThreshold?: number;
        restDisplacementThreshold?: number;
    };
    timingConfig: {
        duration?: number;
    };
};
