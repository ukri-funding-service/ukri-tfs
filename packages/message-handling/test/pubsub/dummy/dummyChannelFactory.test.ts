import 'mocha';
import { expect } from 'chai';
import {
    DummyChannelFactory,
    DummyChannelConfig,
    DummyInboundChannel,
    DummyOutboundChannel,
} from '../../../src/pubsub/dummy';
import { Logger } from '../../../src/logger';
import { DummyLogger } from '../../../src/pubsub/dummy/dummyLogger';

describe('packages/message-handling - pubsub/dummy', () => {
    const configWithNoChannel: DummyChannelConfig = {
        inbound: [],
        outbound: [],
    };

    const configWithInboundChannel: DummyChannelConfig = {
        inbound: [{ channelId: 'my-channel', inboundConfig: { shouldThrowError: false } }],
        outbound: [],
    };

    const configWithOutboundChannel: DummyChannelConfig = {
        inbound: [],
        outbound: [{ channelId: 'my-channel', outboundConfig: { shouldThrowError: false } }],
    };

    const logger: Logger = new DummyLogger();

    describe('DummyChannelFactory - instantiation', () => {
        it('should be instantiatable with minimal config', () => {
            expect(new DummyChannelFactory(configWithNoChannel, logger)).to.exist;
        });
    });

    describe('DummyChannelFactory - inbound channels', () => {
        const randomChannelId = Math.random().toString(16).substr(2, 8);

        it(`should reject an unknown random channel id ${randomChannelId}`, () => {
            const uut = new DummyChannelFactory(configWithInboundChannel, logger);

            expect(() => uut.newInboundChannel(randomChannelId)).to.throw(Error);
        });

        it('should create a known channel id', () => {
            const uut = new DummyChannelFactory(configWithInboundChannel, logger);

            expect(uut.newInboundChannel('my-channel')).to.be.an.instanceOf(DummyInboundChannel);
        });
    });

    describe('DummyChannelFactory - outbound channels', () => {
        const randomChannelId = Math.random().toString(16).substr(2, 8);

        it(`should reject an unknown random channel id ${randomChannelId}`, () => {
            const uut = new DummyChannelFactory(configWithOutboundChannel, logger);

            expect(() => uut.newOutboundChannel(randomChannelId)).to.throw(Error);
        });

        it('should create a known channel id', () => {
            const uut = new DummyChannelFactory(configWithOutboundChannel, logger);

            expect(uut.newOutboundChannel('my-channel')).to.be.an.instanceOf(DummyOutboundChannel);
        });
    });
});
