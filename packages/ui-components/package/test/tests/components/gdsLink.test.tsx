import { render, RenderResult } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { GdsLink } from '../../../src/';
describe('<GdsLink /> component tests', () => {
    let component: RenderResult;
    afterEach(() => {
        component.unmount();
    });
    it('should render a link', () => {
        component = render(
            <GdsLink id="link-id" href="a.link">
                Content
            </GdsLink>,
        );
        const link = component.container.querySelector('#link-id')!;

        expect(link.classList.contains('govuk-link')).to.be.true;
        expect(link).to.not.be.null;
        expect(link.getAttribute('href')).to.equal('a.link');
        expect(link.textContent).to.contain('Content');
    });
});
