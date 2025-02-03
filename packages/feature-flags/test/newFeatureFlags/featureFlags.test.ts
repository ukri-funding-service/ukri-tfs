import { describe, expect, it } from '@jest/globals';
import { FeatureFlags } from '../../src/newFeatureFlags';
import { FlagProvider } from '../../src/newFeatureFlags/flagProvider';

describe('packages/feature-flags - newFeatureFlags/featureFlags', () => {
    const stubFlagProvider: FlagProvider = {
        getFlags: () => {
            return {};
        },
    };

    describe('isEnabled', () => {
        it('should return false for anything if no flags', () => {
            const flags = new FeatureFlags(stubFlagProvider);
            expect(flags.isEnabled('some undefined')).toEqual(false);
        });

        it('should return false when feature key exists but value is explicitly undefined', () => {
            const flags = new FeatureFlags({
                getFlags: () => {
                    return { featureWithUndefinedValue: undefined };
                },
            });

            expect(flags.isEnabled('featureWithUndefinedValue')).toEqual(false);
        });

        it('should return false when feature key does not exist', () => {
            const flags = new FeatureFlags(stubFlagProvider);

            expect(flags.isEnabled('undefinedFeature')).toEqual(false);
        });

        it('should return isEnabled=false when feature key exists and is set to "false"', () => {
            const flags = new FeatureFlags({
                getFlags: () => {
                    return { myFlag: 'false' };
                },
            });

            expect(flags.isEnabled('myFlag')).toEqual(false);
        });

        it('should return isEnabled=true when feature key exists and is set to "true"', () => {
            const flags = new FeatureFlags({
                getFlags: () => {
                    return { myFlag: 'true' };
                },
            });

            expect(flags.isEnabled('myFlag')).toEqual(true);
        });

        it('should return the correct flag value when initialized with a complex flag list', () => {
            const flags = new FeatureFlags({
                getFlags: () => {
                    return {
                        a: undefined,
                        b: 'false',
                        myFirstFlag: 'true',
                        c: 'true',
                        d: 'true',
                        mySecondFlag: 'false',
                        e: 'false',
                    };
                },
            });

            expect(flags.isEnabled('myFirstFlag')).toEqual(true);
            expect(flags.isEnabled('mySecondFlag')).toEqual(false);
        });
    });

    describe('isDisabled', () => {
        it('should return false for anything if no flags', () => {
            const flags = new FeatureFlags(stubFlagProvider);
            expect(flags.isDisabled('some undefined')).toEqual(false);
        });

        it('should return false when feature key exists but value is explicitly undefined', () => {
            const flags = new FeatureFlags({
                getFlags: () => {
                    return { featureWithUndefinedValue: undefined };
                },
            });

            expect(flags.isDisabled('featureWithUndefinedValue')).toEqual(false);
        });

        it('should return false when feature key does not exist', () => {
            const flags = new FeatureFlags({
                getFlags: () => {
                    return { featureWithUndefinedValue: undefined };
                },
            });

            expect(flags.isDisabled('thisDoesNotExistInTheFlagData')).toEqual(false);
        });

        it('should return false when feature key exists and is set to "true"', () => {
            const flags = new FeatureFlags({
                getFlags: () => {
                    return { myFlag: 'true' };
                },
            });

            expect(flags.isDisabled('myFlag')).toEqual(false);
        });

        it('should return true when feature key exists and is set to "false"', () => {
            const flags = new FeatureFlags({
                getFlags: () => {
                    return { myFlag: 'false' };
                },
            });

            expect(flags.isDisabled('myFlag')).toEqual(true);
        });

        it('should return the correct flag value when initialized with a complex flag list', () => {
            const flags = new FeatureFlags({
                getFlags: () => {
                    return {
                        a: undefined,
                        b: 'false',
                        myFirstFlag: 'true',
                        c: 'true',
                        d: 'true',
                        mySecondFlag: 'false',
                        e: 'false',
                    };
                },
            });

            expect(flags.isDisabled('myFirstFlag')).toEqual(false);
            expect(flags.isDisabled('mySecondFlag')).toEqual(true);
        });
    });

    describe('does exist', () => {
        it('should return false for anything if no flags', () => {
            const flags = new FeatureFlags(stubFlagProvider);
            expect(flags.doesExist('some undefined')).toEqual(false);
        });

        it('should return false when feature key exists but value is explicitly undefined', () => {
            const flags = new FeatureFlags({
                getFlags: () => {
                    return { featureWithUndefinedValue: undefined };
                },
            });

            expect(flags.doesExist('featureWithUndefinedValue')).toEqual(false);
        });

        it('should return true when feature key exists and is set to "true"', () => {
            const flags = new FeatureFlags({
                getFlags: () => {
                    return { myFlag: 'true' };
                },
            });

            expect(flags.doesExist('myFlag')).toEqual(true);
        });

        it('should return true when feature key exists and is set to "false"', () => {
            const flags = new FeatureFlags({
                getFlags: () => {
                    return { myFlag: 'false' };
                },
            });

            expect(flags.doesExist('myFlag')).toEqual(true);
        });
    });
});
