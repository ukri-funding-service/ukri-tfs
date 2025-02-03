import React from 'react';
import { expect } from 'chai';
import { MultiColumnDescriptionList } from '../../../src/components/multiColumnDescriptionList';
import { render } from '@testing-library/react';

describe('<MultiColumnDescriptionList /> component tests', () => {
    it('should create dd - dt pairs', () => {
        const col1 = [
            { term: 'first term - a', details: 'first details - a' },
            { term: 'second term - a', details: 'second details - a' },
        ];
        const col2 = [
            { term: 'first term - b', details: 'first details - b' },
            { term: 'second term - b', details: 'second details - b' },
        ];
        const { container, getByText } = render(
            <MultiColumnDescriptionList firstColumnPairs={col1} secondColumnPairs={col2} />,
        );
        expect(container.querySelectorAll('dd').length).to.equal(4);
        expect(container.querySelectorAll('dt').length).to.equal(4);
        getByText('first term - a');
        getByText('first details - a');
        getByText('first term - b');
        getByText('first details - b');
        getByText('second term - a');
        getByText('second details - a');
        getByText('second term - b');
        getByText('second details - b');
    });
});
