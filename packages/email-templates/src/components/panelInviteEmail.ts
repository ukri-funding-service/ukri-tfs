import { generateEmailParagraph, generateHtmlListItem, generateHtmlList } from './index';

export type PanelInviteEmailConfig = {
    inviteLink: string;
    invitee: {
        firstName: string;
        lastName: string;
    };
};

export const generateRoleSpecificHtml = (
    role: string,
    inviteEmailConfig: PanelInviteEmailConfig,
    commentsRequired: boolean,
): string => {
    let html = '';
    if (role === 'CHAIR' || role === 'DEPUTY_CHAIR')
        html = `    ${generateHtmlListItem(
            generateEmailParagraph(
                `Sign in to your Funding Service Account (${inviteEmailConfig.inviteLink}) to view the panel details (if you do not already have an account, you'll be asked to create one).`,
                'noMargin',
            ),
        )}${generateHtmlListItem(
            generateEmailParagraph(
                `Review all applications (declaring any conflicts of interests as you go).`,
                'noMargin',
            ),
        )}${generateHtmlListItem(generateEmailParagraph(preliminaryScoreText(commentsRequired)))}`;
    else {
        html = `    ${generateHtmlListItem(
            generateEmailParagraph(
                `Sign in to your Funding Service Account (${inviteEmailConfig.inviteLink}) to view the panel details (if you do not already have an account, you'll be asked to create one).`,
                'noMargin',
            ),
        )}${generateHtmlListItem(
            generateEmailParagraph(
                `Review any applications where you've been assigned a role (declaring any conflicts of interests as you go).`,
                'noMargin',
            ),
        )}${generateHtmlListItem(generateEmailParagraph(preliminaryScoreText(commentsRequired)))}`;
    }
    return generateHtmlList(html);
};

export const generateRoleSpecificText = (
    role: string,
    inviteEmailConfig: PanelInviteEmailConfig,
    commentsRequired: boolean,
): string => {
    if (role === 'CHAIR' || role === 'DEPUTY_CHAIR')
        return `    1. Sign in to your Funding Service Account (${
            inviteEmailConfig.inviteLink
        }) to view the panel details (if you do not already have an account, you'll be asked to create one).
            2. Review all applications (declaring any conflicts of interests as you go).
            3. ${preliminaryScoreText(commentsRequired)}`;
    else {
        return `    1. Sign in to your Funding Service Account (${
            inviteEmailConfig.inviteLink
        }) to view the panel details (if you do not already have an account, you'll be asked to create one).
            2. Review any applications where you've been assigned a role (declaring any conflicts of interests as you go).
            3. ${preliminaryScoreText(commentsRequired)}`;
    }
};

const preliminaryScoreText = (commentsRequired: boolean) => {
    return `If you've been assigned an introducer role for an application, give it a preliminary score${
        commentsRequired ? ' and add your comments' : ''
    }.`;
};
