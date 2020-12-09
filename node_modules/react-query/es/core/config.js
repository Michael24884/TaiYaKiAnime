import _extends from "@babel/runtime/helpers/esm/extends";
import { stableStringify } from './utils';
// CONFIG
export var defaultQueryKeySerializerFn = function defaultQueryKeySerializerFn(queryKey) {
  try {
    var arrayQueryKey = Array.isArray(queryKey) ? queryKey : [queryKey];
    var queryHash = stableStringify(arrayQueryKey);
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

export var DEFAULT_CONFIG = {
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
export function getDefaultReactQueryConfig() {
  return {
    queries: _extends({}, DEFAULT_CONFIG.queries),
    mutations: _extends({}, DEFAULT_CONFIG.mutations)
  };
}
export function mergeReactQueryConfigs(a, b) {
  return {
    shared: _extends({}, a.shared, b.shared),
    queries: _extends({}, a.queries, b.queries),
    mutations: _extends({}, a.mutations, b.mutations)
  };
}
export function getResolvedQueryConfig(queryCache, queryKey, contextConfig, config) {
  var queryCacheConfig = queryCache.getDefaultConfig();

  var resolvedConfig = _extends({}, DEFAULT_CONFIG.queries, queryCacheConfig == null ? void 0 : queryCacheConfig.shared, queryCacheConfig == null ? void 0 : queryCacheConfig.queries, contextConfig == null ? void 0 : contextConfig.shared, contextConfig == null ? void 0 : contextConfig.queries, config);

  var result = resolvedConfig.queryKeySerializerFn(queryKey);
  resolvedConfig.queryCache = queryCache;
  resolvedConfig.queryHash = result[0];
  resolvedConfig.queryKey = result[1];
  return resolvedConfig;
}
export function isResolvedQueryConfig(config) {
  return Boolean(config.queryHash);
}
export function getResolvedMutationConfig(queryCache, contextConfig, config) {
  var queryCacheConfig = queryCache.getDefaultConfig();
  return _extends({}, DEFAULT_CONFIG.mutations, queryCacheConfig == null ? void 0 : queryCacheConfig.shared, queryCacheConfig == null ? void 0 : queryCacheConfig.mutations, contextConfig == null ? void 0 : contextConfig.shared, contextConfig == null ? void 0 : contextConfig.mutations, config);
}