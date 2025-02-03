import { expect } from 'chai';
import { concatenatePageNumbers } from '../../../src/helpers/pageNumberConcat';

describe('Page Number Concat tests', () => {
    describe('Last page number concatenations', () => {
        it('should return a list with the 5 and 6 replaced with undefined and 10 when the last index does not contain the last page number', () => {
            // given
            const pageNumbers = [1, 2, 3, 4, 5, 6];
            const lastPageNumber = 10;

            // when
            const result = concatenatePageNumbers(pageNumbers, lastPageNumber);

            // then
            expect(result).to.eql([1, 2, 3, 4, undefined, 10]);
        });

        it('should return a list with the 10 and 11 replaced with undefined and 10 when the last index does not contain the last page number', () => {
            // given
            const pageNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            const lastPageNumber = 15;

            // when
            const result = concatenatePageNumbers(pageNumbers, lastPageNumber);

            // then
            expect(result).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, undefined, 15]);
        });

        it('should return a list with nothing replaced when the last index contains the last page number ', () => {
            // given
            const pageNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const lastPageNumber = 10;

            // when
            const result = concatenatePageNumbers(pageNumbers, lastPageNumber);

            // then
            expect(result).to.eql(pageNumbers);
        });
    });
    describe('First page number concatenations', () => {
        it('should return a list with the 3 and 4 replaced with 1 and undefined when the first index does not contain the first page number', () => {
            // given
            const pageNumbers = [3, 4, 5, 6, 7, 8];
            const lastPageNumber = 8;

            // when
            const result = concatenatePageNumbers(pageNumbers, lastPageNumber);

            // then
            expect(result).to.eql([1, undefined, 5, 6, 7, 8]);
        });

        it('should return a list with the 10 and 11 replaced with 1 and undefined when the first index does not contain the first page number', () => {
            // given
            const pageNumbers = [10, 11, 12, 13, 14, 15, 16];
            const lastPageNumber = 16;

            // when
            const result = concatenatePageNumbers(pageNumbers, lastPageNumber);

            // then
            expect(result).to.eql([1, undefined, 12, 13, 14, 15, 16]);
        });
    });

    describe('First and last page number concatenations', () => {
        it('should return a list with the 3 and 4 replaced with 1 and undefined, then 10 and 11 replaced with undefined and 15', () => {
            // given
            const pageNumbers = [3, 4, 5, 6, 7, 8, 9, 10, 11];
            const lastPageNumber = 15;

            // when
            const result = concatenatePageNumbers(pageNumbers, lastPageNumber);

            // then
            expect(result).to.eql([1, undefined, 5, 6, 7, 8, 9, undefined, 15]);
        });

        it('should return a list with the 2 and 3 replaced with 1 and undefined, then 5 and 6 replaced with undefined and 7', () => {
            // given
            const pageNumbers = [2, 3, 4, 5, 6];
            const lastPageNumber = 7;

            // when
            const result = concatenatePageNumbers(pageNumbers, lastPageNumber);

            // then
            expect(result).to.eql([1, undefined, 4, undefined, 7]);
        });
    });

    describe('Lists under 5 items in length', () => {
        it('should return the same list when it contains less than 5 characters', () => {
            // given
            const pageNumbers = [3, 4, 5, 6];
            const lastPageNumber = 10;

            // when
            const result = concatenatePageNumbers(pageNumbers, lastPageNumber);

            // then
            expect(result).to.eql(pageNumbers);
        });
    });

    describe('Last page number less than the number of pages', () => {
        it('should return the same list when the last page number is less than the total number of pages in list', () => {
            // given
            const pageNumbers = [1, 2, 3, 4, 5, 6, 7, 8];
            const lastPageNumber = 5;

            // when
            const result = concatenatePageNumbers(pageNumbers, lastPageNumber);

            // then
            expect(result).to.eql(pageNumbers);
        });

        it('should return the a concatenated list when the last page number is less than the total number of pages in list and the first two pages are missing', () => {
            // given
            const pageNumbers = [3, 4, 5, 6, 7, 8, 9];
            const lastPageNumber = 5;

            // when
            const result = concatenatePageNumbers(pageNumbers, lastPageNumber);

            // then
            expect(result).to.eql([1, undefined, 5, 6, 7, 8, 9]);
        });
    });
});
