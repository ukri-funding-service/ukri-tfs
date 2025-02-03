import React, { ReactElement } from 'react';

import { DescriptionEntry, DescriptionList } from './descriptionList';
import { Position, PositionSpacing } from './position';
import { Columns } from './columns';

interface TermPairsProps {
    term: string;
    details: string;
}

interface InlineDetailsProps extends TermPairsProps {
    compact?: boolean;
}

const InlineDetails = (props: InlineDetailsProps): ReactElement => {
    let rowClassName = 'u-space-y0';
    let termClassName = 'govuk-!-display-inline govuk-!-font-weight-bold';
    let detailsClassName = 'govuk-!-display-inline';
    if (!props.compact) {
        rowClassName += ' govuk-grid-row';
        termClassName += ' govuk-grid-column-one-third';
        detailsClassName += ' govuk-grid-column-two-quarter';
    }
    return (
        <DescriptionEntry
            termClassName={termClassName}
            term={props.term}
            detailsClassName={detailsClassName}
            details={props.details}
            className={rowClassName}
        />
    );
};

interface MultiColumnDescriptionListProps {
    firstColumnPairs: TermPairsProps[];
    secondColumnPairs: TermPairsProps[];
    compact?: boolean;
}

export const MultiColumnDescriptionList = (props: MultiColumnDescriptionListProps): ReactElement => {
    const mapTermPairsToInlineDetails = (termPairs: TermPairsProps[]): ReactElement[] => {
        return termPairs.map(termPair => {
            return (
                <InlineDetails
                    key={termPair.term}
                    term={termPair.term}
                    details={termPair.details}
                    compact={props.compact}
                />
            );
        });
    };
    return (
        <Columns>
            <Position spacing={props.compact ? PositionSpacing.HALF : PositionSpacing.TWO_THIRDS}>
                <DescriptionList>{mapTermPairsToInlineDetails(props.firstColumnPairs)}</DescriptionList>
            </Position>
            <Position spacing={PositionSpacing.TWO_THIRDS}>
                <DescriptionList>{mapTermPairsToInlineDetails(props.secondColumnPairs)}</DescriptionList>
            </Position>
        </Columns>
    );
};
