import { expect } from 'chai';
import { describe, it } from 'mocha';
import { getAllowAdditionalCookies, getCookiePreferencesSet, readCookiePolicy } from '../../src/pageFunctions';
import { cookieBannerSettings } from '../../src/defaults/cookieBannerSettings';

describe('readCookies', () => {
    describe('getAllowAdditionalCookies', () => {
        it('should return true if cookie policy additional cookies are set to true', () => {
            const cookies = {
                [cookieBannerSettings.cookiePreferencesSet]: 'true',
                [cookieBannerSettings.cookiePolicy]: '{"essential":true,"additional":true}',
            };

            const result = getAllowAdditionalCookies(cookies);

            expect(result).to.be.true;
        });

        it('should return false if cookie policy additional cookies are set to false', () => {
            const cookies = {
                [cookieBannerSettings.cookiePreferencesSet]: 'true',
                [cookieBannerSettings.cookiePolicy]: '{"essential":true,"additional":false}',
            };

            const result = getAllowAdditionalCookies(cookies);

            expect(result).to.be.false;
        });

        it('should return false if cookie preferences are not set', () => {
            const cookies = { [cookieBannerSettings.cookiePolicy]: '{"essential":true,"additional":true}' };

            const result = getAllowAdditionalCookies(cookies);

            expect(result).to.be.false;
        });
    });

    describe('getCookiePreferencesSet', () => {
        it('should return true if cookie preferences are set to true', () => {
            const cookies = {
                [cookieBannerSettings.cookiePreferencesSet]: 'true',
            };

            const result = getCookiePreferencesSet(cookies);

            expect(result).to.be.true;
        });

        it('should return false if cookie preferences are set to false', () => {
            const cookies = {
                [cookieBannerSettings.cookiePreferencesSet]: 'false',
            };

            const result = getCookiePreferencesSet(cookies);

            expect(result).to.be.false;
        });

        it('should return false if cookies is undefined', () => {
            const result = getCookiePreferencesSet(undefined);

            expect(result).to.be.false;
        });

        [undefined, ''].map(value =>
            it(`should return false if cookie preferences are set to ${value}`, () => {
                const cookies = {
                    [cookieBannerSettings.cookiePreferencesSet]: value,
                };

                const result = getCookiePreferencesSet(cookies);

                expect(result).to.be.false;
            }),
        );
    });

    describe('readCookiePolicy', () => {
        [{ additional: true }, { additional: false }].forEach(cookiePolicy => {
            it(`should read the values of the cookie policy given additional cookies is ${cookiePolicy.additional}`, () => {
                const cookies = {
                    [cookieBannerSettings.cookiePreferencesSet]: 'true',
                    [cookieBannerSettings.cookiePolicy]: `{"essential":true,"additional":${cookiePolicy.additional}}`,
                };

                const result = readCookiePolicy(cookies);

                expect(result).to.eql({ essential: true, additional: cookiePolicy.additional });
            });
        });

        ['unknown', undefined, '{}', '{essential, additional}', '{"essential":"", "additional":""}'].forEach(
            cookieValue =>
                it(`should return undefined given the cookie policy is ${cookieValue}`, () => {
                    const cookies = {
                        [cookieBannerSettings.cookiePreferencesSet]: 'true',
                        [cookieBannerSettings.cookiePolicy]: cookieValue,
                    };

                    const result = readCookiePolicy(cookies);

                    expect(result).to.eql(undefined);
                }),
        );

        it('should ignore cookie policy if cookie preferences are not set', () => {
            const cookies = { [cookieBannerSettings.cookiePolicy]: '{"essential":true,"additional":true}' };

            const result = readCookiePolicy(cookies);

            expect(result).to.be.undefined;
        });
    });
});
