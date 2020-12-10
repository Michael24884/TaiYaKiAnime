"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.useInfiniteQuery = useInfiniteQuery;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("../core/utils");

var _useBaseQuery = require("./useBaseQuery");

// Implementation
function useInfiniteQuery(arg1, arg2, arg3) {
  var _getQueryArgs = (0, _utils.getQueryArgs)(arg1, arg2, arg3),
      queryKey = _getQueryArgs[0],
      config = _getQueryArgs[1];

  return (0, _useBaseQuery.useBaseQuery)(queryKey, (0, _extends2.default)({}, config, {
    infinite: true
  }));
}