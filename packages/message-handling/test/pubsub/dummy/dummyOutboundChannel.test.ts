import 'mocha';
import sinon from 'sinon';
import { expect } from 'chai';
import 'chai-as-promised';
import { DummyOutboundChannel } from '../../../src/pubsub/dummy/dummyOutboundChannel';
import { DummyLogger } from '../../../src/pubsub/dummy/dummyLogger';
import { Logger } from '../../../src/logger';

describe('packages/message-handling - pubsub/dummy', () => {
    const logger: Logger = new DummyLogger();
    const channelId = 'test-channel';

    beforeEach(() => {
        sinon.stub(console, 'log'); // Hide console logging of provider
    });

    afterEach(sinon.restore);

    describe('dummyOutboundChannel - default construction', () => {
        it('should be possible to create one', () => {
            expect(new DummyOutboundChannel(channelId, logger)).to.exist;
        });

        it('should resolve', () => {
            const uut = new DummyOutboundChannel(channelId, logger);
            expect(uut.publish({ type: '1', data: { wibble: 'wobble' } })).to.be.eventually.fulfilled;
        });
    });

    describe('dummyOutboundChannel - message access', () => {
        const message = { type: '1', data: { wibble: 'wobble' } };
        let uut: DummyOutboundChannel;

        beforeEach(() => {
            uut = new DummyOutboundChannel(channelId, logger);
        });

        it('should be possible to get the message returned', async () => {
            await uut.publish(message);
            expect(uut.messagesPublished).to.deep.equal([{ type: '1', data: { wibble: 'wobble' } }]);
        });

        it('should be possible to get the raw message returned', async () => {
            await uut.publishRaw(JSON.stringify(message));
            expect(uut.rawDataPublished).to.deep.equal([JSON.stringify({ type: '1', data: { wibble: 'wobble' } })]);
        });

        it('should be possible to force an error', async () => {
            uut.shouldThrowError = true;
            await expect(uut.publish(message)).to.eventually.be.rejectedWith(Error);
        });

        it('should be possible to force an error raw', async () => {
            uut.shouldThrowError = true;
            await expect(uut.publishRaw(JSON.stringify(message))).to.eventually.be.rejectedWith(Error);
        });
    });
});
