"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.queryReducer = queryReducer;
exports.Query = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("./utils");

var _types = require("./types");

var _queryObserver = require("./queryObserver");

var _notifyManager = require("./notifyManager");

function _empty() {}

var ActionType = {
  Failed: 0,
  Fetch: 1,
  Success: 2,
  Error: 3,
  Invalidate: 4
};

// CLASS
function _awaitIgnored(value, direct) {
  if (!direct) {
    return value && value.then ? value.then(_empty) : Promise.resolve();
  }
}

function _invoke(body, then) {
  var result = body();

  if (result && result.then) {
    return result.then(then);
  }

  return then(result);
}

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
}

function _async(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

var Query = /*#__PURE__*/function () {
  function Query(config) {
    this.config = config;
    this.queryKey = config.queryKey;
    this.queryHash = config.queryHash;
    this.queryCache = config.queryCache;
    this.cacheTime = config.cacheTime;
    this.observers = [];
    this.state = getDefaultState(config);
    this.scheduleGc();
  }

  var _proto = Query.prototype;

  _proto.updateConfig = function updateConfig(config) {
    this.config = config;
    this.cacheTime = Math.max(this.cacheTime, config.cacheTime);
  };

  _proto.dispatch = function dispatch(action) {
    var _this = this;

    this.state = queryReducer(this.state, action);

    _notifyManager.notifyManager.batch(function () {
      _this.observers.forEach(function (observer) {
        observer.onQueryUpdate(action);
      });

      _this.queryCache.notifyGlobalListeners(_this);
    });
  };

  _proto.scheduleGc = function scheduleGc() {
    var _this2 = this;

    if (_utils.isServer) {
      return;
    }

    this.clearGcTimeout();

    if (this.observers.length > 0 || !(0, _utils.isValidTimeout)(this.cacheTime)) {
      return;
    }

    this.gcTimeout = setTimeout(function () {
      _this2.remove();
    }, this.cacheTime);
  };

  _proto.cancel = function cancel(silent) {
    var promise = this.promise;

    if (promise && this.cancelFetch) {
      this.cancelFetch(silent);
      return promise.then(_utils.noop).catch(_utils.noop);
    }

    return Promise.resolve(undefined);
  };

  _proto.continue = function _continue() {
    var _this$continueFetch;

    (_this$continueFetch = this.continueFetch) == null ? void 0 : _this$continueFetch.call(this);
  };

  _proto.clearTimersObservers = function clearTimersObservers() {
    this.observers.forEach(function (observer) {
      observer.clearTimers();
    });
  };

  _proto.clearGcTimeout = function clearGcTimeout() {
    if (this.gcTimeout) {
      clearTimeout(this.gcTimeout);
      this.gcTimeout = undefined;
    }
  };

  _proto.setData = function setData(updater, options) {
    var _this$config$isDataEq, _this$config;

    var prevData = this.state.data; // Get the new data

    var data = (0, _utils.functionalUpdate)(updater, prevData); // Structurally share data between prev and new data if needed

    if (this.config.structuralSharing) {
      data = (0, _utils.replaceEqualDeep)(prevData, data);
    } // Use prev data if an isDataEqual function is defined and returns `true`


    if ((_this$config$isDataEq = (_this$config = this.config).isDataEqual) == null ? void 0 : _this$config$isDataEq.call(_this$config, prevData, data)) {
      data = prevData;
    } // Try to determine if more data can be fetched


    var canFetchMore = hasMorePages(this.config, data); // Set data and mark it as cached

    this.dispatch({
      type: ActionType.Success,
      data: data,
      canFetchMore: canFetchMore,
      updatedAt: options == null ? void 0 : options.updatedAt
    });
  }
  /**
   * @deprecated
   */
  ;

  _proto.clear = function clear() {
    _utils.Console.warn('react-query: clear() has been deprecated, please use remove() instead');

    this.remove();
  };

  _proto.remove = function remove() {
    this.queryCache.removeQuery(this);
  };

  _proto.destroy = function destroy() {
    this.clearGcTimeout();
    this.clearTimersObservers();
    this.cancel();
  };

  _proto.isActive = function isActive() {
    return this.observers.some(function (observer) {
      return observer.config.enabled;
    });
  };

  _proto.isStale = function isStale() {
    return this.state.isInvalidated || this.state.status !== _types.QueryStatus.Success || this.observers.some(function (observer) {
      return observer.getCurrentResult().isStale;
    });
  };

  _proto.isStaleByTime = function isStaleByTime(staleTime) {
    if (staleTime === void 0) {
      staleTime = 0;
    }

    return this.state.isInvalidated || this.state.status !== _types.QueryStatus.Success || this.state.updatedAt + staleTime <= Date.now();
  };

  _proto.onInteraction = function onInteraction(type) {
    // Execute the first observer which is enabled,
    // stale and wants to refetch on this interaction.
    var staleObserver = this.observers.find(function (observer) {
      var config = observer.config;

      var _observer$getCurrentR = observer.getCurrentResult(),
          isStale = _observer$getCurrentR.isStale;

      return config.enabled && (type === 'focus' && (config.refetchOnWindowFocus === 'always' || config.refetchOnWindowFocus && isStale) || type === 'online' && (config.refetchOnReconnect === 'always' || config.refetchOnReconnect && isStale));
    });

    if (staleObserver) {
      staleObserver.fetch();
    } // Continue any paused fetch


    this.continue();
  }
  /**
   * @deprectated
   */
  ;

  _proto.subscribe = function subscribe(listener) {
    var observer = new _queryObserver.QueryObserver(this.config);
    observer.subscribe(listener);
    return observer;
  };

  _proto.subscribeObserver = function subscribeObserver(observer) {
    this.observers.push(observer); // Stop the query from being garbage collected

    this.clearGcTimeout();
  };

  _proto.unsubscribeObserver = function unsubscribeObserver(observer) {
    this.observers = this.observers.filter(function (x) {
      return x !== observer;
    });

    if (!this.observers.length) {
      // If the transport layer does not support cancellation
      // we'll let the query continue so the result can be cached
      if (this.isTransportCancelable) {
        this.cancel();
      }

      this.scheduleGc();
    }
  };

  _proto.invalidate = function invalidate() {
    if (!this.state.isInvalidated) {
      this.dispatch({
        type: ActionType.Invalidate
      });
    }
  }
  /**
   * @deprectated
   */
  ;

  _proto.refetch = function refetch(options, config) {
    var promise = this.fetch(undefined, config);

    if (!(options == null ? void 0 : options.throwOnError)) {
      promise = promise.catch(_utils.noop);
    }

    return promise;
  }
  /**
   * @deprectated
   */
  ;

  _proto.fetchMore = function fetchMore(fetchMoreVariable, options, config) {
    return this.fetch({
      fetchMore: {
        fetchMoreVariable: fetchMoreVariable,
        previous: (options == null ? void 0 : options.previous) || false
      }
    }, config);
  };

  _proto.fetch = function fetch(options, config) {
    try {
      var _exit2 = false;

      var _this4 = this;

      return _invoke(function () {
        if (_this4.promise) {
          return function () {
            if ((options == null ? void 0 : options.fetchMore) && _this4.state.data) {
              // Silently cancel current fetch if the user wants to fetch more
              return _awaitIgnored(_this4.cancel(true));
            } else {
              // Return current promise if we are already fetching
              _exit2 = true;
              return _this4.promise;
            }
          }();
        }
      }, function (_result2) {
        if (_exit2) return _result2;

        // Update config if passed, otherwise the config from the last execution is used
        if (config) {
          _this4.updateConfig(config);
        }

        config = _this4.config; // Get the query function params

        var filter = config.queryFnParamsFilter;
        var params = filter ? filter(_this4.queryKey) : _this4.queryKey;
        _this4.promise = _async(function () {
          return _catch(function () {
            var data;
            return _invoke(function () {
              if (config.infinite) {
                return _await(_this4.startInfiniteFetch(config, params, options), function (_this4$startInfiniteF) {
                  data = _this4$startInfiniteF;
                });
              } else {
                return _await(_this4.startFetch(config, params, options), function (_this4$startFetch) {
                  data = _this4$startFetch;
                });
              }
            }, function () {
              // Set success state
              _this4.setData(data); // Cleanup


              delete _this4.promise; // Return data

              return data;
            });
          }, function (error) {
            // Set error state if needed
            if (!((0, _utils.isCancelledError)(error) && error.silent)) {
              _this4.dispatch({
                type: ActionType.Error,
                error: error
              });
            } // Log error


            if (!(0, _utils.isCancelledError)(error)) {
              _utils.Console.error(error);
            } // Cleanup


            delete _this4.promise; // Propagate error

            throw error;
          });
        })();
        return _this4.promise;
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.startFetch = function startFetch(config, params, _options) {
    // Create function to fetch the data
    var fetchData = function fetchData() {
      return config.queryFn.apply(config, params);
    }; // Set to fetching state if not already in it


    if (!this.state.isFetching) {
      this.dispatch({
        type: ActionType.Fetch
      });
    } // Try to fetch the data


    return this.tryFetchData(config, fetchData);
  };

  _proto.startInfiniteFetch = function startInfiniteFetch(config, params, options) {
    var fetchMore = options == null ? void 0 : options.fetchMore;

    var _ref = fetchMore || {},
        previous = _ref.previous,
        fetchMoreVariable = _ref.fetchMoreVariable;

    var isFetchingMore = fetchMore ? previous ? 'previous' : 'next' : false;
    var prevPages = this.state.data || []; // Create function to fetch a page

    var fetchPage = _async(function (pages, prepend, cursor) {
      var lastPage = getLastPage(pages, prepend);

      if (typeof cursor === 'undefined' && typeof lastPage !== 'undefined' && config.getFetchMore) {
        cursor = config.getFetchMore(lastPage, pages);
      }

      return !Boolean(cursor) && typeof lastPage !== 'undefined' ? pages : _await(config.queryFn.apply(config, params.concat([cursor])), function (page) {
        return prepend ? [page].concat(pages) : [].concat(pages, [page]);
      });
    }); // Create function to fetch the data


    var fetchData = function fetchData() {
      if (isFetchingMore) {
        return fetchPage(prevPages, previous, fetchMoreVariable);
      } else if (!prevPages.length) {
        return fetchPage([]);
      } else {
        var promise = fetchPage([]);

        for (var i = 1; i < prevPages.length; i++) {
          promise = promise.then(fetchPage);
        }

        return promise;
      }
    }; // Set to fetching state if not already in it


    if (!this.state.isFetching || this.state.isFetchingMore !== isFetchingMore) {
      this.dispatch({
        type: ActionType.Fetch,
        isFetchingMore: isFetchingMore
      });
    } // Try to get the data


    return this.tryFetchData(config, fetchData);
  };

  _proto.tryFetchData = function tryFetchData(config, fn) {
    var _this5 = this;

    return new Promise(function (outerResolve, outerReject) {
      var resolved = false;
      var continueLoop;
      var cancelTransport;

      var done = function done() {
        resolved = true;
        delete _this5.cancelFetch;
        delete _this5.continueFetch;
        delete _this5.isTransportCancelable; // End loop if currently paused

        continueLoop == null ? void 0 : continueLoop();
      };

      var resolve = function resolve(value) {
        done();
        outerResolve(value);
      };

      var reject = function reject(value) {
        done();
        outerReject(value);
      }; // Create callback to cancel this fetch


      _this5.cancelFetch = function (silent) {
        reject(new _utils.CancelledError(silent));
        cancelTransport == null ? void 0 : cancelTransport();
      }; // Create callback to continue this fetch


      _this5.continueFetch = function () {
        continueLoop == null ? void 0 : continueLoop();
      }; // Create loop function


      var run = _async(function () {
        return _catch(function () {
          // Execute query
          var promiseOrValue = fn(); // Check if the transport layer support cancellation

          if ((0, _utils.isCancelable)(promiseOrValue)) {
            cancelTransport = function cancelTransport() {
              try {
                promiseOrValue.cancel();
              } catch (_unused) {}
            };

            _this5.isTransportCancelable = true;
          } // Await data


          return _await(promiseOrValue, function (_promiseOrValue) {
            resolve(_promiseOrValue);
          });
        }, function (error) {
          // Stop if the fetch is already resolved
          if (resolved) {
            return;
          } // Do we need to retry the request?


          var failureCount = _this5.state.failureCount;
          var retry = config.retry,
              retryDelay = config.retryDelay;
          var shouldRetry = retry === true || failureCount < retry || typeof retry === 'function' && retry(failureCount, error);

          if (!shouldRetry) {
            // We are done if the query does not need to be retried
            reject(error);
            return;
          } // Increase the failureCount


          _this5.dispatch({
            type: ActionType.Failed
          }); // Delay


          return _await((0, _utils.sleep)((0, _utils.functionalUpdate)(retryDelay, failureCount) || 0), function () {
            // Pause retry if the document is not visible or when the device is offline
            return _invoke(function () {
              if (!(0, _utils.isDocumentVisible)() || !(0, _utils.isOnline)()) {
                return _awaitIgnored(new Promise(function (continueResolve) {
                  continueLoop = continueResolve;
                }));
              }
            }, function () {
              if (!resolved) {
                run();
              }
            }); // Try again if not resolved yet
          });
        });
      }); // Start loop


      run();
    });
  };

  return Query;
}();

exports.Query = Query;

function getLastPage(pages, previous) {
  return previous ? pages[0] : pages[pages.length - 1];
}

function hasMorePages(config, pages, previous) {
  if (config.infinite && config.getFetchMore && Array.isArray(pages)) {
    return Boolean(config.getFetchMore(getLastPage(pages, previous), pages));
  }
}

function getDefaultState(config) {
  var data = typeof config.initialData === 'function' ? config.initialData() : config.initialData;
  var status = typeof data !== 'undefined' ? _types.QueryStatus.Success : config.enabled ? _types.QueryStatus.Loading : _types.QueryStatus.Idle;
  return {
    canFetchMore: hasMorePages(config, data),
    data: data,
    error: null,
    failureCount: 0,
    isFetching: status === _types.QueryStatus.Loading,
    isFetchingMore: false,
    isInitialData: true,
    isInvalidated: false,
    status: status,
    updateCount: 0,
    updatedAt: Date.now()
  };
}

function queryReducer(state, action) {
  var _action$updatedAt;

  switch (action.type) {
    case ActionType.Failed:
      return (0, _extends2.default)({}, state, {
        failureCount: state.failureCount + 1
      });

    case ActionType.Fetch:
      return (0, _extends2.default)({}, state, {
        failureCount: 0,
        isFetching: true,
        isFetchingMore: action.isFetchingMore || false,
        status: typeof state.data !== 'undefined' ? _types.QueryStatus.Success : _types.QueryStatus.Loading
      });

    case ActionType.Success:
      return (0, _extends2.default)({}, state, {
        canFetchMore: action.canFetchMore,
        data: action.data,
        error: null,
        failureCount: 0,
        isFetching: false,
        isFetchingMore: false,
        isInitialData: false,
        isInvalidated: false,
        status: _types.QueryStatus.Success,
        updateCount: state.updateCount + 1,
        updatedAt: (_action$updatedAt = action.updatedAt) != null ? _action$updatedAt : Date.now()
      });

    case ActionType.Error:
      return (0, _extends2.default)({}, state, {
        error: action.error,
        failureCount: state.failureCount + 1,
        isFetching: false,
        isFetchingMore: false,
        status: _types.QueryStatus.Error,
        throwInErrorBoundary: true,
        updateCount: state.updateCount + 1
      });

    case ActionType.Invalidate:
      return (0, _extends2.default)({}, state, {
        isInvalidated: true
      });

    default:
      return state;
  }
}