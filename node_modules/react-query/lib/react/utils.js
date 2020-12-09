"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.useIsMounted = useIsMounted;
exports.useMountedCallback = useMountedCallback;

var _react = _interopRequireDefault(require("react"));

var _utils = require("../core/utils");

function useIsMounted() {
  var mountedRef = _react.default.useRef(false);

  var isMounted = _react.default.useCallback(function () {
    return mountedRef.current;
  }, []);

  _react.default[_utils.isServer ? 'useEffect' : 'useLayoutEffect'](function () {
    mountedRef.current = true;
    return function () {
      mountedRef.current = false;
    };
  }, []);

  return isMounted;
}

function useMountedCallback(callback) {
  var isMounted = useIsMounted();
  return _react.default.useCallback(function () {
    if (isMounted()) {
      return callback.apply(void 0, arguments);
    }
  }, [callback, isMounted]);
}