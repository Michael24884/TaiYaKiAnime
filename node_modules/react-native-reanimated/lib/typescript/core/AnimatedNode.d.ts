import { Value } from '../types';
export declare function getCallID(): string;
export declare function setCallID(nextCallID: any): void;
interface AnimatedNode<T extends Value> {
    __nodeID: any;
    __nodeConfig: any;
    __initialized: any;
    __inputNodes: any;
}
declare abstract class AnimatedNode<T> {
    __nodeID: any;
    __lastLoopID: {
        '': number;
    };
    __memoizedValue: {
        '': any;
    };
    __children: any[];
    constructor(nodeConfig: object, inputNodes?: ReadonlyArray<AnimatedNode<any>>);
    toString(): string;
    __attach(): void;
    __detach(): void;
    __getValue(): any;
    __forceUpdateCache(newValue: any): void;
    __dangerouslyRescheduleEvaluate(): void;
    __markUpdated(): void;
    __nativeInitialize(): void;
    __nativeTearDown(): void;
    isNativelyInitialized(): any;
    abstract __onEvaluate(): T;
    __getProps(): any;
    __getChildren(): any[];
    __addChild(child: any): void;
    __removeChild(child: any): void;
    _connectAnimatedView(nativeViewTag: any): void;
    _disconnectAnimatedView(nativeViewTag: any): void;
}
export default AnimatedNode;
