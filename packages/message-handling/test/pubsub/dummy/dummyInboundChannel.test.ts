import { expect } from 'chai';
import 'chai-as-promised';
import 'mocha';
import { DummyInboundChannel } from '../../../src/pubsub/dummy/dummyInboundChannel';

describe('packages/message-handling - pubsub/dummy', () => {
    describe('dummyInboundChannel - default construction', () => {
        it('should be possible to create one', () => {
            expect(new DummyInboundChannel()).to.exist;
        });

        it('should return an empty message array', () => {
            const uut = new DummyInboundChannel();
            expect(uut.receive()).to.eventually.equal([]);
        });
    });

    describe('dummyInboundChannel - message access', () => {
        let uut: DummyInboundChannel;

        beforeEach(() => {
            uut = new DummyInboundChannel();
        });

        it('should be possible to force an error', () => {
            uut.shouldThrowError = true;
            expect(uut.receive()).to.eventually.be.rejectedWith(Error);
        });
    });
});
