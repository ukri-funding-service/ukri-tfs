import { expect } from 'chai';
import 'mocha';
import { OrganisationValidator, OrganisationDetails } from '../../../../../src/tfs/extendedOrgList';

interface TestDataType {
    validatorPartial: Partial<OrganisationDetails>;
    expectedMessage: string;
}

describe('OrganisationValidator tests', () => {
    const validData: OrganisationDetails = {
        name: 'good name',
        city: 'london',
        country: 'uk',
    };

    const negativeTestData: TestDataType[] = [
        {
            validatorPartial: { name: '' },
            expectedMessage: `Enter the organisation’s name`,
        },
        {
            validatorPartial: { name: 'a'.repeat(260) },
            expectedMessage: `Organisation name must be 255 characters or fewer`,
        },
        {
            validatorPartial: { city: '' },
            expectedMessage: 'Enter the organisation’s town or city',
        },
        {
            validatorPartial: { city: 'a'.repeat(260) },
            expectedMessage: `Town or city must be 255 characters or fewer`,
        },
        {
            validatorPartial: { country: '' },
            expectedMessage: 'Enter the organisation’s country',
        },
        {
            validatorPartial: { country: 'a'.repeat(260) },
            expectedMessage: `Country must be 255 characters or fewer`,
        },
        {
            validatorPartial: { webAddress: 'a'.repeat(260) },
            expectedMessage: `Website address must be 255 characters or fewer`,
        },
    ];
    describe('Negative cases', () => {
        negativeTestData.forEach(negativeTest => {
            it(`Negative test for ${negativeTest.expectedMessage}`, () => {
                const model = { ...validData, ...negativeTest.validatorPartial };
                const validator = new OrganisationValidator(model, true);
                expect(validator.isValid()).to.be.false;
                expect(validator.errorList().length).to.eql(1);
                expect(validator.errorList()[0].errorSummary).to.eql(negativeTest.expectedMessage);
            });
        });
    });

    it('Positive case', () => {
        const validator = new OrganisationValidator(validData, true);
        expect(validator.isValid()).to.be.true;
        expect(validator.errorList().length).to.eql(0);
    });
});
