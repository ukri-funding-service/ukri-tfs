import { describe, expect, it } from '@jest/globals';
import { createAwardCountQuery } from './awardCount';

describe('awardCount', () => {
    it('should create a query containing a provided organisation id', () => {
        const organisationId = 500;
        const query = createAwardCountQuery(organisationId);

        const expectedQuery = {
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

        expect(query).toEqual(expectedQuery);
    });
});
