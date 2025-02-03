import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { AwardClosedEmailGenerator } from './awardClosedEmailGenerator';
import { AwardClosedEmailData, EmailConfigType } from './data';
import * as generateEmailHeaderMock from '../components/emailHeader';
import * as generateEmailParagraphMock from '../components/emailParagraph';
import * as generateEmailSignOffMock from '../components/emailSignOff';
import { baseEmailText } from '../components';

describe('Award closed email generator', () => {
    const generator: AwardClosedEmailGenerator = new AwardClosedEmailGenerator();

    const emailData: AwardClosedEmailData = {
        award: {
            name: 'My Test Award',
            reference: 'TEST123',
        },
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
        expect(generateEmailHeaderSpy).toHaveBeenCalledWith('My Test Award TEST123 closed');
        expect(generateEmailParagraphSpy).toHaveBeenCalledTimes(2);
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(1, 'Dear John Doe,');
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            2,
            'Your Award TEST123:My Test Award is now closed. Thank you for working with UKRI.',
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

        expect(email).toContain('My Test Award TEST123 closed');
        expect(email).toContain('Dear John Doe,');
        expect(email).toContain('Your Award TEST123:My Test Award is now closed. Thank you for working with UKRI.');
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
        expect(email.text).toContain('My Test Award TEST123 closed');
        expect(email.subject).toContain('UKRI Funding Service - Award closed');
        expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
        expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
        expect(email.toAddresses).toEqual(toAddresses);
    });
});
