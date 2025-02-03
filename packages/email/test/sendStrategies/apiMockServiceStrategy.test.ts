import { expect } from 'chai';
import { ApiMockEmailServiceOptions, ApiMockServiceStrategy, Email } from '../../src';

describe('api mock service strategy', () => {
    it('should convert a generic email type with minimal mandatory options into a simple email type for the api mock', () => {
        // given
        const genericEmail: Email = {
            toAddresses: ['foo@bar.com'],
            subject: 'Test Subject',
            html: '<html></html>',
            text: 'Test email content',
            sourceDisplayName: 'Display Name',
            sourceEmail: 'source@email.com',
        };

        const fakeTransporterOptions: ApiMockEmailServiceOptions = {
            url: '',
        };
        const apiMockServiceStrategy = new ApiMockServiceStrategy(fakeTransporterOptions);

        // when
        const nodemailerEmail = apiMockServiceStrategy.convertEmailToStrategySpecificEmail(genericEmail);

        // then
        expect(nodemailerEmail.to).to.deep.equal(['foo@bar.com']);
        expect(nodemailerEmail.subject).to.equal('Test Subject');
        expect(nodemailerEmail.htmlContent).to.equal('<html></html>');
        expect(nodemailerEmail.textContent).to.equal('Test email content');
        expect(nodemailerEmail.from).to.equal('Display Name <source@email.com>');
    });

    it('should convert a generic email type with additional options into a simple email type for the api mock', () => {
        // given
        const genericEmail: Email = {
            toAddresses: ['foo@bar.com'],
            subject: 'Test Subject',
            html: '<html></html>',
            text: 'Test email content',
            sourceDisplayName: 'Display Name',
            sourceEmail: 'source@email.com',
            bccAddresses: ['a@b.com'],
            ccAddresses: ['c@d.com'],
            replyToAddresses: ['e@f.com'],
        };

        const fakeTransporterOptions: ApiMockEmailServiceOptions = {
            url: '',
        };
        const apiMockServiceStrategy = new ApiMockServiceStrategy(fakeTransporterOptions);

        // when
        const nodemailerEmail = apiMockServiceStrategy.convertEmailToStrategySpecificEmail(genericEmail);

        // then
        expect(nodemailerEmail.to).to.deep.equal(['foo@bar.com']);
        expect(nodemailerEmail.subject).to.equal('Test Subject');
        expect(nodemailerEmail.htmlContent).to.equal('<html></html>');
        expect(nodemailerEmail.textContent).to.equal('Test email content');
        expect(nodemailerEmail.from).to.equal('Display Name <source@email.com>');
        expect(nodemailerEmail.cc).to.deep.equal(['c@d.com']);
        expect(nodemailerEmail.bcc).to.deep.equal(['a@b.com']);
        expect(nodemailerEmail.replyTo).to.deep.equal(['e@f.com']);
    });
});
