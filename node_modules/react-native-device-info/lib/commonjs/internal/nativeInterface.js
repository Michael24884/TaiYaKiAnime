"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactNative = require("react-native");

let RNDeviceInfo = _reactNative.NativeModules.RNDeviceInfo; // @ts-ignore

if (_reactNative.Platform.OS === 'web' || _reactNative.Platform.OS === 'dom') {
  RNDeviceInfo = require('../web');
}

if (!RNDeviceInfo) {
  // Produce an error if we don't have the native module
  if (_reactNative.Platform.OS === 'android' || _reactNative.Platform.OS === 'ios' || _reactNative.Platform.OS === 'web' || // @ts-ignore
  _reactNative.Platform.OS === 'dom') {
    throw new Error("@react-native-community/react-native-device-info: NativeModule.RNDeviceInfo is null. To fix this issue try these steps:\n  \u2022 For react-native <= 0.59: Run `react-native link react-native-device-info` in the project root.\n  \u2022 Rebuild and re-run the app.\n  \u2022 If you are using CocoaPods on iOS, run `pod install` in the `ios` directory and then rebuild and re-run the app. You may also need to re-open Xcode to get the new pods.\n  If none of these fix the issue, please open an issue on the Github repository: https://github.com/react-native-community/react-native-device-info");
  }
}

var _default = RNDeviceInfo;
exports.default = _default;
//# sourceMappingURL=nativeInterface.js.map