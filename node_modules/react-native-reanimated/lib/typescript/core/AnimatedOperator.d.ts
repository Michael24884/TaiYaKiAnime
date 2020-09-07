import AnimatedNode from './AnimatedNode';
import { Value } from '../types';
declare class AnimatedOperator<T extends Value> extends AnimatedNode<T> {
    _input: any;
    _op: any;
    _operation: any;
    constructor(operator: any, input: any);
    toString(): string;
    __onEvaluate(): any;
}
export declare function createAnimatedOperator(name: any): (...args: any[]) => AnimatedOperator<Value>;
export {};
