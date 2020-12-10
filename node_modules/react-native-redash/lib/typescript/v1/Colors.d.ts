import Animated from "react-native-reanimated";
declare type StaticColor = string | number;
export declare const opacity: (c: number) => number;
export declare const red: (c: number) => number;
export declare const green: (c: number) => number;
export declare const blue: (c: number) => number;
export declare const hsv2rgb: (h: Animated.Adaptable<number>, s: Animated.Adaptable<number>, v: Animated.Adaptable<number>) => {
    r: Animated.Node<number>;
    g: Animated.Node<number>;
    b: Animated.Node<number>;
};
export declare const hsv2color: (h: Animated.Adaptable<number>, s: Animated.Adaptable<number>, v: Animated.Adaptable<number>) => Animated.Node<number>;
export declare const colorForBackground: (r: Animated.Adaptable<number>, g: Animated.Adaptable<number>, b: Animated.Adaptable<number>) => Animated.Node<number>;
interface ColorInterpolationConfig {
    inputRange: readonly Animated.Adaptable<number>[];
    outputRange: StaticColor[];
}
export declare const interpolateColor: (value: Animated.Adaptable<number>, config: ColorInterpolationConfig, colorSpace?: "hsv" | "rgb") => Animated.Node<number>;
export declare const mixColor: (value: Animated.Adaptable<number>, color1: StaticColor, color2: StaticColor, colorSpace?: "hsv" | "rgb") => Animated.Node<number>;
export {};
