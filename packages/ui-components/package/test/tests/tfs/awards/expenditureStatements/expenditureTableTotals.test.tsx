import { render, screen } from '@testing-library/react';
import React from 'react';
import { expect } from 'chai';
import { ExpenditureTableTotals, ExpenditureStatementTotals } from '../../../../../src';

const totalValues: ExpenditureStatementTotals = {
    totalfecAmount: 100,
    totalAwardValue: 2000,
    totalPaidToDate: 10,
    totalAmountSpent: 450,
    totalAwardSpent: 105,
};

describe('ExpenditureTableTotals', () => {
    it('should render ExpenditureTableTotals labels', () => {
        render(<ExpenditureTableTotals totalValues={totalValues} editMode={true} />);

        const awardValueLabel = screen.getByText(/Award value/);
        const paidToDateLabel = screen.getByText(/Paid to date/);
        const fecExpenditureLabel = screen.getByText(/fEC Expenditure/);
        const awardExpenditureLabel = screen.getByText(/Award expenditure/);
        const balanceLabel = screen.getByText(/Balance/);

        expect(awardValueLabel).to.exist;
        expect(paidToDateLabel).to.exist;
        expect(fecExpenditureLabel).to.exist;
        expect(awardExpenditureLabel).to.exist;
        expect(balanceLabel).to.exist;
    });

    it('should render ExpenditureTableTotals with correct totals', () => {
        render(<ExpenditureTableTotals totalValues={totalValues} editMode={true} />);

        const totalAward = screen.queryByTestId('total-award-value');
        const totalPaidToDate = screen.queryByTestId('total-paid-to-date');
        const totalFecPercentage = screen.queryByTestId('total-fec-expenditure');
        const totalAwardExpenditure = screen.queryByTestId('total-award-expenditure');
        const totalBalance = screen.queryByTestId('total-balance');

        expect(totalAward?.textContent).to.be.eq('£2,000.00');
        expect(totalPaidToDate?.textContent).to.be.eq('£10.00');
        expect(totalFecPercentage?.textContent).to.be.eq('£450.00');
        expect(totalAwardExpenditure?.textContent).to.be.eq('£105.00');
        expect(totalBalance?.textContent).to.be.eq('£95.00');
    });

    it('should render select ExpenditureTableTotals with correct js-only class', () => {
        const { container } = render(<ExpenditureTableTotals totalValues={totalValues} editMode={true} />);

        const totalFecPercentage = screen.queryByTestId('parent-total-fec-expenditure');

        expect(totalFecPercentage?.classList.contains('js-only')).to.be.true;
        expect(container.querySelectorAll('.js-only').length).to.eql(3);
    });
});
