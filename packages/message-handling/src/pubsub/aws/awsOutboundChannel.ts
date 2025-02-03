import { OutboundChannel } from '../channel';
import { TfsMessage } from '../message';
import { SnsTopic } from './snsTopic';

export class AwsOutboundChannel implements OutboundChannel {
    constructor(public readonly topic: SnsTopic) {}

    async publish(message: TfsMessage): Promise<void> {
        await this.publishRaw(JSON.stringify(message));
    }

    async publishRaw(payload: string): Promise<void> {
        await this.topic.publish(payload);
    }
}
