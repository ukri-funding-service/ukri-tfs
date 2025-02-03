import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { GroupUserAddedEmailGenerator } from './groupUserAddedEmailGenerator';
import { GroupUserAddedEmailData, EmailConfigType } from './data';
import * as generateEmailHeaderMock from '../components/emailHeader';
import * as generateEmailParagraphMock from '../components/emailParagraph';
import * as generateEmailSignOffMock from '../components/emailSignOff';

describe('Group user added email generator', () => {
    const generator: GroupUserAddedEmailGenerator = new GroupUserAddedEmailGenerator();

    let emailData: GroupUserAddedEmailData;

    const emailConfig: EmailConfigType = {
        sourceEmail: 'test@example.com',
        sourceDisplayName: 'Test User',
        applicationManagerUrl: '',
    };

    beforeEach(() => {
        emailData = {
            group: {
                name: 'My Test Group',
                isDefault: false,
            },
            researchOfficer: {
                firstName: 'Jane',
                lastName: 'Doe',
            },
        };

        jest.spyOn(generateEmailHeaderMock, 'generateEmailHeader').mockReturnValue('This is an html email header');
        jest.clearAllMocks();
    });

    describe('Non default group', () => {
        beforeEach(() => {
            emailData.group.isDefault = false;
        });

        it('should generate email with the correct html', () => {
            const generateEmailHeaderSpy = jest
                .spyOn(generateEmailHeaderMock, 'generateEmailHeader')
                .mockReturnValue('');

            const generateEmailParagraphSpy = jest
                .spyOn(generateEmailParagraphMock, 'generateEmailParagraph')
                .mockReturnValue('');

            const generateEmailSignOffHtmlSpy = jest
                .spyOn(generateEmailSignOffMock, 'generateEmailSignOffHtml')
                .mockReturnValue('');

            generator.generateHtml(emailData);

            expect(generateEmailHeaderSpy).toHaveBeenCalledTimes(1);
            expect(generateEmailHeaderSpy).toHaveBeenCalledWith(`You have been added to the group 'My Test Group'`);
            expect(generateEmailParagraphSpy).toHaveBeenCalledTimes(2);
            expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
                1,
                `Jane Doe has added you to the group 'My Test Group'.`,
            );
            expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
                2,
                'This means you will receive email notifications about the progress of all applications assigned to the group.',
            );
            expect(generateEmailSignOffHtmlSpy).toHaveBeenCalledTimes(1);
        });

        it('should generate email with the correct text', () => {
            const generateEmailSignOffTextSpy = jest
                .spyOn(generateEmailSignOffMock, 'generateEmailSignOffText')
                .mockReturnValue('');

            const email = generator.generateText(emailData);

            expect(email).toContain(`You have been added to the group 'My Test Group'`);
            expect(email).toContain(`Jane Doe has added you to the group 'My Test Group'.`);
            expect(email).toContain(
                'This means you will receive email notifications about the progress of all applications assigned to the group.',
            );
            expect(generateEmailSignOffTextSpy).toHaveBeenCalledTimes(1);
        });

        it('should generate a generic Email object', () => {
            const toAddresses = ['test@email.com'];

            const email = generator.generateEmail(toAddresses, emailData, emailConfig);

            expect(email.html).toContain('This is an html email header');
            expect(email.text).toContain(`You have been added to the group 'My Test Group'`);
            expect(email.subject).toContain(`You have been added to the group 'My Test Group' - UKRI Funding Service`);
            expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
            expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
            expect(email.toAddresses).toEqual(toAddresses);
        });
    });

    describe('Default group', () => {
        beforeEach(() => {
            emailData.group.isDefault = true;
        });

        it('should generate email with the correct html', () => {
            const generateEmailHeaderSpy = jest
                .spyOn(generateEmailHeaderMock, 'generateEmailHeader')
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
                `You're now receiving notifications about all unassigned applications`,
            );
            expect(generateEmailParagraphSpy).toHaveBeenCalledTimes(1);
            expect(generateEmailParagraphSpy).toHaveBeenCalledWith(
                `Jane Doe has set you up to receive emails about the progress of all applications that are not assigned to a group.`,
            );
            expect(generateEmailSignOffHtmlSpy).toHaveBeenCalledTimes(1);
        });

        it('should generate email with the correct text', () => {
            const generateEmailSignOffTextSpy = jest
                .spyOn(generateEmailSignOffMock, 'generateEmailSignOffText')
                .mockReturnValue('');

            const email = generator.generateText(emailData);

            expect(email).toContain(`You're now receiving notifications about all unassigned applications`);
            expect(email).toContain(
                `Jane Doe has set you up to receive emails about the progress of all applications that are not assigned to a group.`,
            );
            expect(generateEmailSignOffTextSpy).toHaveBeenCalledTimes(1);
        });

        it('should generate a generic Email object', () => {
            const toAddresses = ['test@email.com'];

            const email = generator.generateEmail(toAddresses, emailData, emailConfig);

            expect(email.html).toContain('This is an html email header');
            expect(email.text).toContain(`You're now receiving notifications about all unassigned applications`);
            expect(email.subject).toContain(
                `You're now receiving notifications about all unassigned applications - UKRI Funding Service`,
            );
            expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
            expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
            expect(email.toAddresses).toEqual(toAddresses);
        });
    });
});
