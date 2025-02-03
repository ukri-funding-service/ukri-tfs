import { IsValidPayload } from '../../pollMessages';
import { InboundChannel } from '../channel';

export interface DummyInboundConfig {
    shouldThrowError: boolean;
}

export class DummyInboundChannel implements InboundChannel {
    shouldThrowError = false;

    constructor(config?: DummyInboundConfig) {
        if (config) {
            this.shouldThrowError = config.shouldThrowError;
        }
    }

    receive<T>(_isValidPayload?: IsValidPayload): Promise<T[]> {
        if (this.shouldThrowError) {
            return Promise.reject(new Error('Throwing error as requested'));
        }

        return Promise.resolve([]);
    }
}
