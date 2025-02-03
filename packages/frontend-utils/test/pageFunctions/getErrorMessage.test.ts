import { errorFormat } from '@ukri-tfs/validation';
import { expect } from 'chai';
import { getErrorMessage } from '../../src/pageFunctions/getErrorMessage';

describe('getErrorMessage', () => {
    it('should return the specified error message from a list of errorFormats', () => {
        const errorList = [
            {
                fieldName: 'name',
                message: 'You must enter an organisation name',
                summary: 'Organisation name not entered',
            },
            {
                fieldName: 'city',
                message: 'You must enter the city where the organisation is based',
                summary: 'Organisation city name not entered',
            },
            {
                fieldName: 'country',
                message: 'You must enter the country where the organisation is based.',
                summary: 'Organisation country name not entered',
            },
        ];
        expect(getErrorMessage(errorList, 'name')).to.deep.equal(['You must enter an organisation name']);
    });
    it('should return a differently specified error message from a list of errorFormats', () => {
        const errorList = [
            {
                fieldName: 'a',
                message: 'b',
                summary: 'c',
            },
            {
                fieldName: 'd',
                message: 'e',
                summary: 'f',
            },
        ];
        expect(getErrorMessage(errorList, 'd')).to.deep.equal(['e']);
    });
    it('should return an empty list when the provided error list is empty', () => {
        const errorList: errorFormat[] = [];
        expect(getErrorMessage(errorList, 'fieldName')).to.deep.equal([]);
    });
});
