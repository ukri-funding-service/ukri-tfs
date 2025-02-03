import React from 'react';
import { expect } from 'chai';
import { GdsLinkButton } from '../../../src/components';
import { render } from '@testing-library/react';

describe('<GdsLinkButton /> component tests', () => {
    it('correct text should be set', () => {
        const { container } = render(<GdsLinkButton ariaLabel="" href="https://www.bbc.com" text="Cancel" />);

        const anchorComponent = container.querySelector('a');
        expect(anchorComponent).to.not.be.null;

        expect(anchorComponent!.textContent).to.equal('Cancel');
    });
    it('correct back link should be set', () => {
        const { container } = render(<GdsLinkButton ariaLabel="" href="https://www.bbc.com" text="Cancel" />);

        const anchorComponent = container.querySelector('a');
        expect(anchorComponent).to.not.be.null;

        expect(anchorComponent!.getAttribute('href')).to.equal('https://www.bbc.com');
    });
    it('className defaults correctly', () => {
        const { container } = render(<GdsLinkButton ariaLabel="" href="https://www.bbc.com" text="Cancel" />);

        const anchorComponent = container.querySelector('a');
        expect(anchorComponent).to.not.be.null;

        expect(anchorComponent!.classList.contains('govuk-link')).to.be.true;
    });
    it('correct class name should be set', () => {
        const { container } = render(
            <GdsLinkButton ariaLabel="" href="https://www.bbc.com" text="Cancel" className="freddieBlassie" />,
        );

        const anchorComponent = container.querySelector('a');
        expect(anchorComponent).to.not.be.null;

        expect(anchorComponent!.classList.contains('freddieBlassie')).to.be.true;
    });
});
