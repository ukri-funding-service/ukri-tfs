import { ChannelFactory, InboundChannel } from '..';

const inboundChannels: Map<string, InboundChannel> = new Map();

export const createInboundChannels = (theChannelFactory: ChannelFactory, channelIds: string[]): void => {
    channelIds.forEach(channelId => inboundChannels.set(channelId, theChannelFactory.newInboundChannel(channelId)));
};

export const getInboundChannel = (channelId: string): InboundChannel => {
    if (!inboundChannels.has(channelId)) {
        throw new Error(`Unknown inbound channel id ${channelId}`);
    }

    return inboundChannels.get(channelId)!;
};
