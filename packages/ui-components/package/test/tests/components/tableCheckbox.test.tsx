import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { TableCheckbox } from '../../../src/components';

describe('<TableCheckbox /> component tests', () => {
    it('checkbox should exist', () => {
        const component = render(<TableCheckbox value="1" name="test" hiddenLabel="hidden label" />);
        const input = component.container.querySelector('input')!;
        expect(input.getAttribute('type')).to.equal('checkbox');
        expect(input.getAttribute('disabled')).to.not.exist;
        expect(input.defaultChecked).to.be.false;
    });

    it('checkbox should be checked and disabled', () => {
        const component = render(
            <TableCheckbox value="1" name="test" hiddenLabel="hidden label" disabled={true} checked={true} />,
        );
        const input = component.container.querySelector('input')!;
        expect(input.getAttribute('disabled')).to.exist;
        expect(input.defaultChecked).to.be.true;
    });
});
