import React from 'react';
import { GdsLinkButton } from '../../components/linkButton';
import { Table } from 'govuk-react-jsx';
import { PagesProps, SummaryProps } from '../../components/pager/pager';
import { withPagination } from '../../wrappers/withPagination';

export interface ApplicationReviewItemPageProps {
    id?: number;
    applicationName: string;
    url: string;
    opportunity: string;
    applicationReference: string;
    organisation: string;
    daysRemaining: number;
    deadline: string;
    isComplete: boolean;
    cancelledAt: string;
}

export type PaginationPageProps = {
    paginationSummary: SummaryProps;
    paginationPages: Omit<PagesProps, 'getLink'>;
};

const deadlineDays = (daysRemaining: number, deadlineDate: string): React.ReactElement => {
    const deadlineIsWithinSevenDays = daysRemaining < 8;
    const deadlineDaysSingle = daysRemaining === 1;

    return (
        <span className={`overview-item__meta ${deadlineIsWithinSevenDays ? 'overview-item__meta--danger' : ''}`}>
            <strong>
                <span className="remaining-days govuk-!-font-size-24">{daysRemaining} </span>
                <br />
                day{deadlineDaysSingle ? '' : 's'} left{' '}
            </strong>
            <br />
            <span className="govuk-body-s">
                Deadline:
                <br />
                {deadlineDate}
            </span>
        </span>
    );
};

export const cancelledOnText = (cancelledDate: string): React.ReactElement => {
    return (
        <span className={`overview-item__meta`}>
            <strong>Cancelled on</strong>
            <br />
            <span className="govuk-body-s">{cancelledDate}</span>
        </span>
    );
};

const renderApplicationReviewInfo = (review: ApplicationReviewItemPageProps) => {
    const getActionedText = () => {
        if (review.cancelledAt) {
            return cancelledOnText(review.cancelledAt);
        } else {
            return review.isComplete ? 'Submitted' : deadlineDays(review.daysRemaining, review.deadline);
        }
    };

    const getLinkButton = () => {
        if (review.cancelledAt) {
            return review.applicationName;
        } else {
            return (
                <GdsLinkButton
                    ariaLabel={`Go to Review Application: ${review.applicationName}`}
                    text={review.applicationName}
                    href={review.url}
                />
            );
        }
    };
    return (
        <li className="overview-item" key={review.applicationReference}>
            <div className="columns">
                <div className="column is-8">
                    <h2 className="overview-item__title" id={`application-ref_${review.applicationReference}`}>
                        {getLinkButton()}
                    </h2>
                    <ul className="overview-item__meta-list">
                        <li className="overview-item__meta-item">
                            <strong>Opportunity: </strong>
                            {review.opportunity}
                            <br />
                        </li>
                        <li className="overview-item__meta-item">
                            <strong>Application reference:</strong> {review.applicationReference}
                            <br />
                        </li>
                        <li className="overview-item__meta-item">
                            <strong>Organisation:</strong> {review.organisation}
                        </li>
                    </ul>
                </div>
                <div className="column is-2">
                    <div className="u-align-setup-vertical u-align-center">
                        <div className="u-align-cell">{getActionedText()}</div>
                    </div>
                </div>
                <div className="column is-2">
                    <div
                        className={`overview-item__meta overview-item__meta--right u-align-setup-vertical u-align-center`}
                    >
                        <div className="u-align-cell">
                            <strong>{review.isComplete ? 'Complete' : 'Incomplete'}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};

interface ApplicationReviewListProps {
    items: ApplicationReviewItemPageProps[];
    pageInfo: PaginationPageProps;
}

export const TfsApplicationReviewList: React.FC<ApplicationReviewListProps> = props => {
    const PagedTable = withPagination(Table);
    return (
        <>
            <ul className="overview-items overview-items--plain">
                {props.items.map(appReviewProps => renderApplicationReviewInfo(appReviewProps))}
            </ul>
            <PagedTable
                id="review-table"
                paginationPages={{
                    ...props.pageInfo.paginationPages,
                    getLink: pageNumber => `?page=${pageNumber}`,
                }}
                paginationSummary={props.pageInfo.paginationSummary}
                rows={props.items.map((reviewData, idx) => {
                    return {
                        cells: [],
                        reactListKey: `review-data-${idx}`,
                    };
                })}
            />
        </>
    );
};
