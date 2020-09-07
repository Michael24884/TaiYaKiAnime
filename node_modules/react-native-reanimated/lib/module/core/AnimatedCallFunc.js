function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import AnimatedNode, { getCallID, setCallID } from './AnimatedNode';
import { adapt } from './AnimatedBlock';
import { val } from '../val';
import invariant from 'fbjs/lib/invariant';

class AnimatedCallFunc extends AnimatedNode {
  constructor(what, args, params) {
    invariant(what instanceof AnimatedNode, "Reanimated: AnimatedCallFunc 'what' argument should be of type AnimatedNode but got ".concat(what));
    invariant(args.every(el => el instanceof AnimatedNode), "Reanimated: every AnimatedCallFunc 'args' argument should be of type AnimatedNode but got ".concat(args));
    invariant(params.every(el => el instanceof AnimatedNode), "Reanimated: every AnimatedCallFunc 'params' argument should be of type AnimatedNode but got ".concat(params));
    super({
      type: 'callfunc',
      what,
      args,
      params
    }, [...args]);

    _defineProperty(this, "_previousCallID", void 0);

    _defineProperty(this, "_what", void 0);

    _defineProperty(this, "_args", void 0);

    _defineProperty(this, "_params", void 0);

    this._what = what;
    this._args = args;
    this._params = params;
  }

  toString() {
    return "AnimatedCallFunc, id: ".concat(this.__nodeID);
  }

  beginContext() {
    this._previousCallID = getCallID();
    setCallID(getCallID() + '/' + this.__nodeID);

    this._params.forEach((param, index) => {
      param.beginContext(this._args[index], this._previousCallID);
    });
  }

  endContext() {
    this._params.forEach((param, index) => {
      param.endContext();
    });

    setCallID(this._previousCallID);
  }

  __onEvaluate() {
    this.beginContext();
    const value = val(this._what);
    this.endContext();
    return value;
  }

}

export function createAnimatedCallFunc(proc, args, params) {
  return new AnimatedCallFunc(proc, args.map(p => adapt(p)), params);
}
//# sourceMappingURL=AnimatedCallFunc.js.map