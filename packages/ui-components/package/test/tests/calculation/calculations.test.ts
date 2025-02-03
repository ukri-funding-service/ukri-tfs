import 'mocha';
import { expect } from 'chai';
import { calculatePercentage } from '../../../src/calculation';

describe('calculations', () => {
    describe('calculatePercentage', () => {
        const expenditureStatementRows: Partial<{ percentage: number; value: number; result: number }>[] = [
            {
                percentage: 100,
                value: 100,
                result: 100,
            },
            {
                percentage: 50,
                value: 75,
                result: 37.5,
            },
            {
                percentage: 33.33,
                value: 1000,
                result: 333.3,
            },
            {
                percentage: 0,
                value: 90,
                result: 0,
            },
            {
                percentage: 25,
                value: -25,
                result: -6.25,
            },
            {
                percentage: -50,
                value: 25,
                result: -12.5,
            },
        ];

        expenditureStatementRows.forEach(expenditureStatementRow => {
            it('should calculate award expenditure from fund heading fec percentage and amount spent', () => {
                const result = calculatePercentage(expenditureStatementRow.percentage!, expenditureStatementRow.value!);

                expect(result).to.be.eq(expenditureStatementRow.result!);
            });
        });

        [null, 0].forEach(value => {
            it('should return 0 if amount spent is falsy', () => {
                const result = calculatePercentage(100, value);

                expect(result).to.be.eq(0);
            });
        });
    });
});
