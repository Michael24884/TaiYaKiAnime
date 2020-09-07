import { Animated, LayoutChangeEvent, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { StretchyOnScroll } from '../types';
export declare type UseOnScrollHandle = (listener?: StretchyOnScroll) => {
    animation: Animated.Value;
    onImageWrapperLayout(event: LayoutChangeEvent): void;
    onScroll(event: NativeSyntheticEvent<NativeScrollEvent>): void;
};
export declare const useOnScrollHandle: UseOnScrollHandle;
