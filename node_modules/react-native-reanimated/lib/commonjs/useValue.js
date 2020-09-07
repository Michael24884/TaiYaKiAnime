"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useValue;

var _react = _interopRequireDefault(require("react"));

var _AnimatedValue = _interopRequireDefault(require("./core/AnimatedValue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useValue(initialValue) {
  const ref = _react.default.useRef(null);

  if (ref.current === null) {
    ref.current = new _AnimatedValue.default(initialValue);
  }

  return ref.current;
}
//# sourceMappingURL=useValue.js.map