import AnimatedNode from './AnimatedNode';
import { Adaptable, Value } from '../types';
export declare function createAnimatedFunction<T extends (Adaptable<Value> | undefined)[]>(cb: (...args: T) => AnimatedNode<number>): typeof cb;
