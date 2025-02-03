import { expect } from 'chai';
import { getPageNumbers } from '../../../src/helpers/pageNumbers';

describe('Page Number tests', () => {
    describe('Positive numbers within valid boundaries', () => {
        it('should return a list of numbers from 1 to 10 when currentPage is 1, totalPages is 10 and pagesToShow is 10', () => {
            // given
            const currentPage = 1;
            const totalPages = 10;
            const pagesToShow = 10;

            // when
            const result = getPageNumbers(currentPage, totalPages, pagesToShow);

            // then
            expect(result).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        });

        it('should return a list of numbers from 1 to 10 when currentPage is 5, totalPages is 10 and pagesToShow is 10', () => {
            // given
            const currentPage = 5;
            const totalPages = 10;
            const pagesToShow = 10;

            // when
            const result = getPageNumbers(currentPage, totalPages, pagesToShow);

            // then
            expect(result).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        });

        it('should return a list of numbers from 1 to 10 when currentPage is 10, totalPages is 10 and pagesToShow is 10', () => {
            // given
            const currentPage = 10;
            const totalPages = 10;
            const pagesToShow = 10;

            // when
            const result = getPageNumbers(currentPage, totalPages, pagesToShow);

            // then
            expect(result).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        });

        it('should return a list of numbers from 1 to 5 when currentPage is 1, totalPages is 5 and pagesToShow is 5', () => {
            // given
            const currentPage = 1;
            const totalPages = 5;
            const pagesToShow = 5;

            // when
            const result = getPageNumbers(currentPage, totalPages, pagesToShow);

            // then
            expect(result).to.eql([1, 2, 3, 4, 5]);
        });

        it('should return a list of numbers from 1 to 3 when currentPage is 1, totalPages is 5 and pagesToShow is 3', () => {
            // given
            const currentPage = 1;
            const totalPages = 5;
            const pagesToShow = 3;

            // when
            const result = getPageNumbers(currentPage, totalPages, pagesToShow);

            // then
            expect(result).to.eql([1, 2, 3]);
        });

        it('should return a list of numbers from 2 to 4 when currentPage is 3, totalPages is 5 and pagesToShow is 3', () => {
            // given
            const currentPage = 3;
            const totalPages = 5;
            const pagesToShow = 3;

            // when
            const result = getPageNumbers(currentPage, totalPages, pagesToShow);

            // then
            expect(result).to.eql([2, 3, 4]);
        });

        it('should return a list of numbers from 2 to 5 when currentPage is 3, totalPages is 10 and pagesToShow is 4', () => {
            // given
            const currentPage = 3;
            const totalPages = 10;
            const pagesToShow = 4;

            // when
            const result = getPageNumbers(currentPage, totalPages, pagesToShow);

            // then
            expect(result).to.eql([2, 3, 4, 5]);
        });

        it('should return a list of numbers from 2 to 5 when currentPage is 5, totalPages is 5 and pagesToShow is 4', () => {
            // given
            const currentPage = 5;
            const totalPages = 5;
            const pagesToShow = 4;

            // when
            const result = getPageNumbers(currentPage, totalPages, pagesToShow);

            // then
            expect(result).to.eql([2, 3, 4, 5]);
        });
    });
    describe('Positive numbers within invalid boundaries', () => {
        it('should return a list of numbers from 1 to 5 when currentPage is 5, totalPages is 5 and pagesToShow is 50', () => {
            // given
            const currentPage = 5;
            const totalPages = 5;
            const pagesToShow = 50;

            // when
            const result = getPageNumbers(currentPage, totalPages, pagesToShow);

            // then
            expect(result).to.eql([1, 2, 3, 4, 5]);
        });

        it('should return a list of numbers from 6 to 10 when currentPage is 50, totalPages is 10 and pagesToShow is 5', () => {
            // given
            const currentPage = 50;
            const totalPages = 10;
            const pagesToShow = 5;

            // when
            const result = getPageNumbers(currentPage, totalPages, pagesToShow);

            // then
            expect(result).to.eql([6, 7, 8, 9, 10]);
        });
    });
    describe('Negative numbers within invalid boundaries', () => {
        it('should return the list containing a number 1 when currentPage is -5, totalPages is -100 and pagesToShow is 10', () => {
            // given
            const currentPage = -5;
            const totalPages = -100;
            const pagesToShow = 10;

            // when
            const result = getPageNumbers(currentPage, totalPages, pagesToShow);

            // then
            expect(result).to.eql([1]);
        });

        it('should return the list containing a number 1 when currentPage is 5, totalPages is -100 and pagesToShow is 10', () => {
            // given
            const currentPage = 5;
            const totalPages = -100;
            const pagesToShow = 10;

            // when
            const result = getPageNumbers(currentPage, totalPages, pagesToShow);

            // then
            expect(result).to.eql([1]);
        });
    });
});
