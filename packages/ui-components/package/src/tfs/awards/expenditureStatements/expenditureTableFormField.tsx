import { Label } from 'govuk-react-jsx';
import React, { ChangeEvent, ReactElement } from 'react';
import { calculatePercentage } from '../../../calculation';
import { Column, HeadingText, Input, TypedTable } from '../../../components';
import { displayCurrency } from '../../../helpers/currency';
import { withFormField } from '../../../wrappers';
import { addTotalRow, getTotalsTitle } from './expenditureTableForm';
import { ExpenditureStatementCategory, ExpenditureStatementRow } from './mappers/mappers';

const categoryTables = (props: CategoryTablesFormFieldProps) => {
    return (
        <>
            {props.categories.map(mappedFundCategory => {
                return (
                    <div key={mappedFundCategory.title}>
                        <HeadingText text={mappedFundCategory.title} tag="h2" size="s" />
                        <ExpenditureCategoryTable
                            category={mappedFundCategory}
                            editable={!!props.editable}
                            updateCategory={props.updateCategory}
                        />
                    </div>
                );
            })}
        </>
    );
};

export const CategoryTablesFormField = withFormField(categoryTables);

interface CategoryTablesFormFieldProps {
    categories: ExpenditureStatementCategory[];
    updateCategory: (updatedCategory: ExpenditureStatementCategory) => void;
    editable?: boolean;
}

const ExpenditureCategoryTable = (props: {
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

    const ExpenditureStatementTable = TypedTable<ExpenditureStatementRow>();

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
