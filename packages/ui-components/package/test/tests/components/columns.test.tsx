import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Columns } from '../../../src/components/columns';

describe('<Columns /> container tests', () => {
    it('should render all children within container', () => {
        const { container } = render(
            <Columns>
                <p>something</p>
                <p>else</p>
                <p>here</p>
            </Columns>,
        );

        expect(container.getElementsByTagName('p').length).to.eql(3);
    });

    it('should render with the default class name if no class name is supplied', () => {
        const { container } = render(<Columns>Test content</Columns>);
        expect(container.getElementsByClassName('columns')).to.exist;
    });

    it('should render with the default class name if a class name is supplied', () => {
        const { container } = render(<Columns className="another-class">Test content</Columns>);
        expect(container.getElementsByClassName('columns')).to.exist;
    });

    it('should render with the supplied class name', () => {
        const { container } = render(<Columns className="another-class">Test content</Columns>);
        expect(container.getElementsByClassName('another-class')).to.exist;
    });

    it('should render with a supplied id', () => {
        const { container } = render(<Columns id="containerId">Test content</Columns>);
        expect(container.querySelector('#containerId')).to.exist;
    });
});
