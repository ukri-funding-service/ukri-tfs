/* eslint-disable @typescript-eslint/no-explicit-any */
import 'mocha';
import sinon from 'sinon';
import { expect } from 'chai';
import 'sinon-chai';

import { ChannelFactory } from '../../../src';
import { ValidatedChannelFactory } from '../../../src/pubsub/validated/validatedChannelFactory';

describe('ValidatedChannelFactory', () => {
    const baseFactoryMock: ChannelFactory = {
        newInboundChannel: sinon.stub(),
        newOutboundChannel: sinon.stub(),
    };

    describe('newInboundChannel', () => {
        it('calls base', () => {
            const factory = new ValidatedChannelFactory({} as any, {} as any, baseFactoryMock);
            factory.newInboundChannel('channel-id');
            expect(baseFactoryMock.newInboundChannel).to.have.been.called;
        });
    });

    describe('newOutboundChannel', () => {
        it('calls base', () => {
            const config = {
                channels: { outbound: [{ channelId: 'channel-id', schemaDefinitions: [{}], schema: {} }] },
            } as any;
            const factory = new ValidatedChannelFactory(config, {} as any, baseFactoryMock);
            factory.newOutboundChannel('channel-id');
            expect(baseFactoryMock.newOutboundChannel).to.have.been.called;
        });

        it('throws if there is no config for new channel', () => {
            const config = { channels: { outbound: [] } } as any;
            const factory = new ValidatedChannelFactory(config, {} as any, baseFactoryMock);
            let error;
            try {
                factory.newOutboundChannel('not-a-channel-id');
            } catch (e) {
                error = e;
            }
            expect(error).to.exist;
        });
    });
});
