import React from 'react';

type CookieBannerConfirmationProps = {
    actionTaken: 'accepted' | 'rejected';
    submitUrl: string;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const CookieBannerConfirmation = (props: CookieBannerConfirmationProps): JSX.Element => {
    return (
        <div
            id="cookie-banner-confirmation"
            className="cookie-banner govuk-clearfix"
            role="region"
            aria-label="cookie banner"
        >
            <form method="get" name="hide-cookie-banner" action={props.submitUrl} onSubmit={props.onSubmit}>
                <div className="container">
                    <div className="cookie-banner__wrapper columns">
                        <div className="column is-three-quarters">
                            <div className="cookie-banner__message">
                                <p className="govuk-body">You have {props.actionTaken} additional cookies.</p>
                            </div>
                        </div>
                    </div>
                    <div className="govuk-button-group">
                        <button
                            id="cookies-dismiss-confirmation"
                            name="cookies-dismiss-confirmation"
                            className="govuk-button"
                            value="yes"
                            type="submit"
                            data-module="govuk-button"
                        >
                            Hide this message
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
