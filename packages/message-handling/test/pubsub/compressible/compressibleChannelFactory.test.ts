import 'mocha';
import sinon from 'sinon';
import { expect } from 'chai';
import 'sinon-chai';

import { ChannelFactory } from '../../../src';
import { CompressibleChannelFactory } from '../../../src/pubsub/compressible/compressibleChannelFactory';

describe('CompressibleChannelFactory', () => {
    const baseFactoryMock: ChannelFactory = {
        newInboundChannel: sinon.stub(),
        newOutboundChannel: sinon.stub(),
    };

    describe('newInboundChannel', () => {
        it('calls base', () => {
            const factory = new CompressibleChannelFactory(baseFactoryMock);
            factory.newInboundChannel('channel-id');
            expect(baseFactoryMock.newInboundChannel).to.have.been.called;
        });
    });

    describe('newOutboundChannel', () => {
        it('calls base', () => {
            const factory = new CompressibleChannelFactory(baseFactoryMock);
            factory.newOutboundChannel('channel-id');
            expect(baseFactoryMock.newOutboundChannel).to.have.been.called;
        });
    });
});
