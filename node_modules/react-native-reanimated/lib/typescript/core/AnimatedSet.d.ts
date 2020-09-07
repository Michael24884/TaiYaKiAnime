import AnimatedNode from './AnimatedNode';
import { Value, Adaptable } from '../types';
import AnimatedValue from './AnimatedValue';
export declare function createAnimatedSet<T extends Value>(what: AnimatedValue<T>, value: Adaptable<T>): AnimatedNode<T>;
