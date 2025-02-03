import 'chai';
import { expect } from 'chai';
import 'mocha';
import {
    ChannelFactoryConfig,
    ChannelProvider,
    CombinedChannelConfig,
    createChannelFactory,
    inboundChannelIds,
    outboundChannelIds,
    initializeChannels,
    getSimulatorEndpointForEnv,
} from '../../../src/pubsub/config';
import { DummyLogger } from '../../../src/pubsub/dummy/dummyLogger';

describe('package/message-handling - pubsub/config', () => {
    describe('baseFactoryConfig - inboundChannelIds', () => {
        it('inboundChannelIds returns empty array for empty config', () => {
            const channelConfig: CombinedChannelConfig = {
                inbound: [],
                outbound: [],
            };

            const result = inboundChannelIds(channelConfig);

            expect(result.length).to.equal(0);
        });

        it('inboundChannelIds returns expected channel ids', () => {
            const channelConfig: CombinedChannelConfig = {
                inbound: [{ channelId: 'one' }, { channelId: 'two' }, { channelId: 'three' }],
                outbound: [],
            };

            const result = inboundChannelIds(channelConfig);

            expect(result).to.contain('three');
            expect(result).to.contain('two');
            expect(result).to.contain('one');
            expect(result.length).to.equal(3);
        });

        it('inboundChannelIds produces only 1 channel definition when multiples are defined', () => {
            const channelConfig: CombinedChannelConfig = {
                inbound: [{ channelId: 'one' }, { channelId: 'two' }, { channelId: 'one' }],
                outbound: [],
            };

            const result = inboundChannelIds(channelConfig);

            expect(result).to.contain('two');
            expect(result).to.contain('one');
            expect(result.length).to.equal(2);
        });
    });

    describe('baseFactoryConfig - outboundChannelIds', () => {
        it('outboundChannelIds returns empty array for empty config', () => {
            const channelConfig: CombinedChannelConfig = {
                inbound: [],
                outbound: [],
            };

            const result = outboundChannelIds(channelConfig);

            expect(result.length).to.equal(0);
        });

        it('outboundChannelIds returns expected channel ids', () => {
            const channelConfig: CombinedChannelConfig = {
                inbound: [],
                outbound: [{ channelId: 'one' }, { channelId: 'two' }, { channelId: 'three' }],
            };

            const result = outboundChannelIds(channelConfig);

            expect(result).to.contain('three');
            expect(result).to.contain('two');
            expect(result).to.contain('one');
            expect(result.length).to.equal(3);
        });

        it('outboundChannelIds produces only 1 channel definition when multiples are defined', () => {
            const channelConfig: CombinedChannelConfig = {
                inbound: [],
                outbound: [{ channelId: 'one' }, { channelId: 'two' }, { channelId: 'one' }],
            };

            const result = outboundChannelIds(channelConfig);

            expect(result).to.contain('two');
            expect(result).to.contain('one');
            expect(result.length).to.equal(2);
        });
    });

    describe('baseFactoryConfig - channelFactory', () => {
        for (const provider in ChannelProvider) {
            const nextProvider: ChannelProvider = ChannelProvider[provider as keyof typeof ChannelProvider];

            const config = {
                provider: nextProvider,
                config: {
                    channels: { inbound: [], outbound: [] },
                },
            } as ChannelFactoryConfig;

            it(`returns a factory for provider ${nextProvider}`, () => {
                expect(createChannelFactory(config, new DummyLogger())).to.exist;
            });
        }
    });

    describe('baseFactoryConfig - channelFactory', () => {
        it(`can initialise channels given valid config`, () => {
            const config: ChannelFactoryConfig = {
                provider: ChannelProvider.DUMMY,
                config: {
                    channels: { inbound: [], outbound: [] },
                },
            };
            expect(initializeChannels(config, new DummyLogger())).to.not.throw;
        });

        it(`can initialise channels given valid config and logger`, () => {
            const config: ChannelFactoryConfig = {
                provider: ChannelProvider.DUMMY,
                config: {
                    channels: { inbound: [], outbound: [] },
                },
            };

            expect(initializeChannels(config, new DummyLogger())).to.not.throw;
        });
    });

    describe('baseFactoryConfig - getSimulatorEndpointForEnv', () => {
        afterEach(() => {
            delete process.env.USE_SIMULATOR_ENDPOINTS;
        });

        describe('simulator environment enabled', () => {
            beforeEach(() => {
                process.env.USE_SIMULATOR_ENDPOINTS = 'true';
            });

            it(`returns the requested endpoint`, () => {
                expect(getSimulatorEndpointForEnv('blah')).to.equal('blah');
            });

            it(`returns undefined endpoint when endpoint URL is undefined`, () => {
                expect(getSimulatorEndpointForEnv(undefined)).to.be.undefined;
            });

            it(`returns undefined endpoint when endpoint URL is empty`, () => {
                expect(getSimulatorEndpointForEnv('')).to.be.undefined;
            });
        });

        describe('simulator environment undefined', () => {
            beforeEach(() => {
                delete process.env.USE_SIMULATOR_ENDPOINTS;
            });

            it(`returns undefined endpoint for valid url`, () => {
                expect(getSimulatorEndpointForEnv('blah')).to.be.undefined;
            });

            it(`returns undefined endpoint when endpoint URL is undefined`, () => {
                expect(getSimulatorEndpointForEnv(undefined)).to.be.undefined;
            });

            it(`returns undefined endpoint when endpoint URL is empty`, () => {
                expect(getSimulatorEndpointForEnv('')).to.be.undefined;
            });
        });

        describe('simulator environment has invalid value', () => {
            beforeEach(() => {
                process.env.USE_SIMULATOR_ENDPOINTS = 'gibberish';
            });

            it(`returns undefined endpoint for valid url`, () => {
                expect(getSimulatorEndpointForEnv('blah')).to.be.undefined;
            });

            it(`returns undefined endpoint when endpoint URL is undefined`, () => {
                expect(getSimulatorEndpointForEnv(undefined)).to.be.undefined;
            });

            it(`returns undefined endpoint when endpoint URL is empty`, () => {
                expect(getSimulatorEndpointForEnv('')).to.be.undefined;
            });
        });
    });
});
