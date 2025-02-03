import { PageNumber } from './pageNumbers';
import { getLowerBoundary } from './minMaxBoundaries';

export type PageNumberBreak = undefined;
export const pageNumberBreak: PageNumberBreak = undefined;

function addPrevNumberBreak(pageNumbers: PageNumber[]): PageNumber[] {
    if (pageNumbers[0] !== 1) {
        pageNumbers[0] = 1;
        pageNumbers[1] = pageNumberBreak;
    }
    return pageNumbers;
}

function addNextNumberBreak(pageNumbers: PageNumber[], totalPages: number): PageNumber[] {
    const lastIndex = pageNumbers.length - 1;
    if (pageNumbers[lastIndex] !== totalPages) {
        pageNumbers[lastIndex] = totalPages;
        pageNumbers[lastIndex - 1] = pageNumberBreak;
    }
    return pageNumbers;
}

/**
 * Creates a break in the page numbers in front and behind the current page without changing the number of items in the array
 * If enough values are available, and the first item is not page 1, it will replace the 0, 1 index with the values `1` and `undefined` respectively.
 * If enough values are available, and the last value is not the `lastPageNumber`, it will replace the n, n-1 index with the `lastPageNumber` and `undefined` respectively, where n is the index of the last value.
 * `concatenatePageNumbers([3,4,5,6,7,8,9], 10)` results in `[1,undefined,5,6,7,undefined,10]`
 *
 * @param pageNumbers A list of page numbers that need to be concatenated with a break. Page number lists with fewer than 5 numbers will be returned unconcatenated.
 * @param lastPageNumber The last page number
 */
export function concatenatePageNumbers(pageNumbers: PageNumber[], lastPageNumber: number): PageNumber[] {
    // force value to be within safe bounderies
    // this is no guarentee of correctness, just prevents against more severe issues such as appending a page number that does not exist
    const lastNumberInArray = pageNumbers[pageNumbers.length - 1] || 1;
    const lastPage = getLowerBoundary(lastPageNumber, lastNumberInArray); // last page must be at least the last page in the array

    const minimumNumberOfPageNumbersRequiredForSymbols = 5;
    if (pageNumbers.length >= minimumNumberOfPageNumbersRequiredForSymbols) {
        pageNumbers = addPrevNumberBreak(pageNumbers);
        pageNumbers = addNextNumberBreak(pageNumbers, lastPage);
    }
    return pageNumbers;
}
