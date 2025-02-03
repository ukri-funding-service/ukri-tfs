/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger } from '@ukri-tfs/logging';
import {
    ServiceHostInfo,
    ServiceHostNamesFromAwsServiceDiscovery,
} from '../../src/serviceHostNamesFromAwsServiceDiscovery';

enum TestVarNamesEnum {
    XYZ_SERVICE_API = 'XYZ_SERVICE_API',
}

type TestVarNames = `${TestVarNamesEnum}`;

const unqualifiedHostNames: Record<TestVarNames, ServiceHostInfo> = {
    XYZ_SERVICE_API: { unqualifiedHostName: 'xyz-api', port: 1234, path: 'api' },
};

describe('serviceHostNamesFromEnv', () => {
    let logger: Logger;

    let originalEnv: NodeJS.ProcessEnv;

    beforeAll(() => {
        originalEnv = { ...process.env };
    });

    beforeEach(() => {
        logger = { warn: jest.fn() } as unknown as Logger;
    });

    afterEach(() => {
        process.env = { ...originalEnv };
        jest.resetAllMocks();
    });

    it('throws if SERVICE_DISCOVERY_NAMESPACE is not set', () => {
        process.env = {};
        let msg = '';
        try {
            new ServiceHostNamesFromAwsServiceDiscovery<TestVarNames>(logger, unqualifiedHostNames);
        } catch (e) {
            if (e instanceof Error) {
                msg = e.message;
            }
        }
        expect(msg).toEqual('Environment variable SERVICE_DISCOVERY_NAMESPACE not set');
    });

    it('qualifies hostnames', () => {
        process.env = { SERVICE_DISCOVERY_NAMESPACE: 'example.com' };

        const serviceHostNames = new ServiceHostNamesFromAwsServiceDiscovery<TestVarNames>(
            logger,
            unqualifiedHostNames,
        );
        const url = serviceHostNames.getUrl('XYZ_SERVICE_API');
        expect(url.toString()).toEqual('https://xyz-api.example.com:1234/api');
    });

    // eslint-disable-next-line no-restricted-syntax
    it('can be set to localhost', () => {
        // eslint-disable-next-line no-restricted-syntax
        process.env = { SERVICE_DISCOVERY_NAMESPACE: 'localhost' };

        const serviceHostNames = new ServiceHostNamesFromAwsServiceDiscovery<TestVarNames>(
            logger,
            unqualifiedHostNames,
        );
        const url = serviceHostNames.getUrl('XYZ_SERVICE_API');
        expect(url.toString()).toEqual('https://127.0.0.1:1234/api');
    });

    it('can be overidden by env vars', () => {
        process.env = {
            SERVICE_DISCOVERY_NAMESPACE: 'example.com',
            XYZ_SERVICE_API: 'https://xyz-override.example.com',
        };

        const serviceHostNames = new ServiceHostNamesFromAwsServiceDiscovery<TestVarNames>(
            logger,
            unqualifiedHostNames,
        );

        const url = serviceHostNames.getUrl('XYZ_SERVICE_API');
        expect(url.toString()).toEqual('https://xyz-override.example.com/');
        expect(logger.warn).toHaveBeenCalledTimes(1);
        expect(logger.warn).toHaveBeenCalledWith(
            'SERVICE_DISCOVERY_NAMESPACE overidden: process.env.XYZ_SERVICE_API = https://xyz-override.example.com\n(would have been XYZ_SERVICE_API = https://xyz-api.example.com:1234/api)',
        );
    });

    it('warns of redundant overrides', () => {
        process.env = {
            SERVICE_DISCOVERY_NAMESPACE: 'example.com',
            XYZ_SERVICE_API: 'https://xyz-api.example.com:1234/api',
        };

        const serviceHostNames = new ServiceHostNamesFromAwsServiceDiscovery<TestVarNames>(
            logger,
            unqualifiedHostNames,
        );

        const url = serviceHostNames.getUrl('XYZ_SERVICE_API');
        expect(url.toString()).toEqual('https://xyz-api.example.com:1234/api');
        expect(logger.warn).toHaveBeenCalledTimes(1);
        expect(logger.warn).toHaveBeenCalledWith(
            'Redundant process.env.XYZ_SERVICE_API = https://xyz-api.example.com:1234/api',
        );
    });

    it('throws if it cannot construct a valid url', () => {
        process.env = {
            SERVICE_DISCOVERY_NAMESPACE: 'example.com',
        };

        const serviceHostNames = new ServiceHostNamesFromAwsServiceDiscovery<TestVarNames>(
            logger,
            unqualifiedHostNames,
        );

        try {
            serviceHostNames.getUrl('INVALID_VAR_NAME' as any);
        } catch (e) {
            expect(e).toEqual(
                new Error('TypeError [ERR_INVALID_URL]: Invalid URL var name=INVALID_VAR_NAME, value=undefined'),
            );
        }
    });
});
