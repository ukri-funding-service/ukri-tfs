import React from 'react';
import { Paragraph } from './paragraph';
import { GdsDetails } from './details';

export interface NotFoundGuidanceProps {
    summaryLine: string;
    itemType: string;
    itemListDescription: string;
    mailToConfig: {
        subject?: string;
        body?: string;
        recipientAddress?: string;
    };
    jsEnabled: boolean;
}

export const NotFoundGuidance = (props: NotFoundGuidanceProps): React.ReactElement => {
    const { summaryLine, itemType, itemListDescription, mailToConfig, jsEnabled } = props;

    const { subject, body, recipientAddress = 'support@funding-service.ukri.org' } = mailToConfig;

    const queryParams: string[] = [];
    if (subject) {
        queryParams.push(`subject=${encodeURIComponent(subject)}`);
    }
    if (body) {
        queryParams.push(`body=${encodeURIComponent(body)}`);
    }

    const queryParamString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

    const mailToLink = (
        <a
            className="govuk-link"
            href={`mailto:${recipientAddress}${queryParamString}`}
            aria-label="support-email"
            target="_blank"
            rel="noreferrer"
        >
            {recipientAddress}
        </a>
    );

    const expandedSection = (
        <>
            <Paragraph>If you cannot find the right {itemType}, try:</Paragraph>
            <ul className="govuk-list govuk-list--bullet">
                <li>checking your spelling</li>
                <li>using another search term</li>
                <li>searching for something less specific.</li>
            </ul>
            <Paragraph>
                If you still cannot find the {itemType} you&apos;re looking for, email {mailToLink} and ask them to add
                it to the list of potential {itemListDescription}.
            </Paragraph>
        </>
    );

    return (
        <>
            {jsEnabled && (
                <div className={'js-enabled'}>
                    <GdsDetails
                        title={summaryLine}
                        altTitle={summaryLine}
                        details={expandedSection}
                        expandedByDefault={false}
                    />
                </div>
            )}
            {!jsEnabled && (
                <>
                    <div className="govuk-details__summary-text">{summaryLine}</div>
                    <div className="govuk-details__text u-space-b30">{expandedSection}</div>
                </>
            )}
        </>
    );
};
