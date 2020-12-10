"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ReactQueryErrorResetBoundary = exports.useErrorResetBoundary = void 0;

var _react = _interopRequireDefault(require("react"));

function createValue() {
  var _isReset = false;
  return {
    clearReset: function clearReset() {
      _isReset = false;
    },
    reset: function reset() {
      _isReset = true;
    },
    isReset: function isReset() {
      return _isReset;
    }
  };
}

var context = /*#__PURE__*/_react.default.createContext(createValue()); // HOOK


var useErrorResetBoundary = function useErrorResetBoundary() {
  return _react.default.useContext(context);
}; // COMPONENT


exports.useErrorResetBoundary = useErrorResetBoundary;

var ReactQueryErrorResetBoundary = function ReactQueryErrorResetBoundary(_ref) {
  var children = _ref.children;

  var value = _react.default.useMemo(function () {
    return createValue();
  }, []);

  return /*#__PURE__*/_react.default.createElement(context.Provider, {
    value: value
  }, typeof children === 'function' ? children(value) : children);
};

exports.ReactQueryErrorResetBoundary = ReactQueryErrorResetBoundary;