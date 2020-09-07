import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import DialogContent from './DialogContent';
import DialogActions from './DialogActions';
import { DialogTitle as _DialogTitle } from './DialogTitle';
import DialogScrollArea from './DialogScrollArea';
declare type Props = {
    /**
     * Determines whether clicking outside the dialog dismiss it.
     */
    dismissable?: boolean;
    /**
     * Callback that is called when the user dismisses the dialog.
     */
    onDismiss?: () => void;
    /**
     * Determines Whether the dialog is visible.
     */
    visible: boolean;
    /**
     * Content of the `Dialog`.
     */
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    /**
     * @optional
     */
    theme: ReactNativePaper.Theme;
};
/**
 * Dialogs inform users about a specific task and may contain critical information, require decisions, or involve multiple tasks.
 * To render the `Dialog` above other components, you'll need to wrap it with the [`Portal`](portal.html) component.
 *
 *  <div class="screenshots">
 *   <img class="medium" src="screenshots/dialog-1.png" />
 *   <img class="medium" src="screenshots/dialog-2.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { Button, Paragraph, Dialog, Portal } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [visible, setVisible] = React.useState(false);
 *
 *   const showDialog = () => setVisible(true);
 *
 *   const hideDialog = () => setVisible(false);
 *
 *   return (
 *     <View>
 *       <Button onPress={showDialog}>Show Dialog</Button>
 *       <Portal>
 *         <Dialog visible={visible} onDismiss={hideDialog}>
 *           <Dialog.Title>Alert</Dialog.Title>
 *           <Dialog.Content>
 *             <Paragraph>This is simple dialog</Paragraph>
 *           </Dialog.Content>
 *           <Dialog.Actions>
 *             <Button onPress={hideDialog}>Done</Button>
 *           </Dialog.Actions>
 *         </Dialog>
 *       </Portal>
 *     </View>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
declare class Dialog extends React.Component<Props> {
    static Content: typeof DialogContent;
    static Actions: typeof DialogActions;
    static Title: (React.ComponentClass<Pick<import("react-native").TextProps & {
        children: React.ReactNode;
    } & {
        children: React.ReactNode;
        style?: StyleProp<import("react-native").TextStyle>;
        theme: ReactNativePaper.Theme;
    }, "style" | "children" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "numberOfLines" | "onLayout" | "onPress" | "onLongPress" | "testID" | "nativeID" | "maxFontSizeMultiplier" | "adjustsFontSizeToFit" | "minimumFontScale" | "suppressHighlighting" | "selectable" | "selectionColor" | "textBreakStrategy" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityComponentType" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityTraits" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors"> & {
        theme?: import("@callstack/react-theme-provider").$DeepPartial<ReactNativePaper.Theme> | undefined;
    }, any> & import("@callstack/react-theme-provider/typings/hoist-non-react-statics").NonReactStatics<(React.ComponentClass<import("react-native").TextProps & {
        children: React.ReactNode;
    } & {
        children: React.ReactNode;
        style?: StyleProp<import("react-native").TextStyle>;
        theme: ReactNativePaper.Theme;
    }, any> & typeof _DialogTitle) | (React.FunctionComponent<import("react-native").TextProps & {
        children: React.ReactNode;
    } & {
        children: React.ReactNode;
        style?: StyleProp<import("react-native").TextStyle>;
        theme: ReactNativePaper.Theme;
    }> & typeof _DialogTitle), {}>) | (React.FunctionComponent<Pick<import("react-native").TextProps & {
        children: React.ReactNode;
    } & {
        children: React.ReactNode;
        style?: StyleProp<import("react-native").TextStyle>;
        theme: ReactNativePaper.Theme;
    }, "style" | "children" | "allowFontScaling" | "ellipsizeMode" | "lineBreakMode" | "numberOfLines" | "onLayout" | "onPress" | "onLongPress" | "testID" | "nativeID" | "maxFontSizeMultiplier" | "adjustsFontSizeToFit" | "minimumFontScale" | "suppressHighlighting" | "selectable" | "selectionColor" | "textBreakStrategy" | "accessible" | "accessibilityActions" | "accessibilityLabel" | "accessibilityRole" | "accessibilityState" | "accessibilityHint" | "accessibilityValue" | "onAccessibilityAction" | "accessibilityComponentType" | "accessibilityLiveRegion" | "importantForAccessibility" | "accessibilityElementsHidden" | "accessibilityTraits" | "accessibilityViewIsModal" | "onAccessibilityEscape" | "onAccessibilityTap" | "onMagicTap" | "accessibilityIgnoresInvertColors"> & {
        theme?: import("@callstack/react-theme-provider").$DeepPartial<ReactNativePaper.Theme> | undefined;
    }> & import("@callstack/react-theme-provider/typings/hoist-non-react-statics").NonReactStatics<(React.ComponentClass<import("react-native").TextProps & {
        children: React.ReactNode;
    } & {
        children: React.ReactNode;
        style?: StyleProp<import("react-native").TextStyle>;
        theme: ReactNativePaper.Theme;
    }, any> & typeof _DialogTitle) | (React.FunctionComponent<import("react-native").TextProps & {
        children: React.ReactNode;
    } & {
        children: React.ReactNode;
        style?: StyleProp<import("react-native").TextStyle>;
        theme: ReactNativePaper.Theme;
    }> & typeof _DialogTitle), {}>);
    static ScrollArea: typeof DialogScrollArea;
    static defaultProps: {
        dismissable: boolean;
        visible: boolean;
    };
    render(): JSX.Element;
}
declare const _default: (React.ComponentClass<Pick<Props, "style" | "children" | "visible" | "dismissable" | "onDismiss"> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<ReactNativePaper.Theme> | undefined;
}, any> & import("@callstack/react-theme-provider/typings/hoist-non-react-statics").NonReactStatics<(React.ComponentClass<Props, any> & typeof Dialog) | (React.FunctionComponent<Props> & typeof Dialog), {}>) | (React.FunctionComponent<Pick<Props, "style" | "children" | "visible" | "dismissable" | "onDismiss"> & {
    theme?: import("@callstack/react-theme-provider").$DeepPartial<ReactNativePaper.Theme> | undefined;
}> & import("@callstack/react-theme-provider/typings/hoist-non-react-statics").NonReactStatics<(React.ComponentClass<Props, any> & typeof Dialog) | (React.FunctionComponent<Props> & typeof Dialog), {}>);
export default _default;
