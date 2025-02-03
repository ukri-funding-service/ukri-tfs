import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { FlagProviderProcessEnv } from '../../../feature-flags/src/newFeatureFlags/flagProviderProcessEnv';

describe('packages/feature-flags - newFeatureFlags/flagProviderProcessEnv', () => {
    let storedEnv: NodeJS.ProcessEnv;

    beforeAll(() => {
        storedEnv = { ...process.env };
    });

    afterAll(() => {
        process.env = { ...storedEnv };
    });

    it('should be instantiatable an empty env', () => {
        process.env = {};
        expect(new FlagProviderProcessEnv()).toBeDefined();
    });

    it('should be instantiatable an empty env with no feature flags', () => {
        process.env = { SOMETHING_ELSE: 'blah' };
        expect(new FlagProviderProcessEnv()).toBeDefined();
    });

    it('should be instantiatable an empty env with feature flags', () => {
        process.env = { FEATURE_A: 'blah' };
        expect(new FlagProviderProcessEnv()).toBeDefined();
    });

    it('should get flags from the environment', () => {
        process.env = { FEATURE_A: 'blah' };
        expect(new FlagProviderProcessEnv().getFlags()).toEqual({ FEATURE_A: 'blah' });
    });

    it('should extract feature flags', () => {
        process.env = { FEATURE_A: 'blah', NOT_A_FEATURE: 'yoo hoo', FEATURE_B: 'undefined' };
        expect(new FlagProviderProcessEnv().getFlagKeys()).toEqual(expect.arrayContaining(['FEATURE_A', 'FEATURE_B']));
    });

    it('should remove non-feature flags', () => {
        process.env = { FEATURE_A: 'blah', NOT_A_FEATURE: 'yoo hoo', FEATURE_B: 'undefined' };
        expect(new FlagProviderProcessEnv().getFlagKeys()).not.toContainEqual(['NOT_A_FEATURE']);
    });

    it('should allow definition of prefix for features', () => {
        process.env = { FEATURE_A: 'blah', NOT_A_FEATURE: 'yoo hoo', FEATURE_B: 'undefined' };
        expect(new FlagProviderProcessEnv('NOT_A_').getFlagKeys()).toEqual(expect.arrayContaining(['NOT_A_FEATURE']));
    });
});
