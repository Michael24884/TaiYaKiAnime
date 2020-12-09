"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useOnGetState;

var React = _interopRequireWildcard(require("react"));

var _NavigationBuilderContext = _interopRequireDefault(require("./NavigationBuilderContext"));

var _NavigationRouteContext = _interopRequireDefault(require("./NavigationRouteContext"));

var _isArrayEqual = _interopRequireDefault(require("./isArrayEqual"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function useOnGetState({
  getState,
  getStateListeners
}) {
  const {
    addKeyedListener
  } = React.useContext(_NavigationBuilderContext.default);
  const route = React.useContext(_NavigationRouteContext.default);
  const key = route ? route.key : 'root';
  const getRehydratedState = React.useCallback(() => {
    const state = getState(); // Avoid returning new route objects if we don't need to

    const routes = state.routes.map(route => {
      var _getStateListeners$ro;

      const childState = (_getStateListeners$ro = getStateListeners[route.key]) === null || _getStateListeners$ro === void 0 ? void 0 : _getStateListeners$ro.call(getStateListeners);

      if (route.state === childState) {
        return route;
      }

      return { ...route,
        state: childState
      };
    });

    if ((0, _isArrayEqual.default)(state.routes, routes)) {
      return state;
    }

    return { ...state,
      routes
    };
  }, [getState, getStateListeners]);
  React.useEffect(() => {
    return addKeyedListener === null || addKeyedListener === void 0 ? void 0 : addKeyedListener('getState', key, getRehydratedState);
  }, [addKeyedListener, getRehydratedState, key]);
}
//# sourceMappingURL=useOnGetState.js.map