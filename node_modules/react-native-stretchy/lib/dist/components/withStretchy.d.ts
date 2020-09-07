import React from 'react';
import { Animated } from 'react-native';
import { StretchyProps } from '../types';
import { UseStretchyOutput } from '../hooks/useStretchy';
export interface WithStretchyProps {
    stretchy: UseStretchyOutput;
}
export declare type StretchyComponentProps<T> = StretchyProps & Omit<Animated.AnimatedProps<T>, 'onScroll'>;
export declare const WithStretchy: <T extends {}>(WrappedComponent: React.FC<StretchyProps & Pick<Animated.AnimatedProps<T>, Exclude<keyof T, "onScroll">> & WithStretchyProps>) => React.FC<StretchyComponentProps<T>>;
