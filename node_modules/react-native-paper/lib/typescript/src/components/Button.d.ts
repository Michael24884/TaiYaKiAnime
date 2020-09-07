import * as React from 'react';
import { Animated, View, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { IconSource } from './Icon';
import Surface from './Surface';
declare type Props = React.ComponentProps<typeof Surface> & {
    /**
     * Mode of the button. You can change the mode to adjust the styling to give it desired emphasis.
     * - `text` - flat button without background or outline (low emphasis)
     * - `outlined` - button with an outline (medium emphasis)
     * - `contained` - button with a background color and elevation shadow (high emphasis)
     */
    mode?: 'text' | 'outlined' | 'contained';
    /**
     * Whether the color is a dark color. A dark button will render light text and vice-versa. Only applicable for `contained` mode.
     */
    dark?: boolean;
    /**
     * Use a compact look, useful for `text` buttons in a row.
     */
    compact?: boolean;
    /**
     * Custom text color for flat button, or background color for contained button.
     */
    color?: string;
    /**
     * Whether to show a loading indicator.
     */
    loading?: boolean;
    /**
     * Icon to display for the `Button`.
     */
    icon?: IconSource;
    /**
     * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
     */
    disabled?: boolean;
    /**
     * Label text of the button.
     */
    children: React.ReactNode;
    /**
     * Make the label text uppercased. Note that this won't work if you pass React elements as children.
     */
    uppercase?: boolean;
    /**
     * Accessibility label for the button. This is read by the screen reader when the user taps the button.
     */
    accessibilityLabel?: string;
    /**
     * Function to execute on press.
     */
    onPress?: () => void;
    /**
     * Style of button's inner content.
     * Use this prop to apply custom height and width.
     */
    contentStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    /**
     * Style for the button text.
     */
    labelStyle?: StyleProp<TextStyle>;
    /**
     * @optional
     */
    theme: ReactNativePaper.Theme;
    /**
     * testID to be used on tests.
     */
    testID?: string;
};
declare type State = {
    elevation: Animated.Value;
};
/**
 * A button is component that the user can press to trigger an action.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/button-1.png" />
 *     <figcaption>Text button</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/button-2.png" />
 *     <figcaption>Outlined button</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/button-3.png" />
 *     <figcaption>Contained button</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Button } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Button icon="camera" mode="contained" onPress={() => console.log('Pressed')}>
 *     Press me
 *   </Button>
 * );
 *
 * export default MyComponent;
 * ```
 */
declare class Button extends React.Component<Props, State> {
    static defaultProps: Partial<Props>;
    state: {
        elevation: Animated.Value;
    };
    private handlePressIn;
    private handlePressOut;
    render(): JSX.Element;
}
declare const _default: (React.ComponentClass<Pick<Pick<import("react-native").ViewProps & React.RefAttributes<View> & {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    theme: ReactNativePaper.Theme;
}, "ref" | "style" | "children" | "onLayout" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityComponentType" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityTraits" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "pointerEvents" | "key" | "hitSlop" | "removeClippedSubviews" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture"> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<ReactNativePaper.Theme> | undefined;
} & {
    children?: React.ReactNode;
} & {
    /**
     * Mode of the button. You can change the mode to adjust the styling to give it desired emphasis.
     * - `text` - flat button without background or outline (low emphasis)
     * - `outlined` - button with an outline (medium emphasis)
     * - `contained` - button with a background color and elevation shadow (high emphasis)
     */
    mode?: "text" | "outlined" | "contained" | undefined;
    /**
     * Whether the color is a dark color. A dark button will render light text and vice-versa. Only applicable for `contained` mode.
     */
    dark?: boolean | undefined;
    /**
     * Use a compact look, useful for `text` buttons in a row.
     */
    compact?: boolean | undefined;
    /**
     * Custom text color for flat button, or background color for contained button.
     */
    color?: string | undefined;
    /**
     * Whether to show a loading indicator.
     */
    loading?: boolean | undefined;
    /**
     * Icon to display for the `Button`.
     */
    icon?: string | number | import("react-native").ImageURISource | import("react-native").ImageURISource[] | Readonly<{
        source: string | number | import("react-native").ImageURISource | import("react-native").ImageURISource[];
        direction: "rtl" | "ltr" | "auto";
    }> | ((props: {
        size: number;
        allowFontScaling?: boolean | undefined;
    } & {
        color: string;
    }) => React.ReactNode) | undefined;
    /**
     * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
     */
    disabled?: boolean | undefined;
    /**
     * Label text of the button.
     */
    children: React.ReactNode;
    /**
     * Make the label text uppercased. Note that this won't work if you pass React elements as children.
     */
    uppercase?: boolean | undefined;
    /**
     * Accessibility label for the button. This is read by the screen reader when the user taps the button.
     */
    accessibilityLabel?: string | undefined;
    /**
     * Function to execute on press.
     */
    onPress?: (() => void) | undefined;
    /**
     * Style of button's inner content.
     * Use this prop to apply custom height and width.
     */
    contentStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    /**
     * Style for the button text.
     */
    labelStyle?: StyleProp<TextStyle>;
    /**
     * @optional
     */
    theme: ReactNativePaper.Theme;
    /**
     * testID to be used on tests.
     */
    testID?: string | undefined;
}, "ref" | "style" | "children" | "color" | "icon" | "onLayout" | "onPress" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityComponentType" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityTraits" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "pointerEvents" | "key" | "disabled" | "hitSlop" | "removeClippedSubviews" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "dark" | "labelStyle" | "mode" | "compact" | "loading" | "uppercase" | "contentStyle"> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<ReactNativePaper.Theme> | undefined;
}, any> & import("@callstack/react-theme-provider/typings/hoist-non-react-statics").NonReactStatics<(React.ComponentClass<Pick<import("react-native").ViewProps & React.RefAttributes<View> & {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    theme: ReactNativePaper.Theme;
}, "ref" | "style" | "children" | "onLayout" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityComponentType" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityTraits" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "pointerEvents" | "key" | "hitSlop" | "removeClippedSubviews" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture"> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<ReactNativePaper.Theme> | undefined;
} & {
    children?: React.ReactNode;
} & {
    /**
     * Mode of the button. You can change the mode to adjust the styling to give it desired emphasis.
     * - `text` - flat button without background or outline (low emphasis)
     * - `outlined` - button with an outline (medium emphasis)
     * - `contained` - button with a background color and elevation shadow (high emphasis)
     */
    mode?: "text" | "outlined" | "contained" | undefined;
    /**
     * Whether the color is a dark color. A dark button will render light text and vice-versa. Only applicable for `contained` mode.
     */
    dark?: boolean | undefined;
    /**
     * Use a compact look, useful for `text` buttons in a row.
     */
    compact?: boolean | undefined;
    /**
     * Custom text color for flat button, or background color for contained button.
     */
    color?: string | undefined;
    /**
     * Whether to show a loading indicator.
     */
    loading?: boolean | undefined;
    /**
     * Icon to display for the `Button`.
     */
    icon?: string | number | import("react-native").ImageURISource | import("react-native").ImageURISource[] | Readonly<{
        source: string | number | import("react-native").ImageURISource | import("react-native").ImageURISource[];
        direction: "rtl" | "ltr" | "auto";
    }> | ((props: {
        size: number;
        allowFontScaling?: boolean | undefined;
    } & {
        color: string;
    }) => React.ReactNode) | undefined;
    /**
     * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
     */
    disabled?: boolean | undefined;
    /**
     * Label text of the button.
     */
    children: React.ReactNode;
    /**
     * Make the label text uppercased. Note that this won't work if you pass React elements as children.
     */
    uppercase?: boolean | undefined;
    /**
     * Accessibility label for the button. This is read by the screen reader when the user taps the button.
     */
    accessibilityLabel?: string | undefined;
    /**
     * Function to execute on press.
     */
    onPress?: (() => void) | undefined;
    /**
     * Style of button's inner content.
     * Use this prop to apply custom height and width.
     */
    contentStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    /**
     * Style for the button text.
     */
    labelStyle?: StyleProp<TextStyle>;
    /**
     * @optional
     */
    theme: ReactNativePaper.Theme;
    /**
     * testID to be used on tests.
     */
    testID?: string | undefined;
}, any> & typeof Button) | (React.FunctionComponent<Pick<import("react-native").ViewProps & React.RefAttributes<View> & {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    theme: ReactNativePaper.Theme;
}, "ref" | "style" | "children" | "onLayout" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityComponentType" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityTraits" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "pointerEvents" | "key" | "hitSlop" | "removeClippedSubviews" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture"> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<ReactNativePaper.Theme> | undefined;
} & {
    children?: React.ReactNode;
} & {
    /**
     * Mode of the button. You can change the mode to adjust the styling to give it desired emphasis.
     * - `text` - flat button without background or outline (low emphasis)
     * - `outlined` - button with an outline (medium emphasis)
     * - `contained` - button with a background color and elevation shadow (high emphasis)
     */
    mode?: "text" | "outlined" | "contained" | undefined;
    /**
     * Whether the color is a dark color. A dark button will render light text and vice-versa. Only applicable for `contained` mode.
     */
    dark?: boolean | undefined;
    /**
     * Use a compact look, useful for `text` buttons in a row.
     */
    compact?: boolean | undefined;
    /**
     * Custom text color for flat button, or background color for contained button.
     */
    color?: string | undefined;
    /**
     * Whether to show a loading indicator.
     */
    loading?: boolean | undefined;
    /**
     * Icon to display for the `Button`.
     */
    icon?: string | number | import("react-native").ImageURISource | import("react-native").ImageURISource[] | Readonly<{
        source: string | number | import("react-native").ImageURISource | import("react-native").ImageURISource[];
        direction: "rtl" | "ltr" | "auto";
    }> | ((props: {
        size: number;
        allowFontScaling?: boolean | undefined;
    } & {
        color: string;
    }) => React.ReactNode) | undefined;
    /**
     * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
     */
    disabled?: boolean | undefined;
    /**
     * Label text of the button.
     */
    children: React.ReactNode;
    /**
     * Make the label text uppercased. Note that this won't work if you pass React elements as children.
     */
    uppercase?: boolean | undefined;
    /**
     * Accessibility label for the button. This is read by the screen reader when the user taps the button.
     */
    accessibilityLabel?: string | undefined;
    /**
     * Function to execute on press.
     */
    onPress?: (() => void) | undefined;
    /**
     * Style of button's inner content.
     * Use this prop to apply custom height and width.
     */
    contentStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    /**
     * Style for the button text.
     */
    labelStyle?: StyleProp<TextStyle>;
    /**
     * @optional
     */
    theme: ReactNativePaper.Theme;
    /**
     * testID to be used on tests.
     */
    testID?: string | undefined;
}> & typeof Button), {}>) | (React.FunctionComponent<Pick<Pick<import("react-native").ViewProps & React.RefAttributes<View> & {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    theme: ReactNativePaper.Theme;
}, "ref" | "style" | "children" | "onLayout" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityComponentType" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityTraits" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "pointerEvents" | "key" | "hitSlop" | "removeClippedSubviews" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture"> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<ReactNativePaper.Theme> | undefined;
} & {
    children?: React.ReactNode;
} & {
    /**
     * Mode of the button. You can change the mode to adjust the styling to give it desired emphasis.
     * - `text` - flat button without background or outline (low emphasis)
     * - `outlined` - button with an outline (medium emphasis)
     * - `contained` - button with a background color and elevation shadow (high emphasis)
     */
    mode?: "text" | "outlined" | "contained" | undefined;
    /**
     * Whether the color is a dark color. A dark button will render light text and vice-versa. Only applicable for `contained` mode.
     */
    dark?: boolean | undefined;
    /**
     * Use a compact look, useful for `text` buttons in a row.
     */
    compact?: boolean | undefined;
    /**
     * Custom text color for flat button, or background color for contained button.
     */
    color?: string | undefined;
    /**
     * Whether to show a loading indicator.
     */
    loading?: boolean | undefined;
    /**
     * Icon to display for the `Button`.
     */
    icon?: string | number | import("react-native").ImageURISource | import("react-native").ImageURISource[] | Readonly<{
        source: string | number | import("react-native").ImageURISource | import("react-native").ImageURISource[];
        direction: "rtl" | "ltr" | "auto";
    }> | ((props: {
        size: number;
        allowFontScaling?: boolean | undefined;
    } & {
        color: string;
    }) => React.ReactNode) | undefined;
    /**
     * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
     */
    disabled?: boolean | undefined;
    /**
     * Label text of the button.
     */
    children: React.ReactNode;
    /**
     * Make the label text uppercased. Note that this won't work if you pass React elements as children.
     */
    uppercase?: boolean | undefined;
    /**
     * Accessibility label for the button. This is read by the screen reader when the user taps the button.
     */
    accessibilityLabel?: string | undefined;
    /**
     * Function to execute on press.
     */
    onPress?: (() => void) | undefined;
    /**
     * Style of button's inner content.
     * Use this prop to apply custom height and width.
     */
    contentStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    /**
     * Style for the button text.
     */
    labelStyle?: StyleProp<TextStyle>;
    /**
     * @optional
     */
    theme: ReactNativePaper.Theme;
    /**
     * testID to be used on tests.
     */
    testID?: string | undefined;
}, "ref" | "style" | "children" | "color" | "icon" | "onLayout" | "onPress" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityComponentType" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityTraits" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "pointerEvents" | "key" | "disabled" | "hitSlop" | "removeClippedSubviews" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture" | "dark" | "labelStyle" | "mode" | "compact" | "loading" | "uppercase" | "contentStyle"> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<ReactNativePaper.Theme> | undefined;
}> & import("@callstack/react-theme-provider/typings/hoist-non-react-statics").NonReactStatics<(React.ComponentClass<Pick<import("react-native").ViewProps & React.RefAttributes<View> & {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    theme: ReactNativePaper.Theme;
}, "ref" | "style" | "children" | "onLayout" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityComponentType" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityTraits" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "pointerEvents" | "key" | "hitSlop" | "removeClippedSubviews" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture"> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<ReactNativePaper.Theme> | undefined;
} & {
    children?: React.ReactNode;
} & {
    /**
     * Mode of the button. You can change the mode to adjust the styling to give it desired emphasis.
     * - `text` - flat button without background or outline (low emphasis)
     * - `outlined` - button with an outline (medium emphasis)
     * - `contained` - button with a background color and elevation shadow (high emphasis)
     */
    mode?: "text" | "outlined" | "contained" | undefined;
    /**
     * Whether the color is a dark color. A dark button will render light text and vice-versa. Only applicable for `contained` mode.
     */
    dark?: boolean | undefined;
    /**
     * Use a compact look, useful for `text` buttons in a row.
     */
    compact?: boolean | undefined;
    /**
     * Custom text color for flat button, or background color for contained button.
     */
    color?: string | undefined;
    /**
     * Whether to show a loading indicator.
     */
    loading?: boolean | undefined;
    /**
     * Icon to display for the `Button`.
     */
    icon?: string | number | import("react-native").ImageURISource | import("react-native").ImageURISource[] | Readonly<{
        source: string | number | import("react-native").ImageURISource | import("react-native").ImageURISource[];
        direction: "rtl" | "ltr" | "auto";
    }> | ((props: {
        size: number;
        allowFontScaling?: boolean | undefined;
    } & {
        color: string;
    }) => React.ReactNode) | undefined;
    /**
     * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
     */
    disabled?: boolean | undefined;
    /**
     * Label text of the button.
     */
    children: React.ReactNode;
    /**
     * Make the label text uppercased. Note that this won't work if you pass React elements as children.
     */
    uppercase?: boolean | undefined;
    /**
     * Accessibility label for the button. This is read by the screen reader when the user taps the button.
     */
    accessibilityLabel?: string | undefined;
    /**
     * Function to execute on press.
     */
    onPress?: (() => void) | undefined;
    /**
     * Style of button's inner content.
     * Use this prop to apply custom height and width.
     */
    contentStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    /**
     * Style for the button text.
     */
    labelStyle?: StyleProp<TextStyle>;
    /**
     * @optional
     */
    theme: ReactNativePaper.Theme;
    /**
     * testID to be used on tests.
     */
    testID?: string | undefined;
}, any> & typeof Button) | (React.FunctionComponent<Pick<import("react-native").ViewProps & React.RefAttributes<View> & {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    theme: ReactNativePaper.Theme;
}, "ref" | "style" | "children" | "onLayout" | "testID" | "nativeID" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityComponentType" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityTraits" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "pointerEvents" | "key" | "hitSlop" | "removeClippedSubviews" | "collapsable" | "needsOffscreenAlphaCompositing" | "renderToHardwareTextureAndroid" | "focusable" | "shouldRasterizeIOS" | "isTVSelectable" | "hasTVPreferredFocus" | "tvParallaxProperties" | "tvParallaxShiftDistanceX" | "tvParallaxShiftDistanceY" | "tvParallaxTiltAngle" | "tvParallaxMagnification" | "onStartShouldSetResponder" | "onMoveShouldSetResponder" | "onResponderEnd" | "onResponderGrant" | "onResponderReject" | "onResponderMove" | "onResponderRelease" | "onResponderStart" | "onResponderTerminationRequest" | "onResponderTerminate" | "onStartShouldSetResponderCapture" | "onMoveShouldSetResponderCapture" | "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchCancel" | "onTouchEndCapture"> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<ReactNativePaper.Theme> | undefined;
} & {
    children?: React.ReactNode;
} & {
    /**
     * Mode of the button. You can change the mode to adjust the styling to give it desired emphasis.
     * - `text` - flat button without background or outline (low emphasis)
     * - `outlined` - button with an outline (medium emphasis)
     * - `contained` - button with a background color and elevation shadow (high emphasis)
     */
    mode?: "text" | "outlined" | "contained" | undefined;
    /**
     * Whether the color is a dark color. A dark button will render light text and vice-versa. Only applicable for `contained` mode.
     */
    dark?: boolean | undefined;
    /**
     * Use a compact look, useful for `text` buttons in a row.
     */
    compact?: boolean | undefined;
    /**
     * Custom text color for flat button, or background color for contained button.
     */
    color?: string | undefined;
    /**
     * Whether to show a loading indicator.
     */
    loading?: boolean | undefined;
    /**
     * Icon to display for the `Button`.
     */
    icon?: string | number | import("react-native").ImageURISource | import("react-native").ImageURISource[] | Readonly<{
        source: string | number | import("react-native").ImageURISource | import("react-native").ImageURISource[];
        direction: "rtl" | "ltr" | "auto";
    }> | ((props: {
        size: number;
        allowFontScaling?: boolean | undefined;
    } & {
        color: string;
    }) => React.ReactNode) | undefined;
    /**
     * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
     */
    disabled?: boolean | undefined;
    /**
     * Label text of the button.
     */
    children: React.ReactNode;
    /**
     * Make the label text uppercased. Note that this won't work if you pass React elements as children.
     */
    uppercase?: boolean | undefined;
    /**
     * Accessibility label for the button. This is read by the screen reader when the user taps the button.
     */
    accessibilityLabel?: string | undefined;
    /**
     * Function to execute on press.
     */
    onPress?: (() => void) | undefined;
    /**
     * Style of button's inner content.
     * Use this prop to apply custom height and width.
     */
    contentStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    /**
     * Style for the button text.
     */
    labelStyle?: StyleProp<TextStyle>;
    /**
     * @optional
     */
    theme: ReactNativePaper.Theme;
    /**
     * testID to be used on tests.
     */
    testID?: string | undefined;
}> & typeof Button), {}>);
export default _default;
