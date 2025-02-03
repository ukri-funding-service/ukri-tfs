import React from 'react';
import { GdsLinkButton, HeadingText, PageLayoutFull, Paragraph } from '../components';

export interface ErrorPageProps {
    statusCode?: number;
    correlationId?: string;
}

export interface ErrorPageContent {
    pageTitle: string;
    content: React.ReactElement;
}

export const getErrorPageContent = (props: ErrorPageProps): ErrorPageContent => {
    let pageHeading = 'Sorry, the service is unavailable';
    let errorText = 'Currently there is an unknown error. Please wait for a few minutes, then try refreshing the page.';

    if (props.statusCode && props.statusCode >= 400 && props.statusCode < 500) {
        pageHeading = 'Page not found';
        errorText = 'If you entered a web address please check it was correct.';
        if (props.statusCode === 401 || props.statusCode === 403) {
            pageHeading = 'Access Denied';
        }
    } else if (props.statusCode && props.statusCode >= 500 && props.statusCode < 600) {
        pageHeading = 'Internal Server Error';
        errorText =
            'Currently there is server interruption. Please wait for a few minutes, then try refreshing the page.';
    }

    pageHeading = (props.statusCode ? `${props.statusCode} - ` : ``) + pageHeading;
    const pageTitle = `${pageHeading} - UKRI Funding Service`;

    const headingContent = <HeadingText text={pageHeading} size="xl" tag="h1" />;
    const correlationId = props.correlationId ? 'Correlation: ' + props.correlationId : '';

    const gaScript = `window.dataLayer = window.dataLayer || [];
        dataLayer.push({
        'event': 'errorPage',
        'pagePath': window.location.pathname,
        'pageTitle': document.title,
        'statusCode': '${props.statusCode}',
        'correlationId': '${props.correlationId}'
        });`;

    const mainContent = (
        <>
            <Paragraph id="errorText">{errorText}</Paragraph>
            <Paragraph id="statusCode" className="js-hidden" data-status-code={props.statusCode}>
                {props.statusCode}
            </Paragraph>
            <Paragraph id="correlationId" data-correlation-id={props.correlationId}>
                {correlationId}
            </Paragraph>
            <Paragraph id="fsAccountLink">
                <GdsLinkButton
                    ariaLabel="Return to your UKRI Funding Service account."
                    text="Return to your UKRI Funding Service account."
                    href={'/'}
                />
            </Paragraph>
            <Paragraph id="fsOpportunitiesLink">
                <GdsLinkButton
                    ariaLabel="View all UKRI Funding Service Opportunities."
                    text="View all UKRI Funding Service Opportunities."
                    href={'https://www.ukri.org/funding/funding-opportunities/'}
                />
            </Paragraph>
            <script
                dangerouslySetInnerHTML={{
                    __html: gaScript,
                }}
            />
        </>
    );

    return {
        pageTitle,
        content: <PageLayoutFull main={mainContent} heading={headingContent} />,
    };
};
