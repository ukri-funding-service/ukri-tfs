import { SNSClient } from '@aws-sdk/client-sns';
import { SQSClient } from '@aws-sdk/client-sqs';
import {
    AwsChannelFactory,
    AwsChannelFactoryConfig,
    AwsInboundChannelConfig,
    AwsOutboundChannelConfig,
    ChannelConfig,
    ChannelFactory,
    ChannelProvider,
    CombinedChannelConfig,
    createInboundChannels,
    createOutboundChannels,
    DummyChannelFactory,
    DummyChannelFactoryConfig,
    DummyInboundChannelConfig,
    DummyOutboundChannelConfig,
} from '..';
import { Logger } from '../../logger';
import { CompressibleChannelFactory } from '../compressible/compressibleChannelFactory';
import { ValidatedChannelFactory, ValidatedChannelFactoryConfig } from '../validated/validatedChannelFactory';

export type AwsValidatedChannelFactoryConfig = ValidatedChannelFactoryConfig<
    AwsChannelFactoryConfig,
    AwsInboundChannelConfig,
    AwsOutboundChannelConfig
>;
export type DummyValidatedChannelFactoryConfig = ValidatedChannelFactoryConfig<
    DummyChannelFactoryConfig,
    DummyInboundChannelConfig,
    DummyOutboundChannelConfig
>;

export type ChannelProviderConfigAWS = {
    provider: ChannelProvider.AWS;
    config: AwsChannelFactoryConfig;
};

export type ChannelProviderConfigDummy = { provider: ChannelProvider.DUMMY; config: DummyChannelFactoryConfig };

export type ChannelProviderConfigAwsValidated = {
    provider: ChannelProvider.AWS_VALIDATED | ChannelProvider.AWS_VALIDATED_COMPRESSIBLE;
    config: AwsValidatedChannelFactoryConfig;
};

export type ChannelProviderConfigDummyValidated = {
    provider: ChannelProvider.DUMMY_VALIDATED | ChannelProvider.DUMMY_VALIDATED_COMPRESSIBLE;
    config: DummyValidatedChannelFactoryConfig;
};

export type ChannelFactoryConfig =
    | ChannelProviderConfigAWS
    | ChannelProviderConfigDummy
    | ChannelProviderConfigAwsValidated
    | ChannelProviderConfigDummyValidated;

export const getSimulatorEndpointForEnv = (endpointUrl: string | undefined): string | undefined => {
    if (endpointUrl && process.env.USE_SIMULATOR_ENDPOINTS === 'true') {
        return endpointUrl;
    }
    return undefined;
};

const newAwsChannelFactory = (config: AwsChannelFactoryConfig, logger: Logger): AwsChannelFactory => {
    logger.info('Using AWS Channel Factory');
    logger.debug(`Config: ${JSON.stringify(config)}`);

    const snsClientEndpoint = getSimulatorEndpointForEnv(process.env.LOCAL_SNS_ENDPOINT);
    const sqsClientEndpoint = getSimulatorEndpointForEnv(process.env.LOCAL_SQS_ENDPOINT);

    logger.debug(`SNS Client Endpoint: ${snsClientEndpoint}`);
    logger.debug(`SQS Client Endpoint: ${sqsClientEndpoint}`);

    const snsClient = new SNSClient({
        region: config.region,
        endpoint: snsClientEndpoint,
        maxAttempts: 100,
    });

    const sqsClient = new SQSClient({
        region: config.region,
        endpoint: sqsClientEndpoint,
    });

    return new AwsChannelFactory(config.channels, sqsClient, snsClient, logger);
};

const newDummyChannelFactory = (config: DummyChannelFactoryConfig, logger: Logger): DummyChannelFactory => {
    logger.warn('Using DummyChannelFactory');
    return new DummyChannelFactory(config.channels, logger);
};

const newAwsValidatedChannelFactory = (config: AwsValidatedChannelFactoryConfig, logger: Logger): ChannelFactory => {
    return new ValidatedChannelFactory(config, logger, newAwsChannelFactory(config, logger));
};

const newDummyValidatedChannelFactory = (
    config: DummyValidatedChannelFactoryConfig,
    logger: Logger,
): ChannelFactory => {
    return new ValidatedChannelFactory(config, logger, newDummyChannelFactory(config, logger));
};

const newAwsValidatedCompressibleChannelFactory = (
    config: AwsValidatedChannelFactoryConfig,
    logger: Logger,
): ChannelFactory => {
    return new ValidatedChannelFactory(
        config,
        logger,
        new CompressibleChannelFactory(newAwsChannelFactory(config, logger)),
    );
};

const newDummyValidatedCompressibleChannelFactory = (
    config: DummyValidatedChannelFactoryConfig,
    logger: Logger,
): ChannelFactory => {
    return new ValidatedChannelFactory(
        config,
        logger,
        new CompressibleChannelFactory(newDummyChannelFactory(config, logger)),
    );
};

export const createChannelFactory = (config: ChannelFactoryConfig, logger: Logger): ChannelFactory => {
    switch (config.provider) {
        case ChannelProvider.AWS:
            return newAwsChannelFactory(config.config, logger);
        case ChannelProvider.DUMMY:
            return newDummyChannelFactory(config.config, logger);
        case ChannelProvider.AWS_VALIDATED:
            return newAwsValidatedChannelFactory(config.config, logger);
        case ChannelProvider.DUMMY_VALIDATED:
            return newDummyValidatedChannelFactory(config.config, logger);
        case ChannelProvider.AWS_VALIDATED_COMPRESSIBLE:
            return newAwsValidatedCompressibleChannelFactory(config.config, logger);
        case ChannelProvider.DUMMY_VALIDATED_COMPRESSIBLE:
            return newDummyValidatedCompressibleChannelFactory(config.config, logger);
    }
};

export const channelIds = <T extends ChannelConfig>(config: T[]): string[] => {
    const uniqueChannelIds = new Set<string>();

    config.forEach(channelConfig => uniqueChannelIds.add(channelConfig.channelId));

    return Array.from(uniqueChannelIds);
};

export const inboundChannelIds = (config: CombinedChannelConfig): string[] => {
    return channelIds(config.inbound);
};

export const outboundChannelIds = (config: CombinedChannelConfig): string[] => {
    return channelIds(config.outbound);
};

export const initializeChannels = (config: ChannelFactoryConfig, logger: Logger): void => {
    const channelFactory = createChannelFactory(config, logger);
    createInboundChannels(channelFactory, inboundChannelIds(config.config.channels));
    createOutboundChannels(channelFactory, outboundChannelIds(config.config.channels));
};
