import React from 'react';
import { TfsApplicationContentBody } from './contentBody';

interface TfsApplicationContentDetailsSectionProps {
    id: string;
    summaryTitle?: string;
    applicationSummary?: string;
    displayStartDateAndDuration: boolean;
    projectStartDate?: string;
    projectDuration?: string;
}

export const TfsApplicationContentDetailsSection: React.FunctionComponent<TfsApplicationContentDetailsSectionProps> = (
    props,
): JSX.Element => {
    const startDateAndDuration = (
        <React.Fragment>
            <h4 className="govuk-heading-s serif">Start date</h4>
            <TfsApplicationContentBody text={props.projectStartDate} />
            <h4 className="govuk-heading-s serif">Duration</h4>
            <TfsApplicationContentBody text={props.projectDuration} />
        </React.Fragment>
    );

    return (
        <div id={props.id} className="serif">
            <h4 className="govuk-heading-s serif">{props.summaryTitle ?? 'Project Summary'}</h4>
            <TfsApplicationContentBody text={props.applicationSummary} id={`${props.id}Summary`} />
            {props.displayStartDateAndDuration ? startDateAndDuration : null}
        </div>
    );
};
