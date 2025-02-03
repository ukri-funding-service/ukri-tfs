import { describe, expect, it } from '@jest/globals';
import { generateCorrelationId } from '../../src/request/correlationIds';

describe('generateCorrelationId tests', () => {
    it('should generate a random UUID upon each call', () => {
        // given
        const firstCorrelationId = generateCorrelationId();

        // when
        const secondCorrelationId = generateCorrelationId();

        // then
        expect(firstCorrelationId).not.toEqual(secondCorrelationId);
    });
});
