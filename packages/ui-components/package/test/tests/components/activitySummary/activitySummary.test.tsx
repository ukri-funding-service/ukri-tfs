import { render, RenderResult } from '@testing-library/react';
import { expect } from 'chai';
import {
    ActivitySummary,
    ActivitySummaryColumn,
    ActivitySummaryCountProps,
} from '../../../../src/components/activitySummary';
import React from 'react';

describe('ActivitySummary', () => {
    let component: RenderResult;

    it('should render the component with the respective props', () => {
        const row: ActivitySummaryCountProps = {
            count: 5,
            text: 'A row',
        };
        const column: ActivitySummaryColumn = {
            title: 'My counts',
            rows: [row],
        };

        component = render(<ActivitySummary columns={[column]} />);

        expect(component.container.textContent).to.contain('My counts');
        expect(component.container.textContent).to.contain('A row');
        expect(component.container.textContent).to.contain('5');
    });

    it('should render the component given there are multiple rows and columns', () => {
        const firstColumn: ActivitySummaryColumn = {
            title: 'My counts',
            rows: [
                {
                    count: 1,
                    text: 'My first row',
                },
                {
                    count: 3,
                    text: 'My second row',
                },
                {
                    count: 5,
                    text: 'My third row',
                },
            ],
        };
        const secondColumn: ActivitySummaryColumn = {
            title: 'Your counts',
            rows: [
                {
                    count: 2,
                    text: 'Your first row',
                },
                {
                    count: 4,
                    text: 'Your second row',
                },
                {
                    count: 6,
                    text: 'Your third row',
                },
            ],
        };

        component = render(<ActivitySummary id="summary" columns={[firstColumn, secondColumn]} />);

        expect(component.getByTestId('summary-0').textContent).to.contain('My counts');
        expect(component.getByTestId('summary-1').textContent).to.contain('Your counts');

        expect(component.getByTestId('summary-0-0').textContent).to.contain('1');
        expect(component.getByTestId('summary-0-1').textContent).to.contain('3');
        expect(component.getByTestId('summary-0-2').textContent).to.contain('5');
        expect(component.getByTestId('summary-1-0').textContent).to.contain('2');
        expect(component.getByTestId('summary-1-1').textContent).to.contain('4');
        expect(component.getByTestId('summary-1-2').textContent).to.contain('6');

        expect(component.getByTestId('summary-0-0').textContent).to.contain('My first row');
        expect(component.getByTestId('summary-0-1').textContent).to.contain('My second row');
        expect(component.getByTestId('summary-0-2').textContent).to.contain('My third row');
        expect(component.getByTestId('summary-1-0').textContent).to.contain('Your first row');
        expect(component.getByTestId('summary-1-1').textContent).to.contain('Your second row');
        expect(component.getByTestId('summary-1-2').textContent).to.contain('Your third row');
    });
});
