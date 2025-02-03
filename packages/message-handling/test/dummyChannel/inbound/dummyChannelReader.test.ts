// Dummy channel code provided as an optional placeholder for a working channel.

import { expect } from 'chai';
import 'chai-as-promised';
import { DummyChannelReaderDEADCODE } from '../../../src/dummyChannel';

describe('packages/message-handling - dummyChannel/inbound/dummyChannelReader', () => {
    it('can be instantiated', () => {
        expect(new DummyChannelReaderDEADCODE()).to.exist;
    });

    it('can be read when data is available', async () => {
        const uut = new DummyChannelReaderDEADCODE();
        uut.returnMeOnRead.push('hello');

        await expect(uut.read()).to.eventually.be.fulfilled;
    });

    it('can be read when data is not available', async () => {
        const uut = new DummyChannelReaderDEADCODE();

        await expect(uut.read()).to.eventually.be.fulfilled;
    });

    it('can read expected data', async () => {
        const uut = new DummyChannelReaderDEADCODE();
        uut.returnMeOnRead = ['some data', 'some more data'];

        const result = await uut.read();

        expect(result).to.include.members(['some data', 'some more data']);
    });

    it('returns empty set if no data is available', async () => {
        const uut = new DummyChannelReaderDEADCODE();

        const result = await uut.read();

        expect(result.length).to.equal(0);
    });

    it('rejects with Error when requested', async () => {
        const uut = new DummyChannelReaderDEADCODE();
        uut.throwThisOnRead = new Error('oops');

        await expect(uut.read()).to.eventually.be.rejectedWith('oops');
    });
});
