import { OutboundChannel } from '../../channel/channel';
import { ChannelWriter } from '../../channel/outbound/channelWriter';
import { AwsChannelWriter } from './awsChannelWriter';
import { SnsTopic } from './snsTopic';

export class AwsOutboundChannel implements OutboundChannel<string> {
    constructor(public readonly topic: SnsTopic) {}

    writer(): ChannelWriter<string> {
        return new AwsChannelWriter(this.topic);
    }
}
