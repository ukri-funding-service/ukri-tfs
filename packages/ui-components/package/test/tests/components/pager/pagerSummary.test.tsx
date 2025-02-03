import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { TfsPagerSummary } from '../../../../src/components/pager';

describe('<TfsPagerSummary /> component tests', () => {
    it('should have 1 to 20 of 100 results', () => {
        // given
        const props = {
            id: 'id',
            start: 1,
            end: 20,
            total: 100,
        };

        // when
        const component = render(<TfsPagerSummary {...props} />);

        // then
        expect(component.container.textContent).to.equal('Showing 1 to 20 of 100 results');
    });

    it('should have 400 to 2000 of 123456 results', () => {
        // given
        const props = {
            id: 'id',
            start: 400,
            end: 2000,
            total: 123456,
        };

        // when
        const component = render(<TfsPagerSummary {...props} />);

        // then
        expect(component.container.textContent).to.equal('Showing 400 to 2000 of 123456 results');
    });

    it('should have 10 to 20 of 100 results', () => {
        // given
        const props = {
            id: 'id',
            start: 10,
            end: 20,
            total: 100,
            resultsName: 'results',
        };

        // when
        const component = render(<TfsPagerSummary {...props} />);

        // then
        expect(component.container.textContent).to.equal('Showing 10 to 20 of 100 results');
    });

    it('should have -10 to -20 of -100 results', () => {
        // given
        const props = {
            id: 'id',
            start: -10,
            end: -20,
            total: -100,
        };

        // when
        const component = render(<TfsPagerSummary {...props} />);

        // then
        expect(component.container.textContent).to.equal('Showing -10 to -20 of -100 results');
    });
});
