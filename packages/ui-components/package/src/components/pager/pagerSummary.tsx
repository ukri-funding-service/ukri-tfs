import React from 'react';

export interface PagerSummaryProps {
    id: string;
    start: number;
    end: number;
    total: number;
    resultsName?: string;
}

export const TfsPagerSummary: React.FunctionComponent<PagerSummaryProps> = (props): JSX.Element => {
    return (
        <div id={props.id} className="pager__summary">{`Showing ${props.start} to ${props.end} of ${props.total} ${
            props.resultsName || 'results'
        }`}</div>
    );
};
