function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import AnimatedNode from './AnimatedNode';
import { createAnimatedCallFunc } from './AnimatedCallFunc';
import { createAnimatedParam } from './AnimatedParam';
import { val } from '../val';
import invariant from 'fbjs/lib/invariant';

class AnimatedFunction extends AnimatedNode {
  constructor(what, ...params) {
    invariant(what instanceof AnimatedNode, "Reanimated: AnimatedCallFunc 'what' argument should be of type AnimatedNode but got ".concat(what));
    super({
      type: 'func',
      what
    }, [what, ...params]);

    _defineProperty(this, "_what", void 0);

    this._what = what;

    this.__attach();
  }

  __onEvaluate() {
    return val(this._what);
  }

  toString() {
    return "AnimatedFunction, id: ".concat(this.__nodeID);
  }

}

export function createAnimatedFunction(cb) {
  const params = new Array(cb.length);

  for (let i = 0; i < params.length; i++) {
    params[i] = createAnimatedParam();
  } // eslint-disable-next-line standard/no-callback-literal


  const what = cb(...params);
  const func = new AnimatedFunction(what, ...params);
  return (...args) => {
    if (args.length !== params.length) {
      throw new Error('Parameter mismatch when calling reanimated function. Expected ' + params.length + ' parameters, got ' + args.length + '.');
    }

    return createAnimatedCallFunc(func, args, params);
  };
}
//# sourceMappingURL=AnimatedFunction.js.map