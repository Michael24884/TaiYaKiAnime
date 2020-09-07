import AnimatedNode from './AnimatedNode';
import { Value, Adaptable } from '../types';
export declare function createAnimatedBlock<T1 extends Value = number, T2 extends Value = any>(items: ReadonlyArray<Adaptable<T2>>): AnimatedNode<T1>;
export declare function adapt(v: any): any;
