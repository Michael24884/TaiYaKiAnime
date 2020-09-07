function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import ReanimatedModule from './ReanimatedModule';
/**
 * Styles allowed to be direcly updated in UI thread
 */

let UI_THREAD_PROPS_WHITELIST = {
  opacity: true,
  transform: true,

  /* colors */
  backgroundColor: true,
  borderRightColor: true,
  borderBottomColor: true,
  borderColor: true,
  borderEndColor: true,
  borderLeftColor: true,
  borderStartColor: true,
  borderTopColor: true,

  /* ios styles */
  shadowOpacity: true,
  shadowRadius: true,

  /* legacy android transform properties */
  scaleX: true,
  scaleY: true,
  translateX: true,
  translateY: true
};
/**
 * Whitelist of view props that can be updated in native thread via UIManagerModule
 */

let NATIVE_THREAD_PROPS_WHITELIST = {
  borderBottomWidth: true,
  borderEndWidth: true,
  borderLeftWidth: true,
  borderRightWidth: true,
  borderStartWidth: true,
  borderTopWidth: true,
  borderWidth: true,
  bottom: true,
  flex: true,
  flexGrow: true,
  flexShrink: true,
  height: true,
  left: true,
  margin: true,
  marginBottom: true,
  marginEnd: true,
  marginHorizontal: true,
  marginLeft: true,
  marginRight: true,
  marginStart: true,
  marginTop: true,
  marginVertical: true,
  maxHeight: true,
  maxWidth: true,
  minHeight: true,
  minWidth: true,
  padding: true,
  paddingBottom: true,
  paddingEnd: true,
  paddingHorizontal: true,
  paddingLeft: true,
  paddingRight: true,
  paddingStart: true,
  paddingTop: true,
  paddingVertical: true,
  right: true,
  start: true,
  top: true,
  width: true,
  zIndex: true,
  borderBottomEndRadius: true,
  borderBottomLeftRadius: true,
  borderBottomRightRadius: true,
  borderBottomStartRadius: true,
  borderRadius: true,
  borderTopEndRadius: true,
  borderTopLeftRadius: true,
  borderTopRightRadius: true,
  borderTopStartRadius: true,
  opacity: true,
  elevation: true,
  fontSize: true,
  lineHeight: true,
  textShadowRadius: true,
  letterSpacing: true,

  /* strings */
  display: true,
  backfaceVisibility: true,
  overflow: true,
  resizeMode: true,
  fontStyle: true,
  fontWeight: true,
  textAlign: true,
  textDecorationLine: true,
  fontFamily: true,
  textAlignVertical: true,
  fontVariant: true,
  textDecorationStyle: true,
  textTransform: true,
  writingDirection: true,

  /* text color */
  color: true
};

function configureProps() {
  ReanimatedModule.configureProps(Object.keys(NATIVE_THREAD_PROPS_WHITELIST), Object.keys(UI_THREAD_PROPS_WHITELIST));
}

export function addWhitelistedNativeProps(props) {
  NATIVE_THREAD_PROPS_WHITELIST = _objectSpread(_objectSpread({}, NATIVE_THREAD_PROPS_WHITELIST), props);
  configureProps();
}
export function addWhitelistedUIProps(props) {
  UI_THREAD_PROPS_WHITELIST = _objectSpread(_objectSpread({}, UI_THREAD_PROPS_WHITELIST), props);
  configureProps();
}
configureProps();
//# sourceMappingURL=ConfigHelper.js.map