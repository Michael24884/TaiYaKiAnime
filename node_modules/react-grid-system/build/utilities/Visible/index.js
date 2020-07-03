"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var style = _interopRequireWildcard(require("./style"));

var _ScreenClassResolver = _interopRequireDefault(require("../../context/ScreenClassResolver"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Visible = function Visible(_ref) {
  var children = _ref.children,
      xs = _ref.xs,
      sm = _ref.sm,
      md = _ref.md,
      lg = _ref.lg,
      xl = _ref.xl,
      xxl = _ref.xxl;
  return /*#__PURE__*/_react.default.createElement(_ScreenClassResolver.default, null, function (screenClass) {
    return !style.visible({
      screenClass: screenClass,
      xs: xs,
      sm: sm,
      md: md,
      lg: lg,
      xl: xl,
      xxl: xxl
    }) ? null : children;
  });
};

Visible.propTypes = {
  /**
   * Content of the component
   */
  children: _propTypes.default.node.isRequired,

  /**
   * Show on extra small devices
   */
  xs: _propTypes.default.bool,

  /**
   * Show on small devices
   */
  sm: _propTypes.default.bool,

  /**
   * Show on medium devices
   */
  md: _propTypes.default.bool,

  /**
   * Show on large devices
   */
  lg: _propTypes.default.bool,

  /**
   * Show on xlarge devices
   */
  xl: _propTypes.default.bool,

  /**
   * Show on xxlarge devices
   */
  xxl: _propTypes.default.bool
};
Visible.defaultProps = {
  xs: false,
  sm: false,
  md: false,
  lg: false,
  xl: false,
  xxl: false
};
var _default = Visible;
exports.default = _default;