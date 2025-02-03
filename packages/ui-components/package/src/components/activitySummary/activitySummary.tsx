import React from 'react';
import { ActivitySummaryCount, ActivitySummaryCountProps } from './activitySummaryCount';
import { SummaryList } from 'govuk-react-jsx';

export interface ActivitySummaryColumn {
    rows: ActivitySummaryCountProps[];
    title?: string;
}

export interface ActivitySummaryProps {
    columns: ActivitySummaryColumn[];
    id?: string;
}

export const ActivitySummary: React.FunctionComponent<ActivitySummaryProps> = ({ columns, id }) => {
    const heights = columns.map(column => {
        return (
            column.rows.length +
            column.rows.reduce((rowTotal, row) => {
                return rowTotal + (row.subCounts?.length ?? 0);
            }, 0)
        );
    });
    const maxHeight = heights.reduce((max, height) => {
        return Math.max(max, height);
    }, 0);
    return (
        <div id={id} data-testId={id}>
            <div className="activity-summary-large">
                <hr className="govuk-section-break govuk-section-break--visible govuk-!-margin-bottom-4" aria-hidden />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {columns.map((column, columnIndex) => {
                        const missingBreakCount = maxHeight - heights[columnIndex];
                        const extraBreaks = [];
                        for (let i = 0; i < missingBreakCount - 1; i++) {
                            extraBreaks.push(<br key={`spacing-${i}`} />);
                        }
                        return (
                            <>
                                <div
                                    key={`summary-${columnIndex}`}
                                    id={id ? `${id}-${columnIndex}` : undefined}
                                    data-testId={id ? `${id}-${columnIndex}` : undefined}
                                    className={'govuk-!-display-inline-block align-top'}
                                >
                                    {column.title && (
                                        <h4 className="govuk-heading-m govuk-!-margin-bottom-2">{column.title}</h4>
                                    )}
                                    {column.rows.map((row, rowIndex) => {
                                        return (
                                            <ActivitySummaryCount
                                                {...row}
                                                key={`summary-count-${columnIndex}-${rowIndex}`}
                                                id={id ? `${id}-${columnIndex}-${rowIndex}` : undefined}
                                                data-testId={id ? `${id}-${columnIndex}-${rowIndex}` : undefined}
                                            ></ActivitySummaryCount>
                                        );
                                    })}
                                    {extraBreaks}
                                </div>
                                <div
                                    className={`govuk-!-display-inline-block align-top ${
                                        columnIndex + 1 < columns.length
                                            ? 'vertical-line-right govuk-!-margin-right-4 govuk-!-padding-right-4'
                                            : ''
                                    }`}
                                />
                            </>
                        );
                    })}
                </div>
                <hr className="govuk-section-break govuk-section-break--visible govuk-!-margin-top-3" aria-hidden />
            </div>
            <div className="activity-summary-small">
                <hr className="govuk-section-break govuk-section-break--visible top-margin" aria-hidden />
                <SummaryList
                    rows={[
                        ...columns.map((column, columnIndex) => {
                            return {
                                key: {
                                    children: column.title,
                                },
                                value: {
                                    children: column.rows.map((row, rowIndex) => {
                                        return (
                                            <ActivitySummaryCount
                                                {...row}
                                                key={`summary-count-${columnIndex}-${rowIndex}`}
                                                id={id ? `small-${id}-${columnIndex}-${rowIndex}` : undefined}
                                                data-testId={id ? `small-${id}-${columnIndex}-${rowIndex}` : undefined}
                                            ></ActivitySummaryCount>
                                        );
                                    }),
                                },
                            };
                        }),
                    ]}
                ></SummaryList>
            </div>
        </div>
    );
};
