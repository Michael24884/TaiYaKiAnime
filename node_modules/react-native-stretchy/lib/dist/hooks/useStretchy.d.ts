import { Animated, NativeSyntheticEvent, NativeScrollEvent, LayoutChangeEvent } from 'react-native';
import { StretchyImage, StretchyOnScroll } from '../types';
export declare type UseStretchyOutput = {
    animation: Animated.Value;
    heightBasedOnRatio: number;
    onScroll(event: NativeSyntheticEvent<NativeScrollEvent>): void;
    onImageWrapperLayout(event: LayoutChangeEvent): void;
};
export declare type UseStretchy = (config: {
    image?: StretchyImage;
    scrollListener?: StretchyOnScroll;
}) => UseStretchyOutput;
export declare const useStretchy: UseStretchy;
