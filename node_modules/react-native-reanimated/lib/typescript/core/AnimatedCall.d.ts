import AnimatedNode from './AnimatedNode';
import { Value } from '../types';
export declare function createAnimatedCall<T extends Value>(args: ReadonlyArray<T | AnimatedNode<T>>, func: (args: ReadonlyArray<T>) => void): AnimatedNode<0>;
