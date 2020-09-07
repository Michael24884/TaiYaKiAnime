"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useWindowDimensions;

var _reactNative = require("react-native");

var _react = require("react");

// Copied from https://github.com/facebook/react-native/blob/8d57691a/Libraries/Utilities/useWindowDimensions.js
// for compatibility with React Native < 0.61.
function useWindowDimensions() {
  const [dimensions, setDimensions] = (0, _react.useState)(() => _reactNative.Dimensions.get('window'));
  (0, _react.useEffect)(() => {
    function handleChange({
      window
    }) {
      if (dimensions.width !== window.width || dimensions.height !== window.height || dimensions.scale !== window.scale || dimensions.fontScale !== window.fontScale) {
        setDimensions(window);
      }
    }

    _reactNative.Dimensions.addEventListener('change', handleChange); // We might have missed an update between calling `get` in render and
    // `addEventListener` in this handler, so we set it here. If there was
    // no change, React will filter out this update as a no-op.


    handleChange({
      window: _reactNative.Dimensions.get('window')
    });
    return () => {
      _reactNative.Dimensions.removeEventListener('change', handleChange);
    };
  }, [dimensions]);
  return dimensions;
}
//# sourceMappingURL=useWindowDimensions.js.map