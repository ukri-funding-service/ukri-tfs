import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { TfsApplicationContentBody } from '../../../../../src';

describe('<TfsApplicationContentBody /> component tests', () => {
    it('should display the correct plain text', () => {
        const wrapper = render(<TfsApplicationContentBody id="test-section" text="This is some test text" />);
        const divComponent = wrapper.container.querySelector('div');
        expect(divComponent).to.not.be.null;
        expect(divComponent!.outerHTML).to.equal('<div><p class="serif govuk-body">This is some test text</p></div>');
        wrapper.unmount();
    });

    it('should display the correct HTML', () => {
        const wrapper = render(
            <TfsApplicationContentBody id="test-section" text={`<p>This is some <strong>text</strong> text`} />,
        );

        const divComponent = wrapper.container.querySelector('div');
        expect(divComponent).to.not.be.null;

        expect(divComponent!.outerHTML).to.equal('<div><p>This is some <strong>text</strong> text</p></div>');
        wrapper.unmount();
    });

    it('should display the no-text caption', () => {
        const wrapper = render(<TfsApplicationContentBody id="test-section" />);

        const paragraphComponent = wrapper.container.querySelector('p');
        expect(paragraphComponent).to.not.be.null;

        expect(paragraphComponent!.outerHTML).to.equal(
            '<p class="govuk-body serif meta">No content has been added.</p>',
        );
        wrapper.unmount();
    });
});
