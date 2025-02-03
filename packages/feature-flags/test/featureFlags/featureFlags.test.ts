import { describe, expect, it } from '@jest/globals';
import { FeatureFlags } from '../../src/featureFlags';

describe('packages/feature-flags - featureFlags', () => {
    // ---------------------- WARNING!! ------------------------
    // Test order matters in this file - the `when uninitialised` tests MUST be run before the other tests run and initialise the flags
    describe('when uninitialised', () => {
        it('isEnabled should return false for anything if not initialised', () => {
            expect(FeatureFlags.isEnabled('some undefined')).toEqual(false);
        });
        it('isDisabled should return false for anything if not initialised', () => {
            expect(FeatureFlags.isDisabled('some undefined')).toEqual(false);
        });
        it('doesExist should return false for anything if not initialised', () => {
            expect(FeatureFlags.doesExist('some undefined')).toEqual(false);
        });
    });

    describe('isEnabled', () => {
        it('should return false when feature key exists but value is explicitly undefined', () => {
            const flags = {
                undefinedFeature: undefined,
            };

            FeatureFlags.initialiseFlagList(flags);

            expect(FeatureFlags.isEnabled('undefinedFeature')).toEqual(false);
        });

        it('should return false when feature key does not exist', () => {
            FeatureFlags.initialiseFlagList({});

            expect(FeatureFlags.isEnabled('undefinedFeature')).toEqual(false);
        });

        it('should return false when feature key exists and is set to "false"', () => {
            FeatureFlags.initialiseFlagList({ myFlag: 'false' });

            expect(FeatureFlags.isEnabled('myFlag')).toEqual(false);
        });

        it('should return true when feature key exists and is set to "true"', () => {
            FeatureFlags.initialiseFlagList({ myFlag: 'true' });

            expect(FeatureFlags.isEnabled('myFlag')).toEqual(true);
        });

        it('should return the correct flag value when initialized with a complex flag list', () => {
            FeatureFlags.initialiseFlagList({
                a: undefined,
                b: 'false',
                myFirstFlag: 'true',
                c: 'true',
                d: 'true',
                mySecondFlag: 'false',
                e: 'false',
            });

            expect(FeatureFlags.isEnabled('myFirstFlag')).toEqual(true);
            expect(FeatureFlags.isEnabled('mySecondFlag')).toEqual(false);
        });
    });

    describe('isDisabled', () => {
        it('should return false when feature key exists but value is explicitly undefined', () => {
            const flags = {
                undefinedFeature: undefined,
            };

            FeatureFlags.initialiseFlagList(flags);

            expect(FeatureFlags.isDisabled('undefinedFeature')).toEqual(false);
        });

        it('should return false when feature key does not exist', () => {
            FeatureFlags.initialiseFlagList({});

            expect(FeatureFlags.isDisabled('undefinedFeature')).toEqual(false);
        });

        it('should return false when feature key exists and is set to "true"', () => {
            FeatureFlags.initialiseFlagList({ myFlag: 'true' });

            expect(FeatureFlags.isDisabled('myFlag')).toEqual(false);
        });

        it('should return true when feature key exists and is set to "false"', () => {
            FeatureFlags.initialiseFlagList({ myFlag: 'false' });

            expect(FeatureFlags.isDisabled('myFlag')).toEqual(true);
        });

        it('should return the correct flag value when initialized with a complex flag list', () => {
            FeatureFlags.initialiseFlagList({
                a: undefined,
                b: 'false',
                myFirstFlag: 'true',
                c: 'true',
                d: 'true',
                mySecondFlag: 'false',
                e: 'false',
            });

            expect(FeatureFlags.isDisabled('myFirstFlag')).toEqual(false);
            expect(FeatureFlags.isDisabled('mySecondFlag')).toEqual(true);
        });
    });

    describe('does exist', () => {
        it('should return true when feature key exists and is set to "false"', () => {
            FeatureFlags.initialiseFlagList({ myFlag: 'false' });

            expect(FeatureFlags.doesExist('myFlag')).toEqual(true);
        });
        it('should return true when feature key exists and is set to "true"', () => {
            FeatureFlags.initialiseFlagList({ myFlag: 'true' });

            expect(FeatureFlags.doesExist('myFlag')).toEqual(true);
        });
        it('should return false when feature key exists and is set to "true"', () => {
            FeatureFlags.initialiseFlagList({});

            expect(FeatureFlags.doesExist('undefinedFeature')).toEqual(false);
        });
    });
});
