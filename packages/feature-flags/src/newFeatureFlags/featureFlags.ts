import { FeatureFlagSet } from './featureFlagSet';
import { FlagProvider } from './flagProvider';

export class FeatureFlags {
    private flagSet: FeatureFlagSet;

    constructor(provider: FlagProvider) {
        this.flagSet = provider.getFlags();
    }

    // If the given flag exists, and is explicitly set to 'true', then return true
    // If the flag does not exist, or is set to any other value, return false
    public isEnabled(featureName: string): boolean {
        const foundFlag = this.flagSet[featureName];
        return !!foundFlag && foundFlag.toLowerCase() === 'true';
    }

    // If the given flag exists, and is explicitly set to 'false', then return true
    // If the flag does not exist, or is set to any other value, return false
    public isDisabled(featureName: string): boolean {
        const foundFlag = this.flagSet[featureName];
        return foundFlag !== undefined && foundFlag.toLowerCase() === 'false';
    }

    // If the given flag has a value, then return true.
    // If the flag does not have a value, return false
    public doesExist(featureName: string): boolean {
        const foundFlag = this.flagSet[featureName];
        return foundFlag !== undefined;
    }
}
