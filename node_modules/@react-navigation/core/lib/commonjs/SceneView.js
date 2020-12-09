"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SceneView;

var React = _interopRequireWildcard(require("react"));

var _NavigationStateContext = _interopRequireDefault(require("./NavigationStateContext"));

var _StaticContainer = _interopRequireDefault(require("./StaticContainer"));

var _EnsureSingleNavigator = _interopRequireDefault(require("./EnsureSingleNavigator"));

var _useOptionsGetters = _interopRequireDefault(require("./useOptionsGetters"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Component which takes care of rendering the screen for a route.
 * It provides all required contexts and applies optimizations when applicable.
 */
function SceneView({
  screen,
  route,
  navigation,
  routeState,
  getState,
  setState,
  options
}) {
  const navigatorKeyRef = React.useRef();
  const getKey = React.useCallback(() => navigatorKeyRef.current, []);
  const {
    addOptionsGetter
  } = (0, _useOptionsGetters.default)({
    key: route.key,
    options,
    navigation
  });
  const setKey = React.useCallback(key => {
    navigatorKeyRef.current = key;
  }, []);
  const getCurrentState = React.useCallback(() => {
    const state = getState();
    const currentRoute = state.routes.find(r => r.key === route.key);
    return currentRoute ? currentRoute.state : undefined;
  }, [getState, route.key]);
  const setCurrentState = React.useCallback(child => {
    const state = getState();
    setState({ ...state,
      routes: state.routes.map(r => r.key === route.key ? { ...r,
        state: child
      } : r)
    });
  }, [getState, route.key, setState]);
  const isInitialRef = React.useRef(true);
  React.useEffect(() => {
    isInitialRef.current = false;
  });
  const getIsInitial = React.useCallback(() => isInitialRef.current, []);
  const context = React.useMemo(() => ({
    state: routeState,
    getState: getCurrentState,
    setState: setCurrentState,
    getKey,
    setKey,
    getIsInitial,
    addOptionsGetter
  }), [routeState, getCurrentState, setCurrentState, getKey, setKey, getIsInitial, addOptionsGetter]);
  const ScreenComponent = screen.getComponent ? screen.getComponent() : screen.component;
  return /*#__PURE__*/React.createElement(_NavigationStateContext.default.Provider, {
    value: context
  }, /*#__PURE__*/React.createElement(_EnsureSingleNavigator.default, null, /*#__PURE__*/React.createElement(_StaticContainer.default, {
    name: screen.name,
    render: ScreenComponent || screen.children,
    navigation: navigation,
    route: route
  }, ScreenComponent !== undefined ? /*#__PURE__*/React.createElement(ScreenComponent, {
    navigation: navigation,
    route: route
  }) : screen.children !== undefined ? screen.children({
    navigation,
    route
  }) : null)));
}
//# sourceMappingURL=SceneView.js.map