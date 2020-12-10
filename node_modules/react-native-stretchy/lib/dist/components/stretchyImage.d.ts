import React from 'react';
import { Animated, LayoutChangeEvent } from 'react-native';
import { StretchyProps } from '../types';
export interface StretchyImageProps extends Omit<StretchyProps, 'backgroundColor' | 'foreground' | 'onScroll'> {
    animation: Animated.Value;
    imageHeight: number;
    onLayout(event: LayoutChangeEvent): void;
}
export declare const StretchyImage: React.FC<StretchyImageProps>;
