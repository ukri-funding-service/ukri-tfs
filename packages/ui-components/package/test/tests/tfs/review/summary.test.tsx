import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { ReviewSummary } from '../../../../src';

describe('packages/ui-components - tfs/review', () => {
    describe('summary', () => {
        it('should render everything in the summary', () => {
            const component = render(
                <ReviewSummary
                    items={[
                        { key: 'test-key', value: 'test-value' },
                        { key: 'test-key2', value: 'test-value2' },
                    ]}
                />,
            );

            expect(component.container.querySelectorAll('.summary-key').length).to.eql(2);
            expect(component.container.querySelectorAll('.summary-value').length).to.eql(2);
        });

        it('summary items should have the correct contents', () => {
            const component = render(
                <ReviewSummary
                    items={[
                        { key: 'test-key', value: 'test-value' },
                        { key: 'test-key2', value: 'test-value2' },
                    ]}
                />,
            );

            expect(component.container.querySelectorAll('.summary-key')[0].textContent).to.eql('test-key');
            expect(component.container.querySelectorAll('.summary-value')[0].textContent).to.eql('test-value');

            expect(component.container.querySelectorAll('.summary-key')[1].textContent).to.eql('test-key2');
            expect(component.container.querySelectorAll('.summary-value')[1].textContent).to.eql('test-value2');
        });
    });
});
