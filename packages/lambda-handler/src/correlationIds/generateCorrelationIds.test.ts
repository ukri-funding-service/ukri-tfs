import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { generateCorrelationIdsFactory } from './generateCorrelationIds';

describe('packages/lambda-handler - correlationIds/generateCorrelationIds', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should generate correlation ids', async () => {
        const actual = generateCorrelationIdsFactory(() => 'some id')();

        expect(actual).toStrictEqual({
            root: 'some id',
            parent: 'some id',
            current: 'some id',
        });
    });
});
