import React from 'react';
import { Animated } from 'react-native';
import { StretchyProps } from '../types';
import { UseStretchyOutput } from '../hooks/useStretchy';
export declare type PropsWithStretchy<P> = P & {
    stretchy: UseStretchyOutput;
};
export declare type StretchyComponentProps<T> = StretchyProps & Omit<Animated.AnimatedProps<T>, 'onScroll'>;
export declare const WithStretchy: <R, P>(WrappedComponent: React.ForwardRefExoticComponent<StretchyProps & Pick<Animated.AnimatedProps<P>, Exclude<keyof P, "onScroll">> & {
    stretchy: UseStretchyOutput;
} & {
    children?: React.ReactNode;
} & React.RefAttributes<R>>) => React.ForwardRefExoticComponent<React.PropsWithoutRef<React.PropsWithChildren<StretchyComponentProps<P>>> & React.RefAttributes<R>>;
