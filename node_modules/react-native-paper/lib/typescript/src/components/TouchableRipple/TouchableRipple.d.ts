import * as React from 'react';
import { TouchableWithoutFeedback, ViewStyle, StyleProp, GestureResponderEvent } from 'react-native';
declare type Props = React.ComponentPropsWithRef<typeof TouchableWithoutFeedback> & {
    /**
     * Whether to render the ripple outside the view bounds.
     */
    borderless?: boolean;
    /**
     * Type of background drawabale to display the feedback (Android).
     * https://facebook.github.io/react-native/docs/touchablenativefeedback.html#background
     */
    background?: Object;
    /**
     * Whether to start the ripple at the center (Web).
     */
    centered?: boolean;
    /**
     * Whether to prevent interaction with the touchable.
     */
    disabled?: boolean;
    /**
     * Function to execute on press. If not set, will cause the touchable to be disabled.
     */
    onPress?: (e: GestureResponderEvent) => void;
    /**
     * Function to execute on long press.
     */
    onLongPress?: (e: GestureResponderEvent) => void;
    /**
     * Color of the ripple effect (Android >= 5.0 and Web).
     */
    rippleColor?: string;
    /**
     * Color of the underlay for the highlight effect (Android < 5.0 and iOS).
     */
    underlayColor?: string;
    /**
     * Content of the `TouchableRipple`.
     */
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    /**
     * @optional
     */
    theme: ReactNativePaper.Theme;
};
/**
 * A wrapper for views that should respond to touches.
 * Provides a material "ink ripple" interaction effect for supported platforms (>= Android Lollipop).
 * On unsupported platforms, it falls back to a highlight effect.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/touchable-ripple.gif" />
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { Text, TouchableRipple } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <TouchableRipple
 *     onPress={() => console.log('Pressed')}
 *     rippleColor="rgba(0, 0, 0, .32)"
 *   >
 *     <Text>Press anywhere</Text>
 *   </TouchableRipple>
 * );
 *
 * export default MyComponent;
 * ```
 */
declare class TouchableRipple extends React.Component<Props> {
    static defaultProps: {
        borderless: boolean;
    };
    /**
     * Whether ripple effect is supported.
     */
    static supported: boolean;
    private handlePressIn;
    private handlePressOut;
    render(): JSX.Element;
}
declare const _default: (React.ComponentClass<Pick<Props, "ref" | "style" | "children" | "onLayout" | "onPress" | "onLongPress" | "testID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityComponentType" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityTraits" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "key" | "disabled" | "hitSlop" | "hasTVPreferredFocus" | "tvParallaxProperties" | "delayLongPress" | "delayPressIn" | "delayPressOut" | "onBlur" | "onFocus" | "onPressIn" | "onPressOut" | "pressRetentionOffset" | "borderless" | "background" | "centered" | "rippleColor" | "underlayColor"> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<ReactNativePaper.Theme> | undefined;
}, any> & import("@callstack/react-theme-provider/typings/hoist-non-react-statics").NonReactStatics<(React.ComponentClass<Props, any> & typeof TouchableRipple) | (React.FunctionComponent<Props> & typeof TouchableRipple), {}>) | (React.FunctionComponent<Pick<Props, "ref" | "style" | "children" | "onLayout" | "onPress" | "onLongPress" | "testID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityComponentType" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityTraits" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "key" | "disabled" | "hitSlop" | "hasTVPreferredFocus" | "tvParallaxProperties" | "delayLongPress" | "delayPressIn" | "delayPressOut" | "onBlur" | "onFocus" | "onPressIn" | "onPressOut" | "pressRetentionOffset" | "borderless" | "background" | "centered" | "rippleColor" | "underlayColor"> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<ReactNativePaper.Theme> | undefined;
}> & import("@callstack/react-theme-provider/typings/hoist-non-react-statics").NonReactStatics<(React.ComponentClass<Props, any> & typeof TouchableRipple) | (React.FunctionComponent<Props> & typeof TouchableRipple), {}>);
export default _default;
