import { ChannelWriter } from '../../channel/outbound/channelWriter';
import { SnsTopic } from './snsTopic';

export class AwsChannelWriter implements ChannelWriter<string> {
    constructor(private snsTopic: SnsTopic) {}

    write(data: string): Promise<void> {
        return this.snsTopic.publish(data);
    }
}
