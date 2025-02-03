import { ChannelFactory, OutboundChannel } from '..';

const outboundChannels: Map<string, OutboundChannel> = new Map();

export const createOutboundChannels = (theChannelFactory: ChannelFactory, channelIds: string[]): void => {
    channelIds.forEach(channelId => outboundChannels.set(channelId, theChannelFactory.newOutboundChannel(channelId)));
};

export const getOutboundChannel = (channelId: string): OutboundChannel => {
    if (!outboundChannels.has(channelId)) {
        throw new Error(`Unknown outbound channel id ${channelId}`);
    }

    return outboundChannels.get(channelId)!;
};
