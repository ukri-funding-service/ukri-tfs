import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { FesRejectedEmailGenerator } from './fesRejectedEmailGenerator';
import { FesRejectedEmailData, EmailConfigType } from './data';
import * as generateEmailHeaderMock from '../components/emailHeader';
import * as generateEmailParagraphMock from '../components/emailParagraph';
import * as generateEmailSignOffMock from '../components/emailSignOff';
import { baseEmailText } from '../components';

describe('fES rejected email generator', () => {
    const generator: FesRejectedEmailGenerator = new FesRejectedEmailGenerator();

    const emailData: FesRejectedEmailData = {
        award: {
            name: 'My Test Award',
            reference: 'TEST123',
        },
        fesUrl: 'http://my/fes/url',
        fesSubmittedDate: '2023-01-22T14:23:09.874Z',
        fesRejectedComments: '<p>First paragraph</p><p>Second paragraph</p>',
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

        const generateEmailH2HeaderSpy = jest
            .spyOn(generateEmailHeaderMock, 'generateEmailH2Header')
            .mockReturnValue('');

        const generateEmailParagraphSpy = jest
            .spyOn(generateEmailParagraphMock, 'generateEmailParagraph')
            .mockReturnValue('');

        const generateEmailSignOffHtmlSpy = jest
            .spyOn(generateEmailSignOffMock, 'generateEmailSignOffHtml')
            .mockReturnValue('');

        generator.generateHtml(emailData);

        expect(generateEmailHeaderSpy).toHaveBeenCalledTimes(1);
        expect(generateEmailHeaderSpy).toHaveBeenCalledWith(
            'Final expenditure statement for My Test Award TEST123 rejected',
        );
        expect(generateEmailParagraphSpy).toHaveBeenCalledTimes(4);
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(1, 'Dear John Doe,');
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            2,
            'The expenditure statement you submitted on 22 January 2023 for the award TEST123:My Test Award has been rejected.',
        );
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            3,
            emailData.fesRejectedComments,
            'default',
            false,
            'div',
        );
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            4,
            'We have sent you a new expenditure statement to complete.<br/>You can view this expenditure statement at <a href="http://my/fes/url">http://my/fes/url</a>.',
        );

        expect(generateEmailH2HeaderSpy).toHaveBeenCalledTimes(1);
        expect(generateEmailH2HeaderSpy).toHaveBeenCalledWith('Reason for rejection');
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

        expect(email).toContain('Final expenditure statement for My Test Award TEST123 rejected');
        expect(email).toContain('Dear John Doe,');
        expect(email).toContain(
            'The expenditure statement you submitted on 22 January 2023 for the award TEST123:My Test Award has been rejected.',
        );
        expect(email).toContain('Reason for rejection');
        expect(email).toContain('First paragraph Second paragraph');
        expect(email).toContain('We have sent you a new expenditure statement to complete.');
        expect(email).toContain('You can view this expenditure statement at http://my/fes/url.');
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
        expect(email.text).toContain('Final expenditure statement for My Test Award TEST123 rejected');
        expect(email.subject).toContain('UKRI Funding Service - Final expenditure statement rejected');
        expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
        expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
        expect(email.toAddresses).toEqual(toAddresses);
    });
});
