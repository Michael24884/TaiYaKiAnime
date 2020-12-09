"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getActionFromState;

function getActionFromState(state, options) {
  var _state$index, _normalizedConfig$scr;

  // Create a normalized configs object which will be easier to use
  const normalizedConfig = options ? createNormalizedConfigItem(options) : {};
  const routes = state.index != null ? state.routes.slice(0, state.index + 1) : state.routes;

  if (routes.length === 0) {
    return undefined;
  }

  if (!(routes.length === 1 && routes[0].key === undefined || routes.length === 2 && routes[0].key === undefined && routes[0].name === (normalizedConfig === null || normalizedConfig === void 0 ? void 0 : normalizedConfig.initialRouteName) && routes[1].key === undefined)) {
    return {
      type: 'RESET',
      payload: state
    };
  }

  const route = state.routes[(_state$index = state.index) !== null && _state$index !== void 0 ? _state$index : state.routes.length - 1];
  let current = route === null || route === void 0 ? void 0 : route.state;
  let config = normalizedConfig === null || normalizedConfig === void 0 ? void 0 : (_normalizedConfig$scr = normalizedConfig.screens) === null || _normalizedConfig$scr === void 0 ? void 0 : _normalizedConfig$scr[route === null || route === void 0 ? void 0 : route.name];
  let params = { ...route.params
  };
  let payload = route ? {
    name: route.name,
    params
  } : undefined;

  while (current) {
    var _config, _config2, _config2$screens;

    if (current.routes.length === 0) {
      return undefined;
    }

    const routes = current.index != null ? current.routes.slice(0, current.index + 1) : current.routes;
    const route = routes[routes.length - 1]; // Explicitly set to override existing value when merging params

    Object.assign(params, {
      initial: undefined,
      screen: undefined,
      params: undefined,
      state: undefined
    });

    if (routes.length === 1 && routes[0].key === undefined) {
      params.initial = true;
      params.screen = route.name;
    } else if (routes.length === 2 && routes[0].key === undefined && routes[0].name === ((_config = config) === null || _config === void 0 ? void 0 : _config.initialRouteName) && routes[1].key === undefined) {
      params.initial = false;
      params.screen = route.name;
    } else {
      params.state = current;
      break;
    }

    if (route.state) {
      params.params = { ...route.params
      };
      params = params.params;
    } else {
      params.params = route.params;
    }

    current = route.state;
    config = (_config2 = config) === null || _config2 === void 0 ? void 0 : (_config2$screens = _config2.screens) === null || _config2$screens === void 0 ? void 0 : _config2$screens[route.name];
  }

  if (!payload) {
    return;
  } // Try to construct payload for a `NAVIGATE` action from the state
  // This lets us preserve the navigation state and not lose it


  return {
    type: 'NAVIGATE',
    payload
  };
}

const createNormalizedConfigItem = config => typeof config === 'object' && config != null ? {
  initialRouteName: config.initialRouteName,
  screens: config.screens != null ? createNormalizedConfigs(config.screens) : undefined
} : {};

const createNormalizedConfigs = options => Object.entries(options).reduce((acc, [k, v]) => {
  acc[k] = createNormalizedConfigItem(v);
  return acc;
}, {});
//# sourceMappingURL=getActionFromState.js.map