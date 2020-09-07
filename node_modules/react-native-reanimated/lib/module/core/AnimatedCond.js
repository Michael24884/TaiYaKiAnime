function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import invariant from 'fbjs/lib/invariant';
import { adapt } from '../core/AnimatedBlock';
import { val } from '../val';
import AnimatedNode from './AnimatedNode';

class AnimatedCond extends AnimatedNode {
  constructor(condition, ifBlock, elseBlock) {
    invariant(condition instanceof AnimatedNode, "Reanimated: Animated.cond node first argument should be of type AnimatedNode but got ".concat(condition));
    invariant(ifBlock instanceof AnimatedNode, "Reanimated: Animated.cond node second argument should be of type AnimatedNode but got ".concat(ifBlock));
    invariant(elseBlock instanceof AnimatedNode || elseBlock === undefined, "Reanimated: Animated.cond node third argument should be of type AnimatedNode or should be undefined but got ".concat(elseBlock));
    super({
      type: 'cond',
      cond: condition,
      ifBlock,
      elseBlock
    }, [condition, ifBlock, elseBlock]);

    _defineProperty(this, "_condition", void 0);

    _defineProperty(this, "_ifBlock", void 0);

    _defineProperty(this, "_elseBlock", void 0);

    this._condition = condition;
    this._ifBlock = ifBlock;
    this._elseBlock = elseBlock;
  }

  toString() {
    return "AnimatedCond, id: ".concat(this.__nodeID);
  }

  __onEvaluate() {
    if (val(this._condition)) {
      return val(this._ifBlock);
    } else {
      return this._elseBlock !== undefined ? val(this._elseBlock) : undefined;
    }
  }

}

export function createAnimatedCond(cond, ifBlock, elseBlock) {
  return new AnimatedCond(adapt(cond), adapt(ifBlock), elseBlock === undefined ? undefined : adapt(elseBlock));
}
//# sourceMappingURL=AnimatedCond.js.map