import { describe, it, expect } from '@jest/globals';

import { NoopLogger } from '../../../src';

describe('logging/loggers - noopLogger', () => {
    it('can be instantiated', () => {
        expect(new NoopLogger()).toBeDefined();
    });

    describe('logs correctly at each level', () => {
        const uut = new NoopLogger();

        it('logs audit message', () => {
            expect(() => uut.audit('this', 'is', 'a', 'test')).not.toThrow();
        });

        it('logs debug message when debug is max level', () => {
            expect(() => uut.debug('this', 'is', 'a', 'test')).not.toThrow();
        });

        it('logs info message', () => {
            expect(() => uut.info('this', 'is', 'a', 'test')).not.toThrow();
        });

        it('logs warn message', () => {
            expect(() => uut.warn('this', 'is', 'a', 'test')).not.toThrow();
        });

        it('logs error message', () => {
            expect(() => uut.error('this', 'is', 'a', 'test')).not.toThrow();
        });
    });
});
