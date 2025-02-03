/* eslint-disable mocha/no-skipped-tests */
const { expect } = require('chai');
require('chai-as-promised');
const { describe, it, before } = require('mocha');
const { getEmailsFromServer } = require('../../../../src/API/support/mailosaur/pollMailosaurInbox');

describe('packages/test-framework - API/support/mailosaur/pollMailosaurInbox', () => {
    let emailAddress;

    before(function () {
        emailAddress = process.env.MAILOSAUR_TEST_EMAIL_ADDRESS;

        if (emailAddress === undefined) {
            this.skip('MAILOSAUR_TEST_EMAIL_ADDRESS was not defined, ignoring email tests');
        }
    });

    beforeEach(() => {
        emailAddress = process.env.MAILOSAUR_TEST_EMAIL_ADDRESS;
    });

    describe('getEmailsFromServer', () => {
        it('connects to the mailosaur instance', async () => {
            await expect(getEmailsFromServer(emailAddress)).to.eventually.be.fulfilled;
        });
    });
});
