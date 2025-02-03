import { expect } from 'chai';
import { render, RenderResult } from '@testing-library/react';
import React from 'react';
import { CompletionStatus } from '../../../src/components/completionStatus';

describe('<CompletionStatus /> component tests', () => {
    let component: RenderResult;
    afterEach(() => {
        component.unmount();
    });

    it('should render complete status', () => {
        component = render(<CompletionStatus isComplete={true} />);

        const status = component.queryByText('Complete');

        expect(status).to.exist;
        expect(status!.getAttribute('aria-label')).to.eql('This section is Complete');
        expect(status!.className).to.contain('completion-status--complete');
    });

    it('should render incomplete status', () => {
        component = render(<CompletionStatus isComplete={false} />);

        const status = component.queryByText('Incomplete');

        expect(status).to.exist;
        expect(status!.getAttribute('aria-label')).to.eql('This section is Incomplete');
        expect(status!.className).to.contain('completion-status--incomplete');
    });

    it('should render accessibility text', () => {
        component = render(<CompletionStatus ariaLabel="This is a custom aria label" />);

        const status = component.queryByText('Incomplete');

        expect(status!.getAttribute('aria-label')).to.eql('This is a custom aria label');
    });
});
