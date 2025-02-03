import { InboundChannel, OutboundChannel } from '.';

export interface ChannelFactory {
    newInboundChannel(channelId: string): InboundChannel;
    newOutboundChannel(channelId: string): OutboundChannel;
}
