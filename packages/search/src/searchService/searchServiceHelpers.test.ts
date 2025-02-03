import { describe, it, expect } from '@jest/globals';
import { calculatePaginationFrom, extractNumberReferenceFromSearch } from './searchServiceHelpers';

describe('searchServiceHelpers', () => {
    describe('calculatePaginationFrom', () => {
        it.each([
            { page: 1, pageSize: undefined, expectedFrom: 0 },
            { page: undefined, pageSize: 10, expectedFrom: 0 },
            { page: 1, pageSize: 10, expectedFrom: 0 },
            { page: 2, pageSize: 10, expectedFrom: 10 },
        ])(
            'should calculate pagination from as $expectedFrom for page $page and pageSize $pageSize',
            ({ page, pageSize, expectedFrom }) => {
                const from = calculatePaginationFrom(page, pageSize);
                expect(from).toEqual(expectedFrom);
            },
        );
    });

    describe('extractAwardReferenceOrNumberFromSearch', () => {
        it('should extract award reference from search', () => {
            const awardRef = extractNumberReferenceFromSearch('UKRI0123');
            expect(awardRef).toEqual(123);
        });

        it('should extract application reference from search', () => {
            const awardRef = extractNumberReferenceFromSearch('APP0123');
            expect(awardRef).toEqual(123);
        });

        it('should extract opportunity reference from search', () => {
            const awardRef = extractNumberReferenceFromSearch('OPP0123');
            expect(awardRef).toEqual(123);
        });

        it('should return undefined if award reference is not found', () => {
            const awardRef = extractNumberReferenceFromSearch('Organisation 123');
            expect(awardRef).toBeUndefined();
        });
    });
});
