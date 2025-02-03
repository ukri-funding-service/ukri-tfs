import { WellKnownEndpointKeysAccessor, WellKnownEndpointKey } from './models/wellKnownKeys';
import NodeCache from 'node-cache';

export class KeysAccessorCachingDecorator implements WellKnownEndpointKeysAccessor {
    private cache: NodeCache = new NodeCache({
        stdTTL: 360,
        checkperiod: 120,
    });
    // singleton accessor
    public static instances: { [key: string]: KeysAccessorCachingDecorator } = {};

    public constructor(private keyAccessor: WellKnownEndpointKeysAccessor) {}

    public static getInstance(keyAccessor: WellKnownEndpointKeysAccessor, key: string): KeysAccessorCachingDecorator {
        if (KeysAccessorCachingDecorator.instances[key] === undefined) {
            KeysAccessorCachingDecorator.instances[key] = new KeysAccessorCachingDecorator(keyAccessor);
        }
        return KeysAccessorCachingDecorator.instances[key];
    }

    async retrieve(endpoint: string): Promise<WellKnownEndpointKey[]> {
        let result = this.cache.get<WellKnownEndpointKey[]>(endpoint);
        if (result === undefined) {
            result = await this.keyAccessor.retrieve(endpoint);
            this.cache.set(endpoint, result);
        }

        return result;
    }

    clear(): void {
        this.cache.flushAll();
    }

    clearForEndpoint(endpoint: string): void {
        this.cache.del(endpoint);
    }
}
