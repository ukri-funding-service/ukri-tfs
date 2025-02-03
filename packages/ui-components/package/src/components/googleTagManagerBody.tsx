import React from 'react';
import { GoogleTagManagerProps } from '../utils';

export const GoogleTagManagerBody = ({ gtmAuth, gtmPreview }: GoogleTagManagerProps): JSX.Element => (
    <noscript>
        <iframe
            src={`https://www.googletagmanager.com/ns.html?id=GTM-PT6WWDQ&gtm_auth=${gtmAuth}&gtm_preview=${gtmPreview}&gtm_cookies_win=x`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
        />
    </noscript>
);
