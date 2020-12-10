import { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
export declare type UseStretchyAnimation = (listener?: (offsetY: number) => void) => {
    animation: Animated.Value;
    onAnimationEvent: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};
export declare const useStretchyAnimation: UseStretchyAnimation;
