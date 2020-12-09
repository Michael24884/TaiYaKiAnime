"use strict";

exports.__esModule = true;
exports.dehydrate = dehydrate;
exports.hydrate = hydrate;

// Most config is not dehydrated but instead meant to configure again when
// consuming the de/rehydrated data, typically with useQuery on the client.
// Sometimes it might make sense to prefetch data on the server and include
// in the html-payload, but not consume it on the initial render.
function dehydrateQuery(query) {
  return {
    config: {
      cacheTime: query.cacheTime
    },
    data: query.state.data,
    queryKey: query.queryKey,
    updatedAt: query.state.updatedAt
  };
}

function defaultShouldDehydrate(query) {
  return query.state.status === 'success';
}

function dehydrate(queryCache, dehydrateConfig) {
  var config = dehydrateConfig || {};
  var shouldDehydrate = config.shouldDehydrate || defaultShouldDehydrate;
  var queries = [];
  queryCache.getQueries().forEach(function (query) {
    if (shouldDehydrate(query)) {
      queries.push(dehydrateQuery(query));
    }
  });
  return {
    queries: queries
  };
}

function hydrate(queryCache, dehydratedState) {
  if (typeof dehydratedState !== 'object' || dehydratedState === null) {
    return;
  }

  var queries = dehydratedState.queries || [];
  queries.forEach(function (dehydratedQuery) {
    var resolvedConfig = queryCache.getResolvedQueryConfig(dehydratedQuery.queryKey, dehydratedQuery.config);
    var query = queryCache.getQueryByHash(resolvedConfig.queryHash); // Do not hydrate if an existing query exists with newer data

    if (query && query.state.updatedAt >= dehydratedQuery.updatedAt) {
      return;
    }

    if (!query) {
      query = queryCache.createQuery(resolvedConfig);
    }

    query.setData(dehydratedQuery.data, {
      updatedAt: dehydratedQuery.updatedAt
    });
  });
}