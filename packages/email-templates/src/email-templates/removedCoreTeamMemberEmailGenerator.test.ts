import { beforeEach, describe, expect, it } from '@jest/globals';
import { RemovedCoreTeamMemberEmailGenerator } from './removedCoreTeamMemberEmailGenerator';
import { RemovedCoreTeamMemberEmailData, EmailConfigType } from './data';

const emailConfig: EmailConfigType = {
    sourceEmail: 'test@example.com',
    sourceDisplayName: 'Test User',
    applicationManagerUrl: '',
};
describe('Removed core team member email generator', () => {
    let generator: RemovedCoreTeamMemberEmailGenerator;
    let emailData: RemovedCoreTeamMemberEmailData;

    beforeEach(() => {
        generator = new RemovedCoreTeamMemberEmailGenerator();
        emailData = {
            coreTeamMember: {
                firstName: 'Elvina',
                lastName: 'Shepherd',
                role: 'Technician',
            },
            recipient: {
                firstName: 'Elvina',
                lastName: 'Shepherd',
            },
            application: {
                applicationRef: 'APP005',
                applicationName: 'Test application',
                opportunityRef: 'OPP331',
                opportunityName: 'Test opportunity',
            },
            applicationOwner: {
                firstName: 'John',
                lastName: 'Doe',
                role: 'Project lead',
                email: 'john.doe@example.com',
            },
        };
    });

    it('should generate email with the correct html', () => {
        const email = generator.generateHtml(emailData);

        expect(email).toContain(`You've been removed from the team that's applying for a UKRI funding Opportunity`);
        expect(email).toContain(`Dear ${emailData.coreTeamMember.firstName} ${emailData.coreTeamMember.lastName}`);
        expect(email).toContain(
            `You've been removed as the ${emailData.coreTeamMember.role} by ${emailData.applicationOwner.firstName} ${emailData.applicationOwner.lastName} who is the ${emailData.applicationOwner.role} on the application team.`,
        );
        expect(email).toContain(emailData.recipient.firstName);
        expect(email).toContain(emailData.recipient.lastName);

        expect(email).toContain(`<strong>Opportunity you've been removed from</strong>`);
        expect(email).toContain('OPP331: Test opportunity');
        expect(email).toContain(`<strong>Application you've been removed from</strong>`);
        expect(email).toContain('APP005: Test application');

        expect(email).toContain(
            `If you have any questions, email ${emailData.applicationOwner.firstName} ${emailData.applicationOwner.lastName} at ${emailData.applicationOwner.email}`,
        );

        expect(email).toContain('Yours sincerely,');
        expect(email).toContain('The UKRI Funding Service');
        expect(email).toContain('Email: support@funding-service.ukri.org');
        expect(email).toContain('Telephone: +44 (0)1793 547 490');
        expect(email).toContain('This is an automated message – do not reply.');
    });

    it('should generate email with the correct text', () => {
        const email = generator.generateText(emailData);

        expect(email).toContain(`You've been removed from the team that's applying for a UKRI funding Opportunity`);
        expect(email).toContain(`Dear ${emailData.coreTeamMember.firstName} ${emailData.coreTeamMember.lastName}`);
        expect(email).toContain(
            `You've been removed as the ${emailData.coreTeamMember.role} by ${emailData.applicationOwner.firstName} ${emailData.applicationOwner.lastName} who is the ${emailData.applicationOwner.role} on the application team.`,
        );
        expect(email).toContain(emailData.recipient.firstName);
        expect(email).toContain(emailData.recipient.lastName);

        expect(email).toContain(`Opportunity you've been removed from`);
        expect(email).toContain('OPP331: Test opportunity');
        expect(email).toContain(`Application you've been removed from`);
        expect(email).toContain('APP005: Test application');

        expect(email).toContain(
            `If you have any questions, email ${emailData.applicationOwner.firstName} ${emailData.applicationOwner.lastName} at ${emailData.applicationOwner.email}`,
        );

        expect(email).toContain('Yours sincerely,');
        expect(email).toContain('The UKRI Funding Service');
        expect(email).toContain('Email: support@funding-service.ukri.org');
        expect(email).toContain('Telephone: +44 (0)1793 547 490');
        expect(email).toContain('This is an automated message – do not reply.');
    });

    it('should generate the email object correctly', () => {
        const toAddresses = ['a', 'v'];
        const email = generator.generateEmail(toAddresses, emailData, emailConfig);

        expect(email.html).toContain('Dear Elvina Shepherd');
        expect(email.text).toContain('Dear Elvina Shepherd');
        expect(email.subject).toContain('UKRI Funding Service');
        expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
        expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
        expect(email.toAddresses).toEqual(toAddresses);
    });
});
