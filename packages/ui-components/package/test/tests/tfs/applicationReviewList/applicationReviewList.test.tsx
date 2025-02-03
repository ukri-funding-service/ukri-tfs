import React from 'react';
import { expect } from 'chai';
import { ApplicationReviewItemPageProps, PaginationPageProps, TfsApplicationReviewList } from '../../../../src';
import { render } from '@testing-library/react';

describe('packages/ui-components - tfs/reviewList', () => {
    describe('applicationReviewList', () => {
        it('should render a review item for each review', () => {
            const reviews: ApplicationReviewItemPageProps[] = [
                {
                    id: 7,
                    applicationName: 'Application Name',
                    url: 'url',
                    opportunity: 'Opportunity Name',
                    applicationReference: 'APP001',
                    organisation: 'Organisation Name',
                    daysRemaining: 0,
                    deadline: '',
                    isComplete: false,
                    cancelledAt: '',
                },
                {
                    id: 11,
                    applicationName: 'Application Name',
                    url: 'url',
                    opportunity: 'Opportunity Name',
                    applicationReference: 'APP002',
                    organisation: 'Organisation Name',
                    daysRemaining: 0,
                    deadline: '',
                    isComplete: false,
                    cancelledAt: '',
                },
            ];
            const pageInfo: PaginationPageProps = {
                paginationPages: {
                    currentPage: 1,
                    totalPages: 1,
                    pagesToShow: 5,
                },
                paginationSummary: {
                    startResult: 1,
                    endResult: 2,
                    totalResults: 2,
                },
            };
            const component = render(<TfsApplicationReviewList items={reviews} pageInfo={pageInfo} />);
            expect(component.container.querySelectorAll('.overview-item').length).to.eql(2);
        });
        it('should render no items if there are no reviews', () => {
            const reviews: ApplicationReviewItemPageProps[] = [];
            const pageInfo: PaginationPageProps = {
                paginationPages: {
                    currentPage: 1,
                    totalPages: 1,
                    pagesToShow: 5,
                },
                paginationSummary: {
                    startResult: 0,
                    endResult: 0,
                    totalResults: 0,
                },
            };
            const component = render(<TfsApplicationReviewList items={reviews} pageInfo={pageInfo} />);
            expect(component.container.querySelectorAll('.overview-item').length).to.eql(0);
        });
    });
});
