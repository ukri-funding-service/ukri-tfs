import { describe, expect, it } from '@jest/globals';

import { EmailConfigType, ReviewReminderOverdueEmailTemplateData } from './data';
import { ReviewReminderOverdueEmailGenerator } from './reviewReminderOverdueEmailGenerator';

const reviewReminderOverdueEmailTemplateData: ReviewReminderOverdueEmailTemplateData = {
    applicationName: 'some research',
    recipient: { firstName: 'barry', lastName: 'jenkins' },
    applicationDisplayId: 'APP123',
    opportunityDisplayId: 'OPP234',
    opportunityName: 'Some Opportunity Name',
    reviewDeadline: '2023-07-07T14:23:09.874Z',
    reviewUrl: 'www.example-review.com',
    daysOverdue: 223,
};

const emailConfig: EmailConfigType = {
    sourceEmail: 'test@example.com',
    sourceDisplayName: 'Test User',
    applicationManagerUrl: '',
};

const reviewReminderOverdueEmailGenerator: ReviewReminderOverdueEmailGenerator =
    new ReviewReminderOverdueEmailGenerator();

describe('ReviewReminderOverdueEmailGenerator', () => {
    describe('html', () => {
        it('html content', () => {
            const emailContent = reviewReminderOverdueEmailGenerator.generateHtml(
                reviewReminderOverdueEmailTemplateData,
            );

            expect(emailContent).toContain('Your review is overdue');
            expect(emailContent).toContain('Dear barry jenkins,');
            expect(emailContent).toContain('Your review of some research is 223 days overdue.');
            expect(emailContent).toContain('The review was due on 7 July 2023.');
            expect(emailContent).toContain('Opportunity');
            expect(emailContent).toContain('OPP234: Some Opportunity Name');
            expect(emailContent).toContain('Application');
            expect(emailContent).toContain('APP123: some research');
            expect(emailContent).toContain(
                'You can still complete your review via <a href="www.example-review.com">The Funding Service</a>.',
            );

            expect(emailContent).toContain('Email: support@funding-service.ukri.org');
            expect(emailContent).toContain('Telephone: +44 (0)1793 547 490');
            expect(emailContent).toContain(`UKRI, part of UK Research and Innovation`);
            expect(emailContent).toContain(`This is an automated message – do not reply.`);
        });
    });
    describe('text', () => {
        it('text content', () => {
            const emailContent = reviewReminderOverdueEmailGenerator.generateText(
                reviewReminderOverdueEmailTemplateData,
            );

            expect(emailContent).toContain('Your review is overdue');
            expect(emailContent).toContain('Dear barry jenkins,');
            expect(emailContent).toContain('Your review of some research is 223 days overdue.');
            expect(emailContent).toContain('The review was due on 7 July 2023.');
            expect(emailContent).toContain('Opportunity');
            expect(emailContent).toContain('OPP234: Some Opportunity Name');
            expect(emailContent).toContain('Application');
            expect(emailContent).toContain('APP123: some research');
            expect(emailContent).toContain('You can still complete your review via www.example-review.com.');

            expect(emailContent).toContain('Email: support@funding-service.ukri.org');
            expect(emailContent).toContain('Telephone: +44 (0)1793 547 490');
            expect(emailContent).toContain(`UKRI, part of UK Research and Innovation`);
            expect(emailContent).toContain(`This is an automated message – do not reply.`);
        });
    });
    describe('email', () => {
        it('generate a generic Email object', () => {
            const toAddresses = ['j@fakeemail.com'];

            const email = reviewReminderOverdueEmailGenerator.generateEmail(
                toAddresses,
                reviewReminderOverdueEmailTemplateData,
                emailConfig,
            );

            expect(email.html).toContain('Dear barry jenkins');
            expect(email.subject).toContain('UKRI Funding Service - reminder to review');
            expect(email.sourceEmail).toContain(emailConfig.sourceEmail);
            expect(email.sourceDisplayName).toContain(emailConfig.sourceDisplayName);
            expect(email.toAddresses).toEqual(toAddresses);
        });
    });

    describe('generateEmailPreview', () => {
        it('should not contain disruptive tags', () => {
            const toAddresses = ['j@fakeemail.com'];
            const uut = new ReviewReminderOverdueEmailGenerator();

            const email = uut.generateEmailPreview(toAddresses, reviewReminderOverdueEmailTemplateData, emailConfig);

            expect(email.html).not.toContain('<head>');
            expect(email.html).not.toContain('<img');
            expect(email.html).not.toContain('<style');

            expect(email.html).not.toContain('Respond now');
        });

        it('should not contain links', () => {
            const toAddresses = ['j@fakeemail.com'];
            const uut = new ReviewReminderOverdueEmailGenerator();

            const email = uut.generateEmailPreview(toAddresses, reviewReminderOverdueEmailTemplateData, emailConfig);

            expect(email.html).not.toContain('<a href>');
        });

        it('should not contain button related text', () => {
            const toAddresses = ['j@fakeemail.com'];
            const uut = new ReviewReminderOverdueEmailGenerator();

            const email = uut.generateEmailPreview(toAddresses, reviewReminderOverdueEmailTemplateData, emailConfig);

            expect(email.html).not.toContain(
                `If the button does not work, use the link below or copy and paste it into your browser's address bar.`,
            );
        });
    });
});
