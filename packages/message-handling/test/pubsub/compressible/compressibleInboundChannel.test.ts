import { expect } from 'chai';
import 'chai-as-promised';
import 'mocha';
import sinon from 'sinon';
import { CompressibleInboundChannel } from '../../../src/pubsub/compressible/compressibleInboundChannel';

describe('CompressibleInboundChannel', () => {
    afterEach(() => sinon.restore());

    describe('receive', () => {
        it(`calls base with a message which doesn't need unzipping`, async () => {
            const baseOutboundChannelMock = {
                receive: sinon.stub().resolves([{ data: { hello: 'world' } }]),
            };

            const compressibleOutboundChannel = new CompressibleInboundChannel(baseOutboundChannelMock);

            const result = await compressibleOutboundChannel.receive();

            expect(baseOutboundChannelMock.receive).to.have.been.calledOnce;
            expect(result).to.deep.equal([{ data: { hello: 'world' } }]);
        });

        it('calls base with a message it has unzipped', async () => {
            const baseOutboundChannelMock = {
                receive: sinon
                    .stub()
                    .resolves([
                        { unzippedType: 'panel-update', data: 'H4sIAAAAAAAAE6tWykjNyclXslIqzy/KSVGqBQDRQQnYEQAAAA==' },
                    ]),
            };

            const compressibleOutboundChannel = new CompressibleInboundChannel(baseOutboundChannelMock);

            const result = await compressibleOutboundChannel.receive();

            expect(baseOutboundChannelMock.receive).to.have.been.calledOnce;
            expect(result).to.deep.equal([{ unzippedType: 'panel-update', data: { hello: 'world' } }]);
        });
    });
});
