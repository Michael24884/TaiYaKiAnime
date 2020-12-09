"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.getDefaultReactQueryConfig = getDefaultReactQueryConfig;
exports.mergeReactQueryConfigs = mergeReactQueryConfigs;
exports.getResolvedQueryConfig = getResolvedQueryConfig;
exports.isResolvedQueryConfig = isResolvedQueryConfig;
exports.getResolvedMutationConfig = getResolvedMutationConfig;
exports.DEFAULT_CONFIG = exports.defaultQueryKeySerializerFn = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _utils = require("./utils");

// CONFIG
var defaultQueryKeySerializerFn = function defaultQueryKeySerializerFn(queryKey) {
  try {
    var arrayQueryKey = Array.isArray(queryKey) ? queryKey : [queryKey];
    var queryHash = (0, _utils.stableStringify)(arrayQueryKey);
    arrayQueryKey = JSON.parse(queryHash);
    return [queryHash, arrayQueryKey];
  } catch (_unused) {
    throw new Error('A valid query key is required!');
  }
};
/**
 * Config merging strategy
 *
 * When using hooks the config will be merged in the following order:
 *
 * 1. These defaults.
 * 2. Defaults from the hook query cache.
 * 3. Combined defaults from any config providers in the tree.
 * 4. Query/mutation config provided to the hook.
 *
 * When using a query cache directly the config will be merged in the following order:
 *
 * 1. These defaults.
 * 2. Defaults from the query cache.
 * 3. Query/mutation config provided to the query cache method.
 */


exports.defaultQueryKeySerializerFn = defaultQueryKeySerializerFn;
var DEFAULT_CONFIG = {
  queries: {
    cacheTime: 5 * 60 * 1000,
    enabled: true,
    notifyOnStatusChange: true,
    queryFn: function queryFn() {
      return Promise.reject();
    },
    queryKeySerializerFn: defaultQueryKeySerializerFn,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: function retryDelay(attemptIndex) {
      return Math.min(1000 * Math.pow(2, attemptIndex), 30000);
    },
    staleTime: 0,
    structuralSharing: true
  }
};
exports.DEFAULT_CONFIG = DEFAULT_CONFIG;

function getDefaultReactQueryConfig() {
  return {
    queries: (0, _extends2.default)({}, DEFAULT_CONFIG.queries),
    mutations: (0, _extends2.default)({}, DEFAULT_CONFIG.mutations)
  };
}

function mergeReactQueryConfigs(a, b) {
  return {
    shared: (0, _extends2.default)({}, a.shared, b.shared),
    queries: (0, _extends2.default)({}, a.queries, b.queries),
    mutations: (0, _extends2.default)({}, a.mutations, b.mutations)
  };
}

function getResolvedQueryConfig(queryCache, queryKey, contextConfig, config) {
  var queryCacheConfig = queryCache.getDefaultConfig();
  var resolvedConfig = (0, _extends2.default)({}, DEFAULT_CONFIG.queries, queryCacheConfig == null ? void 0 : queryCacheConfig.shared, queryCacheConfig == null ? void 0 : queryCacheConfig.queries, contextConfig == null ? void 0 : contextConfig.shared, contextConfig == null ? void 0 : contextConfig.queries, config);
  var result = resolvedConfig.queryKeySerializerFn(queryKey);
  resolvedConfig.queryCache = queryCache;
  resolvedConfig.queryHash = result[0];
  resolvedConfig.queryKey = result[1];
  return resolvedConfig;
}

function isResolvedQueryConfig(config) {
  return Boolean(config.queryHash);
}

function getResolvedMutationConfig(queryCache, contextConfig, config) {
  var queryCacheConfig = queryCache.getDefaultConfig();
  return (0, _extends2.default)({}, DEFAULT_CONFIG.mutations, queryCacheConfig == null ? void 0 : queryCacheConfig.shared, queryCacheConfig == null ? void 0 : queryCacheConfig.mutations, contextConfig == null ? void 0 : contextConfig.shared, contextConfig == null ? void 0 : contextConfig.mutations, config);
}