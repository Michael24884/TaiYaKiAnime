function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import AnimatedNode from './AnimatedNode';
import invariant from 'fbjs/lib/invariant';
import { val } from '../val';

class AnimatedAlways extends AnimatedNode {
  constructor(what) {
    invariant(what instanceof AnimatedNode, "Reanimated: Animated.always node argument should be of type AnimatedNode but got ".concat(what));
    super({
      type: 'always',
      what
    }, [what]);

    _defineProperty(this, "_what", void 0);

    this._what = what;
  }

  toString() {
    return "AnimatedAlways, id: ".concat(this.__nodeID);
  }

  update() {
    this.__getValue();
  }

  __onEvaluate() {
    val(this._what);
    return 0;
  }

}

export function createAnimatedAlways(item) {
  return new AnimatedAlways(item);
}
//# sourceMappingURL=AnimatedAlways.js.map