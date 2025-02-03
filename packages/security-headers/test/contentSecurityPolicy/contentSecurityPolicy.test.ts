import { describe, expect, it } from '@jest/globals';
import { getContentSecurityPolicyHeader } from '../../src/contentSecurityPolicy/contentSecurityPolicy';
import { Directive } from '../../src/contentSecurityPolicy/directive';

describe('packages/security-headers - response/securityHeaders', () => {
    class MyDirectiveX extends Directive {
        constructor() {
            super('x', ['a', 'b', 'c']);
        }
    }

    class MyDirectiveY extends Directive {
        constructor() {
            super('y', ['d', 'e', 'f']);
        }
    }

    it('should serialize an empty directive list', () => {
        expect(getContentSecurityPolicyHeader([])).toEqual('');
    });

    it('should serialize a single directive list', () => {
        expect(getContentSecurityPolicyHeader([new MyDirectiveX()])).toEqual('x a b c');
    });

    it('should serialize a multiple directive list', () => {
        expect(getContentSecurityPolicyHeader([new MyDirectiveX(), new MyDirectiveY()])).toEqual('x a b c; y d e f');
    });
});
