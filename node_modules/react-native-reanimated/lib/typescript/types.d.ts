import AnimatedNode from './core/AnimatedNode';
export declare type Value = string | number | boolean;
export declare type Adaptable<T extends Value> = T | AnimatedNode<T> | ReadonlyArray<T | AnimatedNode<T> | ReadonlyArray<T | AnimatedNode<T>>>;
