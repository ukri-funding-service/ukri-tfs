import React from 'react';

type SummaryItem = {
    key: string;
    value: string;
};

type Props = {
    items: SummaryItem[];
};

export const ReviewSummary: React.FC<Props> = ({ items }) => {
    const keys: React.ReactNode[] = [];
    const values: React.ReactNode[] = [];
    {
        items.forEach((item, index) => {
            keys.push(<span className="summary-key summary-item govuk-!-font-weight-bold">{items[index].key}</span>);
            values.push(<span className="summary-value summary-item">{items[index].value}</span>);
        });
    }
    return (
        <div className="summary-container">
            <div className="review-summary-keys">{keys}</div>
            <div className="review-summary-values">{values}</div>
        </div>
    );
};
