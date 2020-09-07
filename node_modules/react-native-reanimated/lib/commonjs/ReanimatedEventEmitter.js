"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ReanimatedModule = _interopRequireDefault(require("./ReanimatedModule"));

var _reactNative = require("react-native");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = new _reactNative.NativeEventEmitter(_ReanimatedModule.default);

exports.default = _default;
//# sourceMappingURL=ReanimatedEventEmitter.js.map