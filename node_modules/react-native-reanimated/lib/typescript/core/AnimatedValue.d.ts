import { InterpolationConfig } from '../derived/interpolate';
import InternalAnimatedValue from './InternalAnimatedValue';
import type { Value, Adaptable } from '../types';
import type AnimatedNode from './AnimatedNode';
declare class AnimatedValue<T extends Value> extends InternalAnimatedValue<T> {
    setValue(value: Adaptable<T>): void;
    toString(): string;
    interpolate(config: InterpolationConfig): AnimatedNode<number>;
}
export default AnimatedValue;
