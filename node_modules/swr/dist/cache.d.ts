import { CacheInterface, keyInterface, cacheListener } from './types';
export default class Cache implements CacheInterface {
    private __cache;
    private __listeners;
    constructor(initialData?: any);
    get(key: keyInterface): any;
    set(key: keyInterface, value: any): any;
    keys(): string[];
    has(key: keyInterface): boolean;
    clear(): void;
    delete(key: keyInterface): void;
    serializeKey(key: keyInterface): [string, any, string];
    subscribe(listener: cacheListener): () => void;
    private notify;
}
