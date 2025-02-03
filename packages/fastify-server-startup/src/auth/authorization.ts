import {
    isRequestAllowedByRole,
    isRequestSystemCall,
    RequestContext,
    RequestContextLoggerBuilder,
    RoleType,
} from '@ukri-tfs/auth';
import { getEnvironmentVariableOrThrow, getEnvironmentVariableOrUndefined } from '@ukri-tfs/configuration';
import { Logger } from '@ukri-tfs/logging';
import {
    getIsValidJwtOptions,
    isValidJwt,
    retrieveWellKnownEndpointKeys,
    VerifyJwtMiddlewareOptions,
} from '@ukri-tfs/tfs-middleware';
import {
    FastifyReply,
    FastifyRequest,
    preHandlerAsyncHookHandler,
    preHandlerHookHandler,
    RouteShorthandOptions,
} from 'fastify';
import { Forbidden } from 'http-errors';

export const buildApiLogger = (requestContext: RequestContext, operation: string): Logger => {
    return new RequestContextLoggerBuilder(requestContext).withOperation(operation).build();
};

export const requireRole = (allowedRoles: RoleType[]): preHandlerHookHandler => {
    // we give a name to the function for unittesting purpose.
    const roleCheck: preHandlerHookHandler = async function (req: FastifyRequest): Promise<void> {
        const requestContext = req.getContext();
        const allowed = await isRequestAllowedByRole(requestContext, allowedRoles);

        if (!allowed) {
            buildApiLogger(requestContext, req.routerPath).audit(
                `Access denied, user ${requestContext.userData.userId} does not have required role`,
            );
            throw new Forbidden();
        }
    };
    return roleCheck;
};

/* @deprecated Use requireClaimWithConfig which will eventually replace this */
export const requireClaim = (requiredClaims: string[]): preHandlerAsyncHookHandler => {
    // REQUIRE_ACCESS_TOKEN should always be true except for local development.
    const ignoreCheck = getEnvironmentVariableOrUndefined('REQUIRE_ACCESS_TOKEN') === 'false';

    if (ignoreCheck) {
        return nullClaimsCheckerPreHandlerHookHandler();
    } else {
        const wellKnownEndpoint = getEnvironmentVariableOrThrow('JWT_WELL_KNOWN_ENDPOINT');
        const jwtOptions = getIsValidJwtOptions(requiredClaims, wellKnownEndpoint, retrieveWellKnownEndpointKeys);
        return claimsCheckerPreHandlerHookHandler(requiredClaims, jwtOptions);
    }
};

const nullClaimCheck: preHandlerAsyncHookHandler = async (req: FastifyRequest): Promise<void> => {
    buildApiLogger(req.getContext(), req.routerPath).debug('inside nullClaimCheck');
};

export const nullClaimsCheckerPreHandlerHookHandler = (): preHandlerAsyncHookHandler => {
    return nullClaimCheck;
};

export type NullClaimsCheckerConfig = {
    claimsCheckingIsDisabled: true;
};

export type JwtClaimsCheckerConfig = {
    claimsCheckingIsDisabled: false;
    requiredClaims: string[];
    jwtOptions: VerifyJwtMiddlewareOptions;
};

export type ClaimsCheckerConfig = NullClaimsCheckerConfig | JwtClaimsCheckerConfig;

// This could be named requireAllClaims to be clearer, but retaining link to predecessor until
// we have removed the deprecated version.
export const requireClaimWithConfig = (config: ClaimsCheckerConfig): preHandlerHookHandler => {
    switch (config.claimsCheckingIsDisabled) {
        case true: {
            return nullClaimsCheckerPreHandlerHookHandler();
        }
        case false: {
            return claimsCheckerPreHandlerHookHandler(config.requiredClaims, config.jwtOptions);
        }
    }
};

export const claimsCheckerPreHandlerHookHandler = (
    requiredClaims: string[],
    authConfig: VerifyJwtMiddlewareOptions,
): preHandlerAsyncHookHandler => {
    const claimCheck: preHandlerAsyncHookHandler = async function (
        req: FastifyRequest,
        _res: FastifyReply,
    ): Promise<void> {
        const apiLogger = buildApiLogger(req.getContext(), req.routerPath);

        try {
            apiLogger.debug('in claimsCheckerPreHandlerHookHandler');
            await isValidJwt(authConfig)(req.raw);
            apiLogger.debug('called isValidJwt');
        } catch {
            apiLogger.audit(`Access denied, request doesn\'t include claims: ${requiredClaims}`);
            throw new Forbidden();
        }
    };

    return claimCheck;
};

export const isSystemCall = (): preHandlerHookHandler => {
    const systemCallCheck: preHandlerHookHandler = async (req: FastifyRequest): Promise<void> => {
        const requestContext = req.getContext();
        const allowed = await isRequestSystemCall(requestContext);

        if (!allowed) {
            buildApiLogger(req.getContext(), req.routerPath).audit(
                `Access denied, accessor ${requestContext.userData.userId} does not have the required role.`,
            );

            throw new Forbidden();
        }
    };

    return systemCallCheck;
};

export const orRule = (rules: preHandlerHookHandler[]): preHandlerHookHandler => {
    const orRuleImpl: preHandlerHookHandler = async function (req, res, done): Promise<void> {
        const promises = await Promise.allSettled(rules.map(rule => rule.call(this, req, res, done)));

        if (!promises.some(promise => promise.status === 'fulfilled')) {
            throw new Forbidden();
        }
    };

    return orRuleImpl;
};

export const orRuleSequential = (rules: preHandlerHookHandler[]): preHandlerHookHandler => {
    const orRuleImpl: preHandlerHookHandler = async function (req, res, done): Promise<void> {
        for (const rule of rules) {
            /** WARNING: OPTIMISED CODE
             * UFS-2294
             * Using allSettled on a single promise here is not the most ideal solution,
             * however it allows us to maintain the behaviour of the parallel 'orRule'
             * but in a sequential fashion. It was written to allow specification of which
             * rule is most likely to succeed first.
             */
            const ruleResult = await Promise.allSettled([rule.call(this, req, res, done)]);

            if (ruleResult[0].status === 'fulfilled') return;
        }

        throw new Forbidden();
    };

    return orRuleImpl;
};

export const andRule = (rules: preHandlerHookHandler[]): preHandlerHookHandler => {
    const andRuleImpl: preHandlerHookHandler = async function (req, res, done): Promise<void> {
        if (rules.length === 0) {
            throw new Forbidden();
        }

        const promises = await Promise.allSettled(rules.map(rule => rule.call(this, req, res, done)));

        if (promises.some(promise => promise.status !== 'fulfilled')) {
            throw new Forbidden();
        }
    };

    return andRuleImpl;
};

export const withAuthorizationRules = (
    rules: preHandlerHookHandler[],
    options: Omit<RouteShorthandOptions, 'version'>,
): RouteShorthandOptions => {
    let handlers: preHandlerHookHandler[] = [];
    handlers = handlers.concat(rules);

    if (options.preHandler instanceof Array) {
        handlers = handlers.concat(options.preHandler);
    } else if (options.preHandler) {
        handlers.push(options.preHandler);
    }

    return {
        ...options,
        preHandler: handlers,
    };
};

export const checkSameUser = async (req: FastifyRequest, tfsUserId: string): Promise<void> => {
    const requestContext = req.getContext();

    const apiLogger = buildApiLogger(requestContext, req.routerPath);
    const user = await requestContext.userData.user;

    if (user === undefined) {
        apiLogger.audit(`Access denied, user could not be determined`);
        throw new Forbidden();
    }

    if (user.tfsId !== tfsUserId) {
        apiLogger.audit(`Access denied, not same user: ${tfsUserId} does not match TFS User ID ${user.tfsId}`);
        throw new Forbidden();
    }
};

export const sameUser: preHandlerHookHandler = async (req: FastifyRequest): Promise<void> => {
    await checkSameUser(req, (req.params as { tfsUserId: string }).tfsUserId);
};

export const sameBodyUser: preHandlerHookHandler = async (req: FastifyRequest): Promise<void> => {
    await checkSameUser(req, (req.body as { tfsUserId: string }).tfsUserId);
};

export const isAnonymous: preHandlerHookHandler = async (req: FastifyRequest): Promise<void> => {
    const requestContext = req.getContext();
    const userId = requestContext.userData.userId;

    if (userId !== 'anon') {
        await buildApiLogger(requestContext, req.routerPath).audit(`Access denied, userId is not 'anon'`);
        throw new Forbidden();
    }
};
