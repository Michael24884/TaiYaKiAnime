"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.makeQueryCache = makeQueryCache;
exports.onVisibilityOrOnlineChange = onVisibilityOrOnlineChange;
exports.queryCaches = exports.queryCache = exports.QueryCache = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("./utils");

var _config = require("./config");

var _query = require("./query");

var _notifyManager = require("./notifyManager");

var _queryObserver = require("./queryObserver");

// CLASS
var QueryCache = /*#__PURE__*/function () {
  function QueryCache(config) {
    this.config = config || {};
    this.globalListeners = [];
    this.queries = {};
    this.queriesArray = [];
    this.isFetching = 0;
  }

  var _proto = QueryCache.prototype;

  _proto.notifyGlobalListeners = function notifyGlobalListeners(query) {
    var _this = this;

    this.isFetching = this.getQueries().reduce(function (acc, q) {
      return q.state.isFetching ? acc + 1 : acc;
    }, 0);

    _notifyManager.notifyManager.batch(function () {
      _this.globalListeners.forEach(function (listener) {
        _notifyManager.notifyManager.schedule(function () {
          listener(_this, query);
        });
      });
    });
  };

  _proto.getDefaultConfig = function getDefaultConfig() {
    return this.config.defaultConfig;
  };

  _proto.getResolvedQueryConfig = function getResolvedQueryConfig(queryKey, config) {
    return (0, _config.getResolvedQueryConfig)(this, queryKey, undefined, config);
  };

  _proto.subscribe = function subscribe(listener) {
    var _this2 = this;

    this.globalListeners.push(listener);
    return function () {
      _this2.globalListeners = _this2.globalListeners.filter(function (x) {
        return x !== listener;
      });
    };
  };

  _proto.clear = function clear(options) {
    this.removeQueries();

    if (options == null ? void 0 : options.notify) {
      this.notifyGlobalListeners();
    }
  };

  _proto.getQueries = function getQueries(predicate, options) {
    var anyKey = predicate === true || typeof predicate === 'undefined';

    if (anyKey && !options) {
      return this.queriesArray;
    }

    var predicateFn;

    if (typeof predicate === 'function') {
      predicateFn = predicate;
    } else {
      var _ref = options || {},
          exact = _ref.exact,
          active = _ref.active,
          stale = _ref.stale;

      var resolvedConfig = this.getResolvedQueryConfig(predicate);

      predicateFn = function predicateFn(query) {
        // Check query key if needed
        if (!anyKey) {
          if (exact) {
            // Check if the query key matches exactly
            if (query.queryHash !== resolvedConfig.queryHash) {
              return false;
            }
          } else {
            // Check if the query key matches partially
            if (!(0, _utils.deepIncludes)(query.queryKey, resolvedConfig.queryKey)) {
              return false;
            }
          }
        } // Check active state if needed


        if (typeof active === 'boolean' && query.isActive() !== active) {
          return false;
        } // Check stale state if needed


        if (typeof stale === 'boolean' && query.isStale() !== stale) {
          return false;
        }

        return true;
      };
    }

    return this.queriesArray.filter(predicateFn);
  };

  _proto.getQuery = function getQuery(predicate) {
    return this.getQueries(predicate, {
      exact: true
    })[0];
  };

  _proto.getQueryByHash = function getQueryByHash(queryHash) {
    return this.queries[queryHash];
  };

  _proto.getQueryData = function getQueryData(predicate) {
    var _this$getQuery;

    return (_this$getQuery = this.getQuery(predicate)) == null ? void 0 : _this$getQuery.state.data;
  };

  _proto.removeQuery = function removeQuery(query) {
    if (this.queries[query.queryHash]) {
      query.destroy();
      delete this.queries[query.queryHash];
      this.queriesArray = this.queriesArray.filter(function (x) {
        return x !== query;
      });
      this.notifyGlobalListeners(query);
    }
  };

  _proto.removeQueries = function removeQueries(predicate, options) {
    var _this3 = this;

    this.getQueries(predicate, options).forEach(function (query) {
      _this3.removeQuery(query);
    });
  };

  _proto.cancelQueries = function cancelQueries(predicate, options) {
    this.getQueries(predicate, options).forEach(function (query) {
      query.cancel();
    });
  }
  /**
   * @return Promise resolving to an array with the invalidated queries.
   */
  ;

  _proto.invalidateQueries = function invalidateQueries(predicate, options) {
    var queries = this.getQueries(predicate, options);

    _notifyManager.notifyManager.batch(function () {
      queries.forEach(function (query) {
        query.invalidate();
      });
    });

    var _ref2 = options || {},
        _ref2$refetchActive = _ref2.refetchActive,
        refetchActive = _ref2$refetchActive === void 0 ? true : _ref2$refetchActive,
        _ref2$refetchInactive = _ref2.refetchInactive,
        refetchInactive = _ref2$refetchInactive === void 0 ? false : _ref2$refetchInactive;

    if (!refetchInactive && !refetchActive) {
      return Promise.resolve(queries);
    }

    var refetchOptions = (0, _extends2.default)({}, options);

    if (refetchActive && !refetchInactive) {
      refetchOptions.active = true;
    } else if (refetchInactive && !refetchActive) {
      refetchOptions.active = false;
    }

    var promise = this.refetchQueries(predicate, refetchOptions);

    if (!(options == null ? void 0 : options.throwOnError)) {
      promise = promise.catch(function () {
        return queries;
      });
    }

    return promise.then(function () {
      return queries;
    });
  }
  /**
   * @return Promise resolving to an array with the refetched queries.
   */
  ;

  _proto.refetchQueries = function refetchQueries(predicate, options) {
    var _this4 = this;

    var promises = [];

    _notifyManager.notifyManager.batch(function () {
      _this4.getQueries(predicate, options).forEach(function (query) {
        var promise = query.fetch().then(function () {
          return query;
        });

        if (!(options == null ? void 0 : options.throwOnError)) {
          promise = promise.catch(function () {
            return query;
          });
        }

        promises.push(promise);
      });
    });

    return Promise.all(promises);
  };

  _proto.resetErrorBoundaries = function resetErrorBoundaries() {
    this.getQueries().forEach(function (query) {
      query.state.throwInErrorBoundary = false;
    });
  };

  _proto.buildQuery = function buildQuery(queryKey, config) {
    var resolvedConfig = this.getResolvedQueryConfig(queryKey, config);
    var query = this.getQueryByHash(resolvedConfig.queryHash);

    if (!query) {
      query = this.createQuery(resolvedConfig);
    }

    return query;
  };

  _proto.createQuery = function createQuery(config) {
    var query = new _query.Query(config); // A frozen cache does not add new queries to the cache

    if (!this.config.frozen) {
      this.queries[query.queryHash] = query;
      this.queriesArray.push(query);
      this.notifyGlobalListeners(query);
    }

    return query;
  } // Parameter syntax
  ;

  // Implementation
  _proto.fetchQuery = function fetchQuery(arg1, arg2, arg3) {
    var _getQueryArgs = (0, _utils.getQueryArgs)(arg1, arg2, arg3),
        queryKey = _getQueryArgs[0],
        config = _getQueryArgs[1];

    var resolvedConfig = this.getResolvedQueryConfig(queryKey, (0, _extends2.default)({
      // https://github.com/tannerlinsley/react-query/issues/652
      retry: false
    }, config));
    var query = this.getQueryByHash(resolvedConfig.queryHash);

    if (!query) {
      query = this.createQuery(resolvedConfig);
    }

    if (!query.isStaleByTime(config.staleTime)) {
      return Promise.resolve(query.state.data);
    }

    return query.fetch(undefined, resolvedConfig);
  } // Parameter syntax with optional prefetch options
  ;

  // Implementation
  _proto.prefetchQuery = function prefetchQuery(arg1, arg2, arg3, arg4) {
    if ((0, _utils.isPlainObject)(arg2) && (arg2.hasOwnProperty('throwOnError') || arg2.hasOwnProperty('force'))) {
      arg4 = arg2;
      arg2 = undefined;
      arg3 = undefined;
    }

    var _getQueryArgs2 = (0, _utils.getQueryArgs)(arg1, arg2, arg3, arg4),
        queryKey = _getQueryArgs2[0],
        config = _getQueryArgs2[1],
        options = _getQueryArgs2[2];

    if (options == null ? void 0 : options.force) {
      config.staleTime = 0;
    }

    var promise = this.fetchQuery(queryKey, config);

    if (!(options == null ? void 0 : options.throwOnError)) {
      promise = promise.catch(_utils.noop);
    }

    return promise;
  } // Parameter syntax
  ;

  // Implementation
  _proto.watchQuery = function watchQuery(arg1, arg2, arg3) {
    var _getQueryArgs3 = (0, _utils.getQueryArgs)(arg1, arg2, arg3),
        queryKey = _getQueryArgs3[0],
        config = _getQueryArgs3[1];

    var resolvedConfig = this.getResolvedQueryConfig(queryKey, config);
    return new _queryObserver.QueryObserver(resolvedConfig);
  };

  _proto.setQueryData = function setQueryData(queryKey, updater, config) {
    this.buildQuery(queryKey, config).setData(updater);
  };

  return QueryCache;
}();

exports.QueryCache = QueryCache;
var defaultQueryCache = new QueryCache({
  frozen: _utils.isServer
});
exports.queryCache = defaultQueryCache;
var queryCaches = [defaultQueryCache];
/**
 * @deprecated
 */

exports.queryCaches = queryCaches;

function makeQueryCache(config) {
  return new QueryCache(config);
}

function onVisibilityOrOnlineChange(type) {
  if ((0, _utils.isDocumentVisible)() && (0, _utils.isOnline)()) {
    _notifyManager.notifyManager.batch(function () {
      queryCaches.forEach(function (queryCache) {
        queryCache.getQueries().forEach(function (query) {
          query.onInteraction(type);
        });
      });
    });
  }
}