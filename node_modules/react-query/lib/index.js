"use strict";

exports.__esModule = true;

var _index = require("./core/index");

Object.keys(_index).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  exports[key] = _index[key];
});

var _reactBatchedUpdates = require("./react/reactBatchedUpdates");

var _index2 = require("./react/index");

Object.keys(_index2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  exports[key] = _index2[key];
});
(0, _index.setBatchedUpdates)(_reactBatchedUpdates.unstable_batchedUpdates);