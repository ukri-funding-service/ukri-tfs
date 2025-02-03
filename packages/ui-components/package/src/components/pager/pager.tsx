import React from 'react';
import { TfsPagerController, PagerControllerProps } from './pagerController';
import { TfsPagerSummary } from './pagerSummary';

type LinkFunction = (page: number) => string;
export interface PagesProps {
    currentPage: number;
    totalPages: number;
    pagesToShow: number;
    getLink: LinkFunction;
}

export interface SummaryProps {
    startResult: number;
    endResult: number;
    totalResults: number;
    resultsName?: string;
}

export interface TfsPagerProps {
    id: string;
    paginationSummary?: SummaryProps;
    paginationPages: PagesProps;
}

export const TfsPager: React.FunctionComponent<TfsPagerProps> = (props: TfsPagerProps): JSX.Element => {
    const controllerProps: PagerControllerProps = {
        id: `${props.id}-controller`,
        currentPage: props.paginationPages.currentPage,
        getLink: props.paginationPages.getLink,
        pagesToShow: props.paginationPages.pagesToShow,
        totalPages: props.paginationPages.totalPages,
        className: props.paginationSummary ? 'summary' : '',
    };

    return (
        <div id={`${props.id}-pager-container`} className="pager" role="navigation" aria-label="Pagination">
            {props.paginationSummary && (
                <TfsPagerSummary
                    id={`${props.id}-summary`}
                    start={props.paginationSummary.startResult}
                    end={props.paginationSummary.endResult}
                    total={props.paginationSummary.totalResults}
                    resultsName={props.paginationSummary.resultsName}
                />
            )}
            <TfsPagerController {...controllerProps} />
        </div>
    );
};
