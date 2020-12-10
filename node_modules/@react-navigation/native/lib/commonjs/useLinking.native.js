"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useLinking;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _core = require("@react-navigation/core");

var _escapeStringRegexp = _interopRequireDefault(require("escape-string-regexp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

let isUsingLinking = false;

function useLinking(ref, {
  enabled = true,
  prefixes,
  config,
  getInitialURL = () => Promise.race([_reactNative.Linking.getInitialURL(), new Promise(resolve => // Timeout in 150ms if `getInitialState` doesn't resolve
  // Workaround for https://github.com/facebook/react-native/issues/25675
  setTimeout(resolve, 150))]),
  subscribe = listener => {
    const callback = ({
      url
    }) => listener(url);

    _reactNative.Linking.addEventListener('url', callback);

    return () => _reactNative.Linking.removeEventListener('url', callback);
  },
  getStateFromPath = _core.getStateFromPath
}) {
  React.useEffect(() => {
    if (enabled !== false && isUsingLinking) {
      throw new Error(['Looks like you have configured linking in multiple places. This is likely an error since deep links should only be handled in one place to avoid conflicts. Make sure that:', "- You are not using both 'linking' prop and 'useLinking'", "- You don't have 'useLinking' in multiple components", _reactNative.Platform.OS === 'android' ? "- You have set 'android:launchMode=singleTask' in the '<activity />' section of the 'AndroidManifest.xml' file to avoid launching multiple instances" : ''].join('\n').trim());
    } else {
      isUsingLinking = enabled !== false;
    }

    return () => {
      isUsingLinking = false;
    };
  }); // We store these options in ref to avoid re-creating getInitialState and re-subscribing listeners
  // This lets user avoid wrapping the items in `React.useCallback` or `React.useMemo`
  // Not re-creating `getInitialState` is important coz it makes it easier for the user to use in an effect

  const enabledRef = React.useRef(enabled);
  const prefixesRef = React.useRef(prefixes);
  const configRef = React.useRef(config);
  const getInitialURLRef = React.useRef(getInitialURL);
  const getStateFromPathRef = React.useRef(getStateFromPath);
  React.useEffect(() => {
    enabledRef.current = enabled;
    prefixesRef.current = prefixes;
    configRef.current = config;
    getInitialURLRef.current = getInitialURL;
    getStateFromPathRef.current = getStateFromPath;
  }, [config, enabled, prefixes, getInitialURL, getStateFromPath]);
  const extractPathFromURL = React.useCallback(url => {
    for (const prefix of prefixesRef.current) {
      var _prefix$match$, _prefix$match;

      const protocol = (_prefix$match$ = (_prefix$match = prefix.match(/^[^:]+:\/\//)) === null || _prefix$match === void 0 ? void 0 : _prefix$match[0]) !== null && _prefix$match$ !== void 0 ? _prefix$match$ : '';
      const host = prefix.replace(protocol, '');
      const prefixRegex = new RegExp("^".concat((0, _escapeStringRegexp.default)(protocol)).concat(host.split('.').map(it => it === '*' ? '[^/]+' : (0, _escapeStringRegexp.default)(it)).join('\\.')));

      if (prefixRegex.test(url)) {
        return url.replace(prefixRegex, '');
      }
    }

    return undefined;
  }, []);
  const getInitialState = React.useCallback(async () => {
    if (!enabledRef.current) {
      return undefined;
    }

    const url = await getInitialURLRef.current();
    const path = url ? extractPathFromURL(url) : null;

    if (path) {
      return getStateFromPathRef.current(path, configRef.current);
    } else {
      return undefined;
    }
  }, [extractPathFromURL]);
  React.useEffect(() => {
    const listener = url => {
      if (!enabled) {
        return;
      }

      const path = extractPathFromURL(url);
      const navigation = ref.current;

      if (navigation && path) {
        const state = getStateFromPathRef.current(path, configRef.current);

        if (state) {
          // Make sure that the routes in the state exist in the root navigator
          // Otherwise there's an error in the linking configuration
          const rootState = navigation.getRootState();

          if (state.routes.some(r => !(rootState === null || rootState === void 0 ? void 0 : rootState.routeNames.includes(r.name)))) {
            console.warn("The navigation state parsed from the URL contains routes not present in the root navigator. This usually means that the linking configuration doesn't match the navigation structure. See https://reactnavigation.org/docs/configuring-links for more details on how to specify a linking configuration.");
            return;
          }

          const action = (0, _core.getActionFromState)(state, configRef.current);

          if (action !== undefined) {
            try {
              navigation.dispatch(action);
            } catch (e) {
              // Ignore any errors from deep linking.
              // This could happen in case of malformed links, navigation object not being initialized etc.
              console.warn("An error occurred when trying to handle the link '".concat(path, "': ").concat(e.message));
            }
          } else {
            navigation.resetRoot(state);
          }
        }
      }
    };

    return subscribe(listener);
  }, [enabled, ref, subscribe, extractPathFromURL]);
  return {
    getInitialState
  };
}
//# sourceMappingURL=useLinking.native.js.map