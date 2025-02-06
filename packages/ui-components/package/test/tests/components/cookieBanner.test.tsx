import React from 'react';
import chai, { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import { CookieBanner } from '../../../src/components/cookieBanner';
import * as cookieUtils from '../../../src/utils/cookieUtils';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

describe('<HeaderBranding /> component tests', () => {
    beforeEach(() => {
        chai.use(sinonChai);
        sinon.useFakeTimers(new Date('2020-01-01T00:00:00.000Z'));
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should render with default props', () => {
        const mockUrl = '/test';

        const { container } = render(<CookieBanner submitUrl={mockUrl} cookiesEnabled={false} />);
        const cookieMessage = container.querySelector('#global-cookie-message');
        expect(cookieMessage, 'Cookie message is not shown').to.exist;
        expect(cookieMessage?.textContent, 'heading').to.contain('Cookies on the UKRI Funding Service');
        expect(cookieMessage?.textContent, 'first paragraph').to.contain(
            'We use some essential cookies to make this service work.',
        );
        expect(cookieMessage?.textContent, 'second paragraph').to.contain(
            "We'd like to set additional cookies so we can remember your settings, understand how people use the service and make improvements.",
        );
        expect(container.querySelector('#allow-additional-cookies')?.textContent).to.eql('Accept additional cookies');
        expect(container.querySelector('#reject-additional-cookies')?.textContent).to.eql('Reject additional cookies');

        const viewCookiesLink = container.querySelector('#view-cookie-policy');
        expect(viewCookiesLink, 'View cookies link should exist').to.exist;
        expect(viewCookiesLink?.textContent).to.eql('View cookies');
        expect(viewCookiesLink?.getAttribute('href')).to.eql(
            'https://www.ukri.org/who-we-are/cookie-policy#:~:text=Additional%20cookies%20for%20UKRI%20funding%20service%20users',
        );
    });

    it('should have the submitUrl prop as the action to the form element', () => {
        const mockUrl = '/test';

        const { container } = render(<CookieBanner submitUrl={mockUrl} cookiesEnabled={false} />);
        const formComponent = container.querySelector('form');
        expect(formComponent).to.be.not.null;
        expect(formComponent!.getAttribute('action')).to.equal(mockUrl);
    });

    it('should not render if cookiesEnabled true', () => {
        const mockUrl = '/test';

        const { container } = render(<CookieBanner submitUrl={mockUrl} cookiesEnabled={true} />);
        expect(container.querySelector('#global-cookie-message')).not.to.exist;
    });

    it('should not render if accept cookies clicked', () => {
        const mockUrl = '/test';

        const { getByRole, container } = render(<CookieBanner submitUrl={mockUrl} cookiesEnabled={false} />);

        const acceptCookieButton = getByRole('button', { name: 'Accept additional cookies' });
        fireEvent.click(acceptCookieButton);

        expect(container.querySelector('#global-cookie-message')).not.to.exist;
    });

    it('should call storeCookie given accept additional cookies is clicked', () => {
        const mockUrl = '/test';

        const mockStoreCookie = sinon.stub(cookieUtils, 'storeCookie');

        const { getByRole } = render(<CookieBanner submitUrl={mockUrl} cookiesEnabled={false} />);

        const acceptCookieButton = getByRole('button', { name: 'Accept additional cookies' });
        fireEvent.click(acceptCookieButton);

        expect(mockStoreCookie.callCount).to.be.eql(2);
        expect(mockStoreCookie.getCalls()[0].args[0], 'cookie preferences set').to.be.eql(
            'cookies_preferences_set=true; expires=Fri, 31 Jan 2020 00:00:00 GMT; path=/; secure',
        );
        expect(mockStoreCookie.getCalls()[1].args[0], 'cookie policy').to.be.eql(
            'cookies_policy={"essential":true,"additional":true}; expires=Fri, 31 Jan 2020 00:00:00 GMT; path=/; secure',
        );
    });

    it('should call storeCookie given reject additional cookies is clicked', () => {
        const mockUrl = '/test';

        const mockStoreCookie = sinon.stub(cookieUtils, 'storeCookie');

        const { getByRole } = render(<CookieBanner submitUrl={mockUrl} cookiesEnabled={false} />);

        const acceptCookieButton = getByRole('button', { name: 'Reject additional cookies' });
        fireEvent.click(acceptCookieButton);

        expect(mockStoreCookie.callCount).to.be.eql(2);
        expect(mockStoreCookie.getCalls()[0].args[0], 'cookie preferences set').to.be.eql(
            'cookies_preferences_set=true; expires=Fri, 31 Jan 2020 00:00:00 GMT; path=/; secure',
        );
        expect(mockStoreCookie.getCalls()[1].args[0], 'cookie policy').to.be.eql(
            'cookies_policy={"essential":true,"additional":false}; expires=Fri, 31 Jan 2020 00:00:00 GMT; path=/; secure',
        );
    });
});
