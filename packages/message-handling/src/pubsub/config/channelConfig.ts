export interface InboundChannelConfig {
    channelId: string;
}

export interface OutboundChannelConfig {
    channelId: string;
}

export type ChannelConfig = InboundChannelConfig | OutboundChannelConfig;

export interface CombinedChannelConfig {
    inbound: InboundChannelConfig[];
    outbound: OutboundChannelConfig[];
}
