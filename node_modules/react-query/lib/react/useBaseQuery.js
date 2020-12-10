"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.useBaseQuery = useBaseQuery;

var _react = _interopRequireDefault(require("react"));

var _utils = require("./utils");

var _config = require("../core/config");

var _queryObserver = require("../core/queryObserver");

var _ReactQueryErrorResetBoundary = require("./ReactQueryErrorResetBoundary");

var _ReactQueryCacheProvider = require("./ReactQueryCacheProvider");

var _ReactQueryConfigProvider = require("./ReactQueryConfigProvider");

function useBaseQuery(queryKey, config) {
  var _React$useReducer = _react.default.useReducer(function (c) {
    return c + 1;
  }, 0),
      rerender = _React$useReducer[1];

  var isMounted = (0, _utils.useIsMounted)();
  var cache = (0, _ReactQueryCacheProvider.useQueryCache)();
  var contextConfig = (0, _ReactQueryConfigProvider.useContextConfig)();
  var errorResetBoundary = (0, _ReactQueryErrorResetBoundary.useErrorResetBoundary)(); // Get resolved config

  var resolvedConfig = (0, _config.getResolvedQueryConfig)(cache, queryKey, contextConfig, config); // Create query observer

  var observerRef = _react.default.useRef();

  var firstRender = !observerRef.current;
  var observer = observerRef.current || new _queryObserver.QueryObserver(resolvedConfig);
  observerRef.current = observer; // Subscribe to the observer

  _react.default.useEffect(function () {
    errorResetBoundary.clearReset();
    return observer.subscribe(function () {
      if (isMounted()) {
        rerender();
      }
    });
  }, [isMounted, observer, rerender, errorResetBoundary]); // Update config


  if (!firstRender) {
    observer.updateConfig(resolvedConfig);
  }

  var result = observer.getCurrentResult(); // Handle suspense

  if (resolvedConfig.suspense || resolvedConfig.useErrorBoundary) {
    var query = observer.getCurrentQuery();

    if (result.isError && !errorResetBoundary.isReset() && query.state.throwInErrorBoundary) {
      throw result.error;
    }

    if (resolvedConfig.enabled && resolvedConfig.suspense && !result.isSuccess) {
      errorResetBoundary.clearReset();
      var unsubscribe = observer.subscribe();
      throw observer.fetch().finally(unsubscribe);
    }
  }

  return result;
}