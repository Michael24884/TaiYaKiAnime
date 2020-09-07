"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _reactNativeGestureHandler = require("react-native-gesture-handler");

var _reactNativeReanimated = _interopRequireDefault(require("react-native-reanimated"));

var _TabBar = _interopRequireDefault(require("./TabBar"));

var _SceneView = _interopRequireDefault(require("./SceneView"));

var _Pager = _interopRequireDefault(require("./Pager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const GestureHandlerWrapper = _reactNativeGestureHandler.GestureHandlerRootView !== null && _reactNativeGestureHandler.GestureHandlerRootView !== void 0 ? _reactNativeGestureHandler.GestureHandlerRootView : _reactNative.View;

class TabView extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      layout: _objectSpread({
        width: 0,
        height: 0
      }, this.props.initialLayout)
    });

    _defineProperty(this, "jumpToIndex", index => {
      if (index !== this.props.navigationState.index) {
        this.props.onIndexChange(index);
      }
    });

    _defineProperty(this, "handleLayout", e => {
      const {
        height,
        width
      } = e.nativeEvent.layout;

      if (this.state.layout.width === width && this.state.layout.height === height) {
        return;
      }

      this.setState({
        layout: {
          height,
          width
        }
      });
    });
  }

  render() {
    const {
      position: positionListener,
      onSwipeStart,
      onSwipeEnd,
      navigationState,
      lazy,
      lazyPreloadDistance,
      removeClippedSubviews,
      keyboardDismissMode,
      swipeEnabled,
      swipeVelocityImpact,
      timingConfig,
      springConfig,
      tabBarPosition,
      renderTabBar,
      renderScene,
      renderLazyPlaceholder,
      sceneContainerStyle,
      style,
      gestureHandlerProps,
      springVelocityScale,
      renderPager
    } = this.props;
    const {
      layout
    } = this.state;
    return /*#__PURE__*/React.createElement(GestureHandlerWrapper, {
      onLayout: this.handleLayout,
      style: [styles.pager, style]
    }, renderPager({
      navigationState,
      layout,
      keyboardDismissMode,
      swipeEnabled,
      swipeVelocityImpact,
      timingConfig,
      springConfig,
      onSwipeStart,
      onSwipeEnd,
      onIndexChange: this.jumpToIndex,
      springVelocityScale,
      removeClippedSubviews,
      gestureHandlerProps,
      children: ({
        position,
        render,
        addListener,
        removeListener,
        jumpTo
      }) => {
        // All of the props here must not change between re-renders
        // This is crucial to optimizing the routes with PureComponent
        const sceneRendererProps = {
          position,
          layout,
          jumpTo
        };
        return /*#__PURE__*/React.createElement(React.Fragment, null, positionListener ? /*#__PURE__*/React.createElement(_reactNativeReanimated.default.Code, {
          exec: _reactNativeReanimated.default.set(positionListener, position)
        }) : null, tabBarPosition === 'top' && renderTabBar(_objectSpread(_objectSpread({}, sceneRendererProps), {}, {
          navigationState
        })), render(navigationState.routes.map((route, i) => {
          return /*#__PURE__*/React.createElement(_SceneView.default, _extends({}, sceneRendererProps, {
            addListener: addListener,
            removeListener: removeListener,
            key: route.key,
            index: i,
            lazy: lazy,
            lazyPreloadDistance: lazyPreloadDistance,
            navigationState: navigationState,
            style: sceneContainerStyle
          }), ({
            loading
          }) => loading ? renderLazyPlaceholder({
            route
          }) : renderScene(_objectSpread(_objectSpread({}, sceneRendererProps), {}, {
            route
          })));
        })), tabBarPosition === 'bottom' && renderTabBar(_objectSpread(_objectSpread({}, sceneRendererProps), {}, {
          navigationState
        })));
      }
    }));
  }

}

exports.default = TabView;

_defineProperty(TabView, "defaultProps", {
  tabBarPosition: 'top',
  renderTabBar: props => /*#__PURE__*/React.createElement(_TabBar.default, props),
  renderLazyPlaceholder: () => null,
  keyboardDismissMode: 'auto',
  swipeEnabled: true,
  lazy: false,
  lazyPreloadDistance: 0,
  removeClippedSubviews: false,
  springConfig: {},
  timingConfig: {},
  gestureHandlerProps: {},
  renderPager: props => /*#__PURE__*/React.createElement(_Pager.default, props)
});

const styles = _reactNative.StyleSheet.create({
  pager: {
    flex: 1,
    overflow: 'hidden'
  }
});
//# sourceMappingURL=TabView.js.map