import { expect } from 'chai';
import { getLowerBoundary, getUpperBoundary, getUpperAndLowerBoundaries } from '../../../src/helpers/minMaxBoundaries';

describe('getLowerBoundary tests', () => {
    it('should return the lower boundary of 10 when the value is 2', () => {
        // given
        const value = 2;
        const lowerBoundary = 10;

        // when
        const result = getLowerBoundary(value, lowerBoundary);

        // then
        expect(result).to.eql(lowerBoundary);
    });

    it('should return the lower boundary of 100 when the value is 0', () => {
        // given
        const value = 0;
        const lowerBoundary = 100;

        // when
        const result = getLowerBoundary(value, lowerBoundary);

        // then
        expect(result).to.eql(lowerBoundary);
    });

    it('should return the lower boundary of 15 when the value is -20', () => {
        // given
        const value = -20;
        const lowerBoundary = 15;

        // when
        const result = getLowerBoundary(value, lowerBoundary);

        // then
        expect(result).to.eql(lowerBoundary);
    });
});

describe('getUpperBoundary tests', () => {
    it('should return the upper boundary of 10 when the value is 20', () => {
        // given
        const value = 20;
        const upperBoundary = 10;

        // when
        const result = getUpperBoundary(value, upperBoundary);

        // then
        expect(result).to.eql(upperBoundary);
    });

    it('should return the upper boundary of 0 when the value is 1000', () => {
        // given
        const value = 1000;
        const upperBoundary = 0;

        // when
        const result = getUpperBoundary(value, upperBoundary);

        // then
        expect(result).to.eql(upperBoundary);
    });

    it('should return the upper boundary of 0 when the value is 0', () => {
        // given
        const value = 0;
        const upperBoundary = 0;

        // when
        const result = getUpperBoundary(value, upperBoundary);

        // then
        expect(result).to.eql(upperBoundary);
    });
});

describe('getUpperAndLowerBoundaries tests', () => {
    it('should return the upper boundary of 10 when the value is 20 and the lower boundary is 0', () => {
        // given
        const lowerBoundary = 0;
        const value = 20;
        const upperBoundary = 10;

        // when
        const result = getUpperAndLowerBoundaries(value, lowerBoundary, upperBoundary);

        // then
        expect(result).to.eql(upperBoundary);
    });

    it('should return the lower boundary of 15 when the value is -240 and the upper boundary is 300', () => {
        // given
        const lowerBoundary = 15;
        const value = -240;
        const upperBoundary = 300;

        // when
        const result = getUpperAndLowerBoundaries(value, lowerBoundary, upperBoundary);

        // then
        expect(result).to.eql(lowerBoundary);
    });

    it('should return the same value if the upper and lower boundary are the same as the value', () => {
        // given
        const lowerBoundary = 15;
        const value = 15;
        const upperBoundary = 15;

        // when
        const result = getUpperAndLowerBoundaries(value, lowerBoundary, upperBoundary);

        // then
        expect(result).to.eql(value);
    });

    it('should throw if the lower boundary is larger than the upper boundary', () => {
        // given
        const lowerBoundary = 100;
        const value = 20;
        const upperBoundary = 10;

        // when
        const fn = () => getUpperAndLowerBoundaries(value, lowerBoundary, upperBoundary);

        // then
        expect(fn).to.throw('Lower boundary must not be greater than upper boundary');
    });
});
