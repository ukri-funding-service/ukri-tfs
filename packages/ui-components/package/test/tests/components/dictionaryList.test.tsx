import React from 'react';
import { expect } from 'chai';
import { DictionaryList } from '../../../src/components/dictionaryList';
import { render } from '@testing-library/react';

describe('<DictionaryList /> component tests', () => {
    it('should set the correct key and value', () => {
        const { container } = render(<DictionaryList items={[{ key: 'Test Key', value: 'Test Value' }]} />);
        expect(container.querySelector('.application-data__key')!.textContent).to.equal('Test Key');
        expect(container.querySelector('.application-data__value')!.textContent).to.equal('Test Value');
    });

    it('should set the correct number of items', () => {
        const { container } = render(
            <DictionaryList
                items={[
                    { key: 'Test Key', value: 'Test Value' },
                    { key: 'Test Key 2', value: 'Test Value 2' },
                ]}
            />,
        );
        expect(container.querySelectorAll('.application-data__key').length).to.equal(2);
    });

    it('should set classes on the dictionary item', () => {
        const { container } = render(
            <DictionaryList items={[{ key: 'Test Key', value: 'Test Value', classes: ['some-class'] }]} />,
        );

        expect(container.querySelector('.some-class')!.textContent).to.equal('Test KeyTest Value');
    });

    it('should not set undefined classes', () => {
        const { container } = render(
            <DictionaryList items={[{ key: 'Test Key', value: 'Test Value', classes: ['some-class'] }]} />,
        );

        expect(container.querySelectorAll('.some-other-class')).to.be.empty;
    });
});
