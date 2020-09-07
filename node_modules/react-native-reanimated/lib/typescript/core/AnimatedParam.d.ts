import AnimatedNode from './AnimatedNode';
import { Value } from '../types';
export declare class AnimatedParam<T extends Value | undefined> extends AnimatedNode<T> {
    argsStack: any[];
    _prevCallID: any;
    constructor();
    beginContext(ref: any, prevCallID: any): void;
    endContext(): void;
    _getTopNode(): any;
    setValue(value: any): void;
    __onEvaluate(): any;
    start(): void;
    stop(): void;
    isRunning(): any;
}
export declare function createAnimatedParam(): AnimatedParam<Value>;
