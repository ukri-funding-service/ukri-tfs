import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { ReviewScore } from '../../../../src';

describe('packages/ui-components - tfs/review', () => {
    describe('score', () => {
        it('should render a score', () => {
            const component = render(<ReviewScore maxScore={6} score={5} />);

            const reviewScoreComponent = component.container.querySelector('.review-score');
            const reviewMaxScoreComponent = component.container.querySelector('.review-max-score');

            expect(reviewScoreComponent).to.not.be.null;
            expect(reviewScoreComponent!.textContent).to.eql('5');

            expect(reviewMaxScoreComponent).to.not.be.null;
            expect(reviewMaxScoreComponent!.textContent).to.eql(' / 6');
        });
    });
});
