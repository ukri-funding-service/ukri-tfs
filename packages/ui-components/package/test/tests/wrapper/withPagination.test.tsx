import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { withPagination } from '../../../src/wrappers/withPagination';
import { TfsPagerProps } from '../../../src';

describe('WithPagination wrapper tests', () => {
    it('should add a pager to the component with 201 to 220 of 400 items and 10 pages, with a current page of 10 and total pages of 20', () => {
        // given
        const testComponent: React.FunctionComponent<{}> = (_props: {}) => {
            return <input type="text" />;
        };
        const WrappedField = withPagination(testComponent);
        const props: TfsPagerProps = {
            id: 'test',
            paginationPages: {
                currentPage: 10,
                pagesToShow: 10,
                totalPages: 20,
                getLink: () => '#?page=${val}',
            },
            paginationSummary: {
                startResult: 201,
                endResult: 220,
                totalResults: 400,
            },
        };

        // when
        const wrappedComponent = render(<WrappedField {...props} />);
        // showing 201 to 220 of 400 results                  < 1 ... 8 9 [10] 11 12 13 ... 20 >

        const summaryComponent = wrappedComponent.container.querySelector('.pager__summary');
        expect(summaryComponent).to.not.be.null;

        const currentLinkComponent = wrappedComponent.container.querySelector('.pager__list-current-link');
        expect(currentLinkComponent).to.not.be.null;

        // then
        expect(summaryComponent!.textContent).to.equal('Showing 201 to 220 of 400 results'); // summary text
        expect(currentLinkComponent!.textContent).to.equal('10'); // current page
        expect(wrappedComponent.container.querySelectorAll('.pager__list-link').length).to.equal(9); // nav links
        expect(wrappedComponent.container.querySelectorAll('.pager__prev').length).to.equal(1); // prev button
        expect(wrappedComponent.container.querySelectorAll('.pager__next').length).to.equal(1); // next button
        expect(wrappedComponent.container.querySelectorAll('.pager__list-ellipses').length).to.equal(2); // ellipses
    });
});
