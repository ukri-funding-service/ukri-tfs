import { expect } from 'chai';
import { render } from '@testing-library/react';
import React from 'react';
import { BoxedContent } from '../../../src';

describe('<BoxedContent /> component tests', () => {
    it('should render all children within container', () => {
        const component = render(
            <BoxedContent>
                <p>something</p>
                <p>else</p>
                <p>here</p>
            </BoxedContent>,
            {},
        );
        expect(component.container.querySelectorAll('p').length).to.equal(3);
    });

    it('should render with the default class name if no class name is supplied', () => {
        const component = render(<BoxedContent>Test content</BoxedContent>);
        expect(component.container.querySelectorAll('.boxed-content').length).to.equal(1);
    });
});
