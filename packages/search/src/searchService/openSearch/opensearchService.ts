import { mapOpensearchApplicationHit, reduceOpensearchAggregationBucket } from '../../mappers/opensearchServiceMappers';
import { applicationsSearchBodyBuilder } from './opensearchApplicationQueryBuilder';
import { AwardQueryBuilderOptions } from './opensearchAwardQueryBuilderBase';
import {
    ApplicationFieldEnum,
    ApplicationSearchArgs,
    ApplicationStatusEnum,
    AwardSearchArgs,
    AwardSearchOptions,
    ResponseStatusEnum,
    ReviewStatusEnum,
    SearchOptions,
    SearchService,
    SearchServiceApplicationResults,
    SearchServiceAwardDto,
    SearchServiceAwardResults,
    SearchServiceImpl,
    SearchServiceResultCounts,
    SearchServiceResultsMeta,
    SearchServiceStateEnum,
    SortOrderEnum,
} from '../searchService';
import { calculatePaginationFrom } from '../searchServiceHelpers';
import { OpensearchSortOrder } from './openSearchQueryModels';
import { internalAwardsSearchBodyBuilder } from './opensearchInternalAwardQueryBuilder';
import { externalAwardsSearchBodyBuilder } from './opensearchExternalAwardQueryBuilder';
import { createAwardCountQuery } from './awardCount';

export interface OpensearchClusterHealthResponse {
    status: 'green' | 'yellow' | 'red';
}

export interface OpensearchApplicationHitReviewStats {
    pendingCount: number;
    usableCount: number;
    toCheckCount: number;
}

export interface OpensearchApplicationHitInvitationStats {
    noResponseCount: number;
    declinedCount: number;
}

export interface OpensearchApplicationHit {
    id: number;
    displayId: string;
    opportunityId: number;
    opportunityApplicationWorkflowComponentId: number;
    applicationStatus: ApplicationStatusEnum;
    name: string;
    reviewStatus: ReviewStatusEnum;
    reviewStatusPriority: number;
    responseStatus: ResponseStatusEnum;
    responseStatusPriority: number;
    reviewStats: OpensearchApplicationHitReviewStats;
    invitationStats: OpensearchApplicationHitInvitationStats;
    reviewFailedDate?: string;
}

export interface OpensearchApplicationResponseHit {
    _source: OpensearchApplicationHit;
}

export type OpensearchAwardResponseHit = {
    _source: SearchServiceAwardDto;
};

export interface OpensearchAggregationBucket {
    key: string;
    doc_count: number;
}

interface OpensearchAggregation {
    buckets: OpensearchAggregationBucket[];
}

interface OpensearchAggregations {
    reviewStatuses?: OpensearchAggregation;
}

export interface OpensearchApplicationResponse {
    hits: {
        total: { value: number };
        hits: OpensearchApplicationResponseHit[];
    };
    aggregations?: OpensearchAggregations;
}

export type OpensearchCountResponse = {
    count: number;
};

export type OpensearchAwardResponse = {
    hits: {
        total: { value: number };
        hits: OpensearchAwardResponseHit[];
    };
};

export class OpensearchService extends SearchServiceImpl implements SearchService {
    state = SearchServiceStateEnum.OpensearchService;

    private mapSortOrder(sortOrder?: SortOrderEnum): OpensearchSortOrder {
        switch (sortOrder) {
            case SortOrderEnum.Desc:
                return 'desc';
            case SortOrderEnum.Asc:
            default:
                return 'asc';
        }
    }

    private mapApplicationFieldEnum(sortField?: ApplicationFieldEnum): string {
        switch (sortField) {
            case ApplicationFieldEnum.DisplayId:
                return 'displayId.keyword';
            case ApplicationFieldEnum.Name:
                return 'name';
            case ApplicationFieldEnum.ReviewStatus:
                return 'reviewStatus.keyword';
            case ApplicationFieldEnum.ReviewStatusPriority:
                return 'reviewStatusPriority';
            case ApplicationFieldEnum.ResponseStatus:
                return 'responseStatus.keyword';
            case ApplicationFieldEnum.ResponseStatusPriority:
                return 'responseStatusPriority';
            case ApplicationFieldEnum.PendingCount:
                return 'reviewStats.pendingCount';
            case ApplicationFieldEnum.UsableCount:
                return 'reviewStats.usableCount';
            case ApplicationFieldEnum.ToCheckCount:
                return 'reviewStats.toCheckCount';
            case ApplicationFieldEnum.NoResponseCount:
                return 'invitationStats.noResponseCount';
            case ApplicationFieldEnum.DeclinedCount:
                return 'invitationStats.declinedCount';
            case ApplicationFieldEnum.Id:
            default:
                return 'id';
        }
    }

    async getApplications(
        searchArguments: ApplicationSearchArgs,
        searchOptions?: SearchOptions | undefined,
    ): Promise<SearchServiceApplicationResults> {
        const size = searchOptions?.pageSize ?? 10000;
        const from = calculatePaginationFrom(searchOptions?.page, searchOptions?.pageSize);
        const sortField = this.mapApplicationFieldEnum(searchOptions?.sortField);
        const sortOrder = this.mapSortOrder(searchOptions?.sortOrder);
        const applicationsSearchBody = applicationsSearchBodyBuilder({
            pagination: { from, size },
            sort: { sortField, sortOrder },
            filters: {
                opportunityId: searchArguments.opportunityId,
                opportunityApplicationWorkflowComponentId: searchArguments.applicationWorkflowComponentId,
                applicationStatuses: searchArguments.filter?.applicationStatuses,
                reviewStatuses: searchArguments.filter?.reviewStatuses,
            },
            searchTerm: searchArguments.searchTerm,
            bucketAggregationIdentifiers: searchArguments.filterCountFields,
        });

        const urlSearchParams = new URLSearchParams({
            source_content_type: 'application/json',
            source: JSON.stringify(applicationsSearchBody),
        });

        const response: OpensearchApplicationResponse = await this.tfsFetchClient.get(
            this.tfsUserId,
            `/application/_search?${urlSearchParams.toString()}`,
        );

        const totalHits = response.hits.total.value;

        const meta: SearchServiceResultsMeta = {
            page: searchOptions?.page ?? 1,
            pageSize: searchOptions?.pageSize,
            totalCount: totalHits,
            countOnPage: response.hits.hits.length,
            totalPages: Math.ceil(totalHits / size),
        };

        const searchServiceResults: SearchServiceApplicationResults = {
            results: response.hits.hits.map(hit => mapOpensearchApplicationHit(hit._source)),
            meta,
        };

        if (response.aggregations) {
            const resultCounts: SearchServiceResultCounts = {};

            if (response.aggregations.reviewStatuses) {
                resultCounts.reviewStatuses = response.aggregations.reviewStatuses.buckets.reduce(
                    reduceOpensearchAggregationBucket,
                    [],
                );
            }

            searchServiceResults.resultCounts = resultCounts;
        }

        return searchServiceResults;
    }

    async getAwardsCount(organisationId: number): Promise<number> {
        const searchBody = createAwardCountQuery(organisationId);

        const urlSearchParams = new URLSearchParams({
            source_content_type: 'application/json',
            source: JSON.stringify(searchBody),
        });

        const response: OpensearchCountResponse = await this.tfsFetchClient.get(
            this.tfsUserId,
            `/award/_count?${urlSearchParams.toString()}`,
        );

        return response.count;
    }

    async getAwards(
        searchArguments: AwardSearchArgs,
        searchOptions?: AwardSearchOptions,
    ): Promise<SearchServiceAwardResults> {
        let size = 10000;
        let from = 0;
        const queryBuilderOptions: AwardQueryBuilderOptions = {
            pagination: { from, size },
            searchTerm: searchArguments.searchTerm,
            filters: searchArguments.filter,
            external: searchOptions?.external ?? false,
        };

        if (searchOptions) {
            const { sortField, sortOrder, pageSize, page } = searchOptions;
            if (pageSize) {
                size = pageSize;
            }
            from = calculatePaginationFrom(page, pageSize);
            queryBuilderOptions.sort = { sortField, sortOrder };
            queryBuilderOptions.pagination = { from, size };
        }

        const searchBody = queryBuilderOptions.external
            ? externalAwardsSearchBodyBuilder(queryBuilderOptions)
            : internalAwardsSearchBodyBuilder(queryBuilderOptions);

        const urlSearchParams = new URLSearchParams({
            source_content_type: 'application/json',
            source: JSON.stringify(searchBody),
        });

        const response: OpensearchAwardResponse = await this.tfsFetchClient.get(
            this.tfsUserId,
            `/award/_search?${urlSearchParams.toString()}`,
        );

        const totalHits = response.hits.total.value;

        const meta: SearchServiceResultsMeta = {
            page: searchOptions?.page ?? 1,
            pageSize: searchOptions?.pageSize,
            totalCount: totalHits,
            countOnPage: response.hits.hits.length,
            totalPages: Math.ceil(totalHits / size),
        };

        const searchServiceResults: SearchServiceAwardResults = {
            results: response.hits.hits.map(hit => hit._source),
            meta,
        };

        return searchServiceResults;
    }

    async verifyHealth(): Promise<boolean> {
        let result: OpensearchClusterHealthResponse;

        try {
            const sleep = new Promise((_, reject) => setTimeout(() => reject(true), 1000));
            const fetchClientPromise: Promise<OpensearchClusterHealthResponse> = this.tfsFetchClient.get(
                this.tfsUserId,
                '/_cluster/health',
            );

            await Promise.race([sleep, fetchClientPromise]);

            result = await fetchClientPromise;

            this.logger.info(`Opensearch service status: ${result.status}`);

            return true;
        } catch (e) {
            this.logger.error(`Opensearch service unreachable: ${e}`);
        }
        return false;
    }
}
