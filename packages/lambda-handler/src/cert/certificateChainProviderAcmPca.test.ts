import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CertificateChainProviderACMPCA } from './certificateChainProviderAcmPca';
import { NoopLogger } from '@ukri-tfs/logging';
// eslint-disable-next-line deprecate/import
import { mockClient } from 'aws-sdk-client-mock';
import { ACMPCAClient } from '@aws-sdk/client-acm-pca';
import * as getCertsMock from './certs';

const loggerStub = new NoopLogger();

let spiedGetCACertsChain: jest.SpiedFunction<typeof getCertsMock.getCACertificateChain>;

describe('packages/lambda-handler - cert/certificateChainProviderAcmPca', () => {
    beforeEach(() => {
        mockClient(ACMPCAClient);

        spiedGetCACertsChain = jest
            .spyOn(getCertsMock, 'getCACertificateChain')
            .mockImplementation(() => Promise.resolve('test certificate chain'));
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('can be constructed', () => {
        expect(new CertificateChainProviderACMPCA(loggerStub)).toBeDefined;
    });

    describe('getCertificateChain', () => {
        describe('empty env', () => {
            const originalEnv = { ...process.env };

            beforeEach(() => {
                process.env = {};
            });

            afterEach(() => {
                process.env = { ...originalEnv };
            });

            it('produces a certificate chain', async () => {
                const uut = new CertificateChainProviderACMPCA(loggerStub);
                await expect(uut.getCertificateChain()).resolves.toEqual('test certificate chain');
            });

            it('delegates to the getCACertificateChain function', async () => {
                const uut = new CertificateChainProviderACMPCA(loggerStub);

                await uut.getCertificateChain();

                expect(spiedGetCACertsChain).toBeCalledTimes(1);
            });

            it('sets up the expected default region', async () => {
                const uut = new CertificateChainProviderACMPCA(loggerStub);

                await uut.getCertificateChain();

                const actualReqion = await spiedGetCACertsChain.mock.calls[0][0].config.region();
                expect(actualReqion).toEqual('eu-west-2');
            });
        });

        describe('env with region set to non-default value (eu-west-1)', () => {
            const originalEnv = { ...process.env };

            beforeEach(() => {
                process.env = {
                    AWS_REGION: 'eu-west-1',
                };
            });

            afterEach(() => {
                process.env = { ...originalEnv };
            });

            it('produces a certificate chain', async () => {
                const uut = new CertificateChainProviderACMPCA(loggerStub);
                await expect(uut.getCertificateChain()).resolves.toEqual('test certificate chain');
            });

            it('delegates to the getCACertificateChain function', async () => {
                const uut = new CertificateChainProviderACMPCA(loggerStub);

                await uut.getCertificateChain();

                expect(spiedGetCACertsChain).toBeCalledTimes(1);
            });

            it('sets up the expected region', async () => {
                const uut = new CertificateChainProviderACMPCA(loggerStub);

                await uut.getCertificateChain();

                const actualReqion = await spiedGetCACertsChain.mock.calls[0][0].config.region();
                expect(actualReqion).toEqual('eu-west-1');
            });
        });
    });
});
