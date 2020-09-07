function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import AnimatedNode from './AnimatedNode';
import AnimatedClock from './AnimatedClock';
import { AnimatedParam } from "./AnimatedParam";
import invariant from 'fbjs/lib/invariant';

class AnimatedStopClock extends AnimatedNode {
  constructor(clockNode) {
    invariant(clockNode instanceof AnimatedClock || clockNode instanceof AnimatedParam, "Reanimated: Animated.stopClock argument should be of type AnimatedClock but got ".concat(clockNode));
    super({
      type: 'clockStop',
      clock: clockNode
    });

    _defineProperty(this, "_clockNode", void 0);

    this._clockNode = clockNode;
  }

  toString() {
    return "AnimatedStopClock, id: ".concat(this.__nodeID);
  }

  __onEvaluate() {
    this._clockNode.stop();

    return 0;
  }

}

export function createAnimatedStopClock(clock) {
  return new AnimatedStopClock(clock);
}
//# sourceMappingURL=AnimatedStopClock.js.map