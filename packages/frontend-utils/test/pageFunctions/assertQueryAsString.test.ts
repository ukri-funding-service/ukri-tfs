import { expect } from 'chai';
import { assertQueryAsString } from '../../src/pageFunctions/assertQueryAsString';

describe('assertQueryAsString', () => {
    it('should throw error when provided array', () => {
        const anArray = ['abc', 'def'];
        expect(() => assertQueryAsString(anArray)).to.throw('Passed query value is not a string');
    });

    it('should return query as string', () => {
        const string = 'A string';
        const util = assertQueryAsString(string);
        expect(typeof util).to.equal('string');
    });
});
