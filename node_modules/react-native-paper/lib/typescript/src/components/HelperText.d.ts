import * as React from 'react';
import { Animated, StyleProp, TextStyle } from 'react-native';
import AnimatedText from './Typography/AnimatedText';
import type { $Omit } from '../types';
declare type Props = $Omit<$Omit<React.ComponentPropsWithRef<typeof AnimatedText>, 'padding'>, 'type'> & {
    /**
     * Type of the helper text.
     */
    type: 'error' | 'info';
    /**
     * Whether to display the helper text.
     */
    visible?: boolean;
    /**
     * Whether to apply padding to the helper text.
     */
    padding?: 'none' | 'normal';
    /**
     * Text content of the HelperText.
     */
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
    /**
     * @optional
     */
    theme: ReactNativePaper.Theme;
    /**
     * TestID used for testing purposes
     */
    testID?: string;
};
declare type State = {
    shown: Animated.Value;
    textHeight: number;
};
/**
 * Helper text is used in conjuction with input elements to provide additional hints for the user.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/helper-text.gif" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { HelperText, TextInput } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [text, setText] = React.useState('');
 *
 *    const onChangeText = text => setText(text);
 *
 *   const hasErrors = () => {
 *     return !text.includes('@');
 *   };
 *
 *  return (
 *     <View>
 *       <TextInput label="Email" value={text} onChangeText={onChangeText} />
 *       <HelperText type="error" visible={hasErrors()}>
 *         Email address is invalid!
 *       </HelperText>
 *     </View>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
declare class HelperText extends React.PureComponent<Props, State> {
    static defaultProps: Partial<Props>;
    state: {
        shown: Animated.Value;
        textHeight: number;
    };
    componentDidUpdate(prevProps: Props, prevState: State): void;
    private showText;
    private hideText;
    private handleTextLayout;
    render(): JSX.Element;
}
declare const _default: (React.ComponentClass<Pick<Props, "ref" | "style" | "children" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "numberOfLines" | "onLayout" | "onPress" | "onLongPress" | "testID" | "nativeID" | "maxFontSizeMultiplier" | "adjustsFontSizeToFit" | "minimumFontScale" | "suppressHighlighting" | "selectable" | "selectionColor" | "textBreakStrategy" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityComponentType" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityTraits" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "key" | "type" | "padding" | "visible"> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<ReactNativePaper.Theme> | undefined;
}, any> & import("@callstack/react-theme-provider/typings/hoist-non-react-statics").NonReactStatics<(React.ComponentClass<Props, any> & typeof HelperText) | (React.FunctionComponent<Props> & typeof HelperText), {}>) | (React.FunctionComponent<Pick<Props, "ref" | "style" | "children" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "numberOfLines" | "onLayout" | "onPress" | "onLongPress" | "testID" | "nativeID" | "maxFontSizeMultiplier" | "adjustsFontSizeToFit" | "minimumFontScale" | "suppressHighlighting" | "selectable" | "selectionColor" | "textBreakStrategy" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityComponentType" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityTraits" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors" | "key" | "type" | "padding" | "visible"> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<ReactNativePaper.Theme> | undefined;
}> & import("@callstack/react-theme-provider/typings/hoist-non-react-statics").NonReactStatics<(React.ComponentClass<Props, any> & typeof HelperText) | (React.FunctionComponent<Props> & typeof HelperText), {}>);
export default _default;
