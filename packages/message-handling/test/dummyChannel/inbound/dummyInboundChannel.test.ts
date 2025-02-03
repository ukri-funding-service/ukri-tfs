// Dummy channel code provided as an optional placeholder for a working channel.

import { expect } from 'chai';
import 'mocha';
import { DummyChannelReaderDEADCODE } from '../../../src/dummyChannel/inbound/dummyChannelReader';
import { DummyInboundChannelDEADCODE } from '../../../src/dummyChannel/inbound/dummyInboundChannel';

describe('packages/message-handling - dummyChannel/inbound/dummyInboundChannel', () => {
    it('can be instantiated', () => {
        expect(new DummyInboundChannelDEADCODE('my-channel')).to.exist;
    });

    it('can produce a reader', async () => {
        const uut = new DummyInboundChannelDEADCODE('my-channel');

        const response = await uut.reader();

        expect(response).to.exist;
        expect(response).to.be.instanceOf(DummyChannelReaderDEADCODE);
    });
});
