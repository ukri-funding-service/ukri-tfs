import { OutboundChannel } from '../channel';
import { Logger } from '../../logger';
import { TfsMessage } from '../message';

export interface DummyOutboundConfig {
    shouldThrowError: boolean;
}

export class DummyOutboundChannel implements OutboundChannel {
    readonly messagesPublished: TfsMessage[] = [];
    readonly rawDataPublished: string[] = [];
    shouldThrowError = false;

    constructor(protected channelId: string, protected logger: Logger, config?: DummyOutboundConfig) {
        if (config) {
            this.shouldThrowError = config.shouldThrowError;
        }
    }

    async publishRaw(payload: string): Promise<void> {
        if (this.shouldThrowError) {
            return Promise.reject(new Error('Throwing error as requested'));
        }

        this.rawDataPublished.push(payload);
        this.logger.info(
            `Data (raw) written to dummy channel with channelId ${this.channelId}, length ${payload.length}`,
        );
    }

    async publish(message: TfsMessage): Promise<void> {
        if (this.shouldThrowError) {
            return Promise.reject(new Error('Throwing error as requested'));
        }

        this.messagesPublished.push(message);
        this.logger.info(`Data written to dummy channel with channelId ${this.channelId}`);
    }
}
