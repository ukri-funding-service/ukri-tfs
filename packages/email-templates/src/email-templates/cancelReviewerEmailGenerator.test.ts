import { describe, expect, it } from '@jest/globals';
import { CancelReviewerEmailGenerator } from './cancelReviewerEmailGenerator';
import { CancelReviewerEmailData, EmailConfigType, Recipient } from './data';

const cancelReviewerEmailData: CancelReviewerEmailData = {
    firstName: 'firstname',
    lastName: 'lastname',
    applicationName: 'some research',
    recipient: {} as Recipient,
};

const emailConfig: EmailConfigType = {
    sourceEmail: 'test@example.com',
    sourceDisplayName: 'Test User',
    applicationManagerUrl: '',
};

const cancelReviewerEmailGenerator: CancelReviewerEmailGenerator = new CancelReviewerEmailGenerator();

describe('cancelReviewerEmailGenerator', () => {
    it('should work for html', () => {
        const emailContent = cancelReviewerEmailGenerator.generateHtml(cancelReviewerEmailData);

        expect(emailContent).toContain('Dear firstname lastname,');
        expect(emailContent).toContain(
            `We've cancelled your invitation to review ${cancelReviewerEmailData.applicationName}`,
        );
        expect(emailContent).toContain('This could be for several reasons. For example, the deadline has passed.');
        expect(emailContent).toContain(
            `You do not need to do anything. We'll contact you if there are applications we'd like you to review in the future.`,
        );
        expect(emailContent).toContain('The UKRI Funding Service');
        expect(emailContent).toContain('Email: support@funding-service.ukri.org');
        expect(emailContent).toContain('Telephone: +44 (0)1793 547 490');
        expect(emailContent).toContain('This is an automated message – do not reply.');
    });

    it('should work for text only', () => {
        const emailContent = cancelReviewerEmailGenerator.generateText(cancelReviewerEmailData);
        expect(emailContent).toContain('Dear firstname lastname,');
        expect(emailContent).toContain(`We've cancelled your invitation to review some research`);
        expect(emailContent).toContain('This could be for several reasons. For example, the deadline has passed.');
        expect(emailContent).toContain(
            `You do not need to do anything. We'll contact you if there are applications we'd like you to review in the future.`,
        );
        expect(emailContent).toContain('The UKRI Funding Service');
        expect(emailContent).toContain('Email: support@funding-service.ukri.org');
        expect(emailContent).toContain('Telephone: +44 (0)1793 547 490');
    });

    it('should generate a generic Email object', () => {
        const toAddresses = ['a', 'b'];
        const email = cancelReviewerEmailGenerator.generateEmail(toAddresses, cancelReviewerEmailData, emailConfig);

        expect(email.html).toContain('Dear firstname lastname');
        expect(email.text).toContain('Dear firstname lastname');
        expect(email.subject).toContain('UKRI Funding Service - review invitation cancelled');
        expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
        expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
        expect(email.toAddresses).toEqual(toAddresses);
    });

    describe('generateEmailPreview', () => {
        it('should not contain disruptive tags', () => {
            const toAddresses = ['a', 'b'];
            const uut = new CancelReviewerEmailGenerator();

            const email = uut.generateEmailPreview(toAddresses, cancelReviewerEmailData, emailConfig);

            expect(email.html).not.toContain('<head>');
            expect(email.html).not.toContain('<img');
            expect(email.html).not.toContain('<style');
            expect(email.html).not.toContain('Respond now');

            expect(email.html).toContain('Dear firstname lastname');
            expect(email.html).toContain(cancelReviewerEmailData.applicationName);
            expect(email.html).toContain('From');
            expect(email.html).toContain('Email:');
            expect(email.html).toContain('Telephone:');
            expect(email.html).toContain('This is an automated message – do not reply.');
        });
    });
});
