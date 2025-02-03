import { render, screen } from '@testing-library/react';
import { expect } from 'chai';
import 'mocha';
import React from 'react';
import { GdsRadioButton } from '../../../src';

describe('gdsRadioButton tests', () => {
    it('should disable the radio button if disabled is true', () => {
        render(<GdsRadioButton id={'test'} name={'radio_button'} value={'hi'} text={'someText'} disabled={true} />);

        expect(screen.getByRole('radio')).to.have.property('disabled', true);
    });
});
