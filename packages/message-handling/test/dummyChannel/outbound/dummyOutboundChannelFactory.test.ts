// Dummy channel code provided as an optional placeholder for a working channel.

import 'mocha';
import { expect } from 'chai';
import { DummyOutboundChannelDEADCODE, DummyOutboundChannelFactoryDEADCODE } from '../../../src/dummyChannel';

describe('packages/message-handling - dummyChannel/outbound/dummmyOutboundChannelFactory', () => {
    it('should be instantiatable', () => {
        expect(new DummyOutboundChannelFactoryDEADCODE()).to.exist;
    });

    it('should create a DummyOutboundChannel', () => {
        const uut = new DummyOutboundChannelFactoryDEADCODE();

        expect(uut.create({ channelId: 'my-channel' })).to.be.an.instanceOf(DummyOutboundChannelDEADCODE);
    });

    it('should create a channel', () => {
        const uut = new DummyOutboundChannelFactoryDEADCODE();

        expect(uut.create({ channelId: 'my-channel' })).to.exist;
    });
});
