import { LayoutRectangle, LayoutChangeEvent } from 'react-native';
export declare type UseImageWrapperLayout = () => [LayoutRectangle | undefined, (event: LayoutChangeEvent) => void];
export declare const useImageWrapperLayout: UseImageWrapperLayout;
