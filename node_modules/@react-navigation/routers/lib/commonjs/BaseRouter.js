"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nonSecure = require("nanoid/non-secure");

/**
 * Base router object that can be used when writing custom routers.
 * This provides few helper methods to handle common actions such as `RESET`.
 */
const BaseRouter = {
  getStateForAction(state, action) {
    switch (action.type) {
      case 'SET_PARAMS':
        {
          const index = action.source ? state.routes.findIndex(r => r.key === action.source) : state.index;

          if (index === -1) {
            return null;
          }

          return { ...state,
            routes: state.routes.map((r, i) => i === index ? { ...r,
              params: { ...r.params,
                ...action.payload.params
              }
            } : r)
          };
        }

      case 'RESET':
        {
          const nextState = action.payload;

          if (nextState.routes.length === 0 || nextState.routes.some(route => !state.routeNames.includes(route.name))) {
            return null;
          }

          if (nextState.stale === false) {
            if (state.routeNames.length !== nextState.routeNames.length || nextState.routeNames.some(name => !state.routeNames.includes(name))) {
              return null;
            }

            return { ...nextState,
              routes: nextState.routes.map(route => route.key ? route : { ...route,
                key: "".concat(route.name, "-").concat((0, _nonSecure.nanoid)())
              })
            };
          }

          return nextState;
        }

      default:
        return null;
    }
  },

  shouldActionChangeFocus(action) {
    return action.type === 'NAVIGATE';
  }

};
var _default = BaseRouter;
exports.default = _default;
//# sourceMappingURL=BaseRouter.js.map