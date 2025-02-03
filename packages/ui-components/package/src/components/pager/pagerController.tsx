import React from 'react';
import { getPageNumbers, PageNumber } from '../../helpers/pageNumbers';
import { concatenatePageNumbers, pageNumberBreak } from '../../helpers/pageNumberConcat';
import { getLowerBoundary } from '../../helpers';
import cx from 'classnames';

function prevPageButtonComponent(link: string): JSX.Element {
    return (
        <a className="pager__list-link pager__prev govuk-link" href={link} aria-label="Previous page">
            <svg
                className="pager__govuk-pagination__icon pager__govuk-pagination__icon--prev"
                xmlns="http://www.w3.org/2000/svg"
                height="13"
                width="15"
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 15 13"
            >
                <path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
            </svg>
            Previous
        </a>
    );
}

function nextPageButtonComponent(link: string): JSX.Element {
    return (
        <>
            <a className="pager__list-link pager__next govuk-link" href={link} aria-label="Next page">
                Next
                <svg
                    className="pager__govuk-pagination__icon pager__govuk-pagination__icon--next"
                    xmlns="http://www.w3.org/2000/svg"
                    height="13"
                    width="15"
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 15 13"
                >
                    <path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
                </svg>
            </a>
        </>
    );
}

function pageNumberComponent(pageNumber: number, link: string): JSX.Element {
    return (
        <a href={link} className="pager__list-link govuk-link" aria-label={`Page ${pageNumber}`}>
            {pageNumber}
        </a>
    );
}

function ellipsisItemComponent(): JSX.Element {
    return <span className="pager__list-ellipses">⋯</span>;
}

function currentPageNumberComponent(pageNumber: number): JSX.Element {
    return (
        <a
            href="#"
            className="pager__list-current-link govuk-link"
            aria-current="page"
            aria-label={`Page ${pageNumber}`}
        >
            <strong>{pageNumber}</strong>
        </a>
    );
}

function withPageItemWrapper(
    component: JSX.Element,
    key: string,
    additionalClass?: string,
    ariaHide = false,
): JSX.Element {
    if (ariaHide) {
        return (
            <li key={key} className="pager__list-item" aria-hidden="true" role="presentation">
                {component}
            </li>
        );
    }
    return (
        <li key={key} className={cx('pager__list-item', additionalClass)}>
            {component}
        </li>
    );
}

function withPageButtonWrapper(component: JSX.Element, key: string, additionalClass?: string): JSX.Element {
    return (
        <div key={key} className={cx('pager__list-item pager__selectable-item', additionalClass)}>
            {component}
        </div>
    );
}

function getNextButton(currentPageNumber: number, totalPages: number, getLink: GetLinkFunction): JSX.Element {
    const isNextPageButtonRequired = currentPageNumber < totalPages;
    if (isNextPageButtonRequired) {
        return withPageButtonWrapper(
            nextPageButtonComponent(getLink(currentPageNumber + 1)),
            'next-link',
            'pager__next-button-wrapper',
        );
    }
    return <React.Fragment />;
}

function getPrevButton(currentPageNumber: number, getLink: GetLinkFunction): JSX.Element {
    const isPrevPageButtonRequired = currentPageNumber > 1;
    if (isPrevPageButtonRequired) {
        return withPageButtonWrapper(
            prevPageButtonComponent(getLink(currentPageNumber - 1)),
            'prev-link',
            'pager__previous-button-wrapper',
        );
    }
    return <React.Fragment />;
}

function getPageNumberComponents(
    pageNumbers: PageNumber[],
    currentPage: number,
    getLink: GetLinkFunction,
): JSX.Element[] {
    const limitedCurrentPage = getLowerBoundary(currentPage, 1); // cannot be on a page that is lower than 1
    return pageNumbers.map((pageNumber: PageNumber, index: number) => {
        switch (pageNumber) {
            case pageNumberBreak:
                return withPageItemWrapper(
                    ellipsisItemComponent(),
                    'page-link-' + pageNumber,
                    /* ariaHide = */ '',
                    true,
                );
            case limitedCurrentPage:
                return withPageItemWrapper(
                    currentPageNumberComponent(limitedCurrentPage),
                    'page-link-' + pageNumber,
                    'pager__selected-item-background',
                    false,
                );
            default:
                const isIntermediateIndex = index !== 0 && index !== pageNumbers.length - 1;
                const additionalClass = cx('pager__selectable-item', isIntermediateIndex ? 'intermediate-page' : '');
                return withPageItemWrapper(
                    pageNumberComponent(pageNumber, getLink(pageNumber)),
                    'page-link-' + pageNumber,
                    additionalClass,
                );
        }
    });
}

export type GetLinkFunction = (pageNumber: number) => string;

export interface PagerControllerProps {
    id: string;
    totalPages: number;
    pagesToShow: number;
    currentPage: number;
    getLink: GetLinkFunction;
    className?: string;
}

export const TfsPagerController: React.FunctionComponent<PagerControllerProps> = (props): JSX.Element => {
    const pageNumbers = getPageNumbers(props.currentPage, props.totalPages, props.pagesToShow);
    const pageNumbersWithBreaks = concatenatePageNumbers(pageNumbers, props.totalPages);
    const prevButtonComponent = getPrevButton(props.currentPage, props.getLink);
    const nextButtonComponent = getNextButton(props.currentPage, props.totalPages, props.getLink);
    const pageNumberComponents = getPageNumberComponents(pageNumbersWithBreaks, props.currentPage, props.getLink);

    return (
        <nav className={cx('pager__controls', props.className)}>
            <div className={cx('pager__nav-wrapper', props.className)}>
                {prevButtonComponent}
                <ul className={cx('pager__list', props.className)}>{pageNumberComponents}</ul>
                {nextButtonComponent}
            </div>
        </nav>
    );
};
