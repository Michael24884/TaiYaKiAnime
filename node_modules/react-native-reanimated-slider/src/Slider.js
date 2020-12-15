import * as React from "react";
import { I18nManager, View } from "react-native";
import Animated from "react-native-reanimated";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Ballon from "./Ballon";

const {
  Value,
  event,
  cond,
  eq,
  set,
  clockRunning,
  startClock,
  spring,
  stopClock,
  Extrapolate,
  sub,
  Clock,
  divide,
  call,
  interpolate,
  multiply,
  block,
  or
} = Animated;

const BUBBLE_WIDTH = 100;

type Props = {
  minimumTrackTintColor?: string,
  maximumTrackTintColor?: string,
  cacheTrackTintColor?: string,
  /**
   * style for the container view
   */
  style?: any,
  /**
   * color of the border of the slider
   */
  borderColor?: string,
  /**
   * a function that gets the current value of the slider as you slide it,
   * and returns a string to be used in the ballon
   */
  ballon: number => string,

  /**
   * an AnimatedValue from `react-native-reanimated` library which is the
   * current value of the slider.
   */
  progress: typeof Animated.Value,
  /**
   * an AnimatedValue from `react-native-reanimated` library which is the
   * curren value of the cache. the cache is optional and will be rendered behind
   * the main progress indicator.
   */
  cache?: typeof Animated.Value,
  /**
   * an AnimatedValue from `react-native-reanimated` library which is the
   * minimum value of the slider.
   */
  min: typeof Animated.Value,
  /**
   * an AnimatedValue from `react-native-reanimated` library which is the
   * maximum value of the slider.
   */
  max: typeof Animated.Value,
  /**
   * callback called when the users starts sliding
   */
  onSlidingStart: () => void,
  /**
   * callback called when the users stops sliding. the new value will be passed as
   * argument
   */
  onSlidingComplete: number => void,
  /**
   * render custom Ballon to show when sliding.
   */
  renderBallon?: () => React.ReactNode,
  /**
   * this function will be called while sliding, and should set the text inside your custom
   * ballon.
   */
  setBallonText?: string => void,

  /**
   * value to pass to the container of the ballon as `translateY`
   */
  ballonTranslateY: number,

  /**
   * render custom thumb image.
   */
  renderThumbImage?: () => React.ReactNode,

  /**
   * thumb offset from the end of seek
   */
  thumbOffset?: number
};

/**
 * The slider component to show progress. you should install and link `react-native-reanimated`
 * and `react-native-gesture-handler` to be able to use it. All animated values must be imported from
 * `react-native-reanimated`.
 *
 * ## Usage
 *
 * ```js
 * import Slider from 'react-native-reanimated-slider';
 * ...
 *
 * renderBallon=()=>(
 *  <View>
 *    <TextInput ref={this.text} />
 *  </View>
 * )
 *
 * setBallonText=(text)=>{
 *   this.text.setNativeProps({text})
 * }
 *
 * render(){
 *   return (
 *     <Slider
 *       style={{ flex: 1 }}
 *       minimumTrackTintColor="#fff"
 *       thumbTintColor="#fff"
 *       ballon={value => this.convertSecondToTime(value)}
 *       progress={this.currentTime}
 *       min={new Reanimated.Value(0)}
 *       cache={this.playableDuration}
 *       max={this.seekableDuration}
 *       onSlidingStart={this.slidingStart}
 *       onSlidingComplete={this.slidingComplete}
 *
 *       // only if you want to render custom ballon for sliding
 *       renderBallon={this.renderBallon}
 *       setBallonText={this.setBallonText}
 *     />
 *   )
 * }
 * ```
 *
 *
 */
class Slider extends React.Component<Props> {
  static defaultProps = {
    minimumTrackTintColor: "#f3f",
    maximumTrackTintColor: "transparent",
    cacheTrackTintColor: "#777",
    borderColor: "#fff",
    thumbOffset: 7,
    ballonTranslateY: -25,
  };
  ballon = React.createRef();
  constructor(props) {
    const { progress, min, max, cache } = props;
    super(props);
    this.convert_to_percent = value =>
      cond(eq(min, max), 0, divide(value, sub(max, min)));
    this.gestureState = new Value(0);
    this.x = new Value(0);
    this.width = new Value(0);
    this.progress_x = multiply(this.convert_to_percent(progress), this.width);
    this.cache_x = multiply(this.convert_to_percent(cache), this.width);
    this.clamped_x = cond(
      eq(this.width, 0),
      0,
      interpolate(this.x, {
        inputRange: [0, this.width],
        outputRange: [0, this.width],
        extrapolate: Extrapolate.CLAMP
      })
    );
    this.value_x = divide(multiply(this.clamped_x, max), this.width);
    this.onGestureEvent = event([
      {
        nativeEvent: {
          state: this.gestureState,
          x: this.x
        }
      }
    ]);
    this.clock = new Clock();
    this.seek = block([
      cond(
        or(
          eq(this.gestureState, State.ACTIVE),
          eq(this.gestureState, State.BEGAN)
        ),
        [
          call([this.value_x], x => {
            this.props.setBallonText
              ? this.props.setBallonText(props.ballon(x[0]))
              : this.ballon.current.setText(props.ballon(x[0]));
          }),
          cond(
            eq(this.gestureState, State.BEGAN),
            call([this.value_x], () => props.onSlidingStart && props.onSlidingStart())
          ),
          this.clamped_x
        ],
        [
          cond(
            eq(this.gestureState, State.END),
            [
              set(this.gestureState, State.UNDETERMINED),
              call([this.value_x], x => props.onSlidingComplete && props.onSlidingComplete(x[0])),
              this.clamped_x
            ],
            [this.progress_x]
          )
        ]
      )
    ]);
    this.thumb = sub(this.seek, this.props.thumbOffset);
    this.spring_state = {
      finished: new Value(0),
      velocity: new Value(0),
      position: new Value(0),
      time: new Value(0)
    };
    this.runspring = ({ toValue }) => {
      const config = {
        damping: 10,
        mass: 1,
        stiffness: 150,
        overshootClamping: false,
        restSpeedThreshold: 0.001,
        restDisplacementThreshold: 0.001,
        toValue: new Value(0)
      };
      return [
        cond(clockRunning(this.clock), 0, [
          set(this.spring_state.finished, 0),
          set(this.spring_state.velocity, 0),
          // set(this.spring_state.position, from),
          set(config.toValue, toValue),
          startClock(this.clock)
        ]),
        spring(this.clock, this.spring_state, config),
        cond(this.spring_state.finished, [stopClock(this.clock)]),
        this.spring_state.position
      ];
    };
    this.height = cond(
      or(
        eq(this.gestureState, State.BEGAN),
        eq(this.gestureState, State.ACTIVE)
      ),
      [this.runspring({ from: 0, toValue: 1 })],
      cond(
        or(
          eq(this.gestureState, State.UNDETERMINED),
          eq(this.gestureState, State.END)
        ),
        [this.runspring({ from: 1, toValue: 0 })],
        this.spring_state.position
      )
    );
    this.state = { ballon: "" };
  }
  _onLayout = ({ nativeEvent }) => {
    this.width.setValue(nativeEvent.layout.width);
  };
  _renderBallon = () => {
    return <Ballon ref={this.ballon} />;
  };
  _renderThumbImage = style => {
    return <View style={style} />;
  };
  render() {
    const { ballon } = this.state;
    const {
      renderBallon,
      renderThumbImage,
      style,
      minimumTrackTintColor,
      maximumTrackTintColor,
      cacheTrackTintColor,
      borderColor,
      ballonTranslateY,
      thumbOffset
    } = this.props;

    const ballonRenderer = renderBallon || this._renderBallon;
    const thumbRenderer = renderThumbImage || this._renderThumbImage;

    return (
      <PanGestureHandler
        onGestureEvent={this.onGestureEvent}
        onHandlerStateChange={this.onGestureEvent}
        minDist={0}>
        <Animated.View
          style={[
            {
              flex: 1,
              height: 30,
              overflow: "visible",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#3330"
            },
            style
          ]}
          onLayout={this._onLayout}>
          <Animated.View
            style={{
              width: "100%",
              height: 5,
              borderRadius: 2,
              borderColor: borderColor,
              overflow: "hidden",
              borderWidth: 1,
              backgroundColor: maximumTrackTintColor
            }}>
            <Animated.View
              style={{
                backgroundColor: cacheTrackTintColor,
                height: "100%",
                width: this.cache_x,
                [I18nManager.isRTL ? "right" : "left"]: 0,
                position: "absolute"
              }}
            />
            <Animated.View
              style={{
                backgroundColor: minimumTrackTintColor,
                height: "100%",
                maxWidth: "100%",
                width: this.seek,
                [I18nManager.isRTL ? "right" : "left"]: 0,
                position: "absolute"
              }}
            />
          </Animated.View>
          <Animated.View
            style={{
              [I18nManager.isRTL ? "right" : "left"]: this.thumb,
              position: "absolute"
            }}>
            {thumbRenderer({
              backgroundColor: minimumTrackTintColor,
              height: 15,
              width: 15,
              borderRadius: 30
            })}
          </Animated.View>

          <Animated.View
            style={{
              position: "absolute",
              [I18nManager.isRTL ? "right" : "left"]: -50,
              width: BUBBLE_WIDTH,
              opacity: this.height,
              transform: [
                {
                  translateY: ballonTranslateY
                },
                {
                  translateX: this.clamped_x
                },
                {
                  scale: this.height
                }
              ]
            }}>
            {ballonRenderer({ text: ballon })}
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    );
  }
}
export default Slider;
