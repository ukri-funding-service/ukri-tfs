import React from 'react';
import { expect } from 'chai';
import { TfsPageHeading } from '../../../../src';
import { render } from '@testing-library/react';

describe('<TfsPageHeading /> tests', () => {
    it('should render HeadingText as expected when all props are supplied', () => {
        const wrapper = render(
            <TfsPageHeading text="Application" resourceId="APP001" resourceName="Untitled application" />,
        );

        const headingComponent = wrapper.container.querySelector('.govuk-heading-xl');
        const captionComponent = wrapper.container.querySelector('.govuk-caption-xl');

        expect(headingComponent!.textContent).to.equal('Application');
        expect(captionComponent!.textContent).to.equal('APP001: Untitled application');
        wrapper.unmount();
    });

    it('should render HeadingText as expected when resourceName is missing', () => {
        const wrapper = render(<TfsPageHeading text="Application" resourceId="APP001" />);

        const headingComponent = wrapper.container.querySelector('.govuk-heading-xl');
        const captionComponent = wrapper.container.querySelector('.govuk-caption-xl');

        expect(headingComponent!.textContent).to.equal('Application');
        expect(captionComponent!.textContent).to.equal('APP001');
        wrapper.unmount();
    });
});
