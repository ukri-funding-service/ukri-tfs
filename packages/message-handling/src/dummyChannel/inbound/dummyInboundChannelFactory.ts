// Dummy channel code provided as an optional placeholder for a working channel.

import { ChannelFactory } from '../../channel';
import { DummyInboundChannelDEADCODE } from './dummyInboundChannel';

export class DummyInboundChannelFactoryDEADCODE implements ChannelFactory<DummyInboundChannelDEADCODE> {
    create(channelId: string): DummyInboundChannelDEADCODE {
        return new DummyInboundChannelDEADCODE(channelId);
    }
}
