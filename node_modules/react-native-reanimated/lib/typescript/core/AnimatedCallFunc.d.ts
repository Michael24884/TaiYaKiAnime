export function createAnimatedCallFunc(proc: any, args: any, params: any): AnimatedCallFunc;
declare class AnimatedCallFunc extends AnimatedNode<any> {
    constructor(what: any, args: any, params: any);
    _previousCallID: any;
    _what: any;
    _args: any;
    _params: any;
    beginContext(): void;
    endContext(): void;
}
import AnimatedNode from "./AnimatedNode";
export {};
