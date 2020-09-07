"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.val = val;

function val(v) {
  return v && v.__getValue ? v.__getValue() : v || 0;
}
//# sourceMappingURL=val.js.map