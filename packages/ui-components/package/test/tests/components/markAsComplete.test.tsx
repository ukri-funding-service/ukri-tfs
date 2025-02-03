import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MarkAsComplete } from '../../../src/components/markAsComplete';

describe('<MarkAsComplete /> component tests', () => {
    it('Ensure checkbox is surrounded by correct wrapper', () => {
        const { container } = render(<MarkAsComplete text="Mark as complete" id="markAsComplete" value="isComplete" />);
        expect(container.querySelector('.mark-as-complete-wrapper')).to.not.be.null;
    });

    it('Ensure checkbox has the right label', () => {
        const { container } = render(<MarkAsComplete text="Mark as complete" id="markAsComplete" value="isComplete" />);

        const legendComponent = container.querySelector('.govuk-fieldset__legend');
        expect(legendComponent).to.not.be.null;

        expect(legendComponent!.textContent).to.equal('Mark as complete');
    });
});
