import { Logger } from '@ukri-tfs/logging';
import { TokenProviderPreset } from './tokenProviderPreset';

/**
 * A TokenProvider which always returns an empty string.
 */
export class TokenProviderStub extends TokenProviderPreset {
    constructor(logger: Logger) {
        super('', logger);
    }
}
