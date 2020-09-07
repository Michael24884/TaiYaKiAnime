import AnimatedNode from './AnimatedNode';
import { Value, Adaptable } from '../types';
export declare function createAnimatedCond<T1 extends Value = number, T2 extends Value = number>(cond: Adaptable<number>, ifBlock: Adaptable<T1>, elseBlock?: Adaptable<T2>): AnimatedNode<T1 | T2>;
