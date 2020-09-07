import { ConfigInterface, fetcherFn, keyInterface, mutateInterface, responseInterface, triggerInterface } from './types';
declare const trigger: triggerInterface;
declare const mutate: mutateInterface;
declare function useSWR<Data = any, Error = any>(key: keyInterface): responseInterface<Data, Error>;
declare function useSWR<Data = any, Error = any>(key: keyInterface, config?: ConfigInterface<Data, Error>): responseInterface<Data, Error>;
declare function useSWR<Data = any, Error = any>(key: keyInterface, fn?: fetcherFn<Data>, config?: ConfigInterface<Data, Error>): responseInterface<Data, Error>;
declare const SWRConfig: import("react").ProviderExoticComponent<import("react").ProviderProps<ConfigInterface<any, any, fetcherFn<any>>>>;
export { trigger, mutate, SWRConfig };
export default useSWR;
