import useCode from '../derived/useCode';
import AnimatedNode from './AnimatedNode';

function assertNodesNotNull(code, children, exec) {
  if (!code) {
    const error = !children ? "Got \"".concat(typeof children, "\" type passed to children") : "Got \"".concat(typeof exec, "\" type passed to exec");
    throw new Error("<Animated.Code /> expects the 'exec' prop or children to be an animated node or a function returning an animated node. ".concat(error));
  }
}

function Code({
  exec,
  children,
  dependencies = []
}) {
  const nodes = children || exec;
  let code = null;

  if (nodes instanceof AnimatedNode) {
    code = () => nodes;
  } else if (typeof nodes === 'function') {
    code = nodes;
  }

  assertNodesNotNull(code, children, exec);
  useCode(code, dependencies);
  return null;
}

export default Code;
//# sourceMappingURL=AnimatedCode.js.map