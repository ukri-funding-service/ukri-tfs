import { render, screen } from '@testing-library/react';
import React from 'react';
import { DescriptionText } from '../../../../../src/tfs/awards/expenditureStatements/descriptionText';

describe('DescriptionText', () => {
    it('should render text passed in', () => {
        render(<DescriptionText text={'This is some text used for testing'} />);

        screen.getByText('This is some text used for testing');
    });
});
