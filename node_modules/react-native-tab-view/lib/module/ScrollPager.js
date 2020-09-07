function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import * as React from 'react';
import { StyleSheet, Keyboard, InteractionManager } from 'react-native';
import Animated from 'react-native-reanimated';
const {
  event,
  divide,
  onChange,
  cond,
  eq,
  round,
  call,
  Value
} = Animated;
export default class ScrollPager extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "initialOffset", {
      x: this.props.navigationState.index * this.props.layout.width,
      y: 0
    });

    _defineProperty(this, "wasTouched", false);

    _defineProperty(this, "interactionHandle", null);

    _defineProperty(this, "scrollViewRef", /*#__PURE__*/React.createRef());

    _defineProperty(this, "jumpTo", key => {
      this.wasTouched = false;
      const {
        navigationState,
        keyboardDismissMode,
        onIndexChange
      } = this.props;
      const index = navigationState.routes.findIndex(route => route.key === key);

      if (navigationState.index === index) {
        this.scrollTo(index * this.props.layout.width);
      } else {
        onIndexChange(index);

        if (keyboardDismissMode === 'auto') {
          Keyboard.dismiss();
        }
      }
    });

    _defineProperty(this, "scrollTo", (x, animated = true) => {
      if (this.scrollViewRef.current) {
        var _this$scrollViewRef$c, _this$scrollViewRef$c2;

        // getNode() is not necessary in newer versions of React Native
        const scrollView = // @ts-ignore
        typeof ((_this$scrollViewRef$c = this.scrollViewRef.current) === null || _this$scrollViewRef$c === void 0 ? void 0 : _this$scrollViewRef$c.scrollTo) === 'function' ? this.scrollViewRef.current : (_this$scrollViewRef$c2 = this.scrollViewRef.current) === null || _this$scrollViewRef$c2 === void 0 ? void 0 : _this$scrollViewRef$c2.getNode(); // @ts-ignore

        scrollView === null || scrollView === void 0 ? void 0 : scrollView.scrollTo({
          x,
          animated: animated
        });
      }
    });

    _defineProperty(this, "enterListeners", []);

    _defineProperty(this, "addListener", (type, listener) => {
      switch (type) {
        case 'enter':
          this.enterListeners.push(listener);
          break;
      }
    });

    _defineProperty(this, "removeListener", (type, listener) => {
      switch (type) {
        case 'enter':
          {
            const index = this.enterListeners.indexOf(listener);

            if (index > -1) {
              this.enterListeners.splice(index, 1);
            }

            break;
          }
      }
    });

    _defineProperty(this, "position", new Animated.Value(this.props.navigationState.index * this.props.layout.width));

    _defineProperty(this, "onScroll", event([{
      nativeEvent: {
        contentOffset: {
          x: this.position
        }
      }
    }]));

    _defineProperty(this, "layoutWidthNode", new Value(this.props.layout.width));

    _defineProperty(this, "relativePosition", divide(this.position, this.layoutWidthNode));
  }

  componentDidMount() {
    if (this.props.layout.width) {
      this.scrollTo(this.props.navigationState.index * this.props.layout.width, false);
    }
  }

  componentDidUpdate(prevProps) {
    const offset = this.props.navigationState.index * this.props.layout.width;

    if (prevProps.navigationState.routes.length !== this.props.navigationState.routes.length || prevProps.layout.width !== this.props.layout.width) {
      this.scrollTo(offset, false);
    } else if (prevProps.navigationState.index !== this.props.navigationState.index) {
      this.scrollTo(offset);
    }

    if (prevProps.layout.width !== this.props.layout.width) {
      this.layoutWidthNode.setValue(this.props.layout.width);
    }
  }

  componentWillUnmount() {
    if (this.interactionHandle !== null) {
      InteractionManager.clearInteractionHandle(this.interactionHandle);
    }
  }

  render() {
    const {
      children,
      layout,
      onSwipeStart,
      onSwipeEnd,
      overscroll,
      onIndexChange,
      navigationState
    } = this.props;

    const handleSwipeStart = () => {
      this.wasTouched = false;
      onSwipeStart === null || onSwipeStart === void 0 ? void 0 : onSwipeStart();
      this.interactionHandle = InteractionManager.createInteractionHandle();
    };

    const handleSwipeEnd = () => {
      this.wasTouched = true;
      onSwipeEnd === null || onSwipeEnd === void 0 ? void 0 : onSwipeEnd();

      if (this.interactionHandle !== null) {
        InteractionManager.clearInteractionHandle(this.interactionHandle);
      }
    };

    return children({
      position: this.relativePosition,
      addListener: this.addListener,
      removeListener: this.removeListener,
      jumpTo: this.jumpTo,
      render: children => /*#__PURE__*/React.createElement(Animated.ScrollView, {
        pagingEnabled: true,
        directionalLockEnabled: true,
        keyboardDismissMode: "on-drag",
        keyboardShouldPersistTaps: "always",
        overScrollMode: "never",
        scrollToOverflowEnabled: true,
        scrollEnabled: this.props.swipeEnabled,
        automaticallyAdjustContentInsets: false,
        bounces: overscroll,
        scrollsToTop: false,
        showsHorizontalScrollIndicator: false,
        scrollEventThrottle: 1,
        onScroll: this.onScroll,
        onScrollBeginDrag: handleSwipeStart,
        onScrollEndDrag: handleSwipeEnd,
        onMomentumScrollEnd: this.onScroll,
        contentOffset: this.initialOffset,
        style: styles.container,
        contentContainerStyle: layout.width ? {
          flexDirection: 'row',
          width: layout.width * navigationState.routes.length,
          flex: 1
        } : null,
        ref: this.scrollViewRef
      }, children, /*#__PURE__*/React.createElement(Animated.Code, {
        exec: onChange(this.relativePosition, cond(eq(round(this.relativePosition), this.relativePosition), [call([this.relativePosition], ([relativePosition]) => {
          if (this.wasTouched) {
            onIndexChange(relativePosition);
            this.wasTouched = false;
          }
        })]))
      }))
    });
  }

}

_defineProperty(ScrollPager, "defaultProps", {
  bounces: true
});

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
//# sourceMappingURL=ScrollPager.js.map