import { DummyInboundChannel, DummyInboundConfig, DummyOutboundChannel, DummyOutboundConfig } from '.';
import {
    ChannelFactory,
    CombinedChannelConfig,
    InboundChannel,
    InboundChannelConfig,
    OutboundChannel,
    OutboundChannelConfig,
} from '..';
import { Logger } from '../../logger';

export interface DummyInboundChannelConfig extends OutboundChannelConfig {
    inboundConfig: DummyInboundConfig;
}

export interface DummyOutboundChannelConfig extends InboundChannelConfig {
    outboundConfig: DummyOutboundConfig;
}

export interface DummyChannelConfig extends CombinedChannelConfig {
    inbound: DummyInboundChannelConfig[];
    outbound: DummyOutboundChannelConfig[];
}

export interface DummyChannelFactoryConfig {
    channels: DummyChannelConfig;
}

export class DummyChannelFactory implements ChannelFactory {
    private inboundChannelConfig: Map<string, DummyInboundConfig> = new Map();
    private outboundChannelConfig: Map<string, DummyOutboundConfig> = new Map();

    constructor(config: DummyChannelConfig, readonly logger: Logger) {
        config.inbound.forEach(dummyConfig => {
            this.inboundChannelConfig.set(dummyConfig.channelId, dummyConfig.inboundConfig);
        });
        config.outbound.forEach(dummyConfig => {
            this.outboundChannelConfig.set(dummyConfig.channelId, dummyConfig.outboundConfig);
        });
    }

    newInboundChannel(channelId: string): InboundChannel {
        if (!this.inboundChannelConfig.has(channelId)) {
            throw new Error(`Unconfigured inbound channel ${channelId}`);
        }

        const config = this.inboundChannelConfig.get(channelId)!;

        return new DummyInboundChannel(config);
    }

    newOutboundChannel(channelId: string): OutboundChannel {
        if (!this.outboundChannelConfig.has(channelId)) {
            throw new Error(`Unconfigured outbound channel ${channelId}`);
        }

        const config = this.outboundChannelConfig.get(channelId)!;

        return new DummyOutboundChannel(channelId, this.logger, config);
    }
}
