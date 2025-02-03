import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { expenditureStatementFundHeadingBuilder } from './expenditureStatementFundHeadingBuilder';
import { expenditureStatementBuilder } from './expenditureStatementBuilder';
import { expect } from 'chai';
import { ExpenditureTableForm } from '../../../../../src';

const da1 = expenditureStatementFundHeadingBuilder({
    id: 1,
    category: 'Directly allocated',
    subcategory: 'Staff',
    paidToDate: 300,
    fecAmount: 2000,
    fecPercentage: 50,
    amountSpent: 100,
});

const da2 = expenditureStatementFundHeadingBuilder({
    id: 2,
    category: 'Directly allocated',
    paidToDate: 400,
    fecAmount: 2000,
    fecPercentage: 50,
    amountSpent: 150,
});

const di = expenditureStatementFundHeadingBuilder({
    id: 3,
    category: 'Directly incurred',
    paidToDate: 500,
    fecAmount: 2000,
    fecPercentage: 50,
    amountSpent: 200,
});

const expenditureStatement = expenditureStatementBuilder({
    id: 1,
    issuedAt: '9/9/2022 13:00Z',
    type: 'Final',
    status: 'Draft',
    fundHeadings: [da1, da2, di],
});

const transferExpenditureStatement = expenditureStatementBuilder({
    id: 1,
    issuedAt: '9/9/2022 13:00Z',
    type: 'Transfer',
    status: 'Draft',
    fundHeadings: [da1, da2, di],
});

describe('ExpenditureTableForm', () => {
    it('should render ExpenditureTableForm with correct category headings', () => {
        const { container } = render(
            <ExpenditureTableForm expenditureStatement={expenditureStatement} errorMessages={[]} />,
        );
        screen.getByRole('heading', {
            name: /Directly allocated/,
            level: 2,
        });
        screen.getByRole('heading', {
            name: /Directly incurred/,
            level: 2,
        });

        const categoryTables = container.querySelector('#expenditureCategoryTables-wrapper');

        expect(categoryTables).not.to.be.null;
    });

    it('should render ExpenditureTableForm with correct subtitle for final expenditure statement', () => {
        const { container } = render(
            <ExpenditureTableForm expenditureStatement={expenditureStatement} errorMessages={[]} />,
        );
        const subtitle = container.querySelector('h2');

        expect(subtitle?.textContent).to.contains('Final');
    });

    it('should render ExpenditureTableForm with correct subtitle for transfer expenditure statement', () => {
        const { container } = render(
            <ExpenditureTableForm expenditureStatement={transferExpenditureStatement} errorMessages={[]} />,
        );
        const subtitle = container.querySelector('h2');

        expect(subtitle?.textContent).to.contains('Transfer');
    });

    it('should render ExpenditureTableForm with correct totals', () => {
        render(<ExpenditureTableForm expenditureStatement={expenditureStatement} errorMessages={[]} />);
        const totalAward = screen.queryByTestId('total-award-value');
        expect(totalAward?.textContent).to.be.eq('£3,000.00');

        const totalPaidToDate = screen.queryByTestId('total-paid-to-date');
        expect(totalPaidToDate?.textContent).to.be.eq('£1,200.00');

        const totalFecPercentage = screen.queryByTestId('total-fec-expenditure');
        expect(totalFecPercentage?.textContent).to.be.eq('£450.00');

        const totalAwardExpenditure = screen.queryByTestId('total-award-expenditure');
        expect(totalAwardExpenditure?.textContent).to.be.eq('£225.00');

        const totalBalance = screen.queryByTestId('total-balance');
        expect(totalBalance?.textContent).to.be.eq('-£975.00');
    });

    it('should update award expenditure and balance when amount spent is changed', async () => {
        const component = render(
            <ExpenditureTableForm expenditureStatement={expenditureStatement} editable={true} errorMessages={[]} />,
        );

        const amountSpentInput = component.getByTestId('input-1') as HTMLInputElement;
        const awardExpenditure = component.getAllByTestId('award-expenditure')[0];
        const balance = component.getAllByTestId('balance')[0];
        const totalFundHeading = component.getAllByTestId('fund-heading')[2];
        const totalBalance = component.getAllByTestId('balance')[2];

        expect(amountSpentInput.value).to.be.eq('100.00');
        expect(awardExpenditure?.textContent).to.be.eq('50.00');
        expect(balance.textContent).to.be.eq('-250.00');
        expect(totalFundHeading.textContent).to.be.eq('Directly allocated totals');
        expect(totalBalance.textContent).to.be.eq('-575.00');

        fireEvent.change(amountSpentInput, { target: { value: '50.00' } });
        fireEvent.blur(amountSpentInput);

        expect(amountSpentInput.value).to.be.eq('50.00');
        expect(component.getAllByTestId('award-expenditure')[0]?.textContent).to.be.eq('25.00');
        expect(component.getAllByTestId('balance')[0]?.textContent).to.be.eq('-275.00');
        expect(component.getAllByTestId('balance')[2]?.textContent).to.be.eq('-600.00');
    });

    it('should update award expenditure and balance when amount spent is blank', async () => {
        const component = render(
            <ExpenditureTableForm expenditureStatement={expenditureStatement} editable={true} errorMessages={[]} />,
        );

        const amountSpentInput = component.getByTestId('input-1') as HTMLInputElement;

        expect(amountSpentInput.value).to.be.eq('100.00');

        fireEvent.change(amountSpentInput, { target: { value: '' } });
        fireEvent.blur(amountSpentInput);

        expect(amountSpentInput.value).to.be.eq('');
        expect(component.getAllByTestId('award-expenditure')[0]?.textContent).to.be.eq('0.00');
        expect(component.getAllByTestId('balance')[0]?.textContent).to.be.eq('-300.00');
        expect(component.getAllByTestId('balance')[2]?.textContent).to.be.eq('-625.00');
    });

    it('should render ExpenditureTableForm with error messages', () => {
        render(
            <ExpenditureTableForm
                expenditureStatement={expenditureStatement}
                errorMessages={['You must enter a value of at least £0 in all fEC expenditure rows to check values']}
            />,
        );
        screen.getByText('You must enter a value of at least £0 in all fEC expenditure rows to check values');
    });

    it('should render in non-edittable mode without input boxes', () => {
        render(
            <ExpenditureTableForm expenditureStatement={expenditureStatement} editable={false} errorMessages={[]} />,
        );
        const inputBox = screen.queryByTestId('input-1');
        expect(inputBox).to.be.null;
    });

    describe('total costs', () => {
        const total1 = expenditureStatementFundHeadingBuilder({
            id: 4,
            category: 'Total costs',
            paidToDate: 500,
            fecAmount: 2000,
            fecPercentage: 50,
            amountSpent: 200,
        });

        const total2 = expenditureStatementFundHeadingBuilder({
            id: 5,
            category: 'Total costs',
            paidToDate: 300,
            fecAmount: 1000,
            fecPercentage: 60,
            amountSpent: 150,
        });

        const totalCostsStatement = expenditureStatementBuilder({
            id: 1,
            issuedAt: '9/9/2022 13:00Z',
            type: 'Final',
            status: 'Draft',
            fundHeadings: [total1, total2],
        });

        it('should render ExpenditureTableForm with total costs totals', () => {
            const component = render(
                <ExpenditureTableForm expenditureStatement={totalCostsStatement} editable={true} errorMessages={[]} />,
            );
            const totalFundHeading = component.getAllByTestId('fund-heading')[2];

            expect(totalFundHeading.textContent).to.be.eq('Totals');
        });
    });
});
