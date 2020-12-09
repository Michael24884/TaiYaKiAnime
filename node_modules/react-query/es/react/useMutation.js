import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import { useMountedCallback } from './utils';
import { getResolvedMutationConfig } from '../core/config';
import { Console, uid, getStatusProps } from '../core/utils';
import { QueryStatus } from '../core/types';
import { useQueryCache } from './ReactQueryCacheProvider';
import { useContextConfig } from './ReactQueryConfigProvider'; // TYPES

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
  return _extends({}, getStatusProps(QueryStatus.Idle), {
    data: undefined,
    error: null
  });
}

function mutationReducer(state, action) {
  switch (action.type) {
    case ActionType.Reset:
      return getDefaultState();

    case ActionType.Loading:
      return _extends({}, getStatusProps(QueryStatus.Loading), {
        data: undefined,
        error: null
      });

    case ActionType.Resolve:
      return _extends({}, getStatusProps(QueryStatus.Success), {
        data: action.data,
        error: null
      });

    case ActionType.Reject:
      return _extends({}, getStatusProps(QueryStatus.Error), {
        data: undefined,
        error: action.error
      });

    default:
      return state;
  }
}

export function useMutation(mutationFn, config) {
  if (config === void 0) {
    config = {};
  }

  var cache = useQueryCache();
  var contextConfig = useContextConfig(); // Get resolved config

  var resolvedConfig = getResolvedMutationConfig(cache, contextConfig, config);

  var _React$useReducer = React.useReducer(mutationReducer, null, getDefaultState),
      state = _React$useReducer[0],
      unsafeDispatch = _React$useReducer[1];

  var dispatch = useMountedCallback(unsafeDispatch);
  var latestMutationRef = React.useRef();
  var latestMutationFnRef = React.useRef(mutationFn);
  latestMutationFnRef.current = mutationFn;
  var latestConfigRef = React.useRef(resolvedConfig);
  latestConfigRef.current = resolvedConfig;
  var mutate = React.useCallback(_async(function (variables, mutateConfig) {
    if (mutateConfig === void 0) {
      mutateConfig = {};
    }

    var latestConfig = latestConfigRef.current;
    var mutationId = uid();
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
      Console.error(error);
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
  React.useEffect(function () {
    var latestConfig = latestConfigRef.current;
    var suspense = latestConfig.suspense,
        useErrorBoundary = latestConfig.useErrorBoundary;

    if ((useErrorBoundary || suspense) && state.error) {
      throw state.error;
    }
  }, [state.error]);
  var reset = React.useCallback(function () {
    dispatch({
      type: ActionType.Reset
    });
  }, [dispatch]);

  var result = _extends({}, state, {
    reset: reset
  });

  return [mutate, result];
}