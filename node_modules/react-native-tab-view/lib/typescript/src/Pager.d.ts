import * as React from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { Layout, NavigationState, Route, PagerCommonProps, EventEmitterProps } from './types';
export declare type Props<T extends Route> = PagerCommonProps & {
    onIndexChange: (index: number) => void;
    navigationState: NavigationState<T>;
    layout: Layout;
    removeClippedSubviews?: boolean;
    children: (props: EventEmitterProps & {
        position: Animated.Node<number>;
        render: (children: React.ReactNode) => React.ReactNode;
        jumpTo: (key: string) => void;
    }) => React.ReactNode;
    gestureHandlerProps: React.ComponentProps<typeof PanGestureHandler>;
};
declare type ComponentState = {
    enabled: boolean;
    childPanGestureHandlerRefs: React.RefObject<PanGestureHandler>[];
};
export default class Pager<T extends Route> extends React.Component<Props<T>, ComponentState> {
    static defaultProps: {
        swipeVelocityImpact: number;
        springVelocityScale: number;
    };
    state: {
        enabled: boolean;
        childPanGestureHandlerRefs: React.RefObject<PanGestureHandler>[];
    };
    componentDidMount(): void;
    componentDidUpdate(prevProps: Props<T>): void;
    componentWillUnmount(): void;
    static contextType: React.Context<{}>;
    private providerVal;
    private gestureHandlerRef;
    private clock;
    private velocityX;
    private gestureX;
    private gestureState;
    private offsetX;
    private gesturesEnabled;
    private progress;
    private index;
    private nextIndex;
    private lastEnteredIndex;
    private isSwiping;
    private isSwipeGesture;
    private indexAtSwipeEnd;
    private routesLength;
    private layoutWidth;
    private swipeVelocityImpact;
    private springVelocityScale;
    private position;
    private springConfig;
    private timingConfig;
    private initialVelocityForSpring;
    private currentIndexValue;
    private pendingIndexValue;
    private previouslyFocusedTextInput;
    private enterListeners;
    private interactionHandle;
    private jumpToIndex;
    private jumpTo;
    private addListener;
    private removeListener;
    private handleEnteredIndexChange;
    private transitionTo;
    private handleGestureEvent;
    private extrapolatedPosition;
    private toggleEnabled;
    private maybeCancel;
    private translateX;
    private getTranslateX;
    render(): React.ReactNode;
}
export {};
