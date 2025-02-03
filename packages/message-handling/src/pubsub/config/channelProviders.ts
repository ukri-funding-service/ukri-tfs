export enum ChannelProvider {
    AWS = 'AWS',
    DUMMY = 'DUMMY',
    AWS_VALIDATED = 'AWS_VALIDATED',
    DUMMY_VALIDATED = 'DUMMY_VALIDATED',
    AWS_VALIDATED_COMPRESSIBLE = 'AWS_VALIDATED_COMPRESSIBLE',
    DUMMY_VALIDATED_COMPRESSIBLE = 'DUMMY_VALIDATED_COMPRESSIBLE',
}

export function getChannelProvider(provider?: ChannelProvider): ChannelProvider {
    if (provider) {
        return provider;
    }
    if (process.env.MESSAGE_HANDLING_CHANNEL_PROVIDER) {
        const channelProviderString = process.env.MESSAGE_HANDLING_CHANNEL_PROVIDER;
        const channelProvider = channelProviderString as ChannelProvider;
        if (!Object.values(ChannelProvider).includes(channelProvider)) {
            throw new Error(`Channel provider does not exist: ${channelProviderString}`);
        }
        return channelProvider;
    } else if (process.env.AWS_TOPIC_SENDING_ENABLED === 'true') {
        return ChannelProvider.AWS;
    } else if (process.env.AWS_TOPIC_RECEIVING_ENABLED === 'true') {
        return ChannelProvider.AWS;
    } else {
        return ChannelProvider.DUMMY;
    }
}
