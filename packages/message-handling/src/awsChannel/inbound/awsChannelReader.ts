import { IdentityCodec } from '../../codec/codec';
import { ChannelReader } from '../../channel/inbound/channelReader';
import { SqsQueue } from './sqsQueue';

export class AwsChannelReader implements ChannelReader<string> {
    constructor(private sqsQueue: SqsQueue) {}

    read(): Promise<string[]> {
        return this.sqsQueue.receiveAndDecode(new IdentityCodec());
    }
}
