/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import 'mocha';
import sinon, { SinonStub } from 'sinon';
import 'sinon-chai';
import { Logger } from '../src/logger';
import { ChannelHandler, pollMessages } from '../src/pollMessages';
import { TfsMessage } from '../src/pubsub/message';

describe('packages/message-handling', () => {
    describe('pollMessages - broadcast state change', async () => {
        let clock: sinon.SinonFakeTimers;
        let mockLogger: Logger;
        let errorStub: SinonStub;
        let warningStub: SinonStub;
        let debugStub: SinonStub;
        let infoStub: SinonStub;

        beforeEach(() => {
            sinon.restore();
            clock = sinon.useFakeTimers();
            errorStub = sinon.stub();
            warningStub = sinon.stub();
            debugStub = sinon.stub();
            infoStub = sinon.stub();

            mockLogger = {
                debug: debugStub,
                error: errorStub,
                warn: warningStub,
                info: infoStub,
            };
        });

        afterEach(() => clock.restore());

        it('can poll for messages on a schedule', async () => {
            const handlerSpy = sinon.stub().resolves();
            const channelHandler: ChannelHandler = {
                channel: { receive: () => Promise.resolve([message] as any) },
                handle: handlerSpy,
            };
            const message: TfsMessage = {
                data: { payload: 'Hello World' },
                type: 'some-id',
            };

            const job = pollMessages([channelHandler], mockLogger);
            await clock.tickAsync(3000);
            job.cancel();

            expect(handlerSpy).called;
        });

        it('can recover from a rejected message', async () => {
            const handlerSpy = sinon.stub().rejects('uh-oh');
            const channelHandler: ChannelHandler = {
                channel: { receive: () => Promise.resolve([message] as any) },
                handle: handlerSpy,
            };
            const message: TfsMessage = {
                data: { payload: 'Hello World' },
                type: 'some-id',
            };

            const job = pollMessages([channelHandler], mockLogger);
            await clock.tickAsync(3000);
            job.cancel();

            expect(handlerSpy).called;
        });
    });
});
