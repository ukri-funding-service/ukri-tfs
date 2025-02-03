import React from 'react';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import { InputWithCharacterCount } from '../../../src';

describe('Input with character count component tests', () => {
    it('should not show character count if showCharacterCount false', async () => {
        const component = await render(<InputWithCharacterCount name={''} />);
        expect(component.container.querySelector('#more-detail-info-')).to.be.null;
    });
    it('should not show character count if maxCharacterCount not provided', async () => {
        const component = await render(<InputWithCharacterCount name={''} showCharacterCount={true} />);
        expect(component.container.querySelector('#more-detail-info-')).to.be.null;
    });
    it('should show character count if showCharacterCount true and max character count provided', async () => {
        const component = await render(
            <InputWithCharacterCount name={''} showCharacterCount={true} maxCharacterCount={3} />,
        );
        expect(component.container.querySelector('#more-detail-info-')).to.exist;
        expect(component.queryByText('You have 3 characters remaining')).to.exist;
    });
    it('should update character count if defaultvalue provided', async () => {
        const component = await render(
            <InputWithCharacterCount
                name={''}
                showCharacterCount={true}
                maxCharacterCount={29}
                defaultValue={'some text'}
            />,
        );
        expect(component.queryByText('You have 20 characters remaining')).to.exist;
    });
    it('should update character count if value entered', async () => {
        const component = await render(
            <InputWithCharacterCount name={''} showCharacterCount={true} maxCharacterCount={40} />,
        );
        const testArgs = { target: { value: 'some characters like' } };
        const input = component.container.querySelector('input')!;
        fireEvent.change(input, testArgs);
        expect(component.queryByText('You have 20 characters remaining')).to.exist;
    });
    it('should display 1 character remaining', async () => {
        const component = await render(
            <InputWithCharacterCount name={''} showCharacterCount={true} maxCharacterCount={2} />,
        );
        const testArgs = { target: { value: 'd' } };
        const input = component.container.querySelector('input')!;
        fireEvent.change(input, testArgs);
        expect(component.queryByText('You have 1 character remaining')).to.exist;
    });
    it('should display 0 remaining', async () => {
        const component = await render(
            <InputWithCharacterCount name={''} showCharacterCount={true} maxCharacterCount={1} />,
        );
        const testArgs = { target: { value: 'w' } };
        const input = component.container.querySelector('input')!;
        fireEvent.change(input, testArgs);
        expect(component.queryByText('You have 0 characters remaining')).to.exist;
    });
    it('should display over character count text', async () => {
        const component = await render(
            <InputWithCharacterCount name={''} showCharacterCount={true} maxCharacterCount={1} />,
        );
        const testArgs = { target: { value: 'some' } };
        const input = component.container.querySelector('input')!;
        fireEvent.change(input, testArgs);
        expect(component.queryByText('You are 3 characters over the limit')).to.exist;
    });
    it('should display 1 character over character count text', async () => {
        const component = await render(
            <InputWithCharacterCount name={''} showCharacterCount={true} maxCharacterCount={19} />,
        );
        const testArgs = { target: { value: 'some words like this' } };
        const input = component.container.querySelector('input')!;
        fireEvent.change(input, testArgs);
        expect(component.queryByText('You are 1 character over the limit')).to.exist;
    });
});
