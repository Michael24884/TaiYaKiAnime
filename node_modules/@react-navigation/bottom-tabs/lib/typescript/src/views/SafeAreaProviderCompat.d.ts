import * as React from 'react';
export declare const initialSafeAreaInsets: {
    top: number;
    bottom: number;
    right: number;
    left: number;
} | {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
declare type Props = {
    children: React.ReactNode;
};
export default function SafeAreaProviderCompat({ children }: Props): JSX.Element;
export {};
