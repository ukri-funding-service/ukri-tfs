import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { CustomPanel } from '../../../src/components/customPanel';

describe('<CustomPanel /> component tests', () => {
    it('renders the component', () => {
        const component = render(<CustomPanel></CustomPanel>);
        expect(component).to.exist;
    });

    // it('contains a custom attribute', () => {
    //     const component = shallow(<CustomInput data-locator="inputField" />);
    // expect(component.find('Input').prop('data-locator')).to.equal('inputField');
    // });
    //
    // it('contains a default placeholder attribute', () => {
    //     const component = shallow(<CustomInput />);
    // expect(component.find('Input').prop('placeholder')).to.equal('Foo-value');
    // });
    //
    // it('contains a supplied placeholder attribute', () => {
    //     const component = shallow(<CustomInput placeholder="test" />);
    // expect(component.find('Input').prop('placeholder')).to.equal('test');
    // });
});
