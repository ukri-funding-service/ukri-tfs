import { describe, expect, it } from '@jest/globals';
import { ParsedUrlQuery } from 'querystring';
import { PageInfo, getPageInfoFromQuery } from '../../src/paging';

describe('Pagination utility functions', () => {
    describe('getPageInfoFromQuery', () => {
        const assertions: {
            name: string;
            query: ParsedUrlQuery;
            expected: Pick<PageInfo, 'page' | 'pageSize'>;
        }[] = [
            {
                name: 'page and size not a number',
                query: {
                    page: 'a2',
                    pageSize: 'b1',
                },
                expected: {
                    page: 1,
                    pageSize: 10,
                },
            },
            {
                name: 'page and size not specified',
                query: {},
                expected: {
                    page: 1,
                    pageSize: 10,
                },
            },
            {
                name: 'page and size have correct values',
                query: {
                    page: '11',
                    pageSize: '55',
                },
                expected: {
                    page: 11,
                    pageSize: 55,
                },
            },
        ];

        assertions.forEach(({ name, query, expected }) => {
            it(name, () => {
                expect(getPageInfoFromQuery(query)).toEqual(expected);
            });
        });

        it('test with different default size', () => {
            expect(
                getPageInfoFromQuery(
                    {
                        page: '11',
                    },
                    33,
                ),
            ).toEqual({
                page: 11,
                pageSize: 33,
            });
        });
    });
});
