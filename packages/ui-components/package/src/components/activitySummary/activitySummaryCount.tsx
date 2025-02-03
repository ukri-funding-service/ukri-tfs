import React from 'react';
import { Paragraph } from '../paragraph';
import { GdsLink } from '../gdsLink';

export interface ActivitySummaryCountProps extends CountProps {
    subCounts?: CountProps[];
}

export interface CountProps {
    count: number;
    text: string;
    id?: string;
    href?: string;
}

export const ActivitySummaryCount: React.FunctionComponent<ActivitySummaryCountProps> = ({
    count,
    subCounts,
    text,
    id,
    href,
}) => {
    return (
        <div id={id} data-testId={id}>
            <Paragraph className="govuk-!-font-weight-bold govuk-!-display-inline govuk-!-margin-right-2">
                {count}
            </Paragraph>
            <Paragraph className="govuk-!-display-inline">
                {href ? <GdsLink href={href}>{text}</GdsLink> : text}
            </Paragraph>
            <br className="govuk-!-margin-bottom-1" />
            {subCounts &&
                subCounts.map((subCount, countIndex) => {
                    return (
                        <div key={`sub-count-${id}-${countIndex}`}>
                            <img
                                src={'/sub-heading-icon.svg'}
                                alt="Sub heading icon"
                                className="govuk-!-margin-right-1 govuk-!-margin-left-1 raise-image"
                                aria-hidden
                            />
                            <img
                                src={'/warning-icon.svg'}
                                alt="Warning icon"
                                className="govuk-!-margin-right-1"
                                aria-label="Warning"
                            />
                            <Paragraph
                                className="govuk-!-display-inline govuk-!-margin-right-1 subcount-color govuk-!-font-size-16"
                                aria-hidden
                            >
                                {subCount.count}
                            </Paragraph>
                            <Paragraph className="govuk-!-display-inline govuk-!-font-size-16">
                                {subCount.href ? (
                                    <a href={subCount.href}>{subCount.text}</a>
                                ) : (
                                    <div className="subcount-color govuk-!-display-inline">{subCount.text}</div>
                                )}
                            </Paragraph>
                            <br aria-hidden />
                        </div>
                    );
                })}
        </div>
    );
};
