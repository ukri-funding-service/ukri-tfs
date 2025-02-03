import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { generateRoleSpecificHtml, generateRoleSpecificText, PanelInviteEmailConfig } from './panelInviteEmail';

jest.mock('../components', () => {
    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(jest.requireActual('../components') as any),
        generateEmailParagraph: (param: string) => `<p>${param}</p>`,
        generateHtmlListItem: (content: string) => `<li>${content}</li>`,
        generateHtmlList: (content: string) => `<ol>${content}</ol>`,
    };
});

describe('Email components - panelInviteEmail', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('generateRoleSpecificHtml', () => {
        it('should generate html when the role is chair', async () => {
            const inviteConfig: PanelInviteEmailConfig = {
                invitee: {
                    firstName: 'Dave',
                    lastName: 'Morrison',
                },
                inviteLink: 'test-invite-link',
            };

            const generatedRoleSpecificHtml = generateRoleSpecificHtml('CHAIR', inviteConfig, false);

            expect(generatedRoleSpecificHtml).toBe(
                `<ol>    <li><p>Sign in to your Funding Service Account (test-invite-link) to view the panel details (if you do not already have an account, you'll be asked to create one).</p></li><li><p>Review all applications (declaring any conflicts of interests as you go).</p></li><li><p>If you've been assigned an introducer role for an application, give it a preliminary score.</p></li></ol>`,
            );
        });

        it('should generate html when the role is not provided and comments are required', async () => {
            const inviteConfig: PanelInviteEmailConfig = {
                invitee: {
                    firstName: 'Dave',
                    lastName: 'Morrison',
                },
                inviteLink: 'test-invite-link',
            };

            const generatedRoleSpecificHtml = generateRoleSpecificHtml('incorrect role', inviteConfig, true);

            expect(generatedRoleSpecificHtml).toBe(
                `<ol>    <li><p>Sign in to your Funding Service Account (test-invite-link) to view the panel details (if you do not already have an account, you'll be asked to create one).</p></li><li><p>Review any applications where you've been assigned a role (declaring any conflicts of interests as you go).</p></li><li><p>If you've been assigned an introducer role for an application, give it a preliminary score and add your comments.</p></li></ol>`,
            );
        });
    });

    describe('generateRoleSpecificText', () => {
        it('should generate text when the role is chair', async () => {
            const inviteConfig: PanelInviteEmailConfig = {
                invitee: {
                    firstName: 'Dave',
                    lastName: 'Morrison',
                },
                inviteLink: 'test-invite-link',
            };

            const generatedRoleSpecificText = generateRoleSpecificText('CHAIR', inviteConfig, false);

            expect(generatedRoleSpecificText).toBe(
                `    1. Sign in to your Funding Service Account (test-invite-link) to view the panel details (if you do not already have an account, you'll be asked to create one).
            2. Review all applications (declaring any conflicts of interests as you go).
            3. If you've been assigned an introducer role for an application, give it a preliminary score.`,
            );
        });

        it('should generate html when the role is not provided and comments are required', async () => {
            const inviteConfig: PanelInviteEmailConfig = {
                invitee: {
                    firstName: 'Dave',
                    lastName: 'Morrison',
                },
                inviteLink: 'test-invite-link',
            };

            const generatedRoleSpecificText = generateRoleSpecificText('incorrect role', inviteConfig, true);

            expect(generatedRoleSpecificText).toBe(
                `    1. Sign in to your Funding Service Account (test-invite-link) to view the panel details (if you do not already have an account, you'll be asked to create one).
            2. Review any applications where you've been assigned a role (declaring any conflicts of interests as you go).
            3. If you've been assigned an introducer role for an application, give it a preliminary score and add your comments.`,
            );
        });
    });
});
