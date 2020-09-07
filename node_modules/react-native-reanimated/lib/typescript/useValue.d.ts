import AnimatedValue from './core/AnimatedValue';
import { Value } from './types';
export default function useValue<T extends Value>(initialValue: T): AnimatedValue<T>;
