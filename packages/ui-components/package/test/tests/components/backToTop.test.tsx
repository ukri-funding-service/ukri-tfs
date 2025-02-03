import React from 'react';
import { render } from '@testing-library/react';
import { BackToTop } from '../../../src/components';
import { expect } from 'chai';

describe('backToTop tests', () => {
    describe('link', () => {
        it('should exist with appropriate target and default text', () => {
            const { container } = render(<BackToTop target="#my-target" />);
            const anchorTag = container.getElementsByTagName('a')[0];
            expect(anchorTag.textContent).to.eql('Back to top');
            expect(anchorTag.href).to.contain('#my-target');
        });

        it('should have appropriate text set', () => {
            const { container } = render(<BackToTop target="#my-target" text="Top of page" />);
            expect(container.getElementsByTagName('a')[0].textContent).to.contain('Top of page');
        });

        it('should be sticky', () => {
            const { container } = render(<BackToTop target="#my-target" isSticky={true} />);
            expect(container.getElementsByTagName('a')[0].className).to.contain('back-to-top--sticky');
        });
    });
});
