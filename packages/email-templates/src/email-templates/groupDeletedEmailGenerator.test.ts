import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { GroupDeletedEmailGenerator } from './groupDeletedEmailGenerator';
import { GroupDeletedEmailData, EmailConfigType } from './data';
import * as generateEmailHeaderMock from '../components/emailHeader';
import * as generateEmailParagraphMock from '../components/emailParagraph';
import * as generateEmailSignOffMock from '../components/emailSignOff';

describe('Group deleted email generator', () => {
    const generator: GroupDeletedEmailGenerator = new GroupDeletedEmailGenerator();

    const emailData: GroupDeletedEmailData = {
        group: {
            name: 'My Test Group',
            isDefault: false,
        },
        researchOfficer: {
            firstName: 'Jane',
            lastName: 'Doe',
        },
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
        expect(generateEmailHeaderSpy).toHaveBeenCalledWith(`The group 'My Test Group' has been deleted`);
        expect(generateEmailParagraphSpy).toHaveBeenCalledTimes(3);
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(1, `Jane Doe has deleted the group 'My Test Group'.`);
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            2,
            'All the applications that were assigned to this group are now ungrouped.',
        );
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            3,
            'This means that all notifications about them will go to everyone in your research office.',
        );
        expect(generateEmailSignOffHtmlSpy).toHaveBeenCalledTimes(1);
    });

    it('should generate email with the correct text', () => {
        const generateEmailSignOffTextSpy = jest
            .spyOn(generateEmailSignOffMock, 'generateEmailSignOffText')
            .mockReturnValue('');

        const email = generator.generateText(emailData);

        expect(email).toContain(`The group 'My Test Group' has been deleted`);
        expect(email).toContain(`Jane Doe has deleted the group 'My Test Group'.`);
        expect(email).toContain('All the applications that were assigned to this group are now ungrouped.');
        expect(email).toContain(
            'This means that all notifications about them will go to everyone in your research office.',
        );
        expect(generateEmailSignOffTextSpy).toHaveBeenCalledTimes(1);
    });

    it('should generate a generic Email object', () => {
        const toAddresses = ['test@email.com'];

        const email = generator.generateEmail(toAddresses, emailData, emailConfig);

        expect(email.html).toContain('This is an html email header');
        expect(email.text).toContain(`Jane Doe has deleted the group 'My Test Group'.`);
        expect(email.subject).toContain(`The group 'My Test Group' has been deleted - UKRI Funding Service`);
        expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
        expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
        expect(email.toAddresses).toEqual(toAddresses);
    });
});
