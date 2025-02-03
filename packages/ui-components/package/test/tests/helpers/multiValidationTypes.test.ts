import { expect } from 'chai';
import {
    validResult,
    validErrorMessage,
    validErrorSummary,
    invalidErrorMessage,
    invalidErrorSummary,
    invalidResult,
} from '../factories/ValidationResult';
import { multiValidationTypes } from '../../../src/helpers/multiValidationTypes';

describe('Multi Validation Type tests', () => {
    it('Should be valid only with valid validation result', () => {
        const response = multiValidationTypes({ validationResult: validResult });
        expect(response.isValid).to.equal(true);
        expect(response.errorMessages).to.equal(validErrorMessage);
        expect(response.errorSummary).to.equal(validErrorSummary);
        expect(response.showError).to.equal(true);
    });

    it('Should not be valid only with valid validation result', () => {
        const response = multiValidationTypes({ validationResult: invalidResult });
        expect(response.isValid).to.equal(false);
        expect(response.errorMessages).to.equal(invalidErrorMessage);
        expect(response.errorSummary).to.equal(invalidErrorSummary);
        expect(response.showError).to.equal(true);
    });

    it('Should be valid only with explicit isError', () => {
        const response = multiValidationTypes({ isError: true });
        expect(response.isValid).to.equal(false);
        expect(response.errorMessages).to.be.null;
        expect(response.errorSummary).to.be.null;
        expect(response.showError).to.equal(true);
    });

    it('Should be not valid only with explicit isError', () => {
        const response = multiValidationTypes({ isError: false });
        expect(response.isValid).to.equal(true);
        expect(response.errorMessages).to.be.null;
        expect(response.errorSummary).to.be.null;
        expect(response.showError).to.equal(true);
    });

    it('Should be valid only with error messages', () => {
        const errorMessages = ['errormessage'];
        const response = multiValidationTypes({ errorMessages: errorMessages });
        expect(response.isValid).to.equal(false);
        expect(response.errorMessages).to.equal(errorMessages);
        expect(response.errorSummary).to.be.null;
        expect(response.showError).to.equal(true);
    });

    it('Should be valid without error messages', () => {
        const response = multiValidationTypes({ errorMessages: [] });
        expect(response.isValid, 'Valid').to.equal(true);
        expect(response.errorMessages).to.be.null;
        expect(response.errorSummary).to.be.null;
        expect(response.showError, 'show Error').to.equal(true);
    });

    it('Should be invalid with generic error messages', () => {
        interface customError {
            message: string;
            summary: string;
        }

        const errorMessages: customError = { message: 'Invalid', summary: 'Please try again' };
        const response = multiValidationTypes<customError>({ errorMessages: errorMessages });
        expect(response.isValid, 'Valid').to.equal(false);
        expect(response.errorMessages).to.equal(errorMessages);
        expect(response.errorSummary).to.be.null;
        expect(response.showError, 'show Error').to.equal(true);
    });

    it('Should be invalid with generic array of error messages', () => {
        interface customError {
            message: string;
            summary: string;
        }

        const errorMessages: customError[] = [{ message: 'Invalid', summary: 'Please try again' }];
        const response = multiValidationTypes<customError[]>({ errorMessages: errorMessages });
        expect(response.isValid, 'Valid').to.equal(false);
        expect(response.errorMessages).to.equal(errorMessages);
        expect(response.errorSummary).to.be.null;
        expect(response.showError, 'show Error').to.equal(true);
    });
});
