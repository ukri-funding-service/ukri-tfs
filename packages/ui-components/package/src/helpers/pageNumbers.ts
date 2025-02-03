import { getLowerBoundary, getUpperAndLowerBoundaries } from './minMaxBoundaries';
import { PageNumberBreak } from './pageNumberConcat';

export type PageNumber = number | PageNumberBreak;

/**
 * Generates an array of page numbers that can be used to render a pagination controller.
 * @param currentlySelectedPage The page number of the currently selected page
 * @param totalPages The total number of pages
 * @param pageNumbersToShow The number of page numbers that are required in the resulting controls
 */
export function getPageNumbers(
    currentlySelectedPage: number,
    totalPages: number,
    pageNumbersToShow: number,
): PageNumber[] {
    // force values to be within safe bounderies
    // this is no guarentee of correctness, just prevents against more severe issues such as getting caught in a loop
    const lastPageNumber = getLowerBoundary(totalPages, 1); // must be greater than 0
    const currentPage = getUpperAndLowerBoundaries(currentlySelectedPage, 1, lastPageNumber); // must be greater than 0 and lower or equal to the lastPageNumber
    let pageNumbersLeft = getUpperAndLowerBoundaries(pageNumbersToShow, 1, lastPageNumber); // must be greater than 0 and lower or equal to the lastPageNumber

    const pageNumbers: PageNumber[] = [];

    // add current page to set a "mid point"
    pageNumbers.push(currentPage);
    pageNumbersLeft--;

    let pageStep = 1;

    while (pageNumbersLeft > 0) {
        const nextPage = currentPage + pageStep;
        const prevPage = currentPage - pageStep;

        const isNextPageRequired = nextPage <= lastPageNumber;
        const isPreviousPageRequired = prevPage > 0;

        if (isNextPageRequired) {
            pageNumbers.push(nextPage);
            pageNumbersLeft--;
        }

        const canGeneratePrevious = pageNumbersLeft > 0;

        if (canGeneratePrevious && isPreviousPageRequired) {
            pageNumbers.unshift(prevPage);
            pageNumbersLeft--;
        }

        pageStep++;
    }

    return pageNumbers;
}
