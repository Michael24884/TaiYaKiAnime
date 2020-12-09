export declare type VisibilityStatus = "visible" | "hidden" | "transitioning";
export declare type Config = {
    fade?: boolean;
};
export declare function show(config?: Config): Promise<void>;
export declare function hide(config?: Config): Promise<void>;
export declare function getVisibilityStatus(): Promise<VisibilityStatus>;
declare const _default: {
    show: typeof show;
    hide: typeof hide;
    getVisibilityStatus: typeof getVisibilityStatus;
};
export default _default;
