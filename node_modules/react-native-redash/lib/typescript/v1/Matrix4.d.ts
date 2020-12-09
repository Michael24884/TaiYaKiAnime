import Animated from "react-native-reanimated";
export declare type Vec4 = readonly [
    Animated.Adaptable<number>,
    Animated.Adaptable<number>,
    Animated.Adaptable<number>,
    Animated.Adaptable<number>
];
export declare type Matrix4 = readonly [Vec4, Vec4, Vec4, Vec4];
declare type Transform3dName = "translateX" | "translateY" | "translateZ" | "scale" | "scaleX" | "scaleY" | "skewX" | "skewY" | "rotateZ" | "rotate" | "perspective" | "rotateX" | "rotateY" | "rotateZ" | "matrix";
declare type Transformations = {
    [Name in Transform3dName]: Name extends "matrix" ? Matrix4 : Animated.Adaptable<number>;
};
export declare type Transforms3d = (Pick<Transformations, "translateX"> | Pick<Transformations, "translateY"> | Pick<Transformations, "translateZ"> | Pick<Transformations, "scale"> | Pick<Transformations, "scaleX"> | Pick<Transformations, "scaleY"> | Pick<Transformations, "skewX"> | Pick<Transformations, "skewY"> | Pick<Transformations, "perspective"> | Pick<Transformations, "rotateX"> | Pick<Transformations, "rotateY"> | Pick<Transformations, "rotateZ"> | Pick<Transformations, "rotate"> | Pick<Transformations, "matrix">)[];
export declare const identityMatrix4: Matrix4;
export declare const dot4: (row: Vec4, col: Vec4) => Animated.Node<number>;
export declare const matrixVecMul4: (m: Matrix4, v: Vec4) => readonly [Animated.Node<number>, Animated.Node<number>, Animated.Node<number>, Animated.Node<number>];
export declare const multiply4: (m1: Matrix4, m2: Matrix4) => readonly [readonly [Animated.Node<number>, Animated.Node<number>, Animated.Node<number>, Animated.Node<number>], readonly [Animated.Node<number>, Animated.Node<number>, Animated.Node<number>, Animated.Node<number>], readonly [Animated.Node<number>, Animated.Node<number>, Animated.Node<number>, Animated.Node<number>], readonly [Animated.Node<number>, Animated.Node<number>, Animated.Node<number>, Animated.Node<number>]];
export declare const processTransform3d: (transforms: Transforms3d) => Matrix4;
export {};
