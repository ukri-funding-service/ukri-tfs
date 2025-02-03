/* istanbul ignore file */
import { Email } from '../email';
import { SendStrategy } from './sendStrategy';

export interface ApiMockEmailServiceOptions {
    url: string;
}

interface SendEmailRequest {
    to: string[];
    subject: string;
    textContent: string;
    htmlContent: string;
    from: string;
    replyTo?: string[];
    cc?: string[];
    bcc?: string[];
}

type StrategySpecificMailOptions = SendEmailRequest;
type StrategySpecificServerResponse = undefined;

/**
 * Implementation of a send strategy using the simple mock api for api tests
 */
export class ApiMockServiceStrategy
    implements SendStrategy<StrategySpecificMailOptions, StrategySpecificServerResponse>
{
    baseUrl: string;

    constructor(options: ApiMockEmailServiceOptions) {
        this.baseUrl = options.url;
    }

    convertEmailToStrategySpecificEmail(email: Email): StrategySpecificMailOptions {
        // mandatory options
        const options = {
            from: `${email.sourceDisplayName} <${email.sourceEmail}>`,
            to: email.toAddresses,
            subject: email.subject,
            textContent: email.text,
            htmlContent: email.html,
        } as StrategySpecificMailOptions;

        // optional
        if (email.ccAddresses) options.cc = email.ccAddresses;
        if (email.bccAddresses) options.bcc = email.bccAddresses;
        if (email.replyToAddresses) options.replyTo = email.replyToAddresses;

        return options;
    }
    /* istanbul ignore next */
    async send(email: StrategySpecificMailOptions): Promise<StrategySpecificServerResponse> {
        const response = await fetch(`${this.baseUrl}emails`, { method: 'PUT', body: JSON.stringify(email) });
        if (response.ok) {
            return;
        }
        throw new Error(await response.text());
    }
}
