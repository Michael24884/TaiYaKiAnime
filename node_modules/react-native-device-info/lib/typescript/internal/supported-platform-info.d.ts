import { Getter, GetSupportedPlatformInfoAsyncParams, GetSupportedPlatformInfoSyncParams, GetSupportedPlatformInfoFunctionsParams } from './privateTypes';
export declare function clearMemo(): void;
/**
 * function used to get desired info synchronously — with optional memoization
 * @param param0
 */
export declare function getSupportedPlatformInfoSync<T>({ getter, supportedPlatforms, defaultValue, memoKey, }: GetSupportedPlatformInfoSyncParams<T>): T;
/**
 * function used to get desired info asynchronously — with optional memoization
 * @param param0
 */
export declare function getSupportedPlatformInfoAsync<T>({ getter, supportedPlatforms, defaultValue, memoKey, }: GetSupportedPlatformInfoAsyncParams<T>): Promise<T>;
/**
 * function that returns array of getter functions [async, sync]
 * @param param0
 */
export declare function getSupportedPlatformInfoFunctions<T>({ syncGetter, ...asyncParams }: GetSupportedPlatformInfoFunctionsParams<T>): [Getter<Promise<T>>, Getter<T>];
