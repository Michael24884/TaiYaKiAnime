"use strict";

var _Animated = _interopRequireWildcard(require("./Animated"));

var _ReanimatedModule = _interopRequireDefault(require("./ReanimatedModule"));

var _react = _interopRequireDefault(require("react"));

var _reactTestRenderer = _interopRequireDefault(require("react-test-renderer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

jest.mock('./ReanimatedEventEmitter');
jest.mock('./ReanimatedModule');
jest.mock('./derived/evaluateOnce');
jest.mock('./core/AnimatedProps');
const {
  Value,
  timing,
  spring,
  decay
} = _Animated.default;
describe('Reanimated backward compatible API', () => {
  beforeEach(() => {
    let numberOfNodes = 0;

    _ReanimatedModule.default.createNode = () => numberOfNodes++;

    _ReanimatedModule.default.dropNode = () => numberOfNodes--;

    _ReanimatedModule.default.getNumberOfNodes = () => numberOfNodes;
  });

  const checkIfNodesGetDetachedCorrectly = animation => {
    class TestComponent extends _react.default.Component {
      constructor(props) {
        super(props);
        this.transX = new Value(0);
        this.anim = animation.node(this.transX, animation.config);
      }

      start(method) {
        this.anim.start(method);
      }

      stop(res) {
        this.anim.__stopImmediately_testOnly(res);
      }

      render() {
        return /*#__PURE__*/_react.default.createElement(_Animated.default.View, {
          style: {
            transform: [{
              translateX: this.transX
            }]
          }
        });
      }

    }

    const ref = _react.default.createRef();

    let result;

    const resMethod = ({
      finished
    }) => result = finished;

    const initial = _ReanimatedModule.default.getNumberOfNodes();

    const wrapper = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(TestComponent, {
      ref: ref
    }));

    const before = _ReanimatedModule.default.getNumberOfNodes();

    ref.current.start(resMethod);

    const during = _ReanimatedModule.default.getNumberOfNodes();

    ref.current.stop(true);

    const after = _ReanimatedModule.default.getNumberOfNodes();

    wrapper.unmount();

    const final = _ReanimatedModule.default.getNumberOfNodes();

    return result && initial === final && after === before && during > after && initial === 0 && before === 4;
  };

  it('fails if timing does not attach nodes correctly', () => {
    expect(checkIfNodesGetDetachedCorrectly({
      node: timing,
      name: 'timing',
      config: {
        duration: 5000,
        toValue: 120,
        easing: _Animated.Easing.inOut(_Animated.Easing.ease)
      }
    })).toBeTruthy();
  });
  it('fails if decay does not attach nodes correctly', () => {
    expect(checkIfNodesGetDetachedCorrectly({
      node: decay,
      name: 'decay',
      config: {
        deceleration: 0.997
      }
    })).toBeTruthy();
  });
  it('fails if spring does not attach nodes correctly', () => {
    expect(checkIfNodesGetDetachedCorrectly({
      node: spring,
      name: 'spring',
      config: {
        toValue: 0,
        damping: 7,
        mass: 1,
        stiffness: 121.6,
        overshootClamping: false,
        restSpeedThreshold: 0.001,
        restDisplacementThreshold: 0.001
      }
    })).toBeTruthy();
  });
  it('fails if animation related nodes are still attached after detaching of value with two animations triggered', () => {
    const {
      timing,
      Value
    } = _Animated.default;

    class TestComponent extends _react.default.Component {
      constructor(props) {
        super(props);
        this.transX = new Value(0);
        const config = {
          duration: 5000,
          toValue: -120,
          easing: _Animated.Easing.inOut(_Animated.Easing.ease)
        };
        this.anim = timing(this.transX, config);
        this.anim2 = timing(this.transX, config);
      }

      start1(method) {
        this.anim.start(method);
      }

      start2(method) {
        this.anim2.start(method);
      }

      render() {
        return /*#__PURE__*/_react.default.createElement(_Animated.default.View, {
          style: {
            transform: [{
              translateX: this.transX
            }]
          }
        });
      }

    }

    const ref = _react.default.createRef();

    const wrapper = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(TestComponent, {
      ref: ref
    }));

    let result = true;

    const resMethod = ({
      finished
    }) => result = finished;

    ref.current.start1(resMethod);
    ref.current.start2(resMethod);
    expect(result).toBeFalsy();
    result = true;

    const numberOfNodesBeforeUnmounting = _ReanimatedModule.default.getNumberOfNodes();

    wrapper.unmount();
    expect(result).toBeFalsy();

    const numberOfNodesAfterUnmounting = _ReanimatedModule.default.getNumberOfNodes();

    const pass = numberOfNodesAfterUnmounting === 0 && numberOfNodesBeforeUnmounting > 0;
    expect(pass).toBeTruthy();
  });
  it('fails if animation related nodes are detached if there are two children and only one detach', () => {
    const {
      timing,
      Value
    } = _Animated.default;
    const transX = new Value(0);

    const wrapper1 = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_Animated.default.View, {
      style: {
        transform: [{
          translateX: transX
        }]
      }
    }));

    const wrapper2 = _reactTestRenderer.default.create( /*#__PURE__*/_react.default.createElement(_Animated.default.View, {
      style: {
        transform: [{
          translateX: transX
        }]
      }
    }));

    const config = {
      duration: 5000,
      toValue: -120,
      easing: _Animated.Easing.inOut(_Animated.Easing.ease)
    };
    const anim = timing(transX, config);
    anim.start();

    const numberOfNodesBeforeDetach = _ReanimatedModule.default.getNumberOfNodes();

    wrapper1.unmount();

    const numberOfNodesAfterDetach = _ReanimatedModule.default.getNumberOfNodes();

    const result = // 3 means AnimatedProps, AnimatedStyle and AnimatedTransform
    // which are nodes not related to animation and has to be detached
    numberOfNodesBeforeDetach - 3 === numberOfNodesAfterDetach && numberOfNodesAfterDetach > 3;
    expect(result).toBeTruthy();
    wrapper2.unmount();
    expect(_ReanimatedModule.default.getNumberOfNodes() === 0).toBeTruthy();
  });
  it('fails if animation attaches some node without view related', () => {
    const {
      timing,
      Value
    } = _Animated.default;
    const transX = new Value(0);
    const config = {
      duration: 5000,
      toValue: -120,
      easing: _Animated.Easing.inOut(_Animated.Easing.ease)
    };
    const anim = timing(transX, config);
    anim.start();
    expect(_ReanimatedModule.default.getNumberOfNodes()).toBe(0);
  });
});
//# sourceMappingURL=Animated.test.js.map