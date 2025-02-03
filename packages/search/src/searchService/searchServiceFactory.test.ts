import { afterEach, describe, expect, it, jest } from '@jest/globals';
import * as commonPackageStubs from '@ukri-tfs/auth';
import * as Config from '@ukri-tfs/configuration/dist/environmentVars/getEnvironmentVariableOrUndefined';
import { buildMockRestClient, getMockLogger, getMockUserContext } from '../../test/testHelpers';
import { MockSearchService } from './mockSearch/mockSearchService';
import { OpensearchService } from './openSearch/opensearchService';
import { SearchServiceStateEnum } from './searchService';
import { buildSearchService } from './searchServiceFactory';

jest.mock('@ukri-tfs/auth', () => {
    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(jest.requireActual('@ukri-tfs/auth') as any),
        __esModule: true,
    };
});

describe('searchServiceFactory', () => {
    const mockOpensearchRestClient = buildMockRestClient();

    const mockGetMethod = mockOpensearchRestClient.getMethodMock;
    const tfsOpensearchRestClient = mockOpensearchRestClient.tfsRestClient;

    const getEnvironmentVariableOrUndefinedSpy = jest.spyOn(Config, 'getEnvironmentVariableOrUndefined');
    const getUserIdFromUserContextSpy = jest
        .spyOn(commonPackageStubs, 'getUserIdFromUserContext')
        .mockReturnValue('USER_ID');

    const userContext = getMockUserContext();
    const mockLogger = getMockLogger();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call getUserIdFromUserContextSpy with correct user context', async () => {
        getEnvironmentVariableOrUndefinedSpy.mockReturnValue(SearchServiceStateEnum.OpensearchService);
        mockGetMethod.mockResolvedValue({
            status: 'OK',
        });
        const searchService = buildSearchService(userContext, mockLogger, tfsOpensearchRestClient);
        await searchService.verifyHealth();
        expect(getUserIdFromUserContextSpy).toHaveBeenCalledWith(userContext);
        expect(mockGetMethod).toHaveBeenCalledWith('USER_ID', expect.anything());
    });

    it('should return OpensearchService given env var is OpensearchService', () => {
        getEnvironmentVariableOrUndefinedSpy.mockReturnValue(SearchServiceStateEnum.OpensearchService);
        const opensearchService = buildSearchService(userContext, mockLogger, tfsOpensearchRestClient);
        expect(opensearchService).toBeInstanceOf(OpensearchService);
    });

    it('should return OpensearchService given env var is undefined', () => {
        getEnvironmentVariableOrUndefinedSpy.mockReturnValue(undefined);
        const searchService = buildSearchService(userContext, mockLogger, tfsOpensearchRestClient);
        expect(searchService).toBeInstanceOf(OpensearchService);
    });

    it('should return MockSearchService given env var is MockSearchService', () => {
        getEnvironmentVariableOrUndefinedSpy.mockReturnValue(SearchServiceStateEnum.MockSearchService);
        const mockSearchService = buildSearchService(userContext, mockLogger, tfsOpensearchRestClient);
        expect(mockSearchService).toBeInstanceOf(MockSearchService);
    });
});
