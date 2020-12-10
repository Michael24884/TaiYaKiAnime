"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.useIsFetching = useIsFetching;

var _react = _interopRequireDefault(require("react"));

var _ReactQueryCacheProvider = require("./ReactQueryCacheProvider");

var _utils = require("./utils");

function useIsFetching() {
  var isMounted = (0, _utils.useIsMounted)();
  var queryCache = (0, _ReactQueryCacheProvider.useQueryCache)();

  var _React$useState = _react.default.useState(queryCache.isFetching),
      isFetching = _React$useState[0],
      setIsFetching = _React$useState[1];

  _react.default.useEffect(function () {
    return queryCache.subscribe(function () {
      if (isMounted()) {
        setIsFetching(queryCache.isFetching);
      }
    });
  }, [queryCache, setIsFetching, isMounted]);

  return isFetching;
}