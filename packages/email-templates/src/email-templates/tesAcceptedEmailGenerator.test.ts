import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { TesAcceptedEmailGenerator } from './tesAcceptedEmailGenerator';
import { TesAcceptedEmailData, EmailConfigType } from './data';
import * as generateEmailHeaderMock from '../components/emailHeader';
import * as generateEmailParagraphMock from '../components/emailParagraph';
import * as generateEmailSignOffMock from '../components/emailSignOff';
import { baseEmailText } from '../components';

describe('tES accepted email generator', () => {
    const generator: TesAcceptedEmailGenerator = new TesAcceptedEmailGenerator();

    const emailData: TesAcceptedEmailData = {
        award: {
            name: 'Award Name',
            reference: 'Award Ref',
        },
        tesUrl: 'http://my/tes/url',
        tesSubmittedDate: '2023-01-22T14:23:09.874Z',
        recipient: { firstName: 'John', lastName: 'Doe' },
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

    it('should generate email with the correct html', () => {
        const generateEmailHeaderSpy = jest.spyOn(generateEmailHeaderMock, 'generateEmailHeader').mockReturnValue('');

        const generateEmailParagraphSpy = jest
            .spyOn(generateEmailParagraphMock, 'generateEmailParagraph')
            .mockReturnValue('');

        const generateEmailSignOffHtmlSpy = jest
            .spyOn(generateEmailSignOffMock, 'generateEmailSignOffHtml')
            .mockReturnValue('');

        generator.generateHtml(emailData);

        expect(generateEmailHeaderSpy).toHaveBeenCalledTimes(1);
        expect(generateEmailHeaderSpy).toHaveBeenCalledWith(
            'Transfer expenditure statement for Award Ref: Award Name accepted',
        );
        expect(generateEmailParagraphSpy).toHaveBeenCalledTimes(3);
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(1, 'Dear John Doe,');
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            2,
            'The expenditure statement you submitted on 22 January 2023 for the award Award Ref: Award Name has been accepted.',
        );
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            3,
            'You can view the expenditure statement at <a href="http://my/tes/url">http://my/tes/url</a>.',
        );
        expect(generateEmailSignOffHtmlSpy).toHaveBeenCalledTimes(1);
        expect(generateEmailSignOffHtmlSpy).toHaveBeenCalledWith({
            email: baseEmailText.awardEmail,
            telephone: baseEmailText.awardTelephone,
        });
    });

    it('should generate email with the correct text', () => {
        const generateEmailSignOffTextSpy = jest
            .spyOn(generateEmailSignOffMock, 'generateEmailSignOffText')
            .mockReturnValue('');

        const email = generator.generateText(emailData);

        expect(email).toContain('Transfer expenditure statement for Award Ref: Award Name accepted');
        expect(email).toContain('Dear John Doe,');
        expect(email).toContain(
            'The expenditure statement you submitted on 22 January 2023 for the award Award Ref: Award Name has been accepted.',
        );
        expect(email).toContain('You can view the expenditure statement at http://my/tes/url.');
        expect(generateEmailSignOffTextSpy).toHaveBeenCalledTimes(1);
        expect(generateEmailSignOffTextSpy).toHaveBeenCalledWith({
            email: baseEmailText.awardEmail,
            telephone: baseEmailText.awardTelephone,
        });
    });

    it('should generate a generic Email object', () => {
        const toAddresses = ['test@email.com'];

        const email = generator.generateEmail(toAddresses, emailData, emailConfig);

        expect(email.html).toContain('This is an html email header');
        expect(email.text).toContain('Transfer expenditure statement for Award Ref: Award Name accepted');
        expect(email.subject).toContain('UKRI Funding Service - Transfer expenditure statement accepted');
        expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
        expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
        expect(email.toAddresses).toEqual(toAddresses);
    });
});
