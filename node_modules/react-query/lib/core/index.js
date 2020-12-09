"use strict";

exports.__esModule = true;
var _exportNames = {
  getDefaultReactQueryConfig: true,
  queryCache: true,
  queryCaches: true,
  makeQueryCache: true,
  QueryCache: true,
  setFocusHandler: true,
  setOnlineHandler: true,
  CancelledError: true,
  isCancelledError: true,
  isError: true,
  setConsole: true,
  setBatchedUpdates: true
};
exports.setBatchedUpdates = exports.setConsole = exports.isError = exports.isCancelledError = exports.CancelledError = exports.setOnlineHandler = exports.setFocusHandler = exports.QueryCache = exports.makeQueryCache = exports.queryCaches = exports.queryCache = exports.getDefaultReactQueryConfig = void 0;

var _config = require("./config");

exports.getDefaultReactQueryConfig = _config.getDefaultReactQueryConfig;

var _queryCache = require("./queryCache");

exports.queryCache = _queryCache.queryCache;
exports.queryCaches = _queryCache.queryCaches;
exports.makeQueryCache = _queryCache.makeQueryCache;
exports.QueryCache = _queryCache.QueryCache;

var _setFocusHandler = require("./setFocusHandler");

exports.setFocusHandler = _setFocusHandler.setFocusHandler;

var _setOnlineHandler = require("./setOnlineHandler");

exports.setOnlineHandler = _setOnlineHandler.setOnlineHandler;

var _utils = require("./utils");

exports.CancelledError = _utils.CancelledError;
exports.isCancelledError = _utils.isCancelledError;
exports.isError = _utils.isError;
exports.setConsole = _utils.setConsole;
exports.setBatchedUpdates = _utils.setBatchedUpdates;

var _types = require("./types");

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  exports[key] = _types[key];
});