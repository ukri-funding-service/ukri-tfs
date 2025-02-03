import { baseEmailText } from './baseEmailText';
import { generateEmailParagraph } from './emailParagraph';

export interface EmailSignOffOptions {
    signOffText?: string;
    email?: string;
    telephone?: string;
}

export const generateEmailSignOffHtml = (options?: EmailSignOffOptions): string => {
    return `
        ${generateEmailParagraph(`${options?.signOffText ?? baseEmailText.signOff},`)}
        ${generateEmailParagraph(baseEmailText.fundingService, 'noMargin')}
        ${generateEmailParagraph(options?.email ?? baseEmailText.email, 'noMargin')}
        ${generateEmailParagraph(options?.telephone ?? baseEmailText.telephone, 'noMargin')}
        <br/>
        ${generateEmailParagraph(baseEmailText.automatedMessage)}`;
};

export const generateEmailSignOffText = (options?: EmailSignOffOptions): string => {
    return `
        ${`${options?.signOffText ?? baseEmailText.signOff},`}

        ${baseEmailText.fundingService}
        ${options?.email ?? baseEmailText.email}
        ${options?.telephone ?? baseEmailText.telephone}

        ${baseEmailText.automatedMessage}`;
};
