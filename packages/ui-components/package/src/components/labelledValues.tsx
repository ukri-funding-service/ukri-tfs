import React from 'react';
import { DescriptionEntry, DescriptionList } from './descriptionList';

export type LabelValuePair = {
    label: string;
    value: string;
    testId?: string;
    className?: string;
};

interface LabelledValuesListProps {
    labelledValues: LabelValuePair[];
    alignTop?: boolean;
}

export function LabelledValues(props: LabelledValuesListProps): JSX.Element {
    const createLabelledItem = (labelValuePair: LabelValuePair) => {
        const termClassName = props.alignTop ? 'labelled-title labelled-title--top' : 'labelled-title';
        const detailsClassName = 'govuk-!-display-block govuk-!-font-size-36 govuk-body cost-summary-value';
        const term = <strong className="labelled-title-text">{labelValuePair.label}</strong>;

        return (
            <div
                className={`labelled-value-item ${labelValuePair.className ?? ''}`}
                key={labelValuePair.testId}
                data-testid={`parent-${labelValuePair.testId}`}
            >
                <DescriptionEntry
                    term={term}
                    termClassName={termClassName}
                    details={labelValuePair.value}
                    detailsClassName={detailsClassName}
                    details-testid={labelValuePair.testId}
                />
            </div>
        );
    };

    return (
        <DescriptionList className="labelled-values-container u-space-b30">
            {props.labelledValues.map(createLabelledItem)}
        </DescriptionList>
    );
}
