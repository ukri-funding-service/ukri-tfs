import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { GdsRelatedItems } from '../../../src/components/relatedItems';

describe('<GdsRelatedItems /> component tests', () => {
    it('correct title should be set', () => {
        const relatedItems = render(
            <GdsRelatedItems>
                <h2 className="govuk-heading-xs u-space-y5">My swanky title</h2>
            </GdsRelatedItems>,
        );
        expect(relatedItems.container.querySelector('.govuk-heading-xs')?.textContent).to.equal('My swanky title');
    });

    it('correct description should be set', () => {
        const relatedItems = render(
            <GdsRelatedItems>
                <h2 className="govuk-heading-xs u-space-y5">My swanky title</h2>
                <p className="govuk-body-s u-space-b5">My swanky description</p>
            </GdsRelatedItems>,
        );
        expect(relatedItems.container.querySelector('.govuk-body-s')?.textContent).to.equal('My swanky description');
    });

    it('correct text should be set', () => {
        const relatedItems = render(
            <GdsRelatedItems>
                <h2 className="govuk-heading-xs u-space-y5">My swanky title</h2>
                <p className="govuk-body-s u-space-b5">My swanky description</p>
            </GdsRelatedItems>,
        );
        expect(relatedItems.container.querySelector('.govuk-heading-xs')?.textContent).to.equal('My swanky title');
        expect(relatedItems.container.querySelector('.govuk-body-s')?.textContent).to.equal('My swanky description');
    });
});
