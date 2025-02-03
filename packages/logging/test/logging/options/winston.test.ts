import { describe, expect, it } from '@jest/globals';
import { addProjectWinstonOptions } from '../../../src/logging/options';

describe('logging/options - winston', () => {
    it('returns a LoggerOptions when given no customisation', () => {
        expect(addProjectWinstonOptions()).toBeDefined();
    });

    it('returns a LoggerOptions when given a custom logger object', () => {
        expect(addProjectWinstonOptions({ level: 'error' })).toBeDefined();
    });
});
