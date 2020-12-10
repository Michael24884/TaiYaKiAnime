/// <reference types="react" />
import * as ReactNative from 'react-native';
export declare type StretchyImage = ReactNative.ImageSourcePropType;
export declare type StretchyOnScroll = (position: number, reachedToBottomOfHeader: boolean) => void;
export interface StretchyProps {
    backgroundColor?: string;
    image?: StretchyImage;
    imageHeight?: number;
    imageResizeMode?: ReactNative.ImageResizeMode;
    imageWrapperStyle?: ReactNative.ViewStyle;
    imageOverlay?: React.ReactElement;
    foreground?: React.ReactElement;
    onScroll?: StretchyOnScroll;
}
