import type { Adaptable } from '../types';
export declare enum Extrapolate {
    EXTEND = "extend",
    CLAMP = "clamp",
    IDENTITY = "identity"
}
export interface InterpolationConfig {
    inputRange: ReadonlyArray<Adaptable<number>>;
    outputRange: ReadonlyArray<Adaptable<number>>;
    extrapolate?: Extrapolate;
    extrapolateLeft?: Extrapolate;
    extrapolateRight?: Extrapolate;
}
export default function interpolate(value: Adaptable<number>, { inputRange, outputRange, extrapolate, extrapolateLeft, extrapolateRight, }: InterpolationConfig): any;
