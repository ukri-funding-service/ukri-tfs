import { Label } from 'govuk-react-jsx';
import React, { ChangeEvent, ReactElement, useState } from 'react';
import { calculatePercentage } from '../../../calculation';
import { Column, HeadingText, Input, TypedTable } from '../../../components';
import { displayCurrency } from '../../../helpers/currency';
import { CategoryTablesFormField } from './expenditureTableFormField';
import {
    ExpenditureStatementCategory,
    ExpenditureStatementRow,
    mapExpenditureStatementToExpenditureStatementCategories,
} from './mappers/mappers';
import { ExpenditureStatement, ExpenditureStatementTotals } from './models/expenditureStatements';
import { ExpenditureTableTotals } from './expenditureTableTotals';
import { DescriptionText } from './descriptionText';

interface ExpenditureTableFormProps {
    expenditureStatement: ExpenditureStatement;
    errorMessages: string[];
    editable?: boolean;
    descriptionText?: string;
}

const ExpenditureStatementTable = TypedTable<ExpenditureStatementRow>();

const calculateTotalsForRows = (rows: ExpenditureStatementRow[]) => {
    const totalsReducer = (
        accumulator: ExpenditureStatementTotals,
        row: ExpenditureStatementRow,
    ): ExpenditureStatementTotals => {
        const awardSpent = calculatePercentage(row.fecPercentage, row.amountSpent);
        return {
            totalfecAmount: accumulator.totalfecAmount + row.fecAmount,
            totalAwardValue: accumulator.totalAwardValue + row.awardValue,
            totalPaidToDate: accumulator.totalPaidToDate + row.paidToDate,
            totalAmountSpent: accumulator.totalAmountSpent + (row.amountSpent ?? 0),
            totalAwardSpent: accumulator.totalAwardSpent + awardSpent,
        };
    };
    return rows.reduce(totalsReducer, {
        totalfecAmount: 0,
        totalAwardValue: 0,
        totalPaidToDate: 0,
        totalAmountSpent: 0,
        totalAwardSpent: 0,
    });
};

const calculateTotalsForAllCategories = (categories: ExpenditureStatementCategory[]): ExpenditureStatementTotals => {
    const initialTotals: ExpenditureStatementTotals = {
        totalfecAmount: 0,
        totalAwardValue: 0,
        totalPaidToDate: 0,
        totalAmountSpent: 0,
        totalAwardSpent: 0,
    };

    const totals = categories.reduce(
        (accumulator: ExpenditureStatementTotals, category: ExpenditureStatementCategory) => {
            const categoryTotals = calculateTotalsForRows(category.fundHeadingRows);
            return {
                totalfecAmount: accumulator.totalfecAmount + categoryTotals.totalfecAmount,
                totalAwardValue: accumulator.totalAwardValue + categoryTotals.totalAwardValue,
                totalPaidToDate: accumulator.totalPaidToDate + categoryTotals.totalPaidToDate,
                totalAmountSpent: accumulator.totalAmountSpent + categoryTotals.totalAmountSpent,
                totalAwardSpent: accumulator.totalAwardSpent + categoryTotals.totalAwardSpent,
            };
        },
        initialTotals,
    );

    return totals;
};

export const addTotalRow = (rows: ExpenditureStatementRow[], title: string): ExpenditureStatementRow[] => {
    if (rows.length <= 1) {
        // don't add total row if only one row
        return rows;
    }

    const categoryTotals = calculateTotalsForRows(rows);

    return [
        ...rows,
        {
            id: 0,
            fundHeading: title,
            fecPercentage: 0,
            fecAmount: categoryTotals.totalfecAmount,
            paidToDate: categoryTotals.totalPaidToDate,
            amountSpent: categoryTotals.totalAmountSpent,
            awardExpenditure: categoryTotals.totalAwardSpent,
            awardValue: categoryTotals.totalAwardValue,
            totalRow: true,
        },
    ];
};
export const getTotalsTitle = (title: string): string => {
    if (title === 'Total costs') {
        return 'Totals';
    }

    return title + ' totals';
};

export const ExpenditureCategoryTable = (props: {
    category: ExpenditureStatementCategory;
    editable: boolean;
    updateCategory: (category: ExpenditureStatementCategory) => void;
}): ReactElement => {
    const { category, updateCategory } = props;

    const rowsWithTotals = addTotalRow(category.fundHeadingRows, getTotalsTitle(category.title));

    const handleAmountChange = (id: number, newAmount: number | null) => {
        const updatedRows = category.fundHeadingRows.map(row => {
            if (row.id === id) {
                const awardExpenditure = calculatePercentage(row.fecPercentage, newAmount);
                const awardValue = calculatePercentage(row.fecPercentage, row.fecAmount);
                return { ...row, amountSpent: newAmount, awardExpenditure, awardValue };
            }
            return row;
        });

        updateCategory({ ...category, fundHeadingRows: updatedRows });
    };

    const onInputBlur = (event: ChangeEvent<HTMLInputElement>, rowId: number) => {
        handleAmountChange(rowId, event.target.value === '' ? null : parseFloat(event.target.value));
    };

    const autoUpdatingColumnClass = props.editable ? 'js-only-table-cell' : '';

    const generateExpenditureCell = (row: ExpenditureStatementRow): ReactElement | string => {
        const isInputCell = props.editable && !row.totalRow;

        if (isInputCell) {
            return (
                <Label aria-label={`${props.category.title} ${row.fundHeading} fEC Expenditure`}>
                    <Input
                        name={`amount-spent-${row.id}`}
                        data-testid={`input-${row.id}`}
                        onBlur={event => onInputBlur(event, row.id)}
                        defaultValue={row.amountSpent?.toFixed(2)}
                        type="number"
                        className="govuk-input govuk-input--width-5 u-align-right"
                        formGroupClassName="govuk-form-group u-space-y0"
                        step={0.01}
                    />
                </Label>
            );
        } else if (row.amountSpent !== null) {
            return displayCurrency(row.amountSpent);
        } else {
            return '';
        }
    };

    return (
        <ExpenditureStatementTable
            data={rowsWithTotals}
            rowClassName={(row: ExpenditureStatementRow) => (row.totalRow ? 'govuk-table--current' : '')}
        >
            <Column
                testId="fund-heading"
                header="Fund headings"
                value={(row: ExpenditureStatementRow) => row.fundHeading}
                ariaLabel="Fund Headings"
                className={() => 'u-valign-middle'}
                width={20}
            />
            <Column
                header="Total fEC (£)"
                value={(row: ExpenditureStatementRow) => displayCurrency(row.fecAmount)}
                ariaLabel="Total fEC"
                className={() => 'u-valign-middle govuk-table__cell--numeric'}
                headerClassName={'govuk-table__header--numeric'}
            />
            <Column
                header="fEC (%)"
                value={(row: ExpenditureStatementRow) => (row.totalRow ? '' : row.fecPercentage)}
                ariaLabel="fEC Percentage"
                className={() => 'u-valign-middle govuk-table__cell--numeric'}
                headerClassName={'govuk-table__header--numeric'}
            />
            <Column
                header="Award value (£)"
                value={(row: ExpenditureStatementRow) => displayCurrency(row.awardValue)}
                ariaLabel="Award Value In Pounds"
                className={() => 'u-valign-middle govuk-table__cell--numeric'}
                headerClassName={'govuk-table__header--numeric'}
            />
            <Column
                header="Paid to date (£)"
                value={(row: ExpenditureStatementRow) => displayCurrency(row.paidToDate)}
                ariaLabel="Paid to date"
                className={() => 'u-valign-middle govuk-table__cell--numeric'}
                headerClassName={'govuk-table__header--numeric'}
            />
            <Column
                header="fEC Expenditure (£)"
                value={generateExpenditureCell}
                ariaLabel="Full Costs In Pounds"
                className={() => 'u-valign-middle govuk-table__cell--numeric'}
                headerClassName={'govuk-table__header--numeric'}
                width={15}
            />
            <Column
                header="Award expenditure (£)"
                testId={`award-expenditure`}
                value={(row: ExpenditureStatementRow) => displayCurrency(row.awardExpenditure)}
                ariaLabel="Award expenditure Value In Pounds"
                className={() => `u-valign-middle govuk-table__cell--numeric ${autoUpdatingColumnClass}`}
                headerClassName={`govuk-table__header--numeric ${autoUpdatingColumnClass}`}
            />
            <Column
                header="Balance"
                testId={`balance`}
                value={(row: ExpenditureStatementRow) => displayCurrency(row.awardExpenditure - row.paidToDate)}
                ariaLabel="Balance In Pounds"
                className={() => `u-valign-middle govuk-table__cell--numeric ${autoUpdatingColumnClass}`}
                headerClassName={`govuk-table__header--numeric ${autoUpdatingColumnClass}`}
            />
        </ExpenditureStatementTable>
    );
};

const copyText: Record<ExpenditureStatement['type'], string> = {
    Transfer: 'Transfer expenditure statement summary',
    Final: 'Final expenditure statement summary',
};

export const ExpenditureTableForm = (props: ExpenditureTableFormProps): ReactElement => {
    const expenditureStatementCategories = mapExpenditureStatementToExpenditureStatementCategories(
        props.expenditureStatement,
    );
    const [categories, setCategories] = useState(expenditureStatementCategories);

    const totalValues = calculateTotalsForAllCategories(categories);

    const expenditureType = props.expenditureStatement.type;

    const updateCategory = (updatedCategory: ExpenditureStatementCategory) => {
        const updatedCategories = categories.map(category => {
            if (updatedCategory.title === category.title) {
                return updatedCategory;
            }
            return category;
        });
        setCategories(updatedCategories);
    };

    return (
        <>
            <HeadingText text={copyText[expenditureType]} tag="h2" size="s" />
            <ExpenditureTableTotals totalValues={totalValues} editMode={props.editable} />
            {props.descriptionText && <DescriptionText text={props.descriptionText} />}
            <CategoryTablesFormField
                label=""
                name="expenditureCategoryTables"
                isError={props.errorMessages.length > 0}
                errorMessages={props.errorMessages}
                categories={categories}
                updateCategory={updateCategory}
                editable={props.editable}
            ></CategoryTablesFormField>
        </>
    );
};
