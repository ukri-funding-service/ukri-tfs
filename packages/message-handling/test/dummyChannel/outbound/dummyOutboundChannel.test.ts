// Dummy channel code provided as an optional placeholder for a working channel.

import { expect } from 'chai';
import 'chai-as-promised';
import { DummyOutboundChannelDEADCODE } from '../../../src/dummyChannel/outbound/dummyOutboundChannel';
import { DummyChannelWriterDEADCODE } from '../../../src/dummyChannel';
import { ChannelWriter } from '../../../src/channel';

describe('packages/message-handling - dummyChannel/outbound/dummyOutboundChannel', () => {
    it('can be instantiated', () => {
        expect(new DummyOutboundChannelDEADCODE('my-channel')).to.exist;
    });

    it('can return  writer', () => {
        const uut = new DummyOutboundChannelDEADCODE('my-channel');

        expect(uut.writer()).to.exist;
    });

    it('default writer is instance of DummyChannelWriter', () => {
        const uut = new DummyOutboundChannelDEADCODE('my-channel');
        expect(uut.writer()).to.be.instanceOf(DummyChannelWriterDEADCODE);
    });

    it('returns given writer when provided', () => {
        const myWriter: ChannelWriter<string> = {
            write: function (_data: string): Promise<void> {
                throw new Error('Function not implemented.');
            },
        };

        const uut = new DummyOutboundChannelDEADCODE('my-channel', myWriter);
        expect(uut.writer()).to.equal(myWriter);
    });
});
