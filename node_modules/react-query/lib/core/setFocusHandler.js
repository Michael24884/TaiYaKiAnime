"use strict";

exports.__esModule = true;
exports.setFocusHandler = void 0;

var _utils = require("./utils");

var _queryCache = require("./queryCache");

var setFocusHandler = (0, _utils.createSetHandler)(function () {
  return (0, _queryCache.onVisibilityOrOnlineChange)('focus');
});
exports.setFocusHandler = setFocusHandler;
setFocusHandler(function (handleFocus) {
  var _window;

  if (_utils.isServer || !((_window = window) == null ? void 0 : _window.addEventListener)) {
    return;
  } // Listen to visibillitychange and focus


  window.addEventListener('visibilitychange', handleFocus, false);
  window.addEventListener('focus', handleFocus, false);
  return function () {
    // Be sure to unsubscribe if a new handler is set
    window.removeEventListener('visibilitychange', handleFocus);
    window.removeEventListener('focus', handleFocus);
  };
});