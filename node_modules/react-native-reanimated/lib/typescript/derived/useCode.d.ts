/**
 * @callback NodeFactory
 * Function to create a node or an array of nodes.
 * @returns {(Node[] | Node | null | undefined | Boolean)}
 */
/**
 * React hook to run a node.
 * @param {NodeFactory} nodeFactory Function to build the node to run.
 * @param dependencies Array of dependencies. Refresh the node on changes.
 */
export default function useCode(nodeFactory: NodeFactory, dependencies: any): void;
/**
 * Function to create a node or an array of nodes.
 */
export type NodeFactory = () => (Node[] | Node | null | undefined | boolean);
