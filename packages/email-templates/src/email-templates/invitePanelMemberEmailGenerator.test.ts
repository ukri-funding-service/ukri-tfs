import { describe, expect, it, jest } from '@jest/globals';
import { EmailConfigType, InvitePanelMemberEmailData } from './data';
import { InvitePanelMemberEmailGenerator } from './invitePanelMemberEmailGenerator';

const invitePanelMemberEmailData: InvitePanelMemberEmailData = {
    inviteLink: '',
    recipient: {
        firstName: 'Dave',
        lastName: 'Brown',
        email: 'daveBrown@mail.saur',
    },
    panelDisplayId: 'PAN001',
    panelName: 'My new panel',
    meetingStartTime: '2022-10-24T15:00:00Z',
    meetingEndTime: '2022-10-24T16:30:00Z',
    memberRole: 'CHAIR',
    prescoreCommentsRequired: false,
};

const invitePanelMemberEmailGenerator: InvitePanelMemberEmailGenerator = new InvitePanelMemberEmailGenerator();

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
        generateHtmlListItem: (content: string) => `<li>${content}</li>`,
        generateHtmlList: (content: string) => `<ol>${content}</ol>`,
    };
});

const emailConfig: EmailConfigType = {
    sourceEmail: 'test@example.com',
    sourceDisplayName: 'Test User',
    applicationManagerUrl: '',
};

describe('InvitePanelMemberEmailGenerator', () => {
    describe('generateHtml', () => {
        it('test standard html generation', () => {
            const email = invitePanelMemberEmailGenerator.generateHtml({
                ...invitePanelMemberEmailData,
            });

            expect(email).toBe(`Invitation to panel: PAN001: My new panel
                                <br /><br /><br /><br />
                                <p>Dear Dave Brown,</p>
                                <p>You've been invited to take part in an upcoming panel meeting.</p>
                                <header>Panel name</header>
                                <p>PAN001: My new panel</p>
                                <header>Panel date and time</header>
                                <p>24 October 2022</p>
                                <p>4:00pm to 5:30pm</p>
                                <header>What you need to do now</header>

                                <ol>    <li><p>Sign in to your Funding Service Account () to view the panel details (if you do not already have an account, you'll be asked to create one).</p></li><li><p>Review all applications (declaring any conflicts of interests as you go).</p></li><li><p>If you've been assigned an introducer role for an application, give it a preliminary score.</p></li></ol>

                                <p>Thank you.</p>

                                <p>The UKRI Funding Service</p>
                                <p>Telephone: 01793 547490</p>
                                <p>Email: support@funding-service.ukri.org</p>`);
        });
    });

    describe('generateText', () => {
        it('test standard text generation', () => {
            const emailContent = invitePanelMemberEmailGenerator.generateText(invitePanelMemberEmailData);

            expect(emailContent).toBe(
                `Dear ${invitePanelMemberEmailData.recipient.firstName} ${invitePanelMemberEmailData.recipient.lastName},
        You've been invited to take part in an upcoming panel meeting.

        Panel name
        PAN001: My new panel

        Panel date and time
        24 October 2022
        4:00pm to 5:30pm

        What you need to do now

            1. Sign in to your Funding Service Account () to view the panel details (if you do not already have an account, you'll be asked to create one).
            2. Review all applications (declaring any conflicts of interests as you go).
            3. If you've been assigned an introducer role for an application, give it a preliminary score.

        Thank you.

        The UKRI Funding Service
        Telephone: 01793 547490
        Email: support@funding-service.ukri.org`,
            );
        });

        describe('generateEmail', () => {
            it('generate a generic Email object', () => {
                const toAddresses = ['j@fakeemail.com'];

                const email = invitePanelMemberEmailGenerator.generateEmail(
                    toAddresses,
                    invitePanelMemberEmailData,
                    emailConfig,
                );

                expect(email.html).not.toBe('');
                expect(email.text).not.toBe('');
                expect(email.subject).toContain(
                    `Invitation to panel: ${invitePanelMemberEmailData.panelDisplayId}: ${invitePanelMemberEmailData.panelName}`,
                );
                expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
                expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
                expect(email.toAddresses).toEqual(toAddresses);
            });
        });
    });
});
