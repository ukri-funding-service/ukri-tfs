import { RequestContext, RoleType, User } from '@ukri-tfs/auth';
import { VerifyJwtMiddlewareOptions } from '@ukri-tfs/tfs-middleware';
import * as commona from '@ukri-tfs/tfs-middleware/dist/lib/middleware/jwt/isValidJwt';
import * as commonb from '@ukri-tfs/tfs-middleware/dist/lib/middleware/jwt/isValidJwtOptions';
import { fail } from 'assert';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { FastifyInstance, FastifyReply, FastifyRequest, preHandlerHookHandler } from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Forbidden } from 'http-errors';
import 'mocha';
import { default as Sinon, default as sinon } from 'sinon';
import sinonChai from 'sinon-chai';
import { DecoratedFastifyRequest } from '../..';
import {
    andRule,
    isAnonymous,
    isSystemCall,
    nullClaimsCheckerPreHandlerHookHandler,
    orRule,
    orRuleSequential,
    requireClaim,
    requireClaimWithConfig,
    requireRole,
    sameUser,
    withAuthorizationRules,
} from '../../src/auth/authorization';
import { StubLogger } from './stubLogger';

const exampleSchema = {};

const reqContext: RequestContext = {
    userData: {
        user: Promise.resolve({
            id: 23,
            tfsId: '',
            cognitoId: '',
            roles: [
                {
                    id: 1,
                    displayName: 'Test Role',
                    name: RoleType.System,
                },
            ],
        }),
    },
    logger: new StubLogger(),
    service: 'Test Service',
    correlationIds: {
        root: '',
        parent: '',
        current: '',
    },
};

const stubRequest = { getContext: () => reqContext } as unknown as FastifyRequest;
const stubResponse = {} as unknown as FastifyReply;

describe('packages/fastify-server-startup - auth/authorization', () => {
    const mockFastifyInstance = {} as FastifyInstance;

    afterEach(sinon.restore);

    before(() => {
        chai.use(chaiAsPromised);
        chai.use(sinonChai);
    });

    describe('requireRole', () => {
        it('should return the roleCheck function', () => {
            const roleCheckFunction = requireRole([RoleType.Applicant]);
            expect(roleCheckFunction.name).to.equal('roleCheck');
        });
    });

    describe('isSystemCall', () => {
        it('should return the lambdaCheck function', () => {
            const systemCallCheck = isSystemCall();
            expect(systemCallCheck.name).to.equal('systemCallCheck');
        });

        it('should successfully authorise if accessor is lambda', async () => {
            const systemCallFunction = isSystemCall();
            const req = {
                getContext: () => {
                    return {
                        userData: {
                            user: {
                                roles: [
                                    {
                                        name: RoleType.System,
                                    },
                                ],
                            } as User,
                        },
                        logger: new StubLogger(),
                    } as unknown as RequestContext;
                },
            } as unknown as FastifyRequest;

            const call = systemCallFunction.call(
                mockFastifyInstance,
                req as FastifyRequest,
                {} as FastifyReply,
                () => {},
            );

            await expect(call).to.eventually.be.fulfilled;
        });

        it('should not successfully authorise if accessor is not a lambda', async () => {
            const systemCallFunction = isSystemCall();
            const stubLogger = new StubLogger();
            const req = {
                getContext: () => {
                    return {
                        service: 'string',
                        correlationIds: 'CorrelationIds',
                        userData: {
                            user: {
                                roles: [
                                    {
                                        name: RoleType.TfsAdmin,
                                    },
                                ],
                            } as User,
                        },
                        logger: stubLogger,
                    } as unknown as RequestContext;
                },
            } as unknown as FastifyRequest;

            const call = systemCallFunction.call(
                mockFastifyInstance,
                req as FastifyRequest,
                {} as FastifyReply,
                () => {},
            );

            await expect(call).to.eventually.be.rejected;
            expect(stubLogger.auditLogEntries).to.have.length(1); // expect audit record of rejection
        });
    });

    describe('orRule', () => {
        const failingRule: preHandlerHookHandler = async (_req, _rep, _done) => {
            throw new Forbidden();
        };
        const passingRule: preHandlerHookHandler = async (_req, _rep, _done) => {};

        it('should pass if one of two handlers pass', async () => {
            const or = orRule([failingRule, passingRule]);

            const call = or.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            await expect(call).to.eventually.be.fulfilled;
        });

        it('should reject if empty', async () => {
            const or = orRule([]);

            const call = or.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            // Reject when empty as an empty or is useless
            await expect(call).to.eventually.be.rejectedWith(Forbidden);
        });

        it('should pass with one passing rule', async () => {
            //Also acceptable to throw I suppose?
            const or = orRule([passingRule]);

            const call = or.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            await expect(call).to.eventually.be.fulfilled;
        });

        it('should fail with one failing rule', async () => {
            //Also acceptable to throw I suppose?
            const or = orRule([failingRule]);

            const call = or.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            await expect(call).to.eventually.be.rejectedWith(Forbidden);
        });

        it('should fail if both handlers fail', async () => {
            const or = orRule([failingRule, failingRule]);

            const call = or.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            await expect(call).to.eventually.be.rejectedWith(Forbidden);
        });

        it('should pass if both handlers pass', async () => {
            const or = orRule([passingRule, passingRule]);

            const call = or.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            await expect(call).to.eventually.be.fulfilled;
        });

        it('should pass with nested ORs', async () => {
            const or = orRule([
                orRule([orRule([failingRule, passingRule]), failingRule]),
                orRule([failingRule, failingRule]),
            ]);

            const call = or.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            await expect(call).to.eventually.be.fulfilled;
        });

        it('should fail with nested ORs of only failing rules', async () => {
            const or = orRule([
                orRule([orRule([failingRule, failingRule]), failingRule]),
                orRule([failingRule, failingRule]),
            ]);

            const call = or.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            await expect(call).to.eventually.be.rejectedWith(Forbidden);
        });
    });

    describe('orRuleSequential', () => {
        const failingRule: preHandlerHookHandler = async (_req, _rep, _done) => {
            throw new Forbidden();
        };
        const passingRule: preHandlerHookHandler = async (_req, _rep, _done) => {};

        it('permitted if one of two handlers pass', async () => {
            const or = orRuleSequential([failingRule, passingRule]);

            const call = or.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            await expect(call).to.eventually.be.fulfilled;
        });

        it('Forbidden if no rules', async () => {
            const or = orRuleSequential([]);

            const call = or.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            await expect(call).to.eventually.be.rejectedWith(Forbidden);
        });

        it('permitted with one passing rule', async () => {
            const or = orRuleSequential([passingRule]);

            const call = or.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            await expect(call).to.eventually.be.fulfilled;
        });

        it('forbidden with one failing rule', async () => {
            const or = orRuleSequential([failingRule]);

            const call = or.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            await expect(call).to.eventually.be.rejectedWith(Forbidden);
        });

        it('nothing is executed beyond the first rule that passes', async () => {
            const pass1: preHandlerHookHandler = Sinon.stub().resolves();
            const pass2: preHandlerHookHandler = Sinon.stub().resolves();
            const fail1: preHandlerHookHandler = Sinon.stub().rejects();

            const or = orRuleSequential([pass1, pass2, fail1]);
            or.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            expect(pass1).to.have.been.called;
            expect(pass2).not.to.have.been.called;
            expect(fail1).not.to.have.been.called;
        });

        it('forbidden if both rules fail', async () => {
            const or = orRuleSequential([failingRule, failingRule]);

            const call = or.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            await expect(call).to.eventually.be.rejectedWith(Forbidden);
        });

        it('permitted if both rules pass', async () => {
            const or = orRuleSequential([passingRule, passingRule]);

            const call = or.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            await expect(call).to.eventually.be.fulfilled;
        });

        it('permitted with nested ORs', async () => {
            const or = orRuleSequential([
                orRuleSequential([orRuleSequential([failingRule, passingRule]), failingRule]),
                orRuleSequential([failingRule, failingRule]),
            ]);

            const call = or.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            await expect(call).to.eventually.be.fulfilled;
        });

        it('failure with nested ORs of only failing rules', async () => {
            const or = orRuleSequential([
                orRuleSequential([orRuleSequential([failingRule, failingRule]), failingRule]),
                orRuleSequential([failingRule, failingRule]),
            ]);

            const call = or.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            await expect(call).to.eventually.be.rejectedWith(Forbidden);
        });
    });

    describe('andRule', () => {
        const failingRule: preHandlerHookHandler = async (_req, _rep, _done) => {
            throw new Forbidden();
        };
        const passingRule: preHandlerHookHandler = async (_req, _rep, _done) => {};

        it('should fail if one of two handlers pass', async () => {
            const and = andRule([failingRule, passingRule]);

            const call = and.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            await expect(call).to.eventually.be.rejected;
        });

        it('should reject if empty', async () => {
            const and = andRule([]);

            const call = and.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            // Reject when empty as an empty or is useless
            await expect(call).to.eventually.be.rejectedWith(Forbidden);
        });

        it('should pass with one passing rule', async () => {
            //Also acceptable to throw I suppose?
            const and = andRule([passingRule]);

            const call = and.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            await expect(call).to.eventually.be.fulfilled;
        });

        it('should fail with one failing rule', async () => {
            //Also acceptable to throw I suppose?
            const and = andRule([failingRule]);

            const call = and.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            await expect(call).to.eventually.be.rejectedWith(Forbidden);
        });

        it('should fail if both handlers fail', async () => {
            const and = andRule([failingRule, failingRule]);

            const call = and.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            await expect(call).to.eventually.be.rejectedWith(Forbidden);
        });

        it('should pass if both handlers pass', async () => {
            const and = andRule([passingRule, passingRule]);

            const call = and.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            await expect(call).to.eventually.be.fulfilled;
        });

        it('should pass with nested ANDs', async () => {
            const and = andRule([
                andRule([andRule([passingRule, passingRule]), passingRule]),
                andRule([passingRule, passingRule]),
            ]);

            const call = and.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            await expect(call).to.eventually.be.fulfilled;
        });

        it('should fail with nested ANDs with one failing rule', async () => {
            const and = andRule([
                andRule([andRule([passingRule, failingRule]), passingRule]),
                andRule([passingRule, passingRule]),
            ]);

            const call = and.call(mockFastifyInstance, {} as FastifyRequest, {} as FastifyReply, () => {});

            await expect(call).to.eventually.be.rejectedWith(Forbidden);
        });
    });

    describe('nullClaimCheck', () => {
        it('should resolve', async () => {
            const nullClaimsCheckerFn = nullClaimsCheckerPreHandlerHookHandler();

            try {
                await nullClaimsCheckerFn.call(mockFastifyInstance, stubRequest, stubResponse);
            } catch {
                expect.fail('Should never fail');
            }
        });
    });

    describe('requireClaim', () => {
        const stubIsValidJwt = (isValid: boolean): sinon.SinonStub => {
            return sinon.stub(commona, 'isValidJwt').returns(async (_req: IncomingMessage) => {
                if (!isValid) {
                    throw new Error();
                }
            });
        };

        it('should use the JWT_WELL_KNOWN_ENDPOINT env variable when access tokens are required', async () => {
            process.env = {
                REQUIRE_ACCESS_TOKEN: 'true',
                JWT_WELL_KNOWN_ENDPOINT: 'test endpoint',
            };

            const getIsValidJwtOptionsStub = sinon
                .stub(commonb, 'getIsValidJwtOptions')
                .returns({} as unknown as VerifyJwtMiddlewareOptions);
            const isValidJwtStub = stubIsValidJwt(true);

            const requireClaimFn = requireClaim(['test-claim']);
            try {
                await requireClaimFn.call(mockFastifyInstance, stubRequest, stubResponse);
            } catch {} // we expect to fail but don't care as this is not what we're testing

            expect(isValidJwtStub).to.be.called;
            expect(getIsValidJwtOptionsStub).to.be.called;
            expect(getIsValidJwtOptionsStub).to.be.calledWith(['test-claim'], 'test endpoint');
        });

        it('should allow access if REQUIRE_ACCESS_TOKEN is true and token is valid', async () => {
            process.env = {
                REQUIRE_ACCESS_TOKEN: 'true',
                JWT_WELL_KNOWN_ENDPOINT: 'test endpoint', // Required when REQUIRE_ACCESS_TOKEN is true
            };

            const requireClaimFunction: preHandlerHookHandler<
                Server,
                IncomingMessage,
                ServerResponse,
                RouteGenericInterface,
                unknown
            > = requireClaim(['test-claim']);

            stubIsValidJwt(true);
            await expect(requireClaimFunction.call(mockFastifyInstance, stubRequest, stubResponse, () => {})).to
                .eventually.be.fulfilled;
        });

        it('should not forbid access if REQUIRE_ACCESS_TOKEN is false', async () => {
            process.env = {
                REQUIRE_ACCESS_TOKEN: 'false',
            };

            const requireClaimFunction: preHandlerHookHandler<
                Server,
                IncomingMessage,
                ServerResponse,
                RouteGenericInterface,
                unknown
            > = requireClaim(['test-claim']);

            await expect(requireClaimFunction.call(mockFastifyInstance, stubRequest, stubResponse, () => {})).to
                .eventually.be.fulfilled;
        });

        it('should forbid access if REQUIRE_ACCESS_TOKEN is true and the token is not valid', async () => {
            process.env = {
                REQUIRE_ACCESS_TOKEN: 'true',
                JWT_WELL_KNOWN_ENDPOINT: 'test endpoint', // Required when REQUIRE_ACCESS_TOKEN is true
            };

            const requireClaimFunction: preHandlerHookHandler<
                Server,
                IncomingMessage,
                ServerResponse,
                RouteGenericInterface,
                unknown
            > = requireClaim(['test-claim']);

            stubIsValidJwt(false);
            await expect(
                requireClaimFunction.call(mockFastifyInstance, stubRequest, stubResponse, () => {}),
            ).to.eventually.be.rejectedWith('Forbidden');
        });

        it('should return the claimCheck function when access tokens are required', () => {
            process.env = {
                REQUIRE_ACCESS_TOKEN: 'true',
                JWT_WELL_KNOWN_ENDPOINT: 'test endpoint',
            };
            const requireClaimFunction = requireClaim(['test-claim']);
            expect(requireClaimFunction.name).to.equal('claimCheck');
        });

        it('should return the claimCheck function when access tokens flag is undefined', () => {
            process.env = {
                REQUIRE_ACCESS_TOKEN: undefined,
                JWT_WELL_KNOWN_ENDPOINT: 'test endpoint',
            };
            const requireClaimFunction = requireClaim(['test-claim']);
            expect(requireClaimFunction.name).to.equal('claimCheck');
        });

        it('should return the claimCheck function when access tokens flag is set to unrecognised value', () => {
            process.env = {
                REQUIRE_ACCESS_TOKEN: 'someGibberish',
                JWT_WELL_KNOWN_ENDPOINT: 'test endpoint',
            };
            const requireClaimFunction = requireClaim(['test-claim']);
            expect(requireClaimFunction.name).to.equal('claimCheck');
        });

        it('should return the nullClaimCheck function when access tokens are explicitly not required', () => {
            process.env = {
                REQUIRE_ACCESS_TOKEN: 'false',
            };
            const requireClaimFunction = requireClaim(['test-claim']);
            expect(requireClaimFunction.name).to.equal('nullClaimCheck');
        });
    });

    describe('requireClaimWithConfig', () => {
        it('should return the claimCheck function when configured with valid config', () => {
            process.env = {};

            const stubJwtOptions: VerifyJwtMiddlewareOptions = {
                requiredClaims: [],
                wellKnownEndpoint: '',
                rawTokenExtractor: {
                    extract: () => undefined,
                },
                keysAccessor: {
                    retrieve: () => Promise.resolve([]),
                },
                claimsVerifier: {
                    verify: () => Promise.resolve(),
                },
            };

            const requireClaimFunction = requireClaimWithConfig({
                claimsCheckingIsDisabled: false,
                requiredClaims: [],
                jwtOptions: stubJwtOptions,
            });

            expect(requireClaimFunction.name).to.equal('claimCheck');
        });

        it('should return the nullClaimCheck function when access tokens are explicitly not required', () => {
            process.env = {};
            const requireClaimFunction = requireClaimWithConfig({ claimsCheckingIsDisabled: true });
            expect(requireClaimFunction.name).to.equal('nullClaimCheck');
        });
    });

    describe('withAuthorizationRules', () => {
        it('should return an object containing the roleCheck function as the first preHandler value given an object with no preHandler', () => {
            const options = withAuthorizationRules([requireRole([RoleType.Applicant])], {
                schema: exampleSchema,
            });

            if (!Array.isArray(options.preHandler)) {
                fail('Expected prehandler to be an array');
            } else {
                expect(options.preHandler).to.not.be.empty;
                expect(options.preHandler.length).to.equal(1);
                expect(options.preHandler[0].name).to.equal('roleCheck');
            }
        });

        it('should return an object containing the roleCheck function as the first preHandler value given an object with an empty preHandler value', () => {
            const options = withAuthorizationRules([requireRole([RoleType.Applicant])], {
                schema: exampleSchema,
            });

            if (!Array.isArray(options.preHandler)) {
                fail('Expected prehandler to be an array');
            } else {
                expect(options.preHandler).to.not.be.empty;
                expect(options.preHandler[0].name).to.equal('roleCheck');
            }
        });

        it('should return an object containing the roleCheck function as the first preHandler value given an object with an existing preHandler item', () => {
            const otherFunction = async function (): Promise<void> {
                return Promise.resolve();
            };
            const options = withAuthorizationRules([requireRole([RoleType.Applicant])], {
                schema: exampleSchema,
                preHandler: otherFunction,
            });

            if (!Array.isArray(options.preHandler)) {
                fail('Expected prehandler to be an array');
            } else {
                expect(options.preHandler).to.not.be.empty;
                expect(options.preHandler.length).to.be.at.least(2);
                expect(options.preHandler[0].name).to.equal('roleCheck');
                expect(options.preHandler[1].name).to.equal('otherFunction');
            }
        });

        it('should return an object containing the roleCheck function as the first preHandler value given an object with an single-item preHandler array', () => {
            const otherFunction = async function (): Promise<void> {
                return Promise.resolve();
            };
            const options = withAuthorizationRules([requireRole([RoleType.Applicant])], {
                schema: exampleSchema,
                preHandler: [otherFunction],
            });

            expect(options.preHandler).to.not.be.empty;

            if (!Array.isArray(options.preHandler)) {
                fail('Expected prehandler to be an array');
            } else {
                expect(options.preHandler.length).to.be.at.least(2);
                expect(options.preHandler[0].name).to.equal('roleCheck');
                expect(options.preHandler[1].name).to.equal('otherFunction');
            }
        });

        it('should return an object containing the roleCheck function as the first preHandler value given an object with a multiple-item preHandler array', () => {
            const otherFunction = async function (): Promise<void> {
                return Promise.resolve();
            };
            const yetAnotherFunction = async function (): Promise<void> {
                return Promise.resolve();
            };
            const options = withAuthorizationRules([requireRole([RoleType.Applicant])], {
                schema: exampleSchema,
                preHandler: [otherFunction, yetAnotherFunction],
            });

            expect(options.preHandler).to.not.be.empty;

            if (!Array.isArray(options.preHandler)) {
                fail('Expected prehandler to be an array');
            } else {
                expect(options.preHandler.length).to.be.at.least(3);
                expect(options.preHandler[0].name).to.equal('roleCheck');
                expect(options.preHandler[1].name).to.equal('otherFunction');
                expect(options.preHandler[2].name).to.equal('yetAnotherFunction');
            }
        });
    });

    describe('sameUser', () => {
        const mockUser = Promise.resolve({ tfsId: 123 } as unknown as User);

        it('should be fulfilled with matching tfsUserId and tfsId', async () => {
            const req: DecoratedFastifyRequest = {
                params: { tfsUserId: 123 },
                getContext: () => {
                    return {
                        service: 'string',
                        correlationIds: 'CorrelationIds',
                        userData: { userId: 123, user: mockUser },
                        logger: new StubLogger(),
                    } as unknown as RequestContext;
                },
            } as unknown as DecoratedFastifyRequest;

            const rep = {} as unknown as FastifyReply;
            const sameUserCall = sameUser.call(mockFastifyInstance, req, rep, () => {});
            await expect(sameUserCall).to.eventually.be.fulfilled;
        });

        it('should be rejected with non matching tfsUserId and tfsId', async () => {
            const req: DecoratedFastifyRequest = {
                params: { tfsUserId: 123 },
                getContext: () => {
                    return {
                        service: 'string',
                        correlationIds: 'CorrelationIds',
                        userData: { userId: 123, user: mockUser },
                        logger: new StubLogger(),
                    } as unknown as RequestContext;
                },
            } as unknown as DecoratedFastifyRequest;

            req.params = { tfsUserId: 123456 };
            const rep = {} as unknown as FastifyReply;
            const sameUserCall = sameUser.call(mockFastifyInstance, req, rep, () => {});
            await expect(sameUserCall).to.eventually.be.rejectedWith('Forbidden');
        });

        it('should be rejected with non matching tfsUserId and tfsId when User is undefined', async () => {
            const req: DecoratedFastifyRequest = {
                params: { tfsUserId: 123 },
                getContext: () => {
                    return {
                        service: 'string',
                        correlationIds: 'CorrelationIds',
                        userData: { userId: 123, user: Promise.resolve(undefined) },
                        logger: new StubLogger(),
                    } as unknown as RequestContext;
                },
            } as unknown as DecoratedFastifyRequest;

            req.params = { tfsUserId: 123456 };
            const rep = {} as unknown as FastifyReply;
            const sameUserCall = sameUser.call(mockFastifyInstance, req, rep, () => {});
            await expect(sameUserCall).to.eventually.be.rejectedWith('Forbidden');
        });

        it('should be logged with non matching tfsUserId and tfsId when User is returned', async () => {
            const localLogger = new StubLogger();

            const req: DecoratedFastifyRequest = {
                params: { tfsUserId: 123456 },
                getContext: () => {
                    return {
                        service: 'string',
                        correlationIds: 'CorrelationIds',
                        userData: { userId: 123, user: mockUser },
                        logger: localLogger,
                    } as unknown as RequestContext;
                },
            } as unknown as DecoratedFastifyRequest;

            const reply = {} as unknown as FastifyReply;

            try {
                await sameUser.call(mockFastifyInstance, req, reply, () => {});
                fail('expected an exception');
            } catch (error: unknown) {
                expect(error).instanceOf(Forbidden);
            }

            expect(localLogger.auditLogEntries).to.have.length(1); // expect audit record of rejection
        });

        it('should be logged with non matching tfsUserId and tfsId when User is undefined', async () => {
            const localLogger = new StubLogger();

            const req: DecoratedFastifyRequest = {
                params: { tfsUserId: 123456 },
                getContext: () => {
                    return {
                        service: 'string',
                        correlationIds: 'CorrelationIds',
                        userData: { userId: 123, user: Promise.resolve(undefined) },
                        logger: localLogger,
                    } as unknown as RequestContext;
                },
            } as unknown as DecoratedFastifyRequest;

            const reply = {} as unknown as FastifyReply;

            try {
                await sameUser.call(mockFastifyInstance, req, reply, () => {});
                fail('expected an exception');
            } catch (error: unknown) {
                expect(error).instanceOf(Forbidden);
            }

            expect(localLogger.auditLogEntries).to.have.length(1); // expect audit record of rejection
        });
    });

    describe('anonymous', () => {
        const mockUser = Promise.resolve({ tfsId: '1234' } as User);

        it('should be fulfilled with anonymous user', async () => {
            const req = {
                getContext: () => {
                    return {
                        service: 'string',
                        correlationIds: 'CorrelationIds',
                        userData: { userId: 'anon' },
                        logger: new StubLogger(),
                    } as unknown as RequestContext;
                },
            };
            const rep = {} as unknown as FastifyReply;
            const anonymousCall = isAnonymous.call(
                mockFastifyInstance,
                req as unknown as FastifyRequest,
                rep,
                () => {},
            );
            await expect(anonymousCall).to.eventually.be.fulfilled;
        });

        it('should be rejected with non anonymous user', async () => {
            const req = {
                getContext: () => {
                    return {
                        service: 'string',
                        correlationIds: 'CorrelationIds',
                        userData: { userId: '1234', user: mockUser },
                        logger: new StubLogger(),
                    } as unknown as RequestContext;
                },
            };

            const rep = {} as unknown as FastifyReply;
            const anonymousCall = isAnonymous.call(
                mockFastifyInstance,
                req as unknown as FastifyRequest,
                rep,
                () => {},
            );
            await expect(anonymousCall).to.eventually.be.rejectedWith('Forbidden');
        });

        it('should be audit logged with non anonymous user', async () => {
            const localLogger = new StubLogger();
            const req: DecoratedFastifyRequest = {
                getContext: () => {
                    return {
                        service: 'string',
                        correlationIds: 'CorrelationIds',
                        userData: { userId: '1234', user: mockUser },
                        logger: localLogger,
                    } as unknown as RequestContext;
                },
            } as unknown as DecoratedFastifyRequest;

            const rep = {} as unknown as FastifyReply;
            isAnonymous.call(mockFastifyInstance, req as unknown as FastifyRequest, rep, () => {});

            expect(localLogger.auditLogEntries).to.have.length(1); // expect audit record of rejection
        });
    });
});
