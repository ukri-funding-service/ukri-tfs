import React from 'react';
import chai, { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { CookieBannerConfirmation } from '../../../src/components/cookieBannerConfirmation';

describe('<HeaderBranding /> component tests', () => {
    const mockUrl = '/test';
    let mockOnSubmit: sinon.SinonExpectation;

    beforeEach(() => {
        chai.use(sinonChai);
        mockOnSubmit = sinon.mock();
    });

    after(() => {
        sinon.restore();
    });

    it('should render with default props', () => {
        const { container } = render(
            <CookieBannerConfirmation actionTaken={'accepted'} submitUrl={mockUrl} onSubmit={mockOnSubmit} />,
        );

        const cookieBannerConfirmation = container.querySelector('#cookie-banner-confirmation');
        expect(cookieBannerConfirmation, 'Cookie banner confirmation is not displayed').to.exist;
        expect(cookieBannerConfirmation?.textContent, 'paragraph').to.contain('You have accepted additional cookies');
        expect(container.querySelector('#cookies-dismiss-confirmation')?.textContent).to.eql('Hide this message');
    });

    it('should render the rejected text', () => {
        const { container } = render(
            <CookieBannerConfirmation actionTaken={'rejected'} submitUrl={mockUrl} onSubmit={mockOnSubmit} />,
        );
        const cookieBannerConfirmation = container.querySelector('#cookie-banner-confirmation');
        expect(cookieBannerConfirmation, 'Cookie banner confirmation is not displayed').to.exist;
        expect(cookieBannerConfirmation?.textContent, 'paragraph').to.contain('You have rejected additional cookies');
        expect(container.querySelector('#cookies-dismiss-confirmation')?.textContent).to.eql('Hide this message');
    });

    it('should call onSubmit function when the button is clicked', () => {
        const { getByRole } = render(
            <CookieBannerConfirmation actionTaken={'accepted'} submitUrl={mockUrl} onSubmit={mockOnSubmit} />,
        );

        const acceptCookieButton = getByRole('button', { name: 'Hide this message' });
        fireEvent.click(acceptCookieButton);

        expect(mockOnSubmit).to.be.calledOnce;
    });
});
