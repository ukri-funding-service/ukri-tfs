import { describe, expect, it } from '@jest/globals';

import {
    required,
    nonZero,
    isTrue,
    isFalse,
    minLength,
    maxLength,
    all,
    collection,
    minRange,
    maxRange,
    maxLengthHtml,
} from '../../src/validators/rules';
import { ValidationResults } from '../../src/validators/validationResults';

describe('Validator rules - Required tests', () => {
    it('should be invalid if input is undefined', () => {
        const rules = new ValidationResults({}, false);
        const validator = required(rules, undefined);
        expect(validator.isValid()).toEqual(false);
    });

    it('should be invalid if input is null', () => {
        const rules = new ValidationResults({}, false);
        const validator = required(rules, null);
        expect(validator.isValid()).toEqual(false);
    });

    it('should be invalid if input is an empty string', () => {
        const rules = new ValidationResults({}, false);
        const validator = required(rules, '');
        expect(validator.isValid()).toEqual(false);
    });

    it('should be invalid if input is an non-empty blank string', () => {
        const rules = new ValidationResults({}, false);
        const validator = required(rules, ' ');
        expect(validator.isValid()).toEqual(false);
    });

    it('should be invalid if input is an empty array', () => {
        const rules = new ValidationResults({}, false);
        const validator = required(rules, []);
        expect(validator.isValid()).toEqual(false);
    });

    it('should be valid if input is an non-empty non-blank string', () => {
        const rules = new ValidationResults({}, false);
        const validator = required(rules, ' x ');
        expect(validator.isValid()).toEqual(true);
    });

    it('should be valid if input is something other than a string', () => {
        const rules = new ValidationResults({}, false);
        const validator = required(rules, 4);
        expect(validator.isValid()).toEqual(true);
    });

    it('should be valid if input is a non-empty array', () => {
        const rules = new ValidationResults({}, false);
        const validator = required(rules, ['x']);
        expect(validator.isValid()).toEqual(true);
    });

    it('should be valid if input is a number', () => {
        const rules = new ValidationResults({}, false);
        const validator = required(rules, 0);
        expect(validator.isValid()).toEqual(true);
    });

    it('should be invalid if input is NaN', () => {
        const rules = new ValidationResults({}, false);
        const validator = required(rules, NaN);
        expect(validator.isValid()).toEqual(false);
    });

    it('should be valid if input is an object', () => {
        const rules = new ValidationResults({}, false);
        const validator = required(rules, {});
        expect(validator.isValid()).toEqual(true);
    });
});

describe('Validator rules - NonZero tests', () => {
    it('should be valid if input is greater than zero', () => {
        const rules = new ValidationResults({}, false);
        const validator = nonZero(rules, 1);
        expect(validator.isValid()).toEqual(true);
    });

    it('should be invalid if input is zero', () => {
        const rules = new ValidationResults({}, false);
        const validator = nonZero(rules, 0);
        expect(validator.isValid()).toEqual(false);
    });

    it('should be invalid if input is less than zero', () => {
        const rules = new ValidationResults({}, false);
        const validator = nonZero(rules, -1);
        expect(validator.isValid()).toEqual(false);
    });

    it('should be invalid if input is undefined', () => {
        const rules = new ValidationResults({}, false);
        const validator = nonZero(rules, undefined);
        expect(validator.isValid()).toEqual(false);
    });

    it('should return correct error message', () => {
        const rules = new ValidationResults({}, false);
        const validator = nonZero(rules, 0, 'non-null error');
        expect(validator.errorMessage).toEqual('non-null error');
    });

    it('should return correct error summary', () => {
        const rules = new ValidationResults({}, false);
        const validator = nonZero(rules, 0, 'non-null error', 'non-null summary');
        expect(validator.errorSummary).toEqual('non-null summary');
    });

    it('should return correct error field', () => {
        const rules = new ValidationResults({}, false);
        const validator = nonZero(rules, 0, 'non-null error', 'non-null summary', 'non-null field');
        expect(validator.fieldName).toEqual('non-null field');
    });
});

describe('Validator rules - Is true tests', () => {
    it('should return true when true', () => {
        const rules = new ValidationResults({}, false);
        const validator = isTrue(rules, true);

        expect(validator.isValid()).toBeTruthy();
    });

    it('should return false when false which contains default error summary and message', () => {
        const rules = new ValidationResults({}, false);
        const validator = isTrue(rules, false);

        expect(validator.isValid()).toBeFalsy();
        expect(validator.errorMessage).toEqual('Should be true');
        expect(validator.errorSummary).toEqual('Should be true');
    });

    it('should return false when null', () => {
        const rules = new ValidationResults({}, false);
        const validator = isTrue(rules, null);

        expect(validator.isValid()).toBeFalsy();
    });

    it('should return false when undefined', () => {
        const rules = new ValidationResults({}, false);
        const validator = isTrue(rules, undefined);

        expect(validator.isValid()).toBeFalsy();
    });
});

describe('Validator rules - Is false tests', () => {
    it('should return true when false', () => {
        const rules = new ValidationResults({}, false);
        const validator = isFalse(rules, false);

        expect(validator.isValid()).toBeTruthy();
    });

    it('should return false when true which contains default error summary and message', () => {
        const rules = new ValidationResults({}, false);
        const validator = isFalse(rules, true);

        expect(validator.isValid()).toBeFalsy();
        expect(validator.errorMessage).toEqual('Should be false');
        expect(validator.errorSummary).toEqual('Should be false');
    });

    it('should return true when null', () => {
        const rules = new ValidationResults({}, false);
        const validator = isFalse(rules, null);

        expect(validator.isValid()).toBeTruthy();
    });

    it('should return true when undefined', () => {
        const rules = new ValidationResults({}, false);
        const validator = isFalse(rules, undefined);

        expect(validator.isValid()).toBeTruthy();
    });
});

describe('Validator rules - Minimum length tests', () => {
    it('should return true when string greater than min length', () => {
        const rules = new ValidationResults({}, false);
        const validator = minLength(rules, 'ab', 1);

        expect(validator.isValid()).toBeTruthy();
    });

    it('should return true when string equal to min length', () => {
        const rules = new ValidationResults({}, false);
        const validator = minLength(rules, 'a', 1);

        expect(validator.isValid()).toBeTruthy();
    });

    it('should return true when empty spaces equal to min length', () => {
        const rules = new ValidationResults({}, false);
        const validator = minLength(rules, ' ', 1);

        expect(validator.isValid()).toBeTruthy();
    });

    it('should return false when empty string which contains default error summary and message', () => {
        const rules = new ValidationResults({}, false);
        const validator = minLength(rules, '', 1);

        expect(validator.isValid()).toBeFalsy();
        expect(validator.errorMessage).toEqual('Minimum of 1 characters');
        expect(validator.errorSummary).toEqual('Minimum characters not met');
    });
});

describe('Validator rules - Maximum length tests', () => {
    it('should return true when string less than max length', () => {
        const rules = new ValidationResults({}, false);
        const validator = maxLength(rules, 'a', 2);

        expect(validator.isValid()).toBeTruthy();
    });

    it('should return true when string equal to max length', () => {
        const rules = new ValidationResults({}, false);
        const validator = maxLength(rules, 'a', 1);

        expect(validator.isValid()).toBeTruthy();
    });

    it('should return true when empty spaces equal to max length', () => {
        const rules = new ValidationResults({}, false);
        const validator = maxLength(rules, ' ', 1);

        expect(validator.isValid()).toBeTruthy();
    });

    it('should return true when empty string', () => {
        const rules = new ValidationResults({}, false);
        const validator = maxLength(rules, '', 0);

        expect(validator.isValid()).toBeTruthy();
    });

    it('should return false when string exceed maximum length', () => {
        const rules = new ValidationResults({}, false);
        const validator = maxLength(rules, 'a', 0);

        expect(validator.isValid()).toBeFalsy();
        expect(validator.errorMessage).toEqual('Maximum of 0 characters');
        expect(validator.errorSummary).toEqual('Maximum characters exceeded');
    });
});

describe('Validator rules - Maximum length HTML tests', () => {
    it('should return true when string less than max length', () => {
        const rules = new ValidationResults({}, false);
        const validator = maxLengthHtml(rules, '<p>a</p>', 2);

        expect(validator.isValid()).toBeTruthy();
    });

    it('should return true when string equal to max length', () => {
        const rules = new ValidationResults({}, false);
        const validator = maxLengthHtml(rules, '<p>a</p>', 1);

        expect(validator.isValid()).toBeTruthy();
    });

    it('should return true when empty spaces equal to max length', () => {
        const rules = new ValidationResults({}, false);
        const validator = maxLengthHtml(rules, '<p> </p>', 1);

        expect(validator.isValid()).toBeTruthy();
    });

    it('should return true when empty string', () => {
        const rules = new ValidationResults({}, false);
        const validator = maxLengthHtml(rules, '', 0);

        expect(validator.isValid()).toBeTruthy();
    });

    it('should return false when string exceed maximum length', () => {
        const rules = new ValidationResults({}, false);
        const validator = maxLengthHtml(rules, '<p>a</p>', 0);

        expect(validator.isValid()).toBeFalsy();
        expect(validator.errorMessage).toEqual('Maximum of 0 characters');
        expect(validator.errorSummary).toEqual('Maximum characters exceeded');
    });

    it('should return true with html entities', () => {
        const rules = new ValidationResults({}, false);
        const validator = maxLengthHtml(rules, '<p>&lt;</p>', 1);

        expect(validator.isValid()).toBeTruthy();
    });

    it('should return true with exactly 700 characters', () => {
        const validString =
            '<p class="govuk-body"><strong>Provide a summary which will be emailed to potential reviewers inviting them to assess your application. Tailor it for reviewers who may also be experts in your field. Use simple language so a lay person could also understand its strengths. Write a clear overview of the scope, including your vision; objectives; areas of focus; why it&rsquo;s important and why it will succeed.</strong></p>\r\n' +
            '<p class="govuk-body"><strong>Provide a summary which will be emailed to potential reviewers inviting them to assess your application. Tailor it for reviewers who may also be experts in your field. Use simple language so a lay person could also understand its strengths. Write a clear overview of the scope, including your vision; objectives; areas of focu</strong></p>';

        const rules = new ValidationResults({}, false);
        const validator = maxLengthHtml(rules, validString, 700);

        expect(validator.isValid()).toBeTruthy();
    });

    it('should return false when more than 700 characters', () => {
        const invalidString =
            '<p class="govuk-body"><strong>Provide a summary which will be emailed to potential reviewers inviting them to assess your application. Tailor it for reviewers who may also be experts in your field. Use simple language so a lay person could also understand its strengths. Write a clear overview of the scope, including your vision; objectives; areas of focus; why it&rsquo;s important and why it will succeed.</strong></p>\r\n' +
            '<p class="govuk-body"><strong>Provide a summary which will be emailed to potential reviewers inviting them to assess your application. Tailor it for reviewers who may also be experts in your field. Use simple language so a lay person could also understand its strengths. Write a clear overview of the scope, including your vision; objectives; areas of focus;</strong></p>';

        const rules = new ValidationResults({}, false);
        const validator = maxLengthHtml(rules, invalidString, 700);

        expect(validator.isValid()).toBeFalsy();
        expect(validator.errorMessage).toEqual('Maximum of 700 characters');
        expect(validator.errorSummary).toEqual('Maximum characters exceeded');
    });
});

describe('Validator rules - Minimum range tests', () => {
    it('should return true when number greater than min range', () => {
        const rules = new ValidationResults({}, false);
        const validator = minRange(rules, 5, 4);

        expect(validator.isValid()).toBeTruthy();
    });

    it('should return true when number equal to min range', () => {
        const rules = new ValidationResults({}, false);
        const validator = minRange(rules, 5, 5);

        expect(validator.isValid()).toBeTruthy();
    });

    it('should return false when number less than min range', () => {
        const rules = new ValidationResults({}, false);
        const validator = minRange(rules, 4, 5);

        expect(validator.isValid()).toBeFalsy();
        expect(validator.errorMessage).toEqual('Minimum of 5');
        expect(validator.errorSummary).toEqual('Minimum value not met');
    });
});

describe('Validator rules - Maximum range tests', () => {
    it('should return true when number greater than max range', () => {
        const rules = new ValidationResults({}, false);
        const validator = maxRange(rules, 5, 10);

        expect(validator.isValid()).toBeTruthy();
    });

    it('should return true when number equal to max range', () => {
        const rules = new ValidationResults({}, false);
        const validator = maxRange(rules, 5, 5);

        expect(validator.isValid()).toBeTruthy();
    });

    it('should return false when number less than max range', () => {
        const rules = new ValidationResults({}, false);
        const validator = maxRange(rules, 10, 5);

        expect(validator.isValid()).toBeFalsy();
        expect(validator.errorMessage).toEqual('Maximum of 5');
        expect(validator.errorSummary).toEqual('Maximum value exceeded');
    });
});

describe('Validator rules - all tests', () => {
    it('should return true when all results are true', () => {
        const rules = new ValidationResults({}, false);
        const falseValidator = isFalse(rules, false);
        const trueValidator = isTrue(rules, true);

        expect(
            all(
                rules,
                () => falseValidator,
                () => trueValidator,
            ).isValid(),
        ).toBeTruthy();
    });

    it('should return false when any of the results are false', () => {
        const rules = new ValidationResults({}, false);
        const falseValidator = isFalse(rules, false);
        const trueValidator = isTrue(rules, false);

        expect(
            all(
                rules,
                () => falseValidator,
                () => trueValidator,
            ).isValid(),
        ).toBeFalsy();
    });

    it('should contain the error message of the first failing validation check when any of the results are false', () => {
        const rules = new ValidationResults({}, false);
        const falseValidator = isFalse(rules, false, 'Should pass message', 'Should pass summary', 'field1');
        const trueValidator = isTrue(rules, false, 'Should fail message', 'Should fail summary', 'field1');

        expect(
            all(
                rules,
                () => falseValidator,
                () => trueValidator,
            ).errorMessage,
        ).toEqual('Should fail message');
    });

    it('should contain the error summary of the first failing validation check when any of the results are false', () => {
        const rules = new ValidationResults({}, false);
        const falseValidator = isFalse(rules, false, 'Should pass message', 'Should pass summary', 'field1');
        const trueValidator = isTrue(rules, false, 'Should fail message', 'Should fail summary', 'field1');

        expect(
            all(
                rules,
                () => falseValidator,
                () => trueValidator,
            ).errorSummary,
        ).toEqual('Should fail summary');
    });
});

describe('Validatator rules - collection tests', () => {
    it('should be valid if no validators are passed in', () => {
        const validatorOne = new ValidationResults({}, false);
        collection(validatorOne, []);
        expect(validatorOne.isValid()).toEqual(true);
    });

    it('should be valid if two valid validators are passed in', () => {
        const validatorOne = new ValidationResults({}, false);
        const validatorTwo = new ValidationResults({}, false);
        const validatorThree = new ValidationResults({}, false);
        collection(validatorOne, [validatorTwo, validatorThree]);
        expect(validatorOne.isValid()).toBeTruthy();
    });

    it('should be invalid if one of two validators passed in are invalid', () => {
        class FailingValidator extends ValidationResults<{}> {
            falseValidator = isTrue(this, false, 'Should fail message', 'Should fail summary', 'field1');
        }
        const validator = new ValidationResults({}, false);
        const trueValidator = new ValidationResults({}, false);
        const falseValidator = new FailingValidator({}, false);
        collection(validator, [falseValidator, trueValidator]);
        expect(validator.isValid()).toBeFalsy();
    });

    it('should be invalid if two of two validators passed in are invalid', () => {
        class FailingValidator extends ValidationResults<{}> {
            falseValidator = isTrue(this, false, 'Should fail message', 'Should fail summary', 'field1');
        }
        const validator = new ValidationResults({}, false);
        const falseValidator = new FailingValidator({}, false);
        const anotherFalseValidator = new FailingValidator({}, false);
        collection(validator, [falseValidator, anotherFalseValidator]);
        expect(validator.isValid()).toBeFalsy();
    });
});
