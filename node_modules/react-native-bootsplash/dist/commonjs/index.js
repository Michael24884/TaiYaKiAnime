"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.show = show;
exports.hide = hide;
exports.getVisibilityStatus = getVisibilityStatus;
exports.default = void 0;

var _reactNative = require("react-native");

const NativeModule = _reactNative.NativeModules.RNBootSplash;

function show(config = {}) {
  return NativeModule.show({
    fade: false,
    ...config
  }.fade).then(() => {});
}

function hide(config = {}) {
  return NativeModule.hide({
    fade: false,
    ...config
  }.fade).then(() => {});
}

function getVisibilityStatus() {
  return NativeModule.getVisibilityStatus();
}

var _default = {
  show,
  hide,
  getVisibilityStatus
};
exports.default = _default;
//# sourceMappingURL=index.js.map