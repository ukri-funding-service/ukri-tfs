import { IsValidPayload } from '../../pollMessages';
import { InboundChannel } from '../channel';
import { SqsQueue } from './sqsQueue';

export class AwsInboundChannel implements InboundChannel {
    constructor(public readonly queue: SqsQueue) {}

    receive<T>(isValidPayload?: IsValidPayload): Promise<T[]> {
        return this.queue.receive<T>(isValidPayload);
    }
}
