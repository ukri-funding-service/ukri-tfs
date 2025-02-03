import React from 'react';

interface PhaseBannerProps {
    // Case insensitive. Styling determines casing in output
    phase: string;
    surveyUrl: string | undefined;
}

// Banner shown when application (or part of application) is still in an early phase, e.g. alpha, beta, pilot.
export const PhaseBanner: React.FunctionComponent<PhaseBannerProps> = props => {
    return (
        <div id="phase-banner" className="govuk-phase-banner">
            <p className="govuk-phase-banner__content">
                <strong className="govuk-tag govuk-phase-banner__content__tag">{props.phase}</strong>
                <span className="govuk-phase-banner__text">
                    This is a new service – your{' '}
                    <a className="govuk-link" href={props.surveyUrl} target="_blank" rel="noreferrer">
                        feedback
                    </a>{' '}
                    will help us to improve it.
                </span>
            </p>
        </div>
    );
};
