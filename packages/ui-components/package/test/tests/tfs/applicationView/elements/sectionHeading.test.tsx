import React from 'react';
import { RenderResult, render } from '@testing-library/react';
import { expect } from 'chai';
import { TfsApplicationSectionHeading } from '../../../../../src';

describe('<TfsApplicationSectionHeading /> component tests', () => {
    let wrapper: RenderResult;

    beforeEach(() => {
        wrapper = render(
            <TfsApplicationSectionHeading
                id="test-section"
                sectionNumber={1}
                sectionHeading="Test Section"
                showEditLink={true}
                editLinkUrl="/path/to/edit/form"
            />,
        );
    });
    afterEach(() => {
        wrapper.unmount();
    });

    it('should display the correct section number', () => {
        const node = wrapper.container.querySelector('h3');
        expect(node).to.not.be.null;

        expect(node!.textContent).to.include('1.');
    });

    it('should display the correct heading', () => {
        const node = wrapper.container.querySelector('h3');
        expect(node).to.not.be.null;

        expect(node!.textContent).to.include('Test Section');
    });

    it('should display an edit link', () => {
        const node = wrapper.container.querySelector('a');
        expect(node).to.not.be.null;

        expect(node!.textContent).to.include('Edit ');
    });

    it('should include the correct visually hidden text in the edit link', () => {
        const node = wrapper.container.querySelector('a');
        expect(node).to.not.be.null;

        const visuallyHiddenComponent = node!.querySelector('.govuk-visually-hidden');
        expect(visuallyHiddenComponent).to.not.be.null;

        expect(visuallyHiddenComponent!.textContent).to.equal('Test Section');
    });

    it('should display the correct edit link URL', () => {
        const node = wrapper.container.querySelector('a');
        expect(node).to.not.be.null;

        expect(node!.getAttribute('href')).to.equal('/path/to/edit/form');
    });
});
