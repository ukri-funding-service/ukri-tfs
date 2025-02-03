import Ajv, { ValidateFunction } from 'ajv';
import { Logger } from '../../logger';
import { OutboundChannel } from '../channel';
import { TfsMessage } from '../message';
import { ValidatedOutboundChannelConfig } from './validatedChannelFactory';
import addFormats from 'ajv-formats';

export const datesToStrings = (data: unknown): unknown => {
    if (data instanceof Date) {
        return data.toISOString();
    } else if (Array.isArray(data)) {
        return data.map(datesToStrings);
    } else if (typeof data === 'object' && data !== null) {
        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => {
                return [key, datesToStrings(value)];
            }),
        );
    } else {
        return data;
    }
};

export class ValidatedOutboundChannel implements OutboundChannel {
    private ajv: Ajv;
    private validate: ValidateFunction;

    constructor(
        private config: ValidatedOutboundChannelConfig,
        private logger: Logger,
        private baseOutboundChannel: OutboundChannel,
    ) {
        try {
            this.ajv = new Ajv({ removeAdditional: 'all' });
            addFormats(this.ajv);
            config.schemaDefinitions.forEach(schema => this.ajv.addSchema(schema));
            this.validate = this.ajv.compile(config.schema);
        } catch (e) {
            console.error(e);
            this.logger.error(e);
            throw e;
        }
    }

    doValidation(data: unknown): void {
        const txt1 = JSON.stringify(data);
        const result = this.validate(datesToStrings(data));

        if (!result) {
            const msg = `Invalid outbound message sent on channel ${this.config.channelId}: ${this.ajv.errorsText(
                this.validate.errors,
            )}`;

            this.logger.error(msg);
        }

        const txt2 = JSON.stringify(data);
        if (txt1 !== txt2) {
            let startPos = 0;
            for (startPos = 0; startPos < txt2.length; ++startPos) {
                if (txt1[startPos] !== txt2[startPos]) {
                    break;
                }
            }
            const endPos = txt1.indexOf(':', startPos);
            const additionalProperty = txt1.slice(startPos + 1, endPos);
            const msg = `Invalid outbound message sent on channel ${this.config.channelId} with additional property "${additionalProperty}`;
            this.logger.error(msg);
        }
    }

    async publish(message: TfsMessage): Promise<void> {
        await this.baseOutboundChannel.publish(message);
        this.doValidation(message);
    }

    async publishRaw(payload: string): Promise<void> {
        await this.baseOutboundChannel.publishRaw(payload);
        this.doValidation(JSON.parse(payload));
    }
}
