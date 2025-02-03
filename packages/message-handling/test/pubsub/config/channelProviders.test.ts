import { expect } from 'chai';
import { ChannelProvider, getChannelProvider } from '../../../src/pubsub/config';

describe('packages/message-handling- pubsub/config/channelProviders', () => {
    describe('getChannelProvider', () => {
        const testConfig = (
            envProvider: string,
            envTopicSendingEnabled: string,
            envTopicReceivingEnabled: string,
            expectedProvider: ChannelProvider,
        ) => {
            process.env.MESSAGE_HANDLING_CHANNEL_PROVIDER = envProvider;
            process.env.AWS_TOPIC_SENDING_ENABLED = envTopicSendingEnabled;
            process.env.AWS_TOPIC_RECEIVING_ENABLED = envTopicReceivingEnabled;
            if (envProvider === '') {
                delete process.env.MESSAGE_HANDLING_CHANNEL_PROVIDER;
            }
            if (envTopicSendingEnabled === '') {
                delete process.env.AWS_TOPIC_SENDING_ENABLED;
            }
            if (envTopicReceivingEnabled === '') {
                delete process.env.AWS_TOPIC_RECEIVING_ENABLED;
            }

            expect(getChannelProvider()).to.equal(expectedProvider);
        };

        it('should provide an AWS if no env specified and AWS sending on', () => {
            testConfig('', 'true', '', ChannelProvider.AWS);
        });

        it('should provide an AWS if no env specified and AWS receiving on', () => {
            testConfig('', '', 'true', ChannelProvider.AWS);
        });

        it('should provide an AWS if no env specified and AWS sending AND receiving on', () => {
            testConfig('', 'true', 'true', ChannelProvider.AWS);
        });

        it('should provide an Dummy by default if no env specified and AWS sending off', () => {
            testConfig('', 'false', '', ChannelProvider.DUMMY);
        });

        it('should provide an Dummy by default if no env specified', () => {
            testConfig('', '', '', ChannelProvider.DUMMY);
        });

        it('should provide an AWS configuration when env specifies AWS', () => {
            testConfig('AWS', 'true', '', ChannelProvider.AWS);
        });

        it('should provide a AWS configuration when env specifies AWS but topic sending is off', () => {
            testConfig('AWS', 'false', '', ChannelProvider.AWS); // configuration takes precedence over topic sending?
        });

        it('should provide a Dummy configuration when env specifies DUMMY', () => {
            testConfig('DUMMY', 'false', '', ChannelProvider.DUMMY);
        });

        it('should throw an Error when env specifies NONSENSE', () => {
            process.env.MESSAGE_HANDLING_CHANNEL_PROVIDER = 'NONSENSE';

            expect(() => getChannelProvider()).to.throw(Error);
        });

        for (const provider in ChannelProvider) {
            const nextProvider: ChannelProvider = ChannelProvider[provider as keyof typeof ChannelProvider];

            it('should always return the given provider', () => {
                expect(getChannelProvider(nextProvider)).to.equal(nextProvider);
            });
        }
    });
});
