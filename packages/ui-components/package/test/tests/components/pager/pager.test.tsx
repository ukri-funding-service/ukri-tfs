import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { PagesProps, TfsPager, TfsPagerProps } from '../../../../src/components/pager';

describe('<TfsPager /> component tests', () => {
    it('should return a pager with 5 pages from 1 to 5 showing 1 to 100 of 1000 results', () => {
        // given
        const props: TfsPagerProps = {
            id: 'foo',
            paginationPages: {
                currentPage: 1,
                totalPages: 5,
                pagesToShow: 5,
                getLink: (val: number) => `link?page=${val}`,
            },
            paginationSummary: {
                startResult: 1,
                endResult: 100,
                totalResults: 1000,
                resultsName: 'results',
            },
        };

        // when
        const component = render(<TfsPager {...props} />);
        // showing 1 to 100 of 1000 results                  [1] 2 3 4 5 >

        // then
        expect(component.container.querySelector('.pager__summary')?.textContent).to.equal(
            'Showing 1 to 100 of 1000 results',
        ); // summary text
        expect(component.container.querySelector('.pager__list-current-link')?.textContent).to.equal('1'); // current page
        expect(component.container.querySelectorAll('.pager__list-link').length).to.equal(5); // nav links
        expect(component.container.querySelectorAll('.pager__prev').length).to.equal(0); // prev button
        expect(component.container.querySelectorAll('.pager__next').length).to.equal(1); // next button
        expect(component.container.querySelectorAll('.pager__list-ellipses').length).to.equal(0); // ellipses
    });

    it('should return a pager with correct container aria-label and role attributes', () => {
        // given
        const props: TfsPagerProps = {
            id: 'foo',
            paginationPages: {
                currentPage: 1,
                totalPages: 5,
                pagesToShow: 5,
                getLink: (val: number) => `link?page=${val}`,
            },
            paginationSummary: {
                startResult: 1,
                endResult: 100,
                totalResults: 1000,
                resultsName: 'results',
            },
        };

        // when
        const component = render(<TfsPager {...props} />);
        // showing 1 to 100 of 1000 results                  [1] 2 3 4 5 >

        // then
        expect(component.container.querySelector('.pager')?.getAttribute('role')).to.equal('navigation');
        expect(component.container.querySelector('.pager')?.getAttribute('aria-label')).to.equal('Pagination');
    });

    it('should return a pager with 10 pages from 1 to 5000 showing 1234 to 12345 of 123456 applications', () => {
        // given
        const props: TfsPagerProps = {
            id: 'foo',
            paginationPages: {
                currentPage: 25,
                totalPages: 500,
                pagesToShow: 10,
                getLink: (val: number) => `link?page=${val}`,
            },
            paginationSummary: {
                startResult: 1234,
                endResult: 12345,
                totalResults: 123456,
                resultsName: 'applications',
            },
        };

        // when
        const component = render(<TfsPager {...props} />);
        // showing 1234 to 12345 of 123456 applications                  < 1 ... 23 24 [25] 26 27 28 ... 5000 >

        // then
        expect(component.container.querySelector('.pager__summary')?.textContent).to.equal(
            'Showing 1234 to 12345 of 123456 applications',
        ); // summary text
        expect(component.container.querySelector('.pager__list-current-link')?.textContent).to.equal('25'); // current page
        expect(component.container.querySelectorAll('.pager__list-link').length).to.equal(9); // nav links
        expect(component.container.querySelectorAll('.pager__prev').length).to.equal(1); // prev button
        expect(component.container.querySelectorAll('.pager__next').length).to.equal(1); // next button
        expect(component.container.querySelectorAll('.pager__list-ellipses').length).to.equal(2); // ellipses
    });

    it('should return a pager with 1 page showing 1 to 1 of 1 applications', () => {
        // given
        const props: TfsPagerProps = {
            id: 'foo',
            paginationPages: {
                currentPage: 1,
                totalPages: 1,
                pagesToShow: 10,
                getLink: (val: number) => `link?page=${val}`,
            },
            paginationSummary: {
                startResult: 1,
                endResult: 1,
                totalResults: 1,
                resultsName: 'applications',
            },
        };

        // when
        const component = render(<TfsPager {...props} />);
        // showing 1 to 1 of 1 applications                  [1]

        // then
        expect(component.container.querySelector('.pager__summary')?.textContent).to.equal(
            'Showing 1 to 1 of 1 applications',
        ); // summary text
        expect(component.container.querySelector('.pager__list-current-link')?.textContent).to.equal('1'); // current page
        expect(component.container.querySelectorAll('.pager__list-link').length).to.equal(0); // nav links
        expect(component.container.querySelectorAll('.pager__prev').length).to.equal(0); // prev button
        expect(component.container.querySelectorAll('.pager__next').length).to.equal(0); // next button
        expect(component.container.querySelectorAll('.pager__list-ellipses').length).to.equal(0); // ellipses
    });

    it('should return a pager with 1 page showing 0 to 0 of 0 applications', () => {
        // given
        const props: TfsPagerProps = {
            id: 'foo',
            paginationPages: {
                currentPage: 1,
                totalPages: 1,
                pagesToShow: 10,
                getLink: (val: number) => `link?page=${val}`,
            },
            paginationSummary: {
                startResult: 0,
                endResult: 0,
                totalResults: 0,
                resultsName: 'applications',
            },
        };

        // when
        const component = render(<TfsPager {...props} />);
        // showing 0 to 0 of 0 applications                  [1]

        // then
        expect(component.container.querySelector('.pager__summary')?.textContent).to.equal(
            'Showing 0 to 0 of 0 applications',
        ); // summary text
        expect(component.container.querySelector('.pager__list-current-link')?.textContent).to.equal('1'); // current page
        expect(component.container.querySelectorAll('.pager__list-link').length).to.equal(0); // nav links
        expect(component.container.querySelectorAll('.pager__prev').length).to.equal(0); // prev button
        expect(component.container.querySelectorAll('.pager__next').length).to.equal(0); // next button
        expect(component.container.querySelectorAll('.pager__list-ellipses').length).to.equal(0); // ellipses
    });

    it('should return a pager with 1 page showing 0 to 0 of 0 applications when 0 pages are passed in', () => {
        // given
        const props: TfsPagerProps = {
            id: 'foo',
            paginationPages: {
                currentPage: 0,
                totalPages: 0,
                pagesToShow: 0,
                getLink: (val: number) => `link?page=${val}`,
            },
            paginationSummary: {
                startResult: 0,
                endResult: 0,
                totalResults: 0,
                resultsName: 'applications',
            },
        };

        // when
        const component = render(<TfsPager {...props} />);
        // showing 0 to 0 of 0 applications                  [1]

        // then
        expect(component.container.querySelector('.pager__summary')?.textContent).to.equal(
            'Showing 0 to 0 of 0 applications',
        ); // summary text
        expect(component.container.querySelector('.pager__list-current-link')?.textContent).to.equal('1'); // current page
        expect(component.container.querySelectorAll('.pager__list-link').length).to.equal(0); // nav links
        expect(component.container.querySelectorAll('.pager__prev').length).to.equal(0); // prev button
        expect(component.container.querySelectorAll('.pager__next').length).to.equal(0); // next button
        expect(component.container.querySelectorAll('.pager__list-ellipses').length).to.equal(0); // ellipses
    });

    describe('Pagination summary', () => {
        const pagesProps: PagesProps = {
            currentPage: 1,
            totalPages: 5,
            pagesToShow: 5,
            getLink: (val: number) => `link?page=${val}`,
        };

        it('should return a pager with the pagination summary', () => {
            const props: TfsPagerProps = {
                id: 'foo',
                paginationPages: pagesProps,
                paginationSummary: {
                    startResult: 0,
                    endResult: 0,
                    totalResults: 0,
                    resultsName: 'results',
                },
            };

            const component = render(<TfsPager {...props} />);

            expect(component.container.querySelector('.pager__summary')).to.not.be.null;
            expect(component.container.querySelector('.pager__controls.summary')).to.not.be.null;
            expect(component.container.querySelector('.pager__list.summary')).to.not.be.null;
        });

        it('should return a pager without the pagination summary', () => {
            const props: TfsPagerProps = {
                id: 'foo',
                paginationPages: pagesProps,
            };

            const component = render(<TfsPager {...props} />);

            const pagerControls = component.container.querySelector('.pager__controls');
            const pagerList = component.container.querySelector('.pager__list');

            expect(component.container.querySelector('.pager__summary')).to.be.null;
            expect(pagerControls).to.not.be.null;
            expect(pagerList).to.not.be.null;
            expect(pagerControls?.getAttribute('class')).to.not.contain('summary');
            expect(pagerList?.getAttribute('class')).to.not.contain('summary');
        });
    });
});
