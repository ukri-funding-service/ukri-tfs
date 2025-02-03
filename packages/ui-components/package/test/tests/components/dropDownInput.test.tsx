import React from 'react';
import { DropDownInput } from '../../../src/components/dropDownInput';
import { render, screen } from '@testing-library/react';
import { expect } from 'chai';

const options = [
    { value: 'a', displayValue: 'ab' },
    { value: 'b', displayValue: 'bc' },
    { value: 'c', displayValue: 'cd' },
];

describe('<DropDownInput /> Component tests', () => {
    it('Should render a drop down input', () => {
        render(<DropDownInput title={'DropDownInput'} name={'testDropDown'} options={options} />);
        screen.getByText('DropDownInput');
        const option = screen.getByRole('option', { name: 'ab' });
        expect(option.getAttribute('value')).to.equal('a');
    });

    it('Should render a drop down list with Default value set', () => {
        render(
            <DropDownInput
                title={'DropDownInput'}
                name={'testDropDown'}
                options={options}
                defaultOption={{ value: 'c', displayValue: 'cd' }}
            />,
        );
        screen.getByText('DropDownInput');
        const option = screen.getByRole('option', { name: 'cd' });
        expect(option.getAttribute('value')).to.equal('c');
    });

    it('Should render a drop down input option without a displayValue', () => {
        render(<DropDownInput title={'DropDownInput'} name={'testDropDown'} options={[{ value: 'testOption' }]} />);
        screen.getByText('DropDownInput');
        const option = screen.getByRole('option', { name: 'testOption' });
        expect(option.getAttribute('value')).to.equal('testOption');
    });

    it('should disable the drop down if disabled is true', () => {
        render(
            <DropDownInput
                disabled={true}
                title={'DropDownInput'}
                name={'testDropDown'}
                options={[{ value: 'testOption' }]}
            />,
        );

        expect(screen.getByRole('combobox')).have.property('disabled', true);
    });

    it('should enable the drop down if disabled is false', () => {
        render(
            <DropDownInput
                disabled={false}
                title={'DropDownInput'}
                name={'testDropDown'}
                options={[{ value: 'testOption' }]}
            />,
        );

        expect(screen.getByRole('combobox')).to.have.property('disabled', false);
    });

    it('should enable the drop down if disabled is not provided', () => {
        render(<DropDownInput title={'DropDownInput'} name={'testDropDown'} options={[{ value: 'testOption' }]} />);

        expect(screen.getByRole('combobox')).to.not.have.property('disabled', undefined);
    });
});
