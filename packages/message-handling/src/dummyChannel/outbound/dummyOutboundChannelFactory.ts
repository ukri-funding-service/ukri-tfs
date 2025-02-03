// Dummy channel code provided as an optional placeholder for a working channel.

import { ChannelFactory } from '../../channel';
import { ChannelWriter } from '../../channel';
import { DummyOutboundChannelDEADCODE } from './dummyOutboundChannel';

export interface DummyOutboundChannelConfig {
    channelId: string;
    channelWriter?: ChannelWriter<string>;
}

export class DummyOutboundChannelFactoryDEADCODE implements ChannelFactory<DummyOutboundChannelDEADCODE> {
    create(config: DummyOutboundChannelConfig): DummyOutboundChannelDEADCODE {
        return new DummyOutboundChannelDEADCODE(config.channelId, config.channelWriter);
    }
}
