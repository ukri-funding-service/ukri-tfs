import { getUserIdFromUserContext, UserContext } from '@ukri-tfs/auth';
import { getEnvironmentVariableOrUndefined } from '@ukri-tfs/configuration';
import { TfsRestClient } from '@ukri-tfs/http';
import { Logger } from '@ukri-tfs/logging';
import mockApplications from '../data/mockApplications.json';
import mockAwards from '../data/mockAwards.json';
import { MockAward, MockSearchService } from './mockSearch/mockSearchService';
import { OpensearchService } from './openSearch/opensearchService';
import { SearchService, SearchServiceStateEnum } from './searchService';

export const buildSearchService = (
    userContext: UserContext,
    logger: Logger,
    openSearchServiceClient: TfsRestClient,
): SearchService => {
    const searchServiceState = getEnvironmentVariableOrUndefined('SEARCH_SERVICE_STATE');
    const tfsUserId = getUserIdFromUserContext(userContext);

    switch (searchServiceState) {
        case SearchServiceStateEnum.MockSearchService:
            return new MockSearchService(mockApplications, mockAwards as MockAward[]);
        case SearchServiceStateEnum.OpensearchService:
        default:
            return new OpensearchService(tfsUserId, openSearchServiceClient, logger);
    }
};
