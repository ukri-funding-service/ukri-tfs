import { describe, expect, it, jest } from '@jest/globals';
import { TesIssuedEmailGenerator } from './tesIssuedEmailGenerator';
import { EmailConfigType, TesIssuedEmailData } from './data';
import * as generateEmailParagraphMock from '../components/emailParagraph';
import * as generateEmailSignoffMock from '../components/emailSignOff';
import * as generateEmailHeaderMock from '../components/emailHeader';
import { baseEmailText } from '../components';

describe('tES issued email generator', () => {
    const generator: TesIssuedEmailGenerator = new TesIssuedEmailGenerator();

    const emailDataWithoutDeadlineDays: TesIssuedEmailData = {
        award: {
            name: 'My Test Award',
            reference: 'TEST123',
        },
        tesUrl: 'http://my/tes/url',
        recipient: { firstName: 'John', lastName: 'Doe' },
    };

    const deadlineDays = 180;

    const emailDataWithDeadlineDays: TesIssuedEmailData = {
        ...emailDataWithoutDeadlineDays,
        deadlineDays,
    };

    const emailConfig: EmailConfigType = {
        sourceEmail: 'test@example.com',
        sourceDisplayName: 'Test User',
        applicationManagerUrl: '',
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should generate email with the correct html with all data provided', () => {
        const generateEmailParagraphSpy = jest
            .spyOn(generateEmailParagraphMock, 'generateEmailParagraph')
            .mockReturnValue('');

        const generateEmailSignoffHtmlSpy = jest
            .spyOn(generateEmailSignoffMock, 'generateEmailSignOffHtml')
            .mockReturnValue('');

        const generateEmailH2HeaderSpy = jest
            .spyOn(generateEmailHeaderMock, 'generateEmailH2Header')
            .mockReturnValue('');

        generator.generateHtml(emailDataWithDeadlineDays);

        expect(generateEmailParagraphSpy).toHaveBeenCalledTimes(4);
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            1,
            `Dear ${emailDataWithoutDeadlineDays.recipient.firstName} ${emailDataWithoutDeadlineDays.recipient.lastName},`,
        );
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            2,
            `${emailDataWithoutDeadlineDays.award.reference}: ${emailDataWithoutDeadlineDays.award.name} has been issued a transfer expenditure statement (tES).`,
        );
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            3,
            `You have ${deadlineDays} days to complete the tES and return it to us.`,
        );
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            4,
            `You can view and complete your tES at: <a href="${emailDataWithoutDeadlineDays.tesUrl}">${emailDataWithoutDeadlineDays.tesUrl}</a>.`,
        );

        expect(generateEmailH2HeaderSpy).toHaveBeenCalledWith('What to do next');

        expect(generateEmailSignoffHtmlSpy).toHaveBeenCalledWith({
            signOffText: 'Thank you',
            email: baseEmailText.awardEmail,
            telephone: baseEmailText.awardTelephone,
        });
    });

    it('should generate email with the correct text with all data provided', () => {
        const generateEmailSignoffTextSpy = jest
            .spyOn(generateEmailSignoffMock, 'generateEmailSignOffText')
            .mockReturnValue('');

        const email = generator.generateText(emailDataWithDeadlineDays);

        expect(email).toContain(
            `Dear ${emailDataWithoutDeadlineDays.recipient.firstName} ${emailDataWithoutDeadlineDays.recipient.lastName},`,
        );
        expect(email).toContain(
            `${emailDataWithoutDeadlineDays.award.reference}: ${emailDataWithoutDeadlineDays.award.name} has been issued a transfer expenditure statement (tES).`,
        );
        expect(email).toContain(`You have ${deadlineDays} days to complete the tES and return it to us.`);
        expect(email).toContain('What to do next');
        expect(email).toContain(`You can view and complete your tES at: ${emailDataWithoutDeadlineDays.tesUrl}.`);

        expect(generateEmailSignoffTextSpy).toHaveBeenCalledWith({
            signOffText: 'Thank you',
            email: baseEmailText.awardEmail,
            telephone: baseEmailText.awardTelephone,
        });
    });

    it('should generate email with the correct html when optional data is omitted', () => {
        const generateEmailParagraphSpy = jest
            .spyOn(generateEmailParagraphMock, 'generateEmailParagraph')
            .mockReturnValue('');

        generator.generateHtml(emailDataWithoutDeadlineDays);

        expect(generateEmailParagraphSpy).toHaveBeenCalledTimes(4);
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            3,
            'You have 90 days to complete the tES and return it to us.',
        );
    });

    it('should generate email with the correct text when optional data is omitted', () => {
        const generateEmailSignoffTextSpy = jest
            .spyOn(generateEmailSignoffMock, 'generateEmailSignOffText')
            .mockReturnValue('');

        const email = generator.generateText(emailDataWithoutDeadlineDays);

        expect(email).toContain(
            `Dear ${emailDataWithoutDeadlineDays.recipient.firstName} ${emailDataWithoutDeadlineDays.recipient.lastName},`,
        );
        expect(email).toContain(
            `${emailDataWithoutDeadlineDays.award.reference}: ${emailDataWithoutDeadlineDays.award.name} has been issued a transfer expenditure statement (tES).`,
        );
        expect(email).toContain('You have 90 days to complete the tES and return it to us.');
        expect(email).toContain('What to do next');
        expect(email).toContain(`You can view and complete your tES at: ${emailDataWithoutDeadlineDays.tesUrl}.`);

        expect(generateEmailSignoffTextSpy).toHaveBeenCalledWith({
            signOffText: 'Thank you',
            email: baseEmailText.awardEmail,
            telephone: baseEmailText.awardTelephone,
        });
    });

    it('should generate a generic Email object', () => {
        const toAddresses = ['test@email.com'];
        const generatedHtml = 'This is an html email header';
        const generatedText = 'Transfer expenditure statement for My Test Award TEST123 issued';

        jest.spyOn(generator, 'generateHtml').mockReturnValueOnce(generatedHtml);
        jest.spyOn(generator, 'generateText').mockReturnValueOnce(generatedText);

        const email = generator.generateEmail(toAddresses, emailDataWithoutDeadlineDays, emailConfig);

        expect(email.html).toContain(generatedHtml);
        expect(email.text).toContain(generatedText);
        expect(email.subject).toContain('UKRI Funding Service - Complete your transfer expenditure statement');
        expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
        expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
        expect(email.toAddresses).toEqual(toAddresses);
    });
});
