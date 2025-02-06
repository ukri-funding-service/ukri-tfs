import React, { useState } from 'react';
import { cookieBannerSettings } from '@ukri-tfs/frontend-utils';
import { HeadingText } from './heading';
import { storeCookie } from '../utils';
import { GdsLinkButton } from './linkButton';
import { CookieBannerConfirmation } from './cookieBannerConfirmation';

export interface CookieBannerProps {
    submitUrl: string;
    cookiesEnabled: boolean;
}

export type CookiePolicy = {
    essential: true;
    additional: boolean;
};

export const CookieBanner = (props: CookieBannerProps): JSX.Element => {
    const [hideCookieBanner, setHideCookieBanner] = useState(false);
    const [acceptCookieBannerClicked, setAcceptCookieBannerClicked] = useState(false);
    const [rejectCookieBannerClicked, setRejectCookieBannerClicked] = useState(false);
    const expires = new Date(Date.now() + cookieBannerSettings.cookieDuration).toUTCString();

    const updateCookie = (allowAdditional: boolean): void => {
        const cookiePolicy: CookiePolicy = { essential: true, additional: allowAdditional };
        storeCookie(`${cookieBannerSettings.cookiePreferencesSet}=true; expires=${expires}; path=/; secure`);
        storeCookie(
            `${cookieBannerSettings.cookiePolicy}=${JSON.stringify(cookiePolicy)}; expires=${expires}; path=/; secure`,
        );
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
    };

    const onSubmitHideBanner = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        setHideCookieBanner(true);
    };

    const { submitUrl } = props;
    const handleAcceptCookiesAction = () => {
        setAcceptCookieBannerClicked(true);
        updateCookie(true);
    };
    const handleRejectCookiesAction = () => {
        setRejectCookieBannerClicked(true);
        updateCookie(false);
    };

    if (props.cookiesEnabled || hideCookieBanner) {
        return <></>;
    }

    if (acceptCookieBannerClicked || rejectCookieBannerClicked) {
        const actionTaken = acceptCookieBannerClicked ? 'accepted' : 'rejected';

        return (
            <CookieBannerConfirmation actionTaken={actionTaken} submitUrl={submitUrl} onSubmit={onSubmitHideBanner} />
        );
    }

    return (
        <div
            id="global-cookie-message"
            className="cookie-banner govuk-clearfix"
            role="region"
            aria-label="cookie banner"
        >
            <div className="container">
                <div className="cookie-banner__wrapper columns">
                    <div className="column is-three-quarters">
                        <div className="cookie-banner__message">
                            <HeadingText text="Cookies on the UKRI Funding Service" size="m" tag="h2" />
                            <p className="govuk-body">We use some essential cookies to make this service work.</p>
                            <p className="govuk-body">
                                We&apos;d like to set additional cookies so we can remember your settings, understand
                                how people use the service and make improvements.
                            </p>
                            <form method="get" name="submit-cookies-form" action={submitUrl} onSubmit={onSubmit}>
                                <div className="govuk-cookie-banner" data-nosnippet role="region">
                                    <div className="govuk-button-group">
                                        <button
                                            id={cookieBannerSettings.acceptInputFieldName}
                                            type="submit"
                                            className="govuk-button"
                                            data-module="govuk-button"
                                            value={'accept'}
                                            onClick={handleAcceptCookiesAction}
                                        >
                                            Accept additional cookies
                                        </button>
                                        <button
                                            id={cookieBannerSettings.rejectInputFieldName}
                                            type="submit"
                                            className="govuk-button"
                                            data-module="govuk-button"
                                            value={'reject'}
                                            onClick={handleRejectCookiesAction}
                                        >
                                            Reject additional cookies
                                        </button>
                                        <GdsLinkButton
                                            id={'view-cookie-policy'}
                                            href={
                                                'https://www.ukri.org/who-we-are/cookie-policy#:~:text=Additional%20cookies%20for%20UKRI%20funding%20service%20users'
                                            }
                                            text={'View cookies'}
                                        ></GdsLinkButton>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
