import { FeatureFlagSet } from './featureFlagSet';
import { FlagProvider } from './flagProvider';

export class FlagProviderProcessEnv implements FlagProvider {
    private presetKeys: FeatureFlagSet;

    constructor(readonly flagPrefixMarker: string = 'FEATURE_') {
        this.presetKeys = this.readFlagsFromEnv(process.env);
    }

    readFlagsFromEnv(env: NodeJS.ProcessEnv): FeatureFlagSet {
        const flags: FeatureFlagSet = {};

        if (Object.keys(env) !== undefined) {
            Object.keys(env).forEach(key => {
                if (key.startsWith(this.flagPrefixMarker)) {
                    flags[key] = process.env[key];
                }
            });
        }

        return flags;
    }

    getFlags(): FeatureFlagSet {
        return this.presetKeys;
    }

    getFlagKeys(): string[] {
        return Object.keys(this.presetKeys);
    }
}
