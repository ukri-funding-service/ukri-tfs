import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { GroupUserRemovedEmailGenerator } from './groupUserRemovedEmailGenerator';
import { GroupUserRemovedEmailData, EmailConfigType } from './data';
import * as generateEmailHeaderMock from '../components/emailHeader';
import * as generateEmailParagraphMock from '../components/emailParagraph';
import * as generateEmailSignOffMock from '../components/emailSignOff';

describe('Group user removed email generator', () => {
    const generator: GroupUserRemovedEmailGenerator = new GroupUserRemovedEmailGenerator();

    let emailData: GroupUserRemovedEmailData;

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
            externalFundingServiceSignInUrl: 'https://the-funding-service/sign-in',
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
            expect(generateEmailHeaderSpy).toHaveBeenCalledWith(`You've been removed from the group 'My Test Group'`);
            expect(generateEmailParagraphSpy).toHaveBeenCalledTimes(3);
            expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
                1,
                `Jane Doe has removed you from the group 'My Test Group'.`,
            );
            expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
                2,
                'This means you will no longer receive email notifications about any of the applications assigned to the group.',
            );
            expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
                3,
                `You can still <a href="https://the-funding-service/sign-in">track the progress of all your organisation's applications</a> by signing in to the Funding Service.`,
            );
            expect(generateEmailSignOffHtmlSpy).toHaveBeenCalledTimes(1);
        });

        it('should generate email with the correct text', () => {
            const generateEmailSignOffTextSpy = jest
                .spyOn(generateEmailSignOffMock, 'generateEmailSignOffText')
                .mockReturnValue('');

            const email = generator.generateText(emailData);

            expect(email).toContain(`You've been removed from the group 'My Test Group'`);
            expect(email).toContain(`Jane Doe has removed you from the group 'My Test Group'.`);
            expect(email).toContain(
                'This means you will no longer receive email notifications about any of the applications assigned to the group.',
            );
            expect(email).toContain(
                `You can still track the progress of all your organisation's applications by signing in to the Funding Service: https://the-funding-service/sign-in`,
            );
            expect(generateEmailSignOffTextSpy).toHaveBeenCalledTimes(1);
        });

        it('should generate a generic Email object', () => {
            const toAddresses = ['test@email.com'];

            const email = generator.generateEmail(toAddresses, emailData, emailConfig);

            expect(email.html).toContain('This is an html email header');
            expect(email.text).toContain(`You've been removed from the group 'My Test Group'`);
            expect(email.subject).toContain(
                `You've been removed from the group 'My Test Group' - UKRI Funding Service`,
            );
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
                `You're no longer receiving notifications about unassigned applications`,
            );
            expect(generateEmailParagraphSpy).toHaveBeenCalledTimes(2);
            expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
                1,
                `Jane Doe has stopped you receiving emails about the progress of applications that are not assigned to a group.`,
            );
            expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
                2,
                `You can still <a href="https://the-funding-service/sign-in">track the progress of all your organisation's applications</a> by signing in to the Funding Service.`,
            );
            expect(generateEmailSignOffHtmlSpy).toHaveBeenCalledTimes(1);
        });

        it('should generate email with the correct text', () => {
            const generateEmailSignOffTextSpy = jest
                .spyOn(generateEmailSignOffMock, 'generateEmailSignOffText')
                .mockReturnValue('');

            const email = generator.generateText(emailData);

            expect(email).toContain(`You're no longer receiving notifications about unassigned applications`);
            expect(email).toContain(
                `Jane Doe has stopped you receiving emails about the progress of applications that are not assigned to a group.`,
            );
            expect(email).toContain(
                `You can still track the progress of all your organisation's applications by signing in to the Funding Service: https://the-funding-service/sign-in`,
            );
            expect(generateEmailSignOffTextSpy).toHaveBeenCalledTimes(1);
        });

        it('should generate a generic Email object', () => {
            const toAddresses = ['test@email.com'];

            const email = generator.generateEmail(toAddresses, emailData, emailConfig);

            expect(email.html).toContain('This is an html email header');
            expect(email.text).toContain(`You're no longer receiving notifications about unassigned applications`);
            expect(email.subject).toContain(
                `You're no longer receiving notifications about unassigned applications - UKRI Funding Service`,
            );
            expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
            expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
            expect(email.toAddresses).toEqual(toAddresses);
        });
    });
});
