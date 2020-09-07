/**
 * Depending on the arguments list we either return animation node or return an
 * animation object that is compatible with the original Animated API
 */
export default function backwardsCompatibleAnimWrapper(node: any, animationStateDefaults: any): (clock: any, state: any, config: any) => any;
