import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { MockSearchService } from './mockSearchService';
import { SearchService } from '../searchService';

describe('mock search service - awards count', () => {
    let searchService: SearchService;

    beforeEach(() => {
        searchService = new MockSearchService([], []);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should construct and return correct state', async () => {
        const organisationId = 5;
        const count = await searchService.getAwardsCount(organisationId);

        expect(count).toEqual(3);
    });
});
