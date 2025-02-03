import React from 'react';

type Props = {
    score: number;
    maxScore: number;
};

export const ReviewScore: React.FC<Props> = ({ score, maxScore }) => {
    return (
        <div className="u-space-b30">
            <span className="review-score govuk-body govuk-!-font-size-48">{score}</span>
            <span className="review-max-score govuk-body govuk-!-font-size-24"> / {maxScore}</span>
        </div>
    );
};
