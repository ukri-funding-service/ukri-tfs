import { SendStrategy } from './sendStrategy';
import { Email } from '../email';

import { SES } from '@aws-sdk/client-ses';

// Define our own types here to avoid exporting TypeScript 4 specific stuff to projects still using TypeScript 3

// make these properties mandatory
export interface AwsSdkSesOptions {
    region: string;
    apiVersion: string; // date in string format e.g. '2010-12-01'
}

interface Content {
    Charset: string;
    Data: string;
}

interface Body {
    Html: Content;
    Text: Content;
}

interface Message {
    Body: Body;
    Subject: Content;
}

interface Destination {
    ToAddresses: string[];
    CcAddresses?: string[];
    BccAddresses?: string[];
}
interface SendEmailRequest {
    Destination: Destination;
    Message: Message;
    Source: string;
    ReplyToAddresses?: string[];
}

interface SendEmailResponse {
    MessageId: string | undefined;
}

type StrategySpecificMailOptions = SendEmailRequest;
type StrategySpecificServerResponse = SendEmailResponse | Error;

/**
 * Implementation of a send strategy using the AWS SES SDK to be used within an Email Service
 * https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/ses-examples-sending-email.html
 */
export class AwsSdkSesSendStrategy
    implements SendStrategy<StrategySpecificMailOptions, StrategySpecificServerResponse>
{
    constructor(private awsSesOptions: AwsSdkSesOptions) {}

    convertEmailToStrategySpecificEmail(email: Email): StrategySpecificMailOptions {
        // mandatory options
        const options: StrategySpecificMailOptions = {
            Destination: {
                ToAddresses: email.toAddresses,
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: email.html,
                    },
                    Text: {
                        Charset: 'UTF-8',
                        Data: email.text,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: email.subject,
                },
            },
            Source: `${email.sourceDisplayName} <${email.sourceEmail}>`,
        };

        // optional
        if (email.ccAddresses && options.Destination) options.Destination.CcAddresses = email.ccAddresses;
        if (email.bccAddresses && options.Destination) options.Destination.BccAddresses = email.bccAddresses;
        if (email.replyToAddresses) options.ReplyToAddresses = email.replyToAddresses;

        return options;
    }

    async send(email: StrategySpecificMailOptions): Promise<StrategySpecificServerResponse> {
        return new SES(this.awsSesOptions).sendEmail(email);
    }
}
