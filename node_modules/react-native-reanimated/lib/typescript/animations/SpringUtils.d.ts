import { SpringConfig } from './spring';
import { Adaptable } from '../types';
interface SpringConfigWithOrigamiTensionAndFriction {
    tension: Adaptable<number>;
    mass: Adaptable<number>;
    friction: Adaptable<number>;
    overshootClamping: Adaptable<number> | boolean;
    restSpeedThreshold: Adaptable<number>;
    restDisplacementThreshold: Adaptable<number>;
    toValue: Adaptable<number>;
}
declare function makeConfigFromOrigamiTensionAndFriction(prevConfig: SpringConfigWithOrigamiTensionAndFriction): SpringConfig;
interface SpringConfigWithBouncinessAndSpeed {
    bounciness: Adaptable<number>;
    mass: Adaptable<number>;
    speed: Adaptable<number>;
    overshootClamping: Adaptable<number> | boolean;
    restSpeedThreshold: Adaptable<number>;
    restDisplacementThreshold: Adaptable<number>;
    toValue: Adaptable<number>;
}
declare function makeConfigFromBouncinessAndSpeed(prevConfig: SpringConfigWithBouncinessAndSpeed): SpringConfig;
declare function makeDefaultConfig(): SpringConfig;
declare const _default: {
    makeDefaultConfig: typeof makeDefaultConfig;
    makeConfigFromBouncinessAndSpeed: typeof makeConfigFromBouncinessAndSpeed;
    makeConfigFromOrigamiTensionAndFriction: typeof makeConfigFromOrigamiTensionAndFriction;
};
export default _default;
