import { describe, expect, it } from '@jest/globals';
import { getFieldErrors } from '../../src/validators/';
import { errorFormat } from '../../src/errors';

describe('getFieldErrors', () => {
    const errors: errorFormat[] = [
        {
            message: 'A message',
            fieldName: 'field-a',
            summary: 'A summary',
        },
        {
            message: 'B message',
            fieldName: 'field-b',
            summary: 'B summary',
        },
    ];
    it('should find matching error', () => {
        const fieldErrors = getFieldErrors(errors, 'field-a');

        expect(fieldErrors).toEqual([
            {
                message: 'A message',
                fieldName: 'field-a',
                summary: 'A summary',
            },
        ]);
    });
    it('should not find errors when the field has no errors', () => {
        const fieldErrors = getFieldErrors(errors, 'field-c');

        expect(fieldErrors).toEqual([]);
    });
});
