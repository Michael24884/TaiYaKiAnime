import Animated from "react-native-reanimated";
export declare type Concatable = Animated.Adaptable<string> | Animated.Adaptable<number>;
export declare const string: (strings: readonly string[], ...values: readonly Concatable[]) => Animated.Node<string>;
