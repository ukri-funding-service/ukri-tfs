import { InboundChannel, OutboundChannel } from '../channel';
import { ChannelFactory } from '../channelFactory';
import { CompressibleInboundChannel } from './compressibleInboundChannel';
import { CompressibleOutboundChannel } from './compressibleOutbandChannel';

export class CompressibleChannelFactory implements ChannelFactory {
    constructor(private baseChannelFactory: ChannelFactory) {}

    newOutboundChannel(channelId: string): OutboundChannel {
        return new CompressibleOutboundChannel(this.baseChannelFactory.newOutboundChannel(channelId));
    }

    newInboundChannel(channelId: string): InboundChannel {
        return new CompressibleInboundChannel(this.baseChannelFactory.newInboundChannel(channelId));
    }
}
