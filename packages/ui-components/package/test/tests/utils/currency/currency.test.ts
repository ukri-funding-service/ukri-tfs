import 'mocha';
import { expect } from 'chai';
import {
    displayCurrency,
    displayCurrencyWithoutDecimals,
    displayCurrencyWithOptionalDecimals,
    displayCurrencyWithDecimals,
} from '../../../../src';

describe('currency', () => {
    it('displayCurrencyWithoutDecimals', () => {
        expect(displayCurrencyWithoutDecimals(102)).to.be.eq('102');
        expect(displayCurrencyWithoutDecimals(0)).to.be.eq('0');
        expect(displayCurrencyWithoutDecimals(-12)).to.be.eq('-12');
        expect(displayCurrencyWithoutDecimals(2000.95)).to.be.eq('2,001');
        expect(displayCurrencyWithoutDecimals(2000.95, true)).to.be.eq('£2,001');
    });

    it('displayCurrencyWithOptionalDecimals', () => {
        expect(displayCurrencyWithOptionalDecimals(102)).to.be.eq('102');
        expect(displayCurrencyWithOptionalDecimals(0)).to.be.eq('0');
        expect(displayCurrencyWithOptionalDecimals(-12)).to.be.eq('-12');
        expect(displayCurrencyWithOptionalDecimals(2000.95)).to.be.eq('2,000.95');
        expect(displayCurrencyWithOptionalDecimals(2000.95, true)).to.be.eq('£2,000.95');
    });

    it('displayCurrencyWithDecimals', () => {
        expect(displayCurrencyWithDecimals(102)).to.be.eq('102.00');
        expect(displayCurrencyWithDecimals(0)).to.be.eq('0.00');
        expect(displayCurrencyWithDecimals(-12)).to.be.eq('-12.00');
        expect(displayCurrencyWithDecimals(2000.95)).to.be.eq('2,000.95');
        expect(displayCurrencyWithDecimals(2000.956)).to.be.eq('2,000.96');
        expect(displayCurrencyWithDecimals(2000.956, false, 3)).to.be.eq('2,000.956');
        expect(displayCurrencyWithDecimals(2000.95, true, 2)).to.be.eq('£2,000.95');
    });

    it('displayCurrency', () => {
        expect(displayCurrency(102)).to.be.eq('102.00');
        expect(displayCurrency(100)).to.be.eq('100.00');
        expect(displayCurrency(0)).to.be.eq('0.00');
        expect(displayCurrency(90)).to.be.eq('90.00');
        expect(displayCurrency(-12)).to.be.eq('-12.00');
        expect(displayCurrency(-912)).to.be.eq('-912.00');
        expect(displayCurrency(10.1)).to.be.eq('10.10');
        expect(displayCurrency(11.05)).to.be.eq('11.05');
        expect(displayCurrency(2000.95)).to.be.eq('2,000.95');
        expect(displayCurrency(10000.95)).to.be.eq('10,000.95');
        expect(displayCurrency(200000000.01)).to.be.eq('200,000,000.01');
    });
});
