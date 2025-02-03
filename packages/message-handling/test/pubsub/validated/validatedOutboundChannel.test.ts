/* eslint-disable @typescript-eslint/no-explicit-any */
import 'mocha';
import sinon from 'sinon';
import { expect } from 'chai';
import 'sinon-chai';
import { OutboundChannel, TfsMessage } from '../../../src';
import { datesToStrings, ValidatedOutboundChannel } from '../../../src/pubsub/validated/validatedOutboundChannel';

describe('ValidatedOutboundChannel', () => {
    const baseOutboundChannelMock: OutboundChannel = {
        publish: sinon.stub(),
        publishRaw: sinon.stub(),
    };

    const baseRejectOutboundChannelMock: OutboundChannel = {
        publish: sinon.stub().rejects(new Error('test reject')),
        publishRaw: sinon.stub().rejects(new Error('test reject')),
    };

    afterEach(() => sinon.restore());

    describe('constructor', () => {
        it('throws when passed invalid an schema', () => {
            sinon.stub(console, 'error');
            let error;
            try {
                new ValidatedOutboundChannel(
                    {
                        schemaDefinitions: [],
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    $ref: 'panelUpdated.schema.json',
                                },
                            },
                        },
                    } as any,
                    { error: sinon.stub() } as any,
                    baseOutboundChannelMock,
                );
            } catch (e) {
                error = e;
            }

            expect(error).to.exist;
        });
    });

    describe('publish', () => {
        it('calls base', () => {
            const validatedOutboundChannel = new ValidatedOutboundChannel(
                { schemaDefinitions: [], schema: {} } as any,
                {} as any,
                baseOutboundChannelMock,
            );

            validatedOutboundChannel.publish({} as TfsMessage);
            expect(baseOutboundChannelMock.publish).to.have.been.called;
        });

        it('rejects if channel.publish rejects', async () => {
            const outboundChannel = new ValidatedOutboundChannel(
                { schemaDefinitions: [], schema: {} } as any,
                {} as any,
                baseRejectOutboundChannelMock,
            );

            let err: Error | undefined;

            try {
                await outboundChannel.publish({} as TfsMessage);
            } catch (e) {
                err = e as Error;
            }

            expect(err?.message).to.equal('test reject');
        });
    });

    describe('publishRaw', () => {
        it('calls base', () => {
            const validatedOutboundChannel = new ValidatedOutboundChannel(
                { schemaDefinitions: [], schema: {} } as any,
                {} as any,
                baseOutboundChannelMock,
            );
            validatedOutboundChannel.publishRaw('channel-id');
            expect(baseOutboundChannelMock.publishRaw).to.have.been.called;
        });

        it('rejects if channel.publishRaw rejects', async () => {
            const outboundChannel = new ValidatedOutboundChannel(
                { schemaDefinitions: [], schema: {} } as any,
                {} as any,
                baseRejectOutboundChannelMock,
            );

            let err: Error | undefined;

            try {
                await outboundChannel.publishRaw('');
            } catch (e) {
                err = e as Error;
            }

            expect(err?.message).to.equal('test reject');
        });
    });

    describe('doValidation', () => {
        it('logs validation errors', () => {
            const validatedOutboundChannel = new ValidatedOutboundChannel(
                { schemaDefinitions: [], schema: {} } as any,
                {} as any,
                baseOutboundChannelMock,
            );

            const mock = {
                validate: () => false,
                config: { channelId: 'test-channel-id' },
                logger: { error: sinon.stub() },
                ajv: { errorsText: () => 'This is a schema validation error' },
            };

            sinon.stub(console, 'error');

            const doValidation = validatedOutboundChannel.doValidation.bind(mock);
            doValidation({});
            expect(mock.logger.error).to.have.been.called;
        });

        it('logs additional properties', () => {
            const validatedOutboundChannel = new ValidatedOutboundChannel(
                { schemaDefinitions: [], schema: {} } as any,
                {} as any,
                baseOutboundChannelMock,
            );

            const testObj: any = { some: { bogusExtraProperty: 'value' } };

            const mock = {
                validate: () => {
                    testObj.some = {};
                    return true;
                },
                config: { channelId: 'test-channel-id' },
                logger: { error: sinon.stub() },
                ajv: {},
            };

            sinon.stub(console, 'error');

            const doValidation = validatedOutboundChannel.doValidation.bind(mock);
            doValidation(testObj);

            expect(testObj).to.deep.equal({ some: {} });
            expect(mock.logger.error).to.have.been.called;
            expect(mock.logger.error).to.have.been.calledWith(
                'Invalid outbound message sent on channel test-channel-id with additional property "bogusExtraProperty"',
            );
        });
    });

    describe('datesToStrings', () => {
        it('passes all the usual JSON types and converts dates to strings', () => {
            const result = datesToStrings({ array: [new Date(2024, 0, 1), 'hello', null, undefined, true], value: 4 });
            expect(result).to.deep.equal({
                array: ['2024-01-01T00:00:00.000Z', 'hello', null, undefined, true],
                value: 4,
            });
        });
    });
});
