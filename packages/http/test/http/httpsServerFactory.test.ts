import fs from 'fs';
import https from 'https';
import { httpsServerFactory } from '../../src/http/httpsServerFactory';

describe('httpsServerFactory tests', () => {
    const createServerFake = jest.fn();
    const readFileSyncFake = jest.fn().mockReturnValue('content');

    let originalEnvironmentVariables = process.env;

    const setSslEnvironmentVariables = (sslKeyPath: string, sslCertificatePath: string): void => {
        process.env.SSL_KEY_PATH = sslKeyPath;
        process.env.SSL_CERTIFICATE_PATH = sslCertificatePath;
    };

    beforeEach(() => {
        originalEnvironmentVariables = Object.assign({}, process.env);

        jest.spyOn(https, 'createServer').mockImplementation(createServerFake);
        jest.spyOn(fs, 'readFileSync').mockImplementation(readFileSyncFake);
    });

    afterEach(() => {
        process.env = originalEnvironmentVariables;
        jest.resetAllMocks();
    });

    const mockHandler = (): void => {};
    const mockOptions = {};

    it('should return an https server', () => {
        httpsServerFactory(mockHandler, mockOptions);

        expect(createServerFake).toHaveBeenCalledTimes(1);
    });

    it('should return an https server with the server options and RequestListener specified', () => {
        httpsServerFactory(mockHandler, mockOptions);

        expect(createServerFake).toHaveBeenCalledWith(mockOptions, mockHandler);
    });

    it('should return an https server with default SSL credentials if none are specified', () => {
        setSslEnvironmentVariables('mock.key', 'mock.cert');

        httpsServerFactory(mockHandler);

        expect(readFileSyncFake).toHaveBeenNthCalledWith(1, 'mock.key', 'utf8');
        expect(readFileSyncFake).toHaveBeenNthCalledWith(2, 'mock.cert', 'utf8');
    });

    it('should throw an error if default SSL credentials are used but the path to the key file is not specified', () => {
        setSslEnvironmentVariables('', 'mock.cert');

        expect(() => httpsServerFactory(mockHandler)).toThrow();
    });

    it('should throw an error if default SSL credentials are used but the path to the certificate file is not specified', () => {
        setSslEnvironmentVariables('mock.key', '');

        expect(() => httpsServerFactory(mockHandler)).toThrow();
    });
});
