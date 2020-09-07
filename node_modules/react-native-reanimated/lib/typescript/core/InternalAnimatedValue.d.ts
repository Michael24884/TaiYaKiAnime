import AnimatedNode from './AnimatedNode';
import { Value, Adaptable } from '../types';
interface InternalAnimatedValue<T extends Value> {
    _startingValue: any;
    _value: any;
    _animation: any;
    _constant: any;
}
/**
 * This class has been made internal in order to omit dependencies' cycles which
 * were caused by imperative setValue and interpolate – they are currently exposed with AnimatedValue.js
 */
declare class InternalAnimatedValue<T extends Value> extends AnimatedNode<T> {
    static valueForConstant(number: number): any;
    constructor(value?: T, constant?: boolean);
    __detach(): void;
    __detachAnimation(animation: any): void;
    __attachAnimation(animation: any): void;
    __onEvaluate(): any;
    setValue(value: Adaptable<T>): void;
    _updateValue(value: any): void;
}
export default InternalAnimatedValue;
