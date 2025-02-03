import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { CustomInput } from '../../../src/components/customInput';

describe('<CustomInput /> component tests', () => {
    it('renders the component', () => {
        const { container } = render(<CustomInput />);
        expect(container).to.exist;
    });

    it('contains a custom attribute', () => {
        const { container } = render(<CustomInput data-locator="inputField" />);
        expect(container.getElementsByTagName('Input')[0].getAttribute('data-locator')).to.equal('inputField');
    });

    it('contains a default placeholder attribute', () => {
        const { container } = render(<CustomInput />);
        expect(container.getElementsByTagName('Input')[0].getAttribute('placeholder')).to.equal('Foo-value');
    });

    it('contains a supplied placeholder attribute', () => {
        const { container } = render(<CustomInput placeholder="test" />);
        expect(container.getElementsByTagName('Input')[0].getAttribute('placeholder')).to.equal('test');
    });
});
