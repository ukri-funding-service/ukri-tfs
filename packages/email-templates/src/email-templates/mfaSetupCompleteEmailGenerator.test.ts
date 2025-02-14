import { EmailConfigType, MFASetupCompleteEmailData } from './data';
import { MFASetupCompleteEmailGenerator } from './mfaSetupCompleteEmailGenerator';

const mfaSetupCompleteEmailGenerator = new MFASetupCompleteEmailGenerator();

jest.mock('../components', () => {
    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(jest.requireActual('../components') as any),
        generateEmailHeader: (param: string) => `<header>${param}</header>`,
        generateEmailStrongHeader: (param: string) => `<strong><p>${param}</p></strong>`,
        generateEmailParagraph: (param: string) => `<p>${param}</p>`,
        generateEmailSignOffHtml: () => 'mock email sign off html',
        generateEmailSignOffText: () => 'mock email sign off text',
        generateTemplatedEmail: (subjectText: string, emailHtml: string) => `${subjectText}${emailHtml}`,
    };
});

const emailConfig: EmailConfigType = {
    sourceEmail: 'test@example.com',
    sourceDisplayName: 'Test User',
    applicationManagerUrl: 'https://application-manager',
};

const mfaSetupCompleteEmailData: MFASetupCompleteEmailData = {
    recipient: {
        firstName: 'Dave',
        lastName: 'Stevenson',
    },
    accountSettingsLink: 'account-settings/link',
};

describe('InviteReviewerEmailGenerator', () => {
    describe('generateHtml', () => {
        it('test standard html generation', () => {
            const email = mfaSetupCompleteEmailGenerator.generateEmail(
                [''],
                {
                    ...mfaSetupCompleteEmailData,
                },
                emailConfig,
            );

            expect(email.html).toBe(`UKRI Funding Service - 2FA set up complete
            <p>Dear Dave Stevenson,</p>
            <p>Two factor authentication has been set up on your account for the Funding Service (TFS).</p>

            <p>Kind regards,</p>

            <p>The UKRI Funding Service</p>
            <p>Email: support@funding-service.ukri.org</p>
            <p>Telephone: 01793 547490</p>
            <p>This is an automated message – do not reply.</p>`);
        });
    });

    describe('generateText', () => {
        it('test standard text generation', () => {
            const email = mfaSetupCompleteEmailGenerator.generateEmail(
                [''],
                {
                    ...mfaSetupCompleteEmailData,
                },
                emailConfig,
            );

            expect(email.text).toBe(
                `UKRI Funding Service - 2FA set up complete

        Dear Dave Stevenson,

        Two factor authentication has been set up on your account for the Funding Service (TFS).

        Kind regards,

        The UKRI Funding Service
        Email: support@funding-service.ukri.org
        Telephone: 01793 547490
        This is an automated message – do not reply.`,
            );
        });
    });
});
