import { NextApiRequestCookies } from '../components/withCookieConsent';
import { cookieBannerSettings } from '../defaults/cookieBannerSettings';

export type CookiePolicy = {
    essential: boolean;
    additional: boolean;
};

export const getAllowAdditionalCookies = (cookies?: NextApiRequestCookies): boolean => {
    const cookiePolicy = readCookiePolicy(cookies);
    if (cookiePolicy && cookiePolicy.additional) {
        return cookiePolicy.additional;
    } else {
        return false;
    }
};

export const getCookiePreferencesSet = (cookies?: NextApiRequestCookies): boolean => {
    return !!(cookies && cookies[cookieBannerSettings.cookiePreferencesSet] === 'true');
};

export const readCookiePolicy = (cookies?: NextApiRequestCookies): CookiePolicy | undefined => {
    const preferencesSet = cookies?.[cookieBannerSettings.cookiePreferencesSet];
    const cookieValue = cookies?.[cookieBannerSettings.cookiePolicy];

    if (!preferencesSet || !cookieValue) {
        return undefined;
    }

    try {
        const parsedCookiePolicy = JSON.parse(cookieValue);
        return typeof parsedCookiePolicy.essential === 'boolean' && typeof parsedCookiePolicy.additional === 'boolean'
            ? parsedCookiePolicy
            : undefined;
    } catch {
        return undefined;
    }
};
