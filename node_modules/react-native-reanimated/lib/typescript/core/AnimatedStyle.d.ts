export function createOrReuseStyleNode(style: any, oldNode: any): any;
/**
 * AnimatedStyle should never be directly instantiated, use createOrReuseStyleNode
 * in order to make a new instance of this node.
 */
export default class AnimatedStyle extends AnimatedNode<any> {
    constructor(style: any, config: any);
    _config: any;
    _style: any;
    _walkStyleAndGetAnimatedValues(style: any): {};
}
import AnimatedNode from "./AnimatedNode";
