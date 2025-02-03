import { InboundChannel } from '../../channel/channel';
import { ChannelReader } from '../../channel/inbound/channelReader';
import { AwsChannelReader } from './awsChannelReader';
import { SqsQueue } from './sqsQueue';

export class AwsInboundChannel implements InboundChannel<string> {
    constructor(public readonly queue: SqsQueue) {}

    reader(): ChannelReader<string> {
        return new AwsChannelReader(this.queue);
    }
}
