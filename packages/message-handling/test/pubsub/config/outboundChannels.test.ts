import { expect } from 'chai';
import { ChannelFactory, OutboundChannel } from '../../../src/pubsub';
import { createOutboundChannels, getOutboundChannel } from '../../../src/pubsub/config/outboundChannels';

describe('pubsub/config/outboundChannels.ts', () => {
    describe('set and get outbound channels', () => {
        const channelFactory: ChannelFactory = {
            newOutboundChannel: (channelId: String) => {
                return { channelId } as unknown as OutboundChannel;
            },
        } as unknown as ChannelFactory;
        it('should create channels, get channels and throw errors for nonexistent channels', () => {
            createOutboundChannels(channelFactory, ['abc', 'def']);

            expect(getOutboundChannel('abc')).to.deep.equal({ channelId: 'abc' });
            expect(getOutboundChannel('def')).to.deep.equal({ channelId: 'def' });
            expect(() => getOutboundChannel('ghi')).to.throw();
        });
    });
});
