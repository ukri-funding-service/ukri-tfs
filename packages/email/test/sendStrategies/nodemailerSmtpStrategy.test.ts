import { NodemailerSmtpSendStrategy, Email, NodemailerSmtpOptions } from '../../src';
import { expect } from 'chai';

describe('NodemailerSmtpSendStrategy Tests', () => {
    it('should convert a generic email type with minimal mandatory options into a nodemailer email type', () => {
        // given
        const genericEmail: Email = {
            toAddresses: ['foo@bar.com'],
            subject: 'Test Subject',
            html: '<html></html>',
            text: 'Test email content',
            sourceDisplayName: 'Display Name',
            sourceEmail: 'source@email.com',
        };

        const fakeTransporterOptions: NodemailerSmtpOptions = {
            host: '',
            port: 0,
            secure: false,
            auth: { user: '', pass: '' },
        };
        const nodemailerSmtpStrategy = new NodemailerSmtpSendStrategy(fakeTransporterOptions);

        // when
        const nodemailerEmail = nodemailerSmtpStrategy.convertEmailToStrategySpecificEmail(genericEmail);

        // then
        expect(nodemailerEmail.to).to.equal('foo@bar.com');
        expect(nodemailerEmail.subject).to.equal('Test Subject');
        expect(nodemailerEmail.html).to.equal('<html></html>');
        expect(nodemailerEmail.text).to.equal('Test email content');
        expect(nodemailerEmail.from).to.equal('Display Name <source@email.com>');
    });

    it('should convert a generic email type with multiple mandatory options into a nodemailer email type', () => {
        // given
        const genericEmail: Email = {
            toAddresses: ['foo@bar.com', 'bark@fido.com'],
            subject: 'Test Subject',
            html: '<html></html>',
            text: 'Test email content',
            sourceDisplayName: 'Display Name',
            sourceEmail: 'source@email.com',
        };

        const fakeTransporterOptions: NodemailerSmtpOptions = {
            host: '',
            port: 0,
            secure: false,
            auth: { user: '', pass: '' },
        };
        const nodemailerSmtpStrategy = new NodemailerSmtpSendStrategy(fakeTransporterOptions);

        // when
        const nodemailerEmail = nodemailerSmtpStrategy.convertEmailToStrategySpecificEmail(genericEmail);

        // then
        expect(nodemailerEmail.to).to.equal('foo@bar.com, bark@fido.com');
        expect(nodemailerEmail.subject).to.equal('Test Subject');
        expect(nodemailerEmail.html).to.equal('<html></html>');
        expect(nodemailerEmail.text).to.equal('Test email content');
        expect(nodemailerEmail.from).to.equal('Display Name <source@email.com>');
    });

    it('should convert a generic email type with multiple mandatory and optional options into a nodemailer email type', () => {
        // given
        const genericEmail: Email = {
            toAddresses: ['foo@bar.com', 'bark@fido.com'],
            ccAddresses: ['another@addr.com', 'and@another.com'],
            bccAddresses: ['blind@bcc.com', 'another@bcc.com', 'last@one.com'],
            replyToAddresses: ['reply@to.me', 'or@to.me'],
            subject: 'Test Subject',
            html: '<html></html>',
            text: 'Test email content',
            sourceDisplayName: 'Display Name',
            sourceEmail: 'source@email.com',
        };

        const fakeTransporterOptions: NodemailerSmtpOptions = {
            host: '',
            port: 0,
            secure: false,
            auth: { user: '', pass: '' },
        };
        const nodemailerSmtpStrategy = new NodemailerSmtpSendStrategy(fakeTransporterOptions);

        // when
        const nodemailerEmail = nodemailerSmtpStrategy.convertEmailToStrategySpecificEmail(genericEmail);

        // then
        expect(nodemailerEmail.to).to.equal('foo@bar.com, bark@fido.com');
        expect(nodemailerEmail.cc).to.equal('another@addr.com, and@another.com');
        expect(nodemailerEmail.bcc).to.equal('blind@bcc.com, another@bcc.com, last@one.com');
        expect(nodemailerEmail.subject).to.equal('Test Subject');
        expect(nodemailerEmail.html).to.equal('<html></html>');
        expect(nodemailerEmail.text).to.equal('Test email content');
        expect(nodemailerEmail.from).to.equal('Display Name <source@email.com>');
        expect(nodemailerEmail.replyTo).to.equal('reply@to.me, or@to.me');
    });
});
