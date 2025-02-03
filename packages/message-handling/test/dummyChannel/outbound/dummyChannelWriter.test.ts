// Dummy channel code provided as an optional placeholder for a working channel.

import { expect } from 'chai';
import 'chai-as-promised';
import { DummyChannelWriterDEADCODE } from '../../../src/dummyChannel';

describe('packages/message-handling - dummyChannel/outbound/dummyChannelWriter', () => {
    it('can be instantiated', () => {
        expect(new DummyChannelWriterDEADCODE()).to.exist;
    });

    it('can write', async () => {
        const uut = new DummyChannelWriterDEADCODE();

        await expect(uut.write('hello')).to.eventually.be.fulfilled;
    });

    it('can write expected data', async () => {
        const uut = new DummyChannelWriterDEADCODE();

        await uut.write('hello');

        expect(uut.writtenData).to.include.all.members(['hello']);
    });
});
