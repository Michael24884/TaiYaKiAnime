import AnimatedNode from '../core/AnimatedNode';
import { Value } from '../types';
/**
 * evaluate given node and notify children
 * @param node - node to be evaluated
 * @param input - nodes (or one node) representing values which states input for node.
 * @param [callback] - after callback
 */
export declare function evaluateOnce<T extends Value>(node: AnimatedNode<T>, input?: AnimatedNode<T> | AnimatedNode<T>[], callback?: () => void): void;
