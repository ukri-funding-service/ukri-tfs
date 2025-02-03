import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import { ContactUs } from '../../../src/components/contactUs';

describe('<ContactUs /> component tests', () => {
    it('when JS is enabled, default state', () => {
        // Given/When:
        const { container } = render(
            <ContactUs jsEnabled={true} phoneNumberLink="+44123" phoneNumberDisplayText="+44 (0)123" />,
        );

        // Then:
        const divs = container.querySelectorAll('div');
        expect(divs[0].className).to.equal('js-enabled');
        expect(divs[1].className).to.equal('service-help u-space-b20 u-space-t30');
        expect(divs[2].className).to.equal('service-help__text js-hidden');

        const anchors = container.querySelectorAll('a');
        expect(anchors[1].href).to.equal('tel: +44123');
        expect(anchors[1].text).to.equal('+44 (0)123');
    });

    it('when JS is enabled and the expand link is clicked', () => {
        const { container } = render(
            <ContactUs jsEnabled={true} phoneNumberLink="+44123" phoneNumberDisplayText="+44 (0)123" />,
        );

        const contactUsButtonComponent = container.querySelector('#contact-us-button');
        expect(contactUsButtonComponent).to.be.not.null;

        fireEvent.click(contactUsButtonComponent!);

        const divs = container.querySelectorAll('div');
        expect(divs[0].className).to.equal('js-enabled');
        expect(divs[1].className).to.equal('service-help u-space-b20 u-space-t30');
        expect(divs[2].className).to.equal('service-help__text');

        const anchors = container.querySelectorAll('a');
        expect(anchors[1].href).to.equal('tel: +44123');
        expect(anchors[1].text).to.equal('+44 (0)123');
    });

    it('when JS is enabled with custom text', () => {
        // Given/When:
        const { container } = render(
            <ContactUs
                jsEnabled={true}
                phoneNumberLink="+44123"
                phoneNumberDisplayText="+44 (0)123"
                preLinkText="Some text before the link"
                linkText="custom link text"
                postLinkText="Some text after the link"
            />,
        );

        // Then:
        const spans = container.querySelectorAll('h2 span.service-help__plain');

        expect(spans[0].textContent).to.equal('Some text before the link');
        expect(spans[1].textContent).to.equal(' Some text after the link');

        const anchor = container.querySelector('h2 button');

        expect(anchor?.textContent).to.equal('custom link text');
    });

    it('when JS is disabled', () => {
        // Given/When:
        const { container } = render(
            <ContactUs jsEnabled={false} phoneNumberLink="+44123" phoneNumberDisplayText="+44 (0)123" />,
        );

        // Then:
        const divs = container.querySelectorAll('div');
        expect(divs[0].className).to.equal('');
        expect(divs[1].className).to.equal('service-help u-space-b20 u-space-t30');
        expect(divs[2].className).to.equal('service-help__text js-hidden');

        const anchors = container.querySelectorAll('a');
        expect(anchors[1].href).to.equal('tel: +44123');
        expect(anchors[1].text).to.equal('+44 (0)123');
    });
});
