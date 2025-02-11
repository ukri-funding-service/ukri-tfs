import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { FesIssuedEmailGenerator } from './fesIssuedEmailGenerator';
import { FesIssuedEmailData, EmailConfigType } from './data';
import * as generateEmailHeaderMock from '../components/emailHeader';
import * as generateEmailParagraphMock from '../components/emailParagraph';
import * as generateEmailSignOffMock from '../components/emailSignOff';
import { baseEmailText } from '../components';

describe('fES issued email generator', () => {
    const generator: FesIssuedEmailGenerator = new FesIssuedEmailGenerator();

    const emailDataWithoutDeadlineDays: FesIssuedEmailData = {
        award: {
            name: 'My Test Award',
            reference: 'TEST123',
        },
        fesUrl: 'http://my/fes/url',
        recipient: { firstName: 'John', lastName: 'Doe' },
    };

    const deadlineDays = 180;

    const emailDataWithDeadlineDays: FesIssuedEmailData = {
        ...emailDataWithoutDeadlineDays,
        deadlineDays,
    };

    const emailConfig: EmailConfigType = {
        sourceEmail: 'test@example.com',
        sourceDisplayName: 'Test User',
        applicationManagerUrl: '',
    };

    beforeEach(() => {
        jest.spyOn(generateEmailHeaderMock, 'generateEmailHeader').mockReturnValue('This is an html email header');
        jest.clearAllMocks();
    });

    it('should generate email with the correct html with all data provided', () => {
        const generateEmailHeaderSpy = jest.spyOn(generateEmailHeaderMock, 'generateEmailHeader').mockReturnValue('');

        const generateEmailH2HeaderSpy = jest
            .spyOn(generateEmailHeaderMock, 'generateEmailH2Header')
            .mockReturnValue('');

        const generateEmailParagraphSpy = jest
            .spyOn(generateEmailParagraphMock, 'generateEmailParagraph')
            .mockReturnValue('');

        const generateEmailSignOffHtmlSpy = jest
            .spyOn(generateEmailSignOffMock, 'generateEmailSignOffHtml')
            .mockReturnValue('');

        generator.generateHtml(emailDataWithDeadlineDays);

        expect(generateEmailHeaderSpy).toHaveBeenCalledTimes(1);
        expect(generateEmailHeaderSpy).toHaveBeenCalledWith(
            `Final expenditure statement for ${emailDataWithDeadlineDays.award.name} ${emailDataWithDeadlineDays.award.reference} issued`,
        );
        expect(generateEmailParagraphSpy).toHaveBeenCalledTimes(4);
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            1,
            `Dear ${emailDataWithDeadlineDays.recipient.firstName} ${emailDataWithDeadlineDays.recipient.lastName},`,
        );
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            2,
            `${emailDataWithDeadlineDays.award.name} ${emailDataWithDeadlineDays.award.reference} has been issued a final expenditure statement (fES) by UKRI.`,
        );
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            3,
            `You have ${deadlineDays} days to complete the fES and return it to us.`,
        );
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            4,
            `You can complete and submit your fES at <a href="${emailDataWithDeadlineDays.fesUrl}">${emailDataWithDeadlineDays.fesUrl}</a>.`,
        );
        expect(generateEmailH2HeaderSpy).toHaveBeenCalledTimes(1);
        expect(generateEmailH2HeaderSpy).toHaveBeenCalledWith('What happens next');
        expect(generateEmailSignOffHtmlSpy).toHaveBeenCalledTimes(1);
        expect(generateEmailSignOffHtmlSpy).toHaveBeenCalledWith({
            email: baseEmailText.awardEmail,
            telephone: baseEmailText.awardTelephone,
        });
    });

    it('should generate email with the correct text with all data provided', () => {
        const generateEmailSignOffTextSpy = jest
            .spyOn(generateEmailSignOffMock, 'generateEmailSignOffText')
            .mockReturnValue('');
        const email = generator.generateText(emailDataWithDeadlineDays);

        expect(email).toContain(
            `Final expenditure statement for ${emailDataWithDeadlineDays.award.name} ${emailDataWithDeadlineDays.award.reference} issued`,
        );
        expect(email).toContain(
            `Dear ${emailDataWithoutDeadlineDays.recipient.firstName} ${emailDataWithoutDeadlineDays.recipient.lastName},`,
        );
        expect(email).toContain(
            `${emailDataWithDeadlineDays.award.name} ${emailDataWithDeadlineDays.award.reference} has been issued a final expenditure statement (fES) by UKRI.`,
        );
        expect(email).toContain(`You have ${deadlineDays} days to complete the fES and return it to us.`);
        expect(email).toContain('What happens next');
        expect(email).toContain(`You can complete and submit your fES at ${emailDataWithoutDeadlineDays.fesUrl}.`);
        expect(generateEmailSignOffTextSpy).toHaveBeenCalledWith({
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
            'You have 90 days to complete the fES and return it to us.',
        );
    });

    it('should generate email with the correct text when optional data is omitted', () => {
        const email = generator.generateText(emailDataWithoutDeadlineDays);

        expect(email).toContain('You have 90 days to complete the fES and return it to us.');
    });

    it('should generate a generic Email object', () => {
        const toAddresses = ['test@email.com'];

        const email = generator.generateEmail(toAddresses, emailDataWithDeadlineDays, emailConfig);

        expect(email.html).toContain('This is an html email header');
        expect(email.text).toContain('Final expenditure statement for My Test Award TEST123 issued');
        expect(email.subject).toContain('UKRI Funding Service - Final expenditure statement issued');
        expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
        expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
        expect(email.toAddresses).toEqual(toAddresses);
    });
});
