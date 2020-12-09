"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processFonts = processFonts;

var _expoFont = require("expo-font");

// @ts-ignore this file extension is parsed only in managed workflow, so `expo-font` should be always available there
// eslint-disable-next-line import/no-unresolved
function processFonts(fontFamilies) {
  return fontFamilies.map(fontFamily => (0, _expoFont.processFontFamily)(fontFamily));
}
//# sourceMappingURL=FontProcessor.expo.js.map