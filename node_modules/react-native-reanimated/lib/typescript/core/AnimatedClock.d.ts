import AnimatedNode from './AnimatedNode';
declare class AnimatedClock extends AnimatedNode<number> {
    _started: any;
    _attached: any;
    constructor();
    toString(): string;
    __onEvaluate(): any;
    __attach(): void;
    __detach(): void;
    start(): void;
    stop(): void;
    isStarted(): any;
}
export default AnimatedClock;
