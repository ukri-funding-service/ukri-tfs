import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { MockSearchService } from './mockSearchService';
import { SearchService, SearchServiceStateEnum } from '../searchService';

describe('mock search service - verifyHealth and state', () => {
    let searchService: SearchService;

    beforeEach(() => {
        searchService = new MockSearchService([], []);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should construct and return correct state', () => {
        expect(searchService).toBeInstanceOf(MockSearchService);
        expect(searchService.state).toEqual(SearchServiceStateEnum.MockSearchService);
    });

    it('should return true', async () => {
        const result = await searchService.verifyHealth();

        expect(result).toBe(true);
    });
});
