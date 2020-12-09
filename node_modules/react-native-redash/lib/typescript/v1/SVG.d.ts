import Animated from "react-native-reanimated";
export interface PathInterpolationConfig {
    inputRange: readonly Animated.Adaptable<number>[];
    outputRange: readonly (ReanimatedPath | string)[];
    extrapolate?: Animated.Extrapolate;
    extrapolateLeft?: Animated.Extrapolate;
    extrapolateRight?: Animated.Extrapolate;
}
export interface ReanimatedPath {
    totalLength: number;
    segments: {
        start: number;
        end: number;
        p0x: number;
        p3x: number;
    }[];
    length: number[];
    start: number[];
    end: number[];
    p0x: number[];
    p0y: number[];
    p1x: number[];
    p1y: number[];
    p2x: number[];
    p2y: number[];
    p3x: number[];
    p3y: number[];
}
export declare const parsePath: (d: string) => ReanimatedPath;
export declare const getPointAtLength: (path: ReanimatedPath, length: Animated.Adaptable<number>) => {
    x: Animated.Node<number>;
    y: Animated.Node<number>;
};
export declare const interpolatePath: (value: Animated.Adaptable<number>, { inputRange, outputRange, ...config }: PathInterpolationConfig) => Animated.Node<string>;
export declare const bInterpolatePath: (value: Animated.Value<number>, path1: ReanimatedPath | string, path2: ReanimatedPath | string) => Animated.Node<string>;
export declare const getLengthAtX: (path: ReanimatedPath, x: Animated.Adaptable<number>) => Animated.Node<number>;
