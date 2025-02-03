import { describe, expect, it } from '@jest/globals';
import { filterEmptySources } from '../../src/contentSecurityPolicy/directive';

describe('packages/security-headers - response/contentSecurityPolicy/directive', () => {
    describe('filterEmptySources', () => {
        it('empty source should return false', () => {
            expect(filterEmptySources('')).toBeFalsy();
        });

        it('non-empty source should return true', () => {
            expect(filterEmptySources('xyz')).toBeTruthy();
        });
    });
});
