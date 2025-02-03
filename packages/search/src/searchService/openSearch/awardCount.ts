import { AwardNotDeletedFilter } from './opensearchAwardQueryBuilderBase';

export type AwardCountQuery = {
    query: {
        bool: {
            filter: [
                {
                    term: {
                        organisationId: number;
                    };
                },
                AwardNotDeletedFilter,
            ];
        };
    };
};

export const createAwardCountQuery = (organisationId: number): AwardCountQuery => {
    return {
        query: {
            bool: {
                filter: [
                    {
                        term: {
                            organisationId: organisationId,
                        },
                    },
                    {
                        bool: {
                            should: [
                                {
                                    bool: {
                                        must_not: {
                                            exists: {
                                                field: 'deleted',
                                            },
                                        },
                                    },
                                },
                                {
                                    term: {
                                        deleted: {
                                            value: false,
                                        },
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    };
};
