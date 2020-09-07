import * as React from 'react';
import { Animated, StyleProp, TextStyle } from 'react-native';
declare type Props = React.ComponentProps<typeof Animated.Text> & {
    /**
     * Whether the badge is visible
     */
    visible: boolean;
    /**
     * Content of the `Badge`.
     */
    children?: string | number;
    /**
     * Size of the `Badge`.
     */
    size?: number;
    style?: StyleProp<TextStyle>;
    ref?: React.RefObject<typeof Animated.Text>;
    /**
     * @optional
     */
    theme: ReactNativePaper.Theme;
};
declare type State = {
    opacity: Animated.Value;
};
/**
 * Badges are small status descriptors for UI elements.
 * A badge consists of a small circle, typically containing a number or other short set of characters, that appears in proximity to another object.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="small" src="screenshots/badge-1.png" />
 *     <figcaption>Badge with content</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="small" src="screenshots/badge-2.png" />
 *     <figcaption>Badge without content</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Badge } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Badge>3</Badge>
 * );
 *
 * export default MyComponent;
 * ```
 */
declare class Badge extends React.Component<Props, State> {
    static defaultProps: {
        visible: boolean;
        size: number;
    };
    state: {
        opacity: Animated.Value;
    };
    componentDidUpdate(prevProps: Props): void;
    render(): JSX.Element;
}
declare const _default: (React.ComponentClass<Pick<Props, "ref" | "style" | "children" | "size" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "numberOfLines" | "onLayout" | "onPress" | "onLongPress" | "testID" | "nativeID" | "maxFontSizeMultiplier" | "adjustsFontSizeToFit" | "minimumFontScale" | "suppressHighlighting" | "selectable" | "selectionColor" | "textBreakStrategy" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityComponentType" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityTraits" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "key" | "visible"> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<ReactNativePaper.Theme> | undefined;
}, any> & import("@callstack/react-theme-provider/typings/hoist-non-react-statics").NonReactStatics<(React.ComponentClass<Props, any> & typeof Badge) | (React.FunctionComponent<Props> & typeof Badge), {}>) | (React.FunctionComponent<Pick<Props, "ref" | "style" | "children" | "size" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "numberOfLines" | "onLayout" | "onPress" | "onLongPress" | "testID" | "nativeID" | "maxFontSizeMultiplier" | "adjustsFontSizeToFit" | "minimumFontScale" | "suppressHighlighting" | "selectable" | "selectionColor" | "textBreakStrategy" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityComponentType" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityTraits" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "key" | "visible"> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<ReactNativePaper.Theme> | undefined;
}> & import("@callstack/react-theme-provider/typings/hoist-non-react-statics").NonReactStatics<(React.ComponentClass<Props, any> & typeof Badge) | (React.FunctionComponent<Props> & typeof Badge), {}>);
export default _default;
