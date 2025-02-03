import { anonymousUser, GetUserFunction, RoleType, User } from '@ukri-tfs/auth';
import {
    getAccessTokenFromRequestFn,
    getIsValidJwtOptions,
    NullVerifyJwtMiddlewareOptions,
    VerifyJwtMiddlewareOptions,
    WellKnownEndpointKey,
    WellKnownEndpointKeysAccessor,
} from '@ukri-tfs/tfs-middleware';
import { expect } from 'chai';
import { FastifyInstance } from 'fastify';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import { getRequiredClaims, isApiRestPath, isAuthedRestPath, ServerConfig } from '../src';
import { createTestServer, TestServiceContext } from './helpers/testServer';

const user: User = {
    id: 123,
    tfsId: '123',
    cognitoId: '123456',
    roles: [
        {
            id: 1,
            name: RoleType.TfsAdmin,
            displayName: 'TFS Admin',
        },
    ],
};

const getUserByTfsIdFake: GetUserFunction = async () => {
    return user;
};

const testServerConfig: Partial<ServerConfig<TestServiceContext>> = {
    requireServerAuthentication: true,
    isValidJwtOptions: new NullVerifyJwtMiddlewareOptions(),
    requiredClaimsString: 'ukri-tfs/ADM-API',
    getUserFunction: getUserByTfsIdFake,
    services: {
        userService: { getUserByUserId: getUserByTfsIdFake },
    },
};

describe('packages/fastify-server-startup', () => {
    afterEach(sinon.restore);

    describe('index', () => {
        describe('isAuthedRestPath tests', () => {
            const expectedAuthedRestPaths = [
                '/api',
                'hihi.org/api',
                'hihi.org/api/',
                'hihi.org/api/test',
                'hihi.org/api/test/123/asd',
            ];

            expectedAuthedRestPaths.forEach(path => {
                it(`should treat "${path}" as an authed rest path"`, () => {
                    expect(isAuthedRestPath(path)).to.be.true;
                });
            });

            const expectedNonAuthedRestPaths = [
                '',
                '/api-anon',
                'hihi.org/api-anon',
                'hihi.org/api-anon/',
                'hihi.org/api-anon/test',
                'hihi.org/api-anon/test/123/asd',
                '/something-else',
                'hihi.org/something-else',
                'hihi.org/something-else/',
                'hihi.org/something-else/test',
                'hihi.org/something-else/test/123/asd',
            ];

            expectedNonAuthedRestPaths.forEach(path => {
                it(`should treat "${path}" as a non-authed rest path"`, () => {
                    expect(isAuthedRestPath(path)).to.be.false;
                });
            });
        });

        describe('isApiRestPath tests', () => {
            const expectedAuthedRestPaths = [
                '/api',
                'hihi.org/api',
                'hihi.org/api/',
                'hihi.org/api/test',
                'hihi.org/api/test/123/asd',
                '/api-anon',
                'hihi.org/api-anon',
                'hihi.org/api-anon/',
                'hihi.org/api-anon/test',
                'hihi.org/api-anon/test/123/asd',
            ];

            expectedAuthedRestPaths.forEach(path => {
                it(`should treat "${path}" as an api rest path"`, () => {
                    expect(isApiRestPath(path)).to.be.true;
                });
            });

            const expectedNonAuthedRestPaths = [
                '',
                '/something-else',
                'hihi.org/something-else',
                'hihi.org/something-else/',
                'hihi.org/something-else/test',
                'hihi.org/something-else/test/123/asd',
            ];

            expectedNonAuthedRestPaths.forEach(path => {
                it(`should treat "${path}" as a non-api rest path"`, () => {
                    expect(isApiRestPath(path)).to.be.false;
                });
            });
        });

        describe('End-to-end authentication tests', () => {
            const getResponseJson = (response: Awaited<ReturnType<FastifyInstance['inject']>>) => response.json();

            const wellKnownEndpointKeys: WellKnownEndpointKey[] = [
                {
                    kid: '123',
                    kty: 'RSA',
                    alg: 'RS256',
                    use: 'sig',
                    n:
                        'zxfacrbClZb+nwwR0j9rK9wN/Hb733lVPYV3a1MglTCz/83zVYr3mOKGSHo5GZYOMRi6mI6LYcXm' +
                        'AvkLVJlvsZZsRVgn1S9tR+qRVuVMopQpRDY42c9W12/50Mz03Hne+6tdhNijUdON1ZDqub5TNDhX' +
                        'VIXWNWQEBWR2A4j+IFTg7eo+heHhtstolCD9expQcY0q3FAY+2iBHFvTjXDpEsHtfHTqhvXwHvoV' +
                        '8BfG/mKuJg4aaP5f8Og4emc3wCYbVN+cWtKC3wb2N2HeQ1xq/HXQB+v6ktQ3s9t5k80Q5qjSCg2J' +
                        'y2gGsIsgCftztrkGfgkCQqA5y/xjXbvO799CZw==',
                    e: 'AQAB',
                },
            ];

            const keyAccessorStub: WellKnownEndpointKeysAccessor = {
                retrieve: () => Promise.resolve(wellKnownEndpointKeys),
            };

            it('should return 200 OK given a request for the healthcheck endpoint without any extra headers', async () => {
                const server = await createTestServer(testServerConfig);

                const response = await server.inject({
                    method: 'GET',
                    url: 'http://127.0.0.1/health',
                    headers: { 'x-tfsuserid': anonymousUser },
                });
                expect(response.statusCode).to.equal(200);
            });

            it("should return 401 Unauthorized with the message 'Access token not found' given a request without an Authorization header", async () => {
                const server = await createTestServer(testServerConfig);

                const response = await server.inject({
                    method: 'GET',
                    url: 'http://127.0.0.1/api',
                    headers: { 'x-tfsuserid': anonymousUser },
                });
                expect(response.statusCode).to.equal(401);

                const responseObject = getResponseJson(response);
                expect(responseObject.error).to.equal('Unauthorized');
                expect(responseObject.message).to.equal('Access token not found in request');
            });

            it("should return 401 Unauthorized with the message 'Access token not found in request' given a request with an invalid Authorization header type", async () => {
                const server = await createTestServer(testServerConfig);

                const response = await server.inject({
                    method: 'GET',
                    url: 'http://127.0.0.1/api',
                    headers: {
                        'x-tfsuserid': anonymousUser,
                        authorization: 'Basic e30=',
                    },
                });
                expect(response.statusCode).to.equal(401);

                const responseObject = getResponseJson(response);
                expect(responseObject.error).to.equal('Unauthorized');
                expect(responseObject.message).to.equal('Access token not found in request');
            });

            it("should return 401 Unauthorized with the message 'Token could not be decoded' given a request with an invalid bearer token", async () => {
                const mockJwtOptions: VerifyJwtMiddlewareOptions = {
                    requiredClaims: [],
                    wellKnownEndpoint: '',
                    rawTokenExtractor: { extract: getAccessTokenFromRequestFn }, // Mock uses real auth header decoder
                    keysAccessor: { retrieve: () => Promise.resolve([]) },
                    claimsVerifier: { verify: () => Promise.resolve() },
                };

                const server = await createTestServer({
                    ...testServerConfig,
                    isValidJwtOptions: mockJwtOptions,
                });

                const response = await server.inject({
                    method: 'GET',
                    url: 'http://127.0.0.1/api',
                    headers: {
                        'x-tfsuserid': anonymousUser,
                        authorization: 'Bearer e30=',
                    },
                });
                expect(response.statusCode).to.equal(401);

                const responseObject = getResponseJson(response);
                expect(responseObject.error).to.equal('Unauthorized');
                expect(responseObject.message).to.equal('Token could not be decoded');
            });

            it("should return 403 Forbidden with the message 'Token does not contain required claims' given a request with a valid bearer token but no matching claim", async () => {
                const payload = { scope: 'some-other-scope' };
                const privateKey = fs.readFileSync('test/helpers/keys/private.pem');
                const encodedToken = jwt.sign(payload, privateKey, { algorithm: 'RS256', keyid: '123' });

                const server = await createTestServer({
                    ...testServerConfig,
                    isValidJwtOptions: {
                        ...getIsValidJwtOptions(['ukri-tfs/ADM-API'], 'NOT_A_REAL_URL', keyAccessorStub),
                        keysAccessor: keyAccessorStub,
                    },
                });

                const response = await server.inject({
                    method: 'GET',
                    url: 'http://127.0.0.1/api',
                    headers: {
                        'x-tfsuserid': anonymousUser,
                        authorization: `Bearer ${encodedToken}`,
                    },
                });
                expect(response.statusCode).to.equal(403);

                const responseObject = getResponseJson(response);
                expect(responseObject.error).to.equal('Forbidden');
                expect(responseObject.message).to.equal(
                    'Token does not contain required claims. Expected: [ukri-tfs/ADM-API], actual: [some-other-scope]',
                );
            });

            it('should return 404 Not Found given a request with a valid bearer token and a matching claim', async () => {
                const payload = { scope: 'ukri-tfs/ADM-API' };
                const privateKey = fs.readFileSync('test/helpers/keys/private.pem');
                const encodedToken = jwt.sign(payload, privateKey, { algorithm: 'RS256', keyid: '123' });

                const server = await createTestServer({
                    ...testServerConfig,
                    isValidJwtOptions: {
                        ...getIsValidJwtOptions(['ukri-tfs/ADM-API'], 'NOT_A_REAL_URL', keyAccessorStub),
                        keysAccessor: keyAccessorStub,
                    },
                });

                const response = await server.inject({
                    method: 'GET',
                    url: 'http://127.0.0.1/api',
                    headers: {
                        'x-tfsuserid': anonymousUser,
                        authorization: `Bearer ${encodedToken}`,
                    },
                });
                expect(response.statusCode).to.equal(404);
            });
        });
    });

    describe('getRequiredClaims', () => {
        it('should reject an empty set', () => {
            expect(() => getRequiredClaims('')).to.throw;
        });

        it('should handle an singleton set', () => {
            expect(getRequiredClaims('claim1')).to.deep.equal(['claim1']);
        });

        it('should handle a valid space-separated set', () => {
            expect(getRequiredClaims('claim1 claim2 claim3')).to.deep.equal(['claim1', 'claim2', 'claim3']);
        });
    });
});
