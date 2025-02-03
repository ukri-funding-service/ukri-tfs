// Dummy channel code provided as an optional placeholder for a working channel.

import 'mocha';
import { expect } from 'chai';
import 'sinon-chai';
import { DummyInboundChannelDEADCODE, DummyInboundChannelFactoryDEADCODE } from '../../../src/dummyChannel/inbound';

describe('packages/message-handling - dummyChannel/inbound/dummyInboundChannelFactory', () => {
    it('should be instantiatable', () => {
        expect(new DummyInboundChannelFactoryDEADCODE()).to.exist;
    });

    it('should create a DummyInboundChannel', () => {
        const uut = new DummyInboundChannelFactoryDEADCODE();

        expect(uut.create('my-channel')).to.be.an.instanceOf(DummyInboundChannelDEADCODE);
    });

    it('should create a channel', () => {
        const uut = new DummyInboundChannelFactoryDEADCODE();

        expect(uut.create('my-channel')).to.be.an.instanceOf(DummyInboundChannelDEADCODE);
    });
});
