import React from 'react';
import { expect } from 'chai';
import { GdsFormGroup } from '../../../../src';
import { render } from '@testing-library/react';

describe('<GdsFormGroup /> container tests', () => {
    it('should render all children within container', () => {
        const { container, unmount } = render(
            <GdsFormGroup>
                <p>something</p>
                <p>else</p>
                <p>here</p>
            </GdsFormGroup>,
        );
        expect(container.querySelectorAll('p').length).to.equal(3);
        unmount();
    });

    it('should render with the default class name if no class name is supplied', () => {
        const { container, unmount } = render(<GdsFormGroup>Test content</GdsFormGroup>);
        expect(container.querySelector('.govuk-form-group')).to.not.be.null;
        unmount();
    });

    it('should render with the default class name if a class name is supplied', () => {
        const { container, unmount } = render(<GdsFormGroup className="another-class">Test content</GdsFormGroup>);
        expect(container.querySelector('.govuk-form-group')).to.not.be.null;
        unmount();
    });

    it('should render with the supplied class name', () => {
        const { container, unmount } = render(<GdsFormGroup className="another-class">Test content</GdsFormGroup>);
        expect(container.querySelector('.another-class')).to.not.be.null;
        unmount();
    });

    it('should render with a supplied id', () => {
        const { container, unmount } = render(<GdsFormGroup id="containerId">Test content</GdsFormGroup>);
        expect(container.querySelector('#containerId')).to.not.be.null;
        unmount();
    });
});
