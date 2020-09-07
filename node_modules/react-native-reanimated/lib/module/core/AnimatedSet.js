function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import AnimatedNode from './AnimatedNode';
import invariant from 'fbjs/lib/invariant';
import { val } from '../val';
import { adapt } from '../core/AnimatedBlock';

class AnimatedSet extends AnimatedNode {
  constructor(what, value) {
    invariant(what instanceof AnimatedNode, "Reanimated: Animated.set first argument should be of type AnimatedNode but got ".concat(what));
    invariant(value instanceof AnimatedNode, "Reanimated: Animated.set second argument should be of type AnimatedNode, String or Number but got ".concat(value));
    super({
      type: 'set',
      what,
      value
    }, [value]);

    _defineProperty(this, "_what", void 0);

    _defineProperty(this, "_value", void 0);

    invariant(!what._constant, 'Value to be set cannot be constant');
    this._what = what;
    this._value = value;
  }

  toString() {
    return "AnimatedSet, id: ".concat(this.__nodeID);
  }

  __onEvaluate() {
    const newValue = val(this._value);

    this._what.setValue(newValue);

    return newValue;
  }

}

export function createAnimatedSet(what, value) {
  return new AnimatedSet(what, adapt(value));
}
//# sourceMappingURL=AnimatedSet.js.map