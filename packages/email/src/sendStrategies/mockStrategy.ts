/* istanbul ignore file */
import { SendStrategy } from './sendStrategy';

export interface MockSendStrategyOptions<MailOptions, ServerResponse> {
    convert: (email: unknown) => MailOptions;
    send: (email: unknown) => Promise<ServerResponse>;
}

/**
 * Mock implementation of a send strategy to be used for Email Service testing
 */
export class MockSendStrategy<MailOptions, ServerResponse> implements SendStrategy<MailOptions, ServerResponse> {
    constructor(public spies: MockSendStrategyOptions<MailOptions, ServerResponse>) {}

    convertEmailToStrategySpecificEmail(email: unknown): MailOptions {
        return this.spies.convert(email);
    }

    async send(email: MailOptions): Promise<ServerResponse> {
        return this.spies.send(email);
    }
}
