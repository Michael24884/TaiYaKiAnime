"use strict";

var _react = _interopRequireDefault(require("react"));

var _Animated = _interopRequireDefault(require("../Animated"));

var _reactTestRenderer = _interopRequireDefault(require("react-test-renderer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.mock('../ReanimatedEventEmitter');
jest.mock('../ReanimatedModule');
describe('Core Animated components', () => {
  xit('fails if something other then a node or function that returns a node is passed to Animated.Code exec prop', () => {
    console.error = jest.fn();
    expect(() => _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_Animated.default.Code, {
      exec: "not a node"
    }))).toThrowError("<Animated.Code /> expects the 'exec' prop or children to be an animated node or a function returning an animated node.");
  });
  xit('fails if something other then a node or function that returns a node is passed to Animated.Code children', () => {
    console.error = jest.fn();
    expect(() => _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_Animated.default.Code, null, "not a node"))).toThrowError("<Animated.Code /> expects the 'exec' prop or children to be an animated node or a function returning an animated node.");
  });
});
//# sourceMappingURL=Core.test.js.map