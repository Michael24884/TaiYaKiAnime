"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useCode;

var _react = _interopRequireDefault(require("react"));

var _base = require("../base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
function useCode(nodeFactory, dependencies) {
  if (!(_react.default.useEffect instanceof Function)) return;

  _react.default.useEffect(() => {
    // check and correct 1st parameter
    if (!(nodeFactory instanceof Function)) {
      console.warn('useCode() first argument should be a function that returns an animation node.');
      const node = nodeFactory;

      nodeFactory = () => node;
    }

    let node = nodeFactory();

    if (node) {
      // allow factory to return array
      if (node instanceof Array) node = (0, _base.block)(node);
      const animatedAlways = (0, _base.always)(node);

      animatedAlways.__attach(); // return undo function


      return () => animatedAlways.__detach();
    }
  }, dependencies);
}
//# sourceMappingURL=useCode.js.map