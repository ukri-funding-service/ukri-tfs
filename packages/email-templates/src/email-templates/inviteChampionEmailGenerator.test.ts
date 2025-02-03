import { describe, expect, it, jest } from '@jest/globals';
import { EmailConfigType, InviteChampionEmailData } from './data';
import { InviteChampionEmailGenerator } from './inviteChampionEmailGenerator';

const inviteChampionEmailData: InviteChampionEmailData = {
    inviteLink: '',
    recipient: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johnDoe@mail.saur',
    },
    organisationName: 'Stellenbosch',
};

const inviteChampionEmailGenerator: InviteChampionEmailGenerator = new InviteChampionEmailGenerator();

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
    applicationManagerUrl: '',
};

describe('InviteChampionEmailGenerator', () => {
    describe('generateHtml', () => {
        it('test standard html generation', () => {
            const email = inviteChampionEmailGenerator.generateHtml({
                ...inviteChampionEmailData,
            });

            expect(email).toBe(`Your UKRI Funding Service Account
                <header>View all Stellenbosch's UKRI Funding Service activity</header>
                Dear John Doe,
                <p><b>Administrator status has been applied to your UKRI Funding Services account.</b></p>
                <p>If you are a new user, you’ll need to create a password before signing in for the first time.</p>

                <p style="font-family: Helvetica, Arial, sans-serif; font-size: 19px; line-height: 1.315789474; margin: 0 0 30px 0;"><a id="continue-button" href="" style="display:block;width:140px;padding:7px 10px 8px 10px;background-color:#00703c;border-bottom:2px solid #002d18;color:white;text-decoration:none;text-align: center">Continue</a></p>

                <p>If the button does not work, use the link below or copy and paste it into your browser’s address bar.</p>

                <p><a href=""></a></p>

                <p>Name or organisation details incorrect?</p>

                <p>You can either email us: support@funding-service.ukri.org</p>

                <p>Or call the UKRI Funding Service Helpline: +44 (0)1793 547 490</p>

                <p><hr></p>`);
        });
    });

    describe('generateText', () => {
        it('test standard text generation', () => {
            const emailContent = inviteChampionEmailGenerator.generateText(inviteChampionEmailData);

            expect(emailContent)
                .toBe(`Dear ${inviteChampionEmailData.recipient.firstName} ${inviteChampionEmailData.recipient.lastName},

        Administrator status has been applied to your UKRI Funding Services account.

        If you are a new user, you’ll need to create a password before signing in for the first time.

        Copy and paste the link below into your browser’s address bar.
        
        ${inviteChampionEmailData.inviteLink}

        Name or organisation details incorrect? 
        You can either email us: support@funding-service.ukri.org
        Or call the UKRI Funding Service Helpline: +44 (0)1793 547 490`);
        });
    });

    describe('generateEmail', () => {
        it('generate a generic Email object', () => {
            const toAddresses = ['j@fakeemail.com'];

            const email = inviteChampionEmailGenerator.generateEmail(toAddresses, inviteChampionEmailData, emailConfig);

            expect(email.html).not.toBe('');
            expect(email.text).not.toBe('');
            expect(email.subject).toContain('Your UKRI Funding Service Account');
            expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
            expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
            expect(email.toAddresses).toEqual(toAddresses);
        });
    });

    describe('generateEmailPreview', () => {
        it('generate a generic Email object', () => {
            const toAddresses = ['j@fakeemail.com'];

            const email = inviteChampionEmailGenerator.generateEmailPreview(
                toAddresses,
                inviteChampionEmailData,
                emailConfig,
            );

            expect(email.html).not.toBe('');
            expect(email.text).not.toBe('');
            expect(email.subject).toContain('Your UKRI Funding Service Account');
            expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
            expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
            expect(email.toAddresses).toEqual(toAddresses);
        });
    });
});
