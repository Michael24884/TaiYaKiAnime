"use strict";

exports.__esModule = true;
exports.setOnlineHandler = void 0;

var _utils = require("./utils");

var _queryCache = require("./queryCache");

var setOnlineHandler = (0, _utils.createSetHandler)(function () {
  return (0, _queryCache.onVisibilityOrOnlineChange)('online');
});
exports.setOnlineHandler = setOnlineHandler;
setOnlineHandler(function (handleOnline) {
  var _window;

  if (_utils.isServer || !((_window = window) == null ? void 0 : _window.addEventListener)) {
    return;
  } // Listen to online


  window.addEventListener('online', handleOnline, false);
  return function () {
    // Be sure to unsubscribe if a new handler is set
    window.removeEventListener('online', handleOnline);
  };
});