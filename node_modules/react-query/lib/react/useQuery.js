"use strict";

exports.__esModule = true;
exports.useQuery = useQuery;

var _utils = require("../core/utils");

var _useBaseQuery = require("./useBaseQuery");

// Implementation
function useQuery(arg1, arg2, arg3) {
  var _getQueryArgs = (0, _utils.getQueryArgs)(arg1, arg2, arg3),
      queryKey = _getQueryArgs[0],
      config = _getQueryArgs[1];

  return (0, _useBaseQuery.useBaseQuery)(queryKey, config);
}