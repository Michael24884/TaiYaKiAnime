"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "acc", {
  enumerable: true,
  get: function get() {
    return _acc.default;
  }
});
Object.defineProperty(exports, "color", {
  enumerable: true,
  get: function get() {
    return _color.default;
  }
});
Object.defineProperty(exports, "diff", {
  enumerable: true,
  get: function get() {
    return _diff.default;
  }
});
Object.defineProperty(exports, "diffClamp", {
  enumerable: true,
  get: function get() {
    return _diffClamp.default;
  }
});
Object.defineProperty(exports, "interpolate", {
  enumerable: true,
  get: function get() {
    return _interpolate.default;
  }
});
Object.defineProperty(exports, "Extrapolate", {
  enumerable: true,
  get: function get() {
    return _interpolate.Extrapolate;
  }
});
Object.defineProperty(exports, "interpolateColors", {
  enumerable: true,
  get: function get() {
    return _interpolateColors.default;
  }
});
Object.defineProperty(exports, "onChange", {
  enumerable: true,
  get: function get() {
    return _onChange.default;
  }
});
Object.defineProperty(exports, "useCode", {
  enumerable: true,
  get: function get() {
    return _useCode.default;
  }
});

var _acc = _interopRequireDefault(require("./acc"));

var _color = _interopRequireDefault(require("./color"));

var _diff = _interopRequireDefault(require("./diff"));

var _diffClamp = _interopRequireDefault(require("./diffClamp"));

var _interpolate = _interopRequireWildcard(require("./interpolate"));

var _interpolateColors = _interopRequireDefault(require("./interpolateColors"));

var _onChange = _interopRequireDefault(require("./onChange"));

var _useCode = _interopRequireDefault(require("./useCode"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=index.js.map