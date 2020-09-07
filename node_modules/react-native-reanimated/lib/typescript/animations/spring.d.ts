import { Adaptable } from '../types';
export interface SpringConfig {
    damping: Adaptable<number>;
    mass: Adaptable<number>;
    stiffness: Adaptable<number>;
    overshootClamping: Adaptable<number> | boolean;
    restSpeedThreshold: Adaptable<number>;
    restDisplacementThreshold: Adaptable<number>;
    toValue: Adaptable<number>;
}
declare const _default: (clock: any, { finished, velocity, position, time, prevPosition, }: {
    finished: any;
    velocity: any;
    position: any;
    time: any;
    prevPosition: any;
}, { toValue, damping, mass, stiffness, overshootClamping, restDisplacementThreshold, restSpeedThreshold, }: SpringConfig) => import("../core/AnimatedNode").default<number>;
export default _default;
