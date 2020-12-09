"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompatNativeSafeAreaProvider = CompatNativeSafeAreaProvider;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _useWindowDimensions = _interopRequireDefault(require("./useWindowDimensions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function CompatNativeSafeAreaProvider({
  children,
  style,
  onInsetsChange
}) {
  const window = (0, _useWindowDimensions.default)();
  React.useEffect(() => {
    const insets = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    };
    const frame = {
      x: 0,
      y: 0,
      width: window.width,
      height: window.height
    }; // @ts-ignore: missing properties

    onInsetsChange({
      nativeEvent: {
        insets,
        frame
      }
    });
  }, [onInsetsChange, window.height, window.width]);
  return /*#__PURE__*/React.createElement(_reactNative.View, {
    style: style
  }, children);
}
//# sourceMappingURL=CompatNativeSafeAreaProvider.js.map