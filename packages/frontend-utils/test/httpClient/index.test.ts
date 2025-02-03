import { Logger } from '@ukri-tfs/logging';
import { expect } from 'chai';
import 'mocha';
import { Headers } from 'node-fetch';
import { getBasicAuthHttpClient, getHttpClient } from '../../src';

describe('restClient', () => {
    describe('getHttpClient', () => {
        it('should return a new TfsHttpClient', () => {
            const expectedVersion = 'expectedVersion';
            const expectedLogger = {} as unknown as Logger;
            const expectedHeaders = new Headers({ 'accept-version': expectedVersion });

            const tfsHttpClient = getHttpClient(expectedVersion, expectedLogger);

            expect(tfsHttpClient['maxTries']).to.eq(1);
            expect(tfsHttpClient['tokenProvider']).to.eq(undefined);
            expect(tfsHttpClient['requestOptions']['additionalHeaders']).to.be.instanceof(Headers);
            expect([...tfsHttpClient['requestOptions']['additionalHeaders'].keys()].length).to.eq(1);
            expect(tfsHttpClient['requestOptions']['additionalHeaders'].get('accept-version')).to.eq(
                expectedHeaders.get('accept-version'),
            );
        });
    });

    describe('getBasicAuthHttpClient', () => {
        it('should return a new TfsHttpClient with Basic Authentication', () => {
            const expectedVersion = 'expectedVersion';
            const username = 'abraham_lincoln';
            const password = 'usA_1860';

            const expectedHeaders = new Headers({
                'accept-version': expectedVersion,
                Authorization: 'Basic YWJyYWhhbV9saW5jb2xuOnVzQV8xODYw', // base64 abraham_lincoln:usA_1860
            });

            const tfsHttpClient = getBasicAuthHttpClient(username, password, expectedVersion);

            expect(tfsHttpClient['maxTries']).to.eq(1);
            expect(tfsHttpClient['tokenProvider']).to.eq(undefined);
            expect(tfsHttpClient['requestOptions']['additionalHeaders']).to.be.instanceof(Headers);
            expect([...tfsHttpClient['requestOptions']['additionalHeaders'].keys()].length).to.eq(2);
            expect(tfsHttpClient['requestOptions']['additionalHeaders'].get('accept-version')).to.eq(
                expectedHeaders.get('accept-version'),
            );
            expect(tfsHttpClient['requestOptions']['additionalHeaders'].get('Authorization')).to.eq(
                expectedHeaders.get('Authorization'),
            );
        });

        it('should not cache content', () => {
            const expectedVersion = 'expectedVersion';
            const username = 'abraham_lincoln';
            const password = 'usA_1860';
            const password2 = 'usA_1860a';

            let tfsHttpClient = getBasicAuthHttpClient(username, password, expectedVersion);
            tfsHttpClient = getBasicAuthHttpClient(username, password2, expectedVersion);

            expect(tfsHttpClient['requestOptions']['additionalHeaders'].get('Authorization')).to.not.eq(
                'Basic YWJyYWhhbV9saW5jb2xuOnVzQV8xODYw',
            );
        });
    });
});
