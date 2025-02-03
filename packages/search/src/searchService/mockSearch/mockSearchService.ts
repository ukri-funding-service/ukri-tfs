import { paginate } from 'slice-paginate';
import {
    mapMockApplicationReviewStatusToReviewStatusEnum,
    mapMockApplicationStatusToApplicationStatusEnum,
    mapMockApplicationToSearchServiceApplication,
} from '../../mappers/mockSearchServiceMappers';
import {
    ApplicationFieldEnum,
    ApplicationSearchArgs,
    ApplicationStatusEnum,
    AssignedFilter,
    AwardFunder,
    AwardSearchArgs,
    AwardSearchOptions,
    AwardSortFields,
    InternalAwardStatus,
    AwardTask,
    mapSortFieldForAward,
    ReviewStatusEnum,
    ReviewStatusResultCount,
    SearchOptions,
    SearchService,
    SearchServiceApplicationResults,
    SearchServiceAward,
    SearchServiceAwardDto,
    SearchServiceAwardResults,
    SearchServiceResultCounts,
    SearchServiceResultsMeta,
    SearchServiceStateEnum,
    SortOrderEnum,
    ExternalAwardStatus,
    ExternalSlaTaskDto,
    ExternalTask,
} from '../searchService';
import { extractNumberReferenceFromSearch } from '../searchServiceHelpers';

export interface MockApplicationReviewStats {
    pendingCount: number;
    usableCount: number;
    toCheckCount: number;
}

export interface MockApplicationInvitationStats {
    noResponseCount: number;
    declinedCount: number;
}

export interface MockApplication {
    id: number;
    displayId: string;
    opportunityId: number;
    opportunityApplicationWorkflowComponentId: number;
    name: string;
    applicationStatus: string;
    reviewStatus: string;
    reviewStatusPriority: number;
    responseStatus: string;
    responseStatusPriority: number;
    reviewStats: MockApplicationReviewStats;
    invitationStats: MockApplicationInvitationStats;
    reviewFailedDate?: string;
}

export type MockAward = {
    id: number;
    awardReference: number;
    grantReference?: string;
    awardName: string;
    awardHolderId?: number;
    awardHolderFirstName?: string;
    awardHolderLastName?: string;
    opportunityId?: number;
    opportunityName?: string;
    applicationId?: number;
    applicationName?: string;
    organisationId: number;
    organisationName: string;
    status: InternalAwardStatus;
    externalStatus: ExternalAwardStatus;
    funder?: AwardFunder;
    tasks: { title: AwardTask; slaDate: string; activateDate: string }[];
    externalTasks: { title: ExternalTask; slaDate: string; activateDate: string }[];
    earliestStartDate: string;
    actualStartDate?: string;
    endDate: string;
    fesLastFesEvent?: string;
    assignedPersonId?: number;
    assignedPersonName?: string;
    thirdPartyExternalTasks?: { title: string; activateDate: string }[];
    deleted?: boolean;
};

const filterAwardBySearchTerm = (searchTerm: string) => {
    const regex = new RegExp(searchTerm, 'i');

    return (mockAward: SearchServiceAward) => {
        const extractedNumberFromSearch = extractNumberReferenceFromSearch(searchTerm);
        return extractedNumberFromSearch
            ? mockAward.awardReference === extractedNumberFromSearch ||
                  mockAward.opportunityId === extractedNumberFromSearch ||
                  mockAward.applicationId === extractedNumberFromSearch
            : mockAward.awardName.match(regex) ||
                  mockAward.organisationName.match(regex) ||
                  mockAward.opportunityName?.match(regex) ||
                  mockAward.applicationName?.match(regex) ||
                  mockAward.assignedPersonName?.match(regex) ||
                  mockAward.awardHolderFirstName?.match(regex) ||
                  mockAward.grantReference?.match(regex) ||
                  mockAward.awardHolderLastName?.match(regex);
    };
};

const sortByTaskProperty = (
    filteredMockAwards: SearchServiceAward[],
    taskProperty: 'slaDate' | 'activateDate',
    isSortOrderAscending: boolean,
) => {
    filteredMockAwards.forEach(a => {
        a.tasks.sort((ta, tb) => {
            return sortCompare(ta[taskProperty], tb[taskProperty], isSortOrderAscending);
        });
    });

    filteredMockAwards.sort((a, b) => {
        if (a.tasks.length > 0 && b.tasks.length > 0) {
            return sortCompare(a.tasks[0][taskProperty], b.tasks[0][taskProperty], isSortOrderAscending);
        }
        if (a.tasks.length === 0 && b.tasks.length === 0) {
            return sortCompare(a.awardName, b.awardName, isSortOrderAscending);
        }
        return 0;
    });
};

const sortAwardsByField = (
    sortField: AwardSortFields,
    filteredMockAwards: SearchServiceAward[],
    isSortOrderAscending: boolean,
) => {
    if (sortField === 'status') {
        const sortOrder: Record<InternalAwardStatus, number> = {
            Draft: 1,
            'Awaiting authorisation': 2,
            'Awaiting acceptance': 3,
            Announced: 4,
            Active: 5,
            'Awaiting completion': 6,
            Reconciling: 7,
            Suspended: 8,
            'Awaiting termination': 9,
            'Transfer initiated': 10,
            Closed: 11,
        };
        filteredMockAwards.sort((a, b) => {
            const asf = sortOrder[a.status];
            const bsf = sortOrder[b.status];
            return sortCompare(asf, bsf, isSortOrderAscending);
        });
        return;
    }
    const sortFields = mapSortFieldForAward[sortField];
    for (const sf of sortFields) {
        if (sf === 'tasks.slaDate') {
            sortByTaskProperty(filteredMockAwards, 'slaDate', isSortOrderAscending);
        } else if (sf === 'tasks.activateDate') {
            sortByTaskProperty(filteredMockAwards, 'activateDate', isSortOrderAscending);
        } else {
            filteredMockAwards.sort((a, b) => {
                const field = sf.replace('.keyword', '') as keyof Omit<
                    SearchServiceAward,
                    'tasks' | 'externalTasks' | 'thirdPartyExternalTasks'
                >;
                const asf = a[field];
                const bsf = b[field];
                return sortCompare(asf, bsf, isSortOrderAscending);
            });
        }
    }
};

type SortFieldValue = string | number | undefined | Date | boolean;

const sortCompare = (a: SortFieldValue, b: SortFieldValue, isAscending: boolean): number => {
    if (a === undefined) {
        return 1;
    }
    if (b === undefined) {
        return -1;
    }
    const aValue = a instanceof Date ? a.getTime() : a;
    const bValue = b instanceof Date ? b.getTime() : b;

    if (aValue < bValue) {
        return isAscending ? -1 : 1;
    }

    if (aValue > bValue) {
        return isAscending ? 1 : -1;
    }

    return 0;
};

export class MockSearchService implements SearchService {
    state = SearchServiceStateEnum.MockSearchService;

    constructor(private allMockApplications: MockApplication[], private allMockAwards: MockAward[]) {}

    async getAwardsCount(_organisationId: number): Promise<number> {
        return 3;
    }

    async getAwards(
        searchArguments: AwardSearchArgs,
        searchOptions?: AwardSearchOptions,
    ): Promise<SearchServiceAwardResults> {
        const searchTerm = searchArguments.searchTerm;
        const page = searchOptions?.page ?? 1;
        const pageSize = searchOptions?.pageSize;
        const sortOrder = searchOptions?.sortOrder ?? SortOrderEnum.Asc;
        const sortField = searchOptions?.sortField ?? 'task';
        const isSortOrderAscending = sortOrder === SortOrderEnum.Asc;
        const funderFilters = searchArguments.filter?.funders;
        const statusFilters = searchArguments.filter?.statuses;
        const taskFilters = searchArguments.filter?.tasks;
        const assignedFilters = searchArguments.filter?.assigned;

        let filteredMockAwards: SearchServiceAward[] = this.allMockAwards.map(mockAward => {
            const tasks: SearchServiceAward['tasks'] = mockAward.tasks.map(task => ({
                title: task.title,
                slaDate: new Date(task.slaDate),
                activateDate: new Date(task.activateDate),
            }));

            /* istanbul ignore next */
            const externalTasks: SearchServiceAward['externalTasks'] = mockAward.externalTasks
                ? mockAward.externalTasks.map((task: ExternalSlaTaskDto) => ({
                      title: task.title,
                      slaDate: new Date(task.slaDate),
                      activateDate: new Date(task.activateDate),
                      overdueDate: task.overdueDate ? new Date(task.overdueDate) : undefined,
                      overdueTitle: task.overdueTitle,
                  }))
                : [];

            const award: SearchServiceAward = {
                id: mockAward.id,
                awardReference: mockAward.awardReference,
                grantReference: mockAward.grantReference,
                awardName: mockAward.awardName,
                opportunityId: mockAward.opportunityId,
                opportunityName: mockAward.opportunityName,
                applicationId: mockAward.applicationId,
                applicationName: mockAward.applicationName,
                organisationId: mockAward.organisationId,
                organisationName: mockAward.organisationName,
                status: mockAward.status,
                externalStatus: mockAward.externalStatus,
                funder: mockAward.funder,
                tasks,
                externalTasks,
                earliestStartDate: new Date(mockAward.earliestStartDate),
                actualStartDate: mockAward.actualStartDate ? new Date(mockAward.actualStartDate) : undefined,
                endDate: new Date(mockAward.endDate),
                fesLastFesEvent: mockAward.fesLastFesEvent,
                assignedPersonId: mockAward.assignedPersonId,
                assignedPersonName: mockAward.assignedPersonName,
                awardHolderId: mockAward.awardHolderId,
                awardHolderFirstName: mockAward.awardHolderFirstName,
                awardHolderLastName: mockAward.awardHolderLastName,
                thirdPartyExternalTasks: mockAward.thirdPartyExternalTasks,
                deleted: false,
            };

            return award;
        });

        if (searchTerm) {
            filteredMockAwards = filteredMockAwards.filter(filterAwardBySearchTerm(searchTerm));
        }

        if (funderFilters?.length) {
            filteredMockAwards = filteredMockAwards.filter(a => a.funder && funderFilters.includes(a.funder));
        }

        if (statusFilters?.length) {
            filteredMockAwards = filteredMockAwards.filter(a => a.funder && statusFilters.includes(a.status));
        }

        if (taskFilters?.length) {
            filteredMockAwards = filteredMockAwards.filter(a => {
                return a.tasks.some(t => taskFilters.includes(t.title));
            });
        }
        if (assignedFilters?.length) {
            filteredMockAwards = filteredMockAwards.filter(a => {
                return assignedFilterMatch(a.assignedPersonId, assignedFilters);
            });
        }

        if (searchOptions?.external) {
            filteredMockAwards = filteredMockAwards.filter(a => {
                return a.externalStatus !== 'Invalid';
            });
        }
        if (sortField) {
            sortAwardsByField(sortField, filteredMockAwards, isSortOrderAscending);
        }
        const sortedMockAwards = filteredMockAwards;

        let paginatedMockAwards = sortedMockAwards;
        if (pageSize) {
            const { start, end } = paginate(sortedMockAwards.length, pageSize, page);

            paginatedMockAwards = sortedMockAwards.slice(start, end);
        }

        let totalPages = 0;
        if (sortedMockAwards.length) {
            totalPages = pageSize ? Math.ceil(sortedMockAwards.length / pageSize) : 1;
        }

        const meta: SearchServiceResultsMeta = {
            page,
            pageSize,
            totalCount: sortedMockAwards.length,
            countOnPage: paginatedMockAwards.length,
            totalPages,
        };

        /* istanbul ignore next */
        const results: SearchServiceAwardDto[] = paginatedMockAwards.map(award => ({
            ...award,
            tasks: award.tasks.map(task => ({
                title: task.title,
                slaDate: task.slaDate.toISOString(),
                activateDate: task.activateDate.toISOString(),
            })),
            externalTasks: award.externalTasks.map(task => ({
                title: task.title,
                slaDate: task.slaDate.toISOString(),
                activateDate: task.activateDate.toISOString(),
            })),
            earliestStartDate: award.earliestStartDate.toISOString(),
            actualStartDate: award.actualStartDate?.toISOString(),
            endDate: award.endDate.toISOString(),
            deleted: award.deleted ?? false,
        }));

        const searchServiceResults: SearchServiceAwardResults = {
            results,
            meta,
        };

        return searchServiceResults;
    }

    async getApplications(
        searchArguments: ApplicationSearchArgs,
        searchOptions?: SearchOptions | undefined,
    ): Promise<SearchServiceApplicationResults> {
        const reduceApplicationFieldEnumToResultCounts = (mockApplications: MockApplication[]) => {
            return (
                resultCounts: SearchServiceResultCounts,
                applicationFieldEnum: ApplicationFieldEnum,
            ): SearchServiceResultCounts => {
                switch (applicationFieldEnum) {
                    case ApplicationFieldEnum.ReviewStatus:
                        resultCounts.reviewStatuses = mockApplications.reduce(
                            reduceMockApplicationToReviewStatusResultCounts,
                            [],
                        );
                }

                return resultCounts;
            };
        };

        const reduceMockApplicationToReviewStatusResultCounts = (
            reviewStatusesResultCounts: ReviewStatusResultCount[],
            mockApplication: MockApplication,
        ) => {
            const reviewStatusEnum = mapMockApplicationReviewStatusToReviewStatusEnum(mockApplication.reviewStatus);

            if (reviewStatusEnum !== undefined) {
                const foundIndex = reviewStatusesResultCounts.findIndex(
                    reviewStatusResultCount => reviewStatusResultCount.title === reviewStatusEnum,
                );

                if (foundIndex >= 0) {
                    reviewStatusesResultCounts[foundIndex].count += 1;
                } else {
                    reviewStatusesResultCounts.push({ title: reviewStatusEnum, count: 1 });
                }
            }

            return reviewStatusesResultCounts;
        };

        const sortByField = (
            mockApplications: MockApplication[],
            isSortOrderAscending: boolean,
            sortField?: ApplicationFieldEnum,
        ): MockApplication[] => {
            return mockApplications.sort((a: MockApplication, b: MockApplication): number => {
                switch (sortField) {
                    case ApplicationFieldEnum.DisplayId:
                        return sortCompare(a.displayId.toLowerCase(), b.displayId.toLowerCase(), isSortOrderAscending);
                    case ApplicationFieldEnum.Name:
                        return sortCompare(a.name.toLowerCase(), b.name.toLowerCase(), isSortOrderAscending);
                    case ApplicationFieldEnum.ReviewStatusPriority:
                        return sortCompare(a.reviewStatusPriority, b.reviewStatusPriority, isSortOrderAscending);
                    case ApplicationFieldEnum.ResponseStatusPriority:
                        return sortCompare(a.responseStatusPriority, b.responseStatusPriority, isSortOrderAscending);
                    case ApplicationFieldEnum.PendingCount:
                        return sortCompare(
                            a.reviewStats.pendingCount,
                            b.reviewStats.pendingCount,
                            isSortOrderAscending,
                        );
                    case ApplicationFieldEnum.UsableCount:
                        return sortCompare(a.reviewStats.usableCount, b.reviewStats.usableCount, isSortOrderAscending);
                    case ApplicationFieldEnum.ToCheckCount:
                        return sortCompare(
                            a.reviewStats.toCheckCount,
                            b.reviewStats.toCheckCount,
                            isSortOrderAscending,
                        );
                    case ApplicationFieldEnum.NoResponseCount:
                        return sortCompare(
                            a.invitationStats.noResponseCount,
                            b.invitationStats.noResponseCount,
                            isSortOrderAscending,
                        );
                    case ApplicationFieldEnum.DeclinedCount:
                        return sortCompare(
                            a.invitationStats.declinedCount,
                            b.invitationStats.declinedCount,
                            isSortOrderAscending,
                        );
                    case ApplicationFieldEnum.Id:
                    default:
                        return sortCompare(a.id, b.id, isSortOrderAscending);
                }
            });
        };

        const filterBySearchTerm = (searchTerm: string) => {
            const regex = new RegExp(searchTerm, 'i');

            return (mockApplication: MockApplication) => {
                const parsedSearchTerm = parseInt(searchTerm);
                return (
                    (isNaN(parsedSearchTerm)
                        ? mockApplication.displayId === searchTerm
                        : mockApplication.id === parsedSearchTerm) || mockApplication.name.match(regex)
                );
            };
        };

        const filterByApplicationStatuses = (applicationStatusFilters: ApplicationStatusEnum[]) => {
            return (mockApplication: MockApplication) => {
                const applicationStatusEnum = mapMockApplicationStatusToApplicationStatusEnum(
                    mockApplication.applicationStatus,
                );

                return applicationStatusEnum ? applicationStatusFilters.includes(applicationStatusEnum) : false;
            };
        };

        const filterByReviewStatuses = (reviewStatusFilters: ReviewStatusEnum[]) => {
            return (mockApplication: MockApplication) => {
                const reviewStatusEnum = mapMockApplicationReviewStatusToReviewStatusEnum(mockApplication.reviewStatus);

                return reviewStatusEnum ? reviewStatusFilters.includes(reviewStatusEnum) : false;
            };
        };

        const searchTerm = searchArguments.searchTerm;
        const applicationStatusFilters = searchArguments.filter?.applicationStatuses;
        const reviewStatusFilters = searchArguments.filter?.reviewStatuses;
        const page = searchOptions?.page ?? 1;
        const pageSize = searchOptions?.pageSize;
        const sortOrder = searchOptions?.sortOrder ?? SortOrderEnum.Asc;
        const isSortOrderAscending = sortOrder === SortOrderEnum.Asc;

        let filteredMockApplications = this.allMockApplications.filter(
            mockApplication => mockApplication.opportunityId === searchArguments.opportunityId,
        );

        if (searchTerm) {
            filteredMockApplications = filteredMockApplications.filter(filterBySearchTerm(searchTerm));
        }

        if (applicationStatusFilters && applicationStatusFilters.length) {
            filteredMockApplications = filteredMockApplications.filter(
                filterByApplicationStatuses(applicationStatusFilters),
            );
        }

        if (reviewStatusFilters && reviewStatusFilters.length) {
            filteredMockApplications = filteredMockApplications.filter(filterByReviewStatuses(reviewStatusFilters));
        }

        filteredMockApplications = sortByField(
            filteredMockApplications,
            isSortOrderAscending,
            searchOptions?.sortField,
        );

        let paginatedMockApplications = filteredMockApplications;
        if (pageSize) {
            const { start, end } = paginate(filteredMockApplications.length, pageSize, page);

            paginatedMockApplications = filteredMockApplications.slice(start, end);
        }

        let totalPages = 0;
        if (filteredMockApplications.length) {
            totalPages = pageSize ? Math.ceil(filteredMockApplications.length / pageSize) : 1;
        }

        const meta: SearchServiceResultsMeta = {
            page,
            pageSize,
            totalCount: filteredMockApplications.length,
            countOnPage: paginatedMockApplications.length,
            totalPages,
        };

        const searchServiceResults: SearchServiceApplicationResults = {
            results: paginatedMockApplications.map(mapMockApplicationToSearchServiceApplication),
            meta,
        };

        if (searchArguments.filterCountFields) {
            const resultCounts: SearchServiceResultCounts = searchArguments.filterCountFields.reduce(
                reduceApplicationFieldEnumToResultCounts(filteredMockApplications),
                {},
            );

            searchServiceResults.resultCounts = resultCounts;
        }

        return searchServiceResults;
    }

    async verifyHealth(): Promise<boolean> {
        return true;
    }
}

const assignedFilterMatch = (personId: number | undefined, assignedFilters: AssignedFilter[]): boolean => {
    if (personId === undefined) {
        return assignedFilters.includes('unassigned');
    } else {
        return assignedFilters.includes(personId) || assignedFilters.includes('assigned');
    }
};
