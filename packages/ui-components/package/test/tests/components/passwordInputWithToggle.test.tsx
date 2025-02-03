import 'mocha';
import React from 'react';
import { expect } from 'chai';
import { PasswordInputWithToggle } from '../../../src/components/passwordInputWithToggle';
import { fireEvent, render } from '@testing-library/react';

describe('<PasswordInputWithToggle /> component tests', () => {
    it('should default to hidden', () => {
        const component = render(<PasswordInputWithToggle name="Title" />);
        expect(component.container.querySelector('input')?.getAttribute('type')).to.equal('password');
        expect(component.container.querySelector('a')?.textContent).to.equal('Show password');
    });

    it('should switch to show password when toggled', () => {
        const component = render(<PasswordInputWithToggle name="Title" />);
        fireEvent.click(component.container.querySelector('a')!);
        expect(component.container.querySelector('input')?.getAttribute('type')).to.equal('text');
        expect(component.container.querySelector('a')?.textContent).to.equal('Hide password');
    });

    it('should switch to hidden password when toggled twice', () => {
        const component = render(<PasswordInputWithToggle name="Title" />);
        fireEvent.click(component.container.querySelector('a')!);
        fireEvent.click(component.container.querySelector('a')!);
        expect(component.container.querySelector('input')?.getAttribute('type')).to.equal('password');
        expect(component.container.querySelector('a')?.textContent).to.equal('Show password');
    });
});
