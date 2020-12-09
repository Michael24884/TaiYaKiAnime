"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.useMutation = useMutation;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _utils = require("./utils");

var _config = require("../core/config");

var _utils2 = require("../core/utils");

var _types = require("../core/types");

var _ReactQueryCacheProvider = require("./ReactQueryCacheProvider");

var _ReactQueryConfigProvider = require("./ReactQueryConfigProvider");

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

var ActionType = {
  Reset: 0,
  Loading: 1,
  Resolve: 2,
  Reject: 3
};

// HOOK
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

function getDefaultState() {
  return (0, _extends2.default)({}, (0, _utils2.getStatusProps)(_types.QueryStatus.Idle), {
    data: undefined,
    error: null
  });
}

function mutationReducer(state, action) {
  switch (action.type) {
    case ActionType.Reset:
      return getDefaultState();

    case ActionType.Loading:
      return (0, _extends2.default)({}, (0, _utils2.getStatusProps)(_types.QueryStatus.Loading), {
        data: undefined,
        error: null
      });

    case ActionType.Resolve:
      return (0, _extends2.default)({}, (0, _utils2.getStatusProps)(_types.QueryStatus.Success), {
        data: action.data,
        error: null
      });

    case ActionType.Reject:
      return (0, _extends2.default)({}, (0, _utils2.getStatusProps)(_types.QueryStatus.Error), {
        data: undefined,
        error: action.error
      });

    default:
      return state;
  }
}

function useMutation(mutationFn, config) {
  if (config === void 0) {
    config = {};
  }

  var cache = (0, _ReactQueryCacheProvider.useQueryCache)();
  var contextConfig = (0, _ReactQueryConfigProvider.useContextConfig)(); // Get resolved config

  var resolvedConfig = (0, _config.getResolvedMutationConfig)(cache, contextConfig, config);

  var _React$useReducer = _react.default.useReducer(mutationReducer, null, getDefaultState),
      state = _React$useReducer[0],
      unsafeDispatch = _React$useReducer[1];

  var dispatch = (0, _utils.useMountedCallback)(unsafeDispatch);

  var latestMutationRef = _react.default.useRef();

  var latestMutationFnRef = _react.default.useRef(mutationFn);

  latestMutationFnRef.current = mutationFn;

  var latestConfigRef = _react.default.useRef(resolvedConfig);

  latestConfigRef.current = resolvedConfig;

  var mutate = _react.default.useCallback(_async(function (variables, mutateConfig) {
    if (mutateConfig === void 0) {
      mutateConfig = {};
    }

    var latestConfig = latestConfigRef.current;
    var mutationId = (0, _utils2.uid)();
    latestMutationRef.current = mutationId;

    var isLatest = function isLatest() {
      return latestMutationRef.current === mutationId;
    };

    var snapshotValue;
    return _catch(function () {
      dispatch({
        type: ActionType.Loading
      });
      return _await(latestConfig.onMutate == null ? void 0 : latestConfig.onMutate(variables), function (_latestConfig$onMutat) {
        snapshotValue = _latestConfig$onMutat;
        var latestMutationFn = latestMutationFnRef.current;
        return _await(latestMutationFn(variables), function (data) {
          if (isLatest()) {
            dispatch({
              type: ActionType.Resolve,
              data: data
            });
          }

          return _await(latestConfig.onSuccess == null ? void 0 : latestConfig.onSuccess(data, variables), function () {
            return _await(mutateConfig.onSuccess == null ? void 0 : mutateConfig.onSuccess(data, variables), function () {
              return _await(latestConfig.onSettled == null ? void 0 : latestConfig.onSettled(data, null, variables), function () {
                return _await(mutateConfig.onSettled == null ? void 0 : mutateConfig.onSettled(data, null, variables), function () {
                  return data;
                });
              });
            });
          });
        });
      });
    }, function (error) {
      _utils2.Console.error(error);

      return _await(latestConfig.onError == null ? void 0 : latestConfig.onError(error, variables, snapshotValue), function () {
        return _await(mutateConfig.onError == null ? void 0 : mutateConfig.onError(error, variables, snapshotValue), function () {
          return _await(latestConfig.onSettled == null ? void 0 : latestConfig.onSettled(undefined, error, variables, snapshotValue), function () {
            return _await(mutateConfig.onSettled == null ? void 0 : mutateConfig.onSettled(undefined, error, variables, snapshotValue), function () {
              if (isLatest()) {
                dispatch({
                  type: ActionType.Reject,
                  error: error
                });
              }

              if (mutateConfig.throwOnError || latestConfig.throwOnError) {
                throw error;
              }
            });
          });
        });
      });
    });
  }), [dispatch]);

  _react.default.useEffect(function () {
    var latestConfig = latestConfigRef.current;
    var suspense = latestConfig.suspense,
        useErrorBoundary = latestConfig.useErrorBoundary;

    if ((useErrorBoundary || suspense) && state.error) {
      throw state.error;
    }
  }, [state.error]);

  var reset = _react.default.useCallback(function () {
    dispatch({
      type: ActionType.Reset
    });
  }, [dispatch]);

  var result = (0, _extends2.default)({}, state, {
    reset: reset
  });
  return [mutate, result];
}