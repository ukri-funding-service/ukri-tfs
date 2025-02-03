import React from 'react';
import { expect } from 'chai';
import { OL, PlainList, UL } from '../../../src/components';
import { render } from '@testing-library/react';

describe('<GdsLinkButton /> component tests', () => {
    it('should render a bullet list', () => {
        const { container } = render(
            <UL>
                <li>A bullet</li>
            </UL>,
        );

        const list = container.querySelector('ul');
        expect(list).to.not.be.null;
        expect(list!.className).to.contain('govuk-list');
        expect(list!.className).to.contain('govuk-list--bullet');
        expect(list!.textContent).to.contain('A bullet');
    });
    it('should render a list with extra spacing', () => {
        const { container } = render(
            <UL extraSpacing>
                <li>A bullet</li>
            </UL>,
        );

        const list = container.querySelector('ul');
        expect(list).to.not.be.null;
        expect(list!.className).to.contain('govuk-list--spaced');
    });
    it('should render a numbered list', () => {
        const { container } = render(
            <OL>
                <li>A number element</li>
            </OL>,
        );

        const list = container.querySelector('ol');
        expect(list).to.not.be.null;
        expect(list!.className).to.contain('govuk-list');
        expect(list!.className).to.contain('govuk-list--number');
        expect(list!.textContent).to.contain('A number element');
    });
    it('should render a plain list', () => {
        const { container } = render(
            <PlainList>
                <li>A plain element</li>
            </PlainList>,
        );

        const list = container.querySelector('ul');
        expect(list).to.not.be.null;
        expect(list!.className).to.contain('govuk-list');
        expect(list!.className).to.not.contain('govuk-list--');
        expect(list!.textContent).to.contain('A plain element');
    });
});
