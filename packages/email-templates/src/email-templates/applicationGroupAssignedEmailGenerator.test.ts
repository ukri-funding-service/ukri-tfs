import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as generateEmailHeaderMock from '../components/emailHeader';
import * as generateEmailParagraphMock from '../components/emailParagraph';
import * as generateEmailSignOffMock from '../components/emailSignOff';
import { ApplicationGroupAssignedEmailGenerator } from './applicationGroupAssignedEmailGenerator';
import { ApplicationGroupAssignedEmailDataWithApplicationLink } from './data';
describe('Group assigned application email generator', () => {
    const generator: ApplicationGroupAssignedEmailGenerator = new ApplicationGroupAssignedEmailGenerator();
    const emailData: ApplicationGroupAssignedEmailDataWithApplicationLink = {
        group: {
            name: 'My Test Group',
            isDefault: false,
        },
        applicant: {
            firstName: 'Sam',
            lastName: 'Jones',
        },

        application: {
            applicationRef: '12345',
            applicationName: 'Test Application Name',
            opportunityRef: '543231',
            opportunityName: 'Test Opportunity Name',
        },
        applicationLink: 'http://application/test',
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
        expect(generateEmailHeaderSpy).toHaveBeenCalledWith('Someone has assigned a new application to your group');
        expect(generateEmailParagraphSpy).toHaveBeenCalledTimes(9);
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(1, '<strong>Opportunity (call)</strong>', 'noMargin');
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            2,
            `${emailData.application.opportunityRef}: ${emailData.application.opportunityName}`,
        );
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(3, '<strong>Applicant</strong>', 'noMargin');
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            4,
            `${emailData.applicant.firstName} ${emailData.applicant.lastName}`,
        );
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(5, '<strong>Application</strong>', 'noMargin');
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            6,
            `${emailData.application.applicationRef}: ${emailData.application.applicationName}`,
        );
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(7, '<strong>Group</strong>', 'noMargin');
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(8, `Assigned to: ${emailData.group.name}`);
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            9,
            `Sign in to the Funding Service to <a href="${emailData.applicationLink}">view and edit the draft application</a>`,
        );
        expect(generateEmailSignOffHtmlSpy).toHaveBeenCalledTimes(1);
    });

    it('should generate email with the correct text', () => {
        const generateEmailSignOffTextSpy = jest
            .spyOn(generateEmailSignOffMock, 'generateEmailSignOffText')
            .mockReturnValue('');

        const email = generator.generateText(emailData);

        expect(email).toContain('Someone has assigned a new application to your group');
        expect(email).toContain('Opportunity (call)');
        expect(email).toContain(`${emailData.application.opportunityRef}: ${emailData.application.opportunityName}`);
        expect(email).toContain('Applicant');
        expect(email).toContain(`${emailData.applicant.firstName} ${emailData.applicant.lastName}`);
        expect(email).toContain('Application');
        expect(email).toContain(`${emailData.application.applicationRef}: ${emailData.application.applicationName}`);
        expect(email).toContain('Group');
        expect(email).toContain(`Assigned to: ${emailData.group.name}`);
        expect(email).toContain(
            `Sign in to the Funding Service to view and edit the draft application at ${emailData.applicationLink}.`,
        );

        expect(generateEmailSignOffTextSpy).toHaveBeenCalledTimes(1);
    });
});
