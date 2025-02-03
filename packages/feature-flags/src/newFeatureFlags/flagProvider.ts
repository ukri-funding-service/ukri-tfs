import { FeatureFlagSet } from './featureFlagSet';

export interface FlagProvider {
    getFlags: () => FeatureFlagSet;
}
