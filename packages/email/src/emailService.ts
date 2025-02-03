import { AnEmailService } from './anEmailService';
import { Email } from './email';
import { SendStrategy } from './sendStrategies';

/**
 * Generic Email Service to be used with a SendStrategy.
 */
export class EmailService<MailOptionType, ServerResponseType> implements AnEmailService<ServerResponseType> {
    constructor(private sendStrategy: SendStrategy<MailOptionType, ServerResponseType>) {}

    async send(email: Email): Promise<ServerResponseType> {
        const strategySpecificEmail = this.sendStrategy.convertEmailToStrategySpecificEmail(email);
        return this.sendStrategy.send(strategySpecificEmail);
    }
}
