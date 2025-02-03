import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ApplicationAccessEmailData, EmailConfigType } from './data';
import * as generateEmailHeaderMock from '../components/emailHeader';
import * as generateEmailParagraphMock from '../components/emailParagraph';
import * as generateEmailSignOffMock from '../components/emailSignOff';
import { ApplicationAccessEmailGenerator } from './applicationAccessEmailGenerator';

describe('application Access email generator', () => {
    const generator: ApplicationAccessEmailGenerator = new ApplicationAccessEmailGenerator();

    const emailData: ApplicationAccessEmailData = {
        application: {
            applicationName: 'Test Application',
            applicationRef: '',
            opportunityName: '',
            opportunityRef: '',
        },
        leadApplicant: {
            firstName: 'Steve',
            lastName: 'Oswald',
        },
        recipient: { firstName: 'John', lastName: 'Doe' },
        accessLink: '/signIn',
        organisation: {
            id: 1,
            name: 'United States Naval Academy',
        },
    };

    const emailConfig: EmailConfigType = {
        sourceEmail: 'test@example.com',
        sourceDisplayName: 'Test User',
        applicationManagerUrl: 'http://application-manager/',
    };

    beforeEach(() => {
        jest.spyOn(generateEmailHeaderMock, 'generateEmailHeader').mockReturnValue('This is an html email header');
        jest.clearAllMocks();
    });

    it('should generate email with the correct html', () => {
        const generateEmailParagraphSpy = jest
            .spyOn(generateEmailParagraphMock, 'generateEmailParagraph')
            .mockReturnValue('');

        const generateEmailSignOffHtmlSpy = jest
            .spyOn(generateEmailSignOffMock, 'generateEmailSignOffHtml')
            .mockReturnValue('');
        const email = generator.generateEmail([], emailData, emailConfig);

        expect(email.subject).toEqual('UKRI Funding Service - invite to access application');

        expect(generateEmailParagraphSpy).toHaveBeenCalledTimes(3);
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(1, 'Dear John Doe,');
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            2,
            `You've been given access to an application on the UKRI Funding Service: ${emailData.application.applicationName}. You've been given access by ${emailData.leadApplicant.firstName} ${emailData.leadApplicant.lastName} from ${emailData.organisation.name}.`,
        );
        expect(generateEmailParagraphSpy).toHaveBeenNthCalledWith(
            3,
            `Sign in to your area of The UKRI Funding Service to <a href="http://application-manager/signIn">access the application</a>. You'll need to create an account with the Funding Service, if you don't already have one.`,
        );

        expect(generateEmailSignOffHtmlSpy).toHaveBeenCalledTimes(1);
    });

    it('should generate email with the correct text', () => {
        const generateEmailSignOffTextSpy = jest
            .spyOn(generateEmailSignOffMock, 'generateEmailSignOffText')
            .mockReturnValue('');

        const email = generator.generateEmail([], emailData, emailConfig);
        expect(email.subject).toEqual('UKRI Funding Service - invite to access application');
        expect(email.text).toContain('Dear John Doe,');
        expect(email.text).toContain(
            `You've been given access to an application on the UKRI Funding Service: ${emailData.application.applicationName}. You've been given access by ${emailData.leadApplicant.firstName} ${emailData.leadApplicant.lastName} from ${emailData.organisation.name}.`,
        );
        expect(email.text).toContain(
            `Sign in to your area of The UKRI Funding Service to access the application (http://application-manager/signIn). You'll need to create an account with the Funding Service, if you don't already have one.`,
        );

        expect(generateEmailSignOffTextSpy).toHaveBeenCalledTimes(1);
    });

    it('should generate a generic Email object', () => {
        const toAddresses = ['test@email.com'];

        const email = generator.generateEmail(toAddresses, emailData, emailConfig);

        expect(email.text).toContain('UKRI Funding Service - invite to access application');
        expect(email.subject).toContain('UKRI Funding Service - invite to access application');
        expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
        expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
        expect(email.toAddresses).toEqual(toAddresses);
    });
});
