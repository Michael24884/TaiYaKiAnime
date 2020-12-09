import Animated from "react-native-reanimated";
declare type Fn = (...args: Animated.Adaptable<number>[]) => Animated.Node<number>;
declare type Adaptable = Vector | Animated.Adaptable<number>;
export interface Vector<T extends Animated.Adaptable<number> = Animated.Adaptable<number>> {
    x: T;
    y: T;
}
declare type Create = {
    (): Vector<0>;
    <T extends Animated.Adaptable<number>>(x: T, y?: T): Vector<T>;
};
export declare const vec: {
    create: Create;
    createValue: (x?: number, y?: number | undefined) => Vector<Animated.Value<number>>;
    minus: (a: Adaptable) => {
        x: Animated.Node<number>;
        y: Animated.Node<number>;
    };
    add: (vectors_0: Adaptable, vectors_1: Adaptable, ...vectors_2: Adaptable[]) => {
        x: Animated.Node<number>;
        y: Animated.Node<number>;
    };
    sub: (vectors_0: Adaptable, vectors_1: Adaptable, ...vectors_2: Adaptable[]) => {
        x: Animated.Node<number>;
        y: Animated.Node<number>;
    };
    dot: (v1: Vector, v2: Vector) => {
        x: Animated.Node<number>;
        y: Animated.Node<number>;
    };
    div: (vectors_0: Adaptable, vectors_1: Adaptable, ...vectors_2: Adaptable[]) => {
        x: Animated.Node<number>;
        y: Animated.Node<number>;
    };
    mul: (vectors_0: Adaptable, vectors_1: Adaptable, ...vectors_2: Adaptable[]) => {
        x: Animated.Node<number>;
        y: Animated.Node<number>;
    };
    multiply: (vectors_0: Adaptable, vectors_1: Adaptable, ...vectors_2: Adaptable[]) => {
        x: Animated.Node<number>;
        y: Animated.Node<number>;
    };
    divide: (vectors_0: Adaptable, vectors_1: Adaptable, ...vectors_2: Adaptable[]) => {
        x: Animated.Node<number>;
        y: Animated.Node<number>;
    };
    pow: (vectors_0: Adaptable, vectors_1: number) => {
        x: Animated.Node<number>;
        y: Animated.Node<number>;
    };
    sqrt: (vectors_0: Adaptable) => {
        x: Animated.Node<number>;
        y: Animated.Node<number>;
    };
    set: (a: Vector<Animated.Value<number>>, b: Adaptable) => Animated.Node<number>;
    clamp: (value: Adaptable, minVec: Adaptable, maxVec: Adaptable) => {
        x: Animated.Node<number>;
        y: Animated.Node<number>;
    };
    apply: (fn: Fn, ...vectors: Adaptable[]) => {
        x: Animated.Node<number>;
        y: Animated.Node<number>;
    };
    min: (vector: Adaptable, value: Animated.Adaptable<number>) => {
        x: Animated.Node<number>;
        y: Animated.Node<number>;
    };
    max: (vector: Adaptable, value: Animated.Adaptable<number>) => {
        x: Animated.Node<number>;
        y: Animated.Node<number>;
    };
    cos: (vectors_0: Adaptable) => {
        x: Animated.Node<number>;
        y: Animated.Node<number>;
    };
    sin: (vectors_0: Adaptable) => {
        x: Animated.Node<number>;
        y: Animated.Node<number>;
    };
    length: (v: Vector) => Animated.Node<number>;
    normalize: (v: Vector) => {
        x: Animated.Node<number>;
        y: Animated.Node<number>;
    };
    cross: (v1: Vector, v2: Vector) => {
        x: Animated.Node<number>;
        y: Animated.Node<number>;
    };
};
export {};
