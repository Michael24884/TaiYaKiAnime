declare function _default(clock: any, { time, velocity, position, finished }: {
    time: any;
    velocity: any;
    position: any;
    finished: any;
}, { deceleration }: {
    deceleration: any;
}): import("../core/AnimatedNode").default<number>;
export default _default;
