"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useRouteCache;
exports.SUPPRESS_STATE_ACCESS_WARNING = void 0;

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Utilites such as `getFocusedRouteNameFromRoute` need to access state.
 * So we need a way to suppress the warning for those use cases.
 * This is fine since they are internal utilities and this is not public API.
 */
const SUPPRESS_STATE_ACCESS_WARNING = {
  value: false
};
/**
 * Hook to cache route props for each screen in the navigator.
 * This lets add warnings and modifications to the route object but keep references between renders.
 */

exports.SUPPRESS_STATE_ACCESS_WARNING = SUPPRESS_STATE_ACCESS_WARNING;

function useRouteCache(routes) {
  // Cache object which holds route objects for each screen
  const cache = React.useMemo(() => ({
    current: new Map()
  }), []);

  if (process.env.NODE_ENV === 'production') {
    // We don't want the overhead of creating extra maps every render in prod
    return routes;
  }

  cache.current = routes.reduce((acc, route) => {
    const previous = cache.current.get(route);

    if (previous) {
      // If a cached route object already exists, reuse it
      acc.set(route, previous);
    } else {
      const proxy = { ...route
      };
      Object.defineProperty(proxy, 'state', {
        get() {
          if (!SUPPRESS_STATE_ACCESS_WARNING.value) {
            console.warn("Accessing the 'state' property of the 'route' object is not supported. If you want to get the focused route name, use the 'getFocusedRouteNameFromRoute' helper instead: https://reactnavigation.org/docs/screen-options-resolution/#setting-parent-screen-options-based-on-child-navigators-state");
          }

          return route.state;
        }

      });
      acc.set(route, proxy);
    }

    return acc;
  }, new Map());
  return Array.from(cache.current.values());
}
//# sourceMappingURL=useRouteCache.js.map