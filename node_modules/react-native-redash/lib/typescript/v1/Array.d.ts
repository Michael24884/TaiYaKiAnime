import Animated from "react-native-reanimated";
export declare const get: (array: Animated.Adaptable<number>[], index: Animated.Adaptable<number>, notFound?: Animated.Node<number>) => Animated.Node<number>;
export declare const contains: (values: Animated.Adaptable<number>[], value: Animated.Adaptable<number>) => Animated.Node<0 | 1>;
export declare const find: (values: Animated.Node<number>[], fn: (v: Animated.Node<number>) => Animated.Node<number>, notFound?: Animated.Node<number>) => Animated.Node<number>;
