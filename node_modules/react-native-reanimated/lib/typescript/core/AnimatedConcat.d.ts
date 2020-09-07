import AnimatedNode from './AnimatedNode';
import { Adaptable } from '../types';
export declare function createAnimatedConcat(...args: Array<Adaptable<string> | Adaptable<number>>): AnimatedNode<string>;
