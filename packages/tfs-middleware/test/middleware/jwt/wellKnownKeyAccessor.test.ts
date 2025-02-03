import { expect } from 'chai';
import { WellKnownEndpointKey, WellKnownEndpointKeysAccessor } from '../../../src/middleware/jwt/models/wellKnownKeys';
import { KeysAccessorCachingDecorator } from '../../../src/middleware/jwt/wellKnownKeyAccessor';

describe('packages/tfs-middleware - middleware/jwt/wellKnownKeyAccessor', () => {
    const wellKnownEndpointKey1: WellKnownEndpointKey = {
        alg: 'ES256', // Not significant
        e: '',
        kid: '',
        kty: '',
        n: '',
        use: '',
    };
    const wellKnownEndpointKey2: WellKnownEndpointKey = { ...wellKnownEndpointKey1 };
    const wellKnownEndpointKey3: WellKnownEndpointKey = { ...wellKnownEndpointKey1 };

    describe('KeysAccessorCachingDecorator', () => {
        it('should return the result from the retrieval call', async () => {
            const mockAccessor: WellKnownEndpointKeysAccessor = {
                retrieve: async () => {
                    return [wellKnownEndpointKey1, wellKnownEndpointKey2, wellKnownEndpointKey3];
                },
            };

            const keyCacheAccessor = new KeysAccessorCachingDecorator(mockAccessor);
            await expect(keyCacheAccessor.retrieve('something')).to.eventually.include.members([
                wellKnownEndpointKey1,
                wellKnownEndpointKey2,
                wellKnownEndpointKey3,
            ]);
        });

        it('should never call the WellKnownEndpointKeysAccessor twice for the same endpoint', async () => {
            let retrievalCount = 0;

            const stubAccessor: WellKnownEndpointKeysAccessor = {
                retrieve: () => {
                    retrievalCount++;
                    return Promise.resolve([]);
                },
            };

            const keyCacheAccessor = new KeysAccessorCachingDecorator(stubAccessor);
            await keyCacheAccessor.retrieve('something');
            await keyCacheAccessor.retrieve('something');
            await keyCacheAccessor.retrieve('something');
            await keyCacheAccessor.retrieve('something');
            await keyCacheAccessor.retrieve('something');
            expect(retrievalCount).to.eq(1);
        });

        it('should call the WellKnownEndpointKeysAccessor twice for an unknown endpoint', async () => {
            let retrievalCount = 0;

            const stubAccessor: WellKnownEndpointKeysAccessor = {
                retrieve: () => {
                    retrievalCount++;
                    return Promise.resolve([]);
                },
            };

            const keyCacheAccessor = new KeysAccessorCachingDecorator(stubAccessor);
            await keyCacheAccessor.retrieve('something');
            await keyCacheAccessor.retrieve('somethingElse');
            expect(retrievalCount).to.eq(2);
        });

        it('should clear the cache', async () => {
            let retrievalCount = 0;

            const stubAccessor: WellKnownEndpointKeysAccessor = {
                retrieve: () => {
                    retrievalCount++;
                    return Promise.resolve([]);
                },
            };

            const keyCacheAccessor = new KeysAccessorCachingDecorator(stubAccessor);
            await keyCacheAccessor.retrieve('something');
            keyCacheAccessor.clear();
            await keyCacheAccessor.retrieve('something');
            expect(retrievalCount).to.eq(2);
        });

        it('should clear the cache for a single entry', async () => {
            const retrievalCounts: Map<string, number> = new Map();

            const stubAccessor: WellKnownEndpointKeysAccessor = {
                retrieve: (endpoint: string) => {
                    let count = retrievalCounts.get(endpoint);

                    if (count === undefined) {
                        count = 0;
                    }
                    count++;
                    retrievalCounts.set(endpoint, count);
                    return Promise.resolve([]);
                },
            };

            const keyCacheAccessor = new KeysAccessorCachingDecorator(stubAccessor);
            await keyCacheAccessor.retrieve('something');
            await keyCacheAccessor.retrieve('somethingElse');

            keyCacheAccessor.clearForEndpoint('something'); // Next call to retrieve 'something' will increment counter

            await keyCacheAccessor.retrieve('something');
            expect(retrievalCounts.get('something')).to.eq(2);
        });
    });
});
