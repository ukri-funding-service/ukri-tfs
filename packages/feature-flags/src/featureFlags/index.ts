/**
 * @deprecated
 */
export interface featureFlagType {
    [key: string]: string | undefined;
}

/**
 * @deprecated Prefer ../newFeatureFlags
 */
export class FeatureFlags {
    private static flagList: featureFlagType;

    public static initialiseFlagList(flagList: featureFlagType): void {
        FeatureFlags.flagList = flagList;
    }

    // If the given flag exists, and is explicitly set to 'true', then return true
    // If the flag does not exist, or is set to any other value, return false
    public static isEnabled(featureName: string): boolean {
        if (FeatureFlags.flagList === undefined) {
            return false;
        }
        const foundFlag = FeatureFlags.flagList[featureName];
        return !!foundFlag && foundFlag.toLowerCase() === 'true';
    }

    // If the given flag exists, and is explicitly set to 'false', then return true
    // If the flag does not exist, or is set to any other value, return false
    public static isDisabled(featureName: string): boolean {
        if (FeatureFlags.flagList === undefined) {
            return false;
        }
        const foundFlag = FeatureFlags.flagList[featureName];
        return !!foundFlag && foundFlag.toLowerCase() === 'false';
    }

    // If the given flag exists, then return true
    // If the flag does not exist, return false
    public static doesExist(featureName: string): boolean {
        if (FeatureFlags.flagList === undefined) {
            return false;
        }
        const foundFlag = FeatureFlags.flagList[featureName];
        return !!foundFlag;
    }
}
