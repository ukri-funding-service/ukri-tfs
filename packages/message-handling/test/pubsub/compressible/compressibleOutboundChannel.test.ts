import 'mocha';
import sinon from 'sinon';
import { expect } from 'chai';
import 'sinon-chai';
import { gunzip } from 'zlib';
import { promisify } from 'util';
const gunzipp = promisify(gunzip);

import { TfsMessage } from '../../../src';
import { CompressibleOutboundChannel } from '../../../src/pubsub/compressible/compressibleOutbandChannel';

describe('ValidatedOutboundChannel', () => {
    let baseOutboundChannelMock: { publish: sinon.SinonStub; publishRaw: sinon.SinonStub };

    beforeEach(() => {
        baseOutboundChannelMock = {
            publish: sinon.stub(),
            publishRaw: sinon.stub(),
        };
    });

    afterEach(() => sinon.restore());

    describe('publish', () => {
        it('calls base', async () => {
            const compressibleOutboundChannel = new CompressibleOutboundChannel(baseOutboundChannelMock);

            await compressibleOutboundChannel.publish({} as TfsMessage);
            expect(baseOutboundChannelMock.publish).to.have.been.called;
        });

        const uncompress = async (data: string) => {
            const bufferIn = Buffer.from(data, 'base64');
            const bufferOut = await gunzipp(bufferIn);
            return bufferOut.toString();
        };

        it('compresses where there is an unzippedType', async () => {
            let publishMsg = {} as TfsMessage;

            const compressibleOutboundChannel = new CompressibleOutboundChannel({
                publish: async msg => {
                    publishMsg = msg;
                },
                publishRaw: sinon.stub(),
            });

            const originalMessage = {
                unzippedType: 'panel-updated',
                data: { hello: 'world' },
            } as TfsMessage;

            await compressibleOutboundChannel.publish(originalMessage);

            expect(publishMsg.unzippedType).to.equal('panel-updated');
            expect(typeof publishMsg.data).to.equal('string');
            expect(await uncompress(publishMsg.data as unknown as string)).to.equal(`{"hello":"world"}`);
        });

        it(`doesn't mutate the message passed`, async () => {
            const compressibleOutboundChannel = new CompressibleOutboundChannel(baseOutboundChannelMock);
            const originalMessage = {
                unzippedType: 'panel-updated',
                data: { hello: 'world' },
            } as TfsMessage;

            await compressibleOutboundChannel.publish(originalMessage);

            expect(originalMessage.data).to.deep.equal({ hello: 'world' });
        });
    });

    describe('publishRaw', () => {
        it('calls base', async () => {
            const compressibleOutboundChannel = new CompressibleOutboundChannel(baseOutboundChannelMock);
            await compressibleOutboundChannel.publishRaw('channel-id');
            expect(baseOutboundChannelMock.publishRaw).to.have.been.called;
        });
    });
});
