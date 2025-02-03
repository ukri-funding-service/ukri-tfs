import { describe, expect, it, jest } from '@jest/globals';
import { InviteReviewerEmailTemplateData, Recipient, EmailConfigType } from './data';
import { InviteReviewerEmailGenerator } from './inviteReviewerEmailGenerator';

const inviteReviewerEmailTemplateData: InviteReviewerEmailTemplateData = {
    applicants: [
        { organisation: 'ZORG', firstName: 'monsieur', lastName: 'poirot', role: 'Lead applicant' },
        {
            organisation: 'ZERG',
            firstName: 'captain',
            lastName: 'carelli',
            role: 'Principal investigator',
        },
    ],
    applicationName: 'some research',
    applicationDisplayId: 'APP123',
    applicationSummary: 'application for money',
    councilList: ['Council1', 'Council2'],
    grantSize: 488488488,
    opportunityName: 'a well named opportunity',
    opportunityDisplayId: 'OPP123',
    reviewDeadline: '2023-07-07T14:23:09.874Z',
    urlLink: 'www.example.com',
    recipient: {
        firstName: 'firstname',
        lastName: 'lastname',
    } as Recipient,
};

const inviteReviewerEmailGenerator: InviteReviewerEmailGenerator = new InviteReviewerEmailGenerator();

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

describe('InviteReviewerEmailGenerator', () => {
    describe('generateHtml', () => {
        it('test standard html generation', () => {
            const email = inviteReviewerEmailGenerator.generateHtml({
                ...inviteReviewerEmailTemplateData,
            });

            expect(email).toBe(`UKRI Funding Service - invitation to review a funding application APP123: some research
            <p>Dear firstname lastname,</p>
            <p>We're inviting you to review a funding application for a UK Research and Innovation (UKRI) opportunity. We think your expertise will be crucial in reviewing the application and helping us assess whether it should receive funding.</p>

            <strong><p>Opportunity</p></strong>
            <p>OPP123: a well named opportunity</p>

            <strong><p>Application</p></strong>
            <p>APP123: some research</p>

            <strong><p>Application summary</p></strong>
            <p>application for money</p>

            <strong><p>Application team</p></strong>
            <ul class=\"govuk-list govuk-list--bullet\"><li>monsieur poirot, ZORG - <strong>Lead applicant</strong></li><li>captain carelli, ZERG - <strong>Principal investigator</strong></li></ul>

            <strong><p>What happens next</p></strong>

            <p>If you accept the invite, you’ll need to sign in to your UKRI Funding Service account, or create an account if you do not already have one.</p>

            <p>Once you’ve signed in, you’ll be able to view the application and submit your review.</p>

            <strong><p>How long do I have to complete my review?</p></strong>

            <p>You’ll have 21 days from the day your invite is sent.</p>

            <p>If your timeframe is not feasible, you can contact the council running the opportunity to request an extension:</p>
            <ul class=\"govuk-list govuk-list--bullet\">
                <li>AHRC: <a href=\"mailto:operations@ahrc.ukri.org\">operations@ahrc.ukri.org</a></li>
                <li>BBSRC: <a href=\"mailto:peer.review@bbsrc.ukri.org\">peer.review@bbsrc.ukri.org</a></li>
                <li>EPSRC: <a href=\"mailto:grants@epsrc.ukri.org\">grants@epsrc.ukri.org</a></li>
                <li>ESRC: <a href=\"mailto:ESRCpeerreview@esrc.ukri.org\">ESRCpeerreview@esrc.ukri.org</a></li>
                <li>MRC: <a href=\"mailto:peer.review@mrc.ukri.org\">peer.review@mrc.ukri.org</a></li>
                <li>NERC: <a href=\"mailto:researchgrants@nerc.ukri.org\">researchgrants@nerc.ukri.org</a></li>
                <li>STFC: <a href=\"mailto:grantspolicy@stfc.ukri.org\">grantspolicy@stfc.ukri.org</a></li>
            </ul>

            <p>If you’re not sure which council to contact, or the funding Opportunity is being led by UKRI central, use the UKRI contact details at the foot of this email.</p>

            <strong><p>What is an expert reviewer?</p></strong>

            <p>The expert review stage (sometimes called the peer review stage) is an important part of our process. It gives fellow experts the chance to comment on and critique applications. This helps us understand the value of an application and decide which applications should receive funding.</p>

            <p>Being an expert reviewer is a voluntary position. On average, reviews take between 2 to 6 hours to complete - but this varies depending on the reviewer and the application. We’ll give you the guidance required to complete your review.</p>

            <p>You do not have to be an expert in every aspect of the application to be able to complete a review. For example, you may have expertise in the specific methodology but not the subject matter.</p>

            <p>Being an expert reviewer also gives you exposure to new research ideas in your field and beyond.</p>

            <strong><p>Let us know if you can review this application</p></strong>

            <p>Respond to the invitation at: <a href="www.example.com">www.example.com</a></p>

            <p>You do not have to complete the review right now. Only agree to review this application if you are not aware of any conflicts of interest.</p>

            <p>If you have more questions about reviewing this application, you can contact the council running the opportunity.</p>

            <p>Thank you for your time and support.</p>

            mock email sign off html`);
        });
    });

    describe('generateText', () => {
        it('test standard text generation', () => {
            const emailContent = inviteReviewerEmailGenerator.generateText(inviteReviewerEmailTemplateData);

            expect(emailContent).toBe(`Dear firstname lastname,

            We're inviting you to review a funding application for a UK Research and Innovation (UKRI) opportunity. We think your expertise will be crucial in reviewing the application and helping us assess whether it should receive funding.

            Opportunity
            OPP123: a well named opportunity

            Application
            APP123: some research

            Application summary
            application for money

            Application team
            monsieur poirot, ZORG - Lead applicantcaptain carelli, ZERG - Principal investigator

            What happens next

            If you accept the invite, you’ll need to sign in to your UKRI Funding Service account, or create an account if you do not already have one.

            Once you’ve signed in, you’ll be able to view the application and submit your review.

            How long do I have to complete my review?

            You’ll have 21 days from the day your invite is sent.

            If your timeframe is not feasible, you can contact the council running the opportunity to request an extension:
            
            AHRC: operations@ahrc.ukri.org

            BBSRC: peer.review@bbsrc.ukri.org

            EPSRC: grants@epsrc.ukri.org

            ESRC: ESRCpeerreview@esrc.ukri.org

            MRC: peer.review@mrc.ukri.org

            NERC: researchgrants@nerc.ukri.org

            STFC: grantspolicy@stfc.ukri.org

            If you’re not sure which council to contact, or the funding Opportunity is being led by UKRI central, use the UKRI contact details at the foot of this email.

            What is an expert reviewer?

            The expert review stage (sometimes called the peer review stage) is an important part of our process. It gives fellow experts the chance to comment on and critique applications. This helps us understand the value of an application and decide which applications should receive funding.

            Being an expert reviewer is a voluntary position. On average, reviews take between 2 to 6 hours to complete - but this varies depending on the reviewer and the application. We’ll give you the guidance required to complete your review.

            You do not have to be an expert in every aspect of the application to be able to complete a review. For example, you may have expertise in the specific methodology but not the subject matter.

            Being an expert reviewer also gives you exposure to new research ideas in your field and beyond.

            Let us know if you can review this application

            Respond to the invitation at: www.example.com

            You do not have to complete the review right now. Only agree to review this application if you are not aware of any conflicts of interest.

            If you have more questions about reviewing this application, you can contact the council running the opportunity.

            Thank you for your time and support.

            mock email sign off text`);
        });
    });

    describe('formatDate', () => {
        it('should return date in expected format', () => {
            expect(inviteReviewerEmailGenerator.formatDate(new Date('2024-01-01T10:00:00.000Z'))).toBe(
                '1 January 2024',
            );
        });
    });

    describe('generateEmail', () => {
        it('generate a generic Email object', () => {
            const toAddresses = ['j@fakeemail.com'];

            const email = inviteReviewerEmailGenerator.generateEmail(
                toAddresses,
                inviteReviewerEmailTemplateData,
                emailConfig,
            );

            expect(email.html).not.toBe('');
            expect(email.text).not.toBe('');
            expect(email.subject).toContain(
                'UKRI Funding Service - invitation to review a funding application APP123: some research',
            );
            expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
            expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
            expect(email.toAddresses).toEqual(toAddresses);
        });
    });

    describe('generateEmailPreview', () => {
        it('generate a generic Email object', () => {
            const toAddresses = ['j@fakeemail.com'];

            const email = inviteReviewerEmailGenerator.generateEmailPreview(
                toAddresses,
                inviteReviewerEmailTemplateData,
                emailConfig,
            );

            expect(email.html).not.toBe('');
            expect(email.text).not.toBe('');
            expect(email.subject).toContain(
                'UKRI Funding Service - invitation to review a funding application APP123: some research',
            );
            expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
            expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
            expect(email.toAddresses).toEqual(toAddresses);
        });
    });
});
