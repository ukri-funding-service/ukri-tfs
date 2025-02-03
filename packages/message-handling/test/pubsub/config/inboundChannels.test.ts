import { expect } from 'chai';
import { ChannelFactory, InboundChannel } from '../../../src/pubsub';
import { createInboundChannels, getInboundChannel } from '../../../src/pubsub/config/inboundChannels';

const channelFactory: ChannelFactory = {
    newInboundChannel: (channelId: String) => {
        return { channelId } as unknown as InboundChannel;
    },
} as unknown as ChannelFactory;

describe('packages/message-handling - pubsub/config/inboundChannels', () => {
    describe('createInboundChannels', () => {
        it('should work with no channels defined', () => {
            createInboundChannels(channelFactory, []);
        });

        it('should work with single channel defined', () => {
            createInboundChannels(channelFactory, ['abc']);
        });

        it('should work with multiple channels defined', () => {
            createInboundChannels(channelFactory, ['abc', 'def', 'hij']);
        });
    });

    describe('getInboundChannel', () => {
        it('should get channels ids which are defined in config', () => {
            createInboundChannels(channelFactory, ['abc', 'def']);

            expect(getInboundChannel('abc')).to.deep.equal({ channelId: 'abc' });
            expect(getInboundChannel('def')).to.deep.equal({ channelId: 'def' });
        });

        it('should throw errors for nonexistent channel ids', () => {
            createInboundChannels(channelFactory, ['abc', 'def']);

            expect(() => getInboundChannel('ghi')).to.throw();
        });
    });
});
