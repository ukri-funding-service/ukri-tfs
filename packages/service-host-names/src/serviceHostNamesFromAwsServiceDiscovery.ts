import { getEnvironmentVariableOrThrow } from '@ukri-tfs/configuration';
import { Logger } from '@ukri-tfs/logging';
import { ServiceHostNames } from './serviceHostNames';

export interface ServiceHostInfo {
    unqualifiedHostName: string;
    port: number;
    path: string;
}

// Consider urls equal irrespective of case or a trailing forward slash
const urlsEqual = (mixedCaseUrl1: string, mixedCaseUrl2: string): boolean => {
    const url1 = mixedCaseUrl1.toLowerCase();
    const url2 = mixedCaseUrl2.toLowerCase();
    if (url1 === url2 || url1 + '/' === url2 || url1 === url2 + '/') {
        return true;
    } else {
        return false;
    }
};

export class ServiceHostNamesFromAwsServiceDiscovery<T extends string> implements ServiceHostNames<T> {
    urls: Record<T, string>;

    constructor(logger: Logger, hostsInfo: Record<T, ServiceHostInfo>) {
        const serviceDiscoveryNamespace = getEnvironmentVariableOrThrow('SERVICE_DISCOVERY_NAMESPACE');

        const emptyServiceMap: Partial<Record<T, string>> = {};

        this.urls = (Object.keys(hostsInfo) as T[]).reduce((acc, varName) => {
            let serviceUrl = '';
            const envServiceUrl: string = process.env[varName] ?? '';
            const { unqualifiedHostName, port, path } = hostsInfo[varName];

            // eslint-disable-next-line no-restricted-syntax
            if (serviceDiscoveryNamespace === 'localhost') {
                serviceUrl = `https://127.0.0.1:${port}/${path}`;
            } else {
                serviceUrl = `https://${unqualifiedHostName}.${serviceDiscoveryNamespace}:${port}/${path}`;
            }

            if (urlsEqual(serviceUrl.toLowerCase(), envServiceUrl.toLowerCase())) {
                logger.warn(`Redundant process.env.${varName} = ${envServiceUrl}`);
            } else if (envServiceUrl.length) {
                logger.warn(
                    [
                        `SERVICE_DISCOVERY_NAMESPACE overidden: process.env.${varName} = ${envServiceUrl}`,
                        `(would have been ${varName} = ${serviceUrl})`,
                    ].join('\n'),
                );
                serviceUrl = envServiceUrl;
            }
            return { ...acc, [varName]: serviceUrl };
        }, emptyServiceMap) as Record<T, string>;
    }

    getUrl(varName: T): URL {
        const url = this.urls[varName];
        try {
            return new URL(url);
        } catch (e) {
            throw new Error(`${e} var name=${varName}, value=${url}`);
        }
    }
}
