import { Email } from '../../src';
import { AwsSdkSesOptions, AwsSdkSesSendStrategy } from '../../src/sendStrategies/awsSdkStrategy';
import { expect } from 'chai';
import 'mocha';

describe('AwsSdkSesSendStrategy Tests', () => {
    it('should convert a generic email type with minimal mandatory options into an AwsSdkSesSendStrategy email type', () => {
        // given
        const genericEmail: Email = {
            toAddresses: ['foo@bar.com'],
            subject: 'Test Subject',
            html: '<html></html>',
            text: 'Test email content',
            sourceDisplayName: 'Display Name',
            sourceEmail: 'source@email.com',
        };

        const fakeOptions: AwsSdkSesOptions = { region: '', apiVersion: '' };
        const awsSesStrategy = new AwsSdkSesSendStrategy(fakeOptions);

        // when
        const awsSesEmail = awsSesStrategy.convertEmailToStrategySpecificEmail(genericEmail);

        // then
        expect(awsSesEmail.Destination).to.eql({
            ToAddresses: genericEmail.toAddresses,
        });
        expect(awsSesEmail.Message).to.eql({
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: genericEmail.html,
                },
                Text: {
                    Charset: 'UTF-8',
                    Data: genericEmail.text,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: genericEmail.subject,
            },
        });
        expect(awsSesEmail.Source).to.equal(`${genericEmail.sourceDisplayName} <${genericEmail.sourceEmail}>`);
        expect(awsSesEmail.ReplyToAddresses).to.equal(genericEmail.replyToAddresses);
    });

    it('should convert a generic email type with multiple mandatory options into an AwsSdkSesSendStrategy email type', () => {
        // given
        const genericEmail: Email = {
            toAddresses: ['foo@bar.com', 'bark@fido.com'],
            subject: 'Test Subject',
            html: '<html></html>',
            text: 'Test email content',
            sourceDisplayName: 'Display Name',
            sourceEmail: 'source@email.com',
        };

        const fakeOptions: AwsSdkSesOptions = { region: '', apiVersion: '' };
        const awsSesStrategy = new AwsSdkSesSendStrategy(fakeOptions);

        // when
        const awsSesEmail = awsSesStrategy.convertEmailToStrategySpecificEmail(genericEmail);

        // then
        expect(awsSesEmail.Destination).to.eql({
            ToAddresses: genericEmail.toAddresses,
        });
        expect(awsSesEmail.Message).to.eql({
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: genericEmail.html,
                },
                Text: {
                    Charset: 'UTF-8',
                    Data: genericEmail.text,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: genericEmail.subject,
            },
        });
        expect(awsSesEmail.Source).to.equal(`${genericEmail.sourceDisplayName} <${genericEmail.sourceEmail}>`);
        expect(awsSesEmail.ReplyToAddresses).to.equal(genericEmail.replyToAddresses);
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

        const fakeOptions: AwsSdkSesOptions = { region: '', apiVersion: '' };
        const awsSesStrategy = new AwsSdkSesSendStrategy(fakeOptions);

        // when
        const awsSesEmail = awsSesStrategy.convertEmailToStrategySpecificEmail(genericEmail);

        // then
        expect(awsSesEmail.Destination).to.eql({
            ToAddresses: genericEmail.toAddresses,
            CcAddresses: genericEmail.ccAddresses,
            BccAddresses: genericEmail.bccAddresses,
        });
        expect(awsSesEmail.Message).to.eql({
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: genericEmail.html,
                },
                Text: {
                    Charset: 'UTF-8',
                    Data: genericEmail.text,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: genericEmail.subject,
            },
        });
        expect(awsSesEmail.Source).to.equal(`${genericEmail.sourceDisplayName} <${genericEmail.sourceEmail}>`);
        expect(awsSesEmail.ReplyToAddresses).to.equal(genericEmail.replyToAddresses);
    });
});
