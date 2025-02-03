import React from 'react';
import { ReactElement } from 'react';
import { displayCurrency } from '../../../helpers';
import { LabelledValues } from '../../../components';
import { ExpenditureStatementTotals } from './models/expenditureStatements';

export const ExpenditureTableTotals = (props: {
    totalValues: ExpenditureStatementTotals;
    editMode?: boolean;
}): ReactElement => {
    const { totalValues } = props;

    const autoUpdatingTotalClass = props.editMode ? 'js-only' : '';
    const totals = [
        {
            label: 'Award value',
            value: displayCurrency(totalValues.totalAwardValue, true),
            testId: 'total-award-value',
        },
        {
            label: 'Paid to date',
            value: displayCurrency(totalValues.totalPaidToDate, true),
            testId: 'total-paid-to-date',
        },
        {
            label: 'fEC Expenditure',
            value: displayCurrency(totalValues.totalAmountSpent, true),
            testId: 'total-fec-expenditure',
            className: autoUpdatingTotalClass,
        },
        {
            label: 'Award expenditure',
            value: displayCurrency(totalValues.totalAwardSpent, true),
            testId: 'total-award-expenditure',
            className: autoUpdatingTotalClass,
        },
        {
            label: 'Balance',
            value: displayCurrency(totalValues.totalAwardSpent - totalValues.totalPaidToDate, true),
            testId: 'total-balance',
            className: autoUpdatingTotalClass,
        },
    ];

    return <LabelledValues labelledValues={totals} />;
};
