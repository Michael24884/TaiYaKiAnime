declare type DisplayMetrics = {
    width: number;
    height: number;
    scale: number;
    fontScale: number;
};
export default function useWindowDimensions(): DisplayMetrics;
export {};
