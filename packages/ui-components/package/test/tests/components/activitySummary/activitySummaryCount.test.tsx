import { render, RenderResult } from '@testing-library/react';
import { expect } from 'chai';
import { ActivitySummaryCount, ActivitySummaryCountProps } from '../../../../src/components/activitySummary';
import React from 'react';

describe('ActivitySummaryCount', () => {
    let component: RenderResult;

    it('should render the component with the respective props', () => {
        const props: ActivitySummaryCountProps = {
            count: 5,
            text: 'A long title',
        };

        component = render(<ActivitySummaryCount {...props} />);

        expect(component.container.textContent).to.contain('A long title');
        expect(component.container.textContent).to.contain('5');
        expect(component.container.querySelector('a')).to.not.exist;
    });

    it('should render the component given an href is provided', () => {
        const props: ActivitySummaryCountProps = {
            count: 1,
            text: 'Click to visit page',
            href: '/link-to-my-page',
        };

        component = render(<ActivitySummaryCount {...props} />);

        expect(component.container.textContent).to.contain('Click to visit page');
        expect(component.container.textContent).to.contain('1');
        expect(component.container.querySelector('a')?.getAttribute('href')).to.contain('/link-to-my-page');
    });

    it('should render the component given a sub count is provided', () => {
        const subCounts = [{ count: 5, text: 'Sub count' }];
        const props: ActivitySummaryCountProps = {
            count: 1,
            text: 'Count with a sub count',
            subCounts,
        };

        component = render(<ActivitySummaryCount {...props} />);

        expect(component.container.textContent).to.contain('1');
        expect(component.container.textContent).to.contain('Count with a sub count');
        expect(component.container.textContent).to.contain('5');
        expect(component.container.textContent).to.contain('Sub count');
        expect(component.container.querySelector('a')).to.not.exist;
    });
});
