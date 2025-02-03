import { Logger } from '../../logger';
import { InboundChannel, OutboundChannel } from '../channel';
import { ChannelFactory } from '../channelFactory';
import { InboundChannelConfig, OutboundChannelConfig } from '../config';
import { ValidatedOutboundChannel } from './validatedOutboundChannel';

export interface Schema {
    $id: string;
}

export interface ValidatedOutboundChannelConfig extends OutboundChannelConfig {
    schema: Schema;
    schemaDefinitions: Schema[];
}

export interface ValidatedChannelConfig<
    TInbound extends InboundChannelConfig,
    TOutbound extends OutboundChannelConfig,
> {
    outbound: (TOutbound & ValidatedOutboundChannelConfig)[];
    inbound: TInbound[];
}

export type ValidatedChannelFactoryConfig<
    TConfig,
    TInbound extends InboundChannelConfig,
    TOutbound extends OutboundChannelConfig,
> = TConfig & {
    channels: ValidatedChannelConfig<TInbound, TOutbound>;
};

export class ValidatedChannelFactory<
    TConfig,
    TInbound extends InboundChannelConfig,
    TOutbound extends OutboundChannelConfig,
> implements ChannelFactory
{
    constructor(
        private config: ValidatedChannelFactoryConfig<TConfig, TInbound, TOutbound>,
        private logger: Logger,
        private baseChannelFactory: ChannelFactory,
    ) {}

    newInboundChannel(channelId: string): InboundChannel {
        return this.baseChannelFactory.newInboundChannel(channelId);
    }

    newOutboundChannel(channelId: string): OutboundChannel {
        const [outboundConfig] = this.config.channels.outbound.filter(config => config.channelId === channelId);

        if (!outboundConfig) {
            throw new Error(`Outbound config for channel ${channelId} not found`);
        }

        return new ValidatedOutboundChannel(
            outboundConfig,
            this.logger,
            this.baseChannelFactory.newOutboundChannel(channelId),
        );
    }
}
