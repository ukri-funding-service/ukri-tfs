import React from 'react';
import { expect } from 'chai';
import { Paragraph } from '../../../src/components/paragraph';
import { render } from '@testing-library/react';

describe('Paragraph component tests', (): void => {
    it('should render a single paragraph tag', (): void => {
        const { container } = render(<Paragraph id="foo">Test</Paragraph>);
        expect(container.querySelectorAll('p')).to.have.length(1);
    });

    it('should render its children as react JSX within the paragraph tag', (): void => {
        const { container } = render(<Paragraph id="foo">Test</Paragraph>);

        const paragraphComponent = container.querySelector('p');
        expect(paragraphComponent).to.not.be.null;

        expect(paragraphComponent!.textContent).to.equal('Test');
    });

    it('should use passed in className', (): void => {
        const { container } = render(
            <Paragraph id="foo" className="something">
                Test
            </Paragraph>,
        );

        const paragraphComponent = container.querySelector('p');
        expect(paragraphComponent).to.not.be.null;

        expect(paragraphComponent!.classList.contains('something')).to.be.true;
    });
});
