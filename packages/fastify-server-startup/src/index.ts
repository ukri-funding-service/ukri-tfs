import { GetUserFunction, RequestContext, RequestWithContext } from '@ukri-tfs/auth';
import { ServerFactory } from '@ukri-tfs/http';
import { Logger } from '@ukri-tfs/logging';
import {
    getIsValidJwtOptions,
    isValidJwt,
    JwtValidationError,
    JwtVerificationErrors,
    onErrorFn,
    retrieveWellKnownEndpointKeys,
    VerifyJwtMiddlewareOptions,
} from '@ukri-tfs/tfs-middleware';
import fastify, {
    FastifyError,
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    FastifySchema,
    FastifyServerOptions,
    onRequestAsyncHookHandler,
    RawReplyDefaultExpression,
    RawRequestDefaultExpression,
    RawServerBase,
    RawServerDefault,
    RouteShorthandOptions,
} from 'fastify';
import fastifyOas from 'fastify-oas';
import { RouteGenericInterface } from 'fastify/types/route';
import middie from 'middie';
import { getSwaggerDocumentationOptions } from './documentation';
import { getContextMiddleware } from './middleware';
import { logUncaughtErrors } from './middleware/errorLogging';
import { healthCheck } from './routes/health';
import { healthCheckSchema, healthCheckUrl } from './schemas';

export * from './auth/authorization';
export * from './middleware';
export * from './routes/health';
export * from './schemas/healthcheck';
// Seems to fix TS2742: The inferred type of 'default' cannot be named without a reference to '@ukri-tfs/fastify-server-startup/node_modules/fastify/types/route'.
export { RouteGenericInterface };

// Types which support prefixing a key to allow creation of the OpenAPI extensions (below)
export type PrefixedAttributeKey<Key, Prefix extends string> = Key extends string ? `${Prefix}${Key}` : never;

// OpenAPI schema extensions - which are members of a schema
// starting with the prefix 'x-...' and having constrained types
// See https://swagger.io/docs/specification/openapi-extensions
export type OpenAPIExtensionKey = PrefixedAttributeKey<string, 'x-'>;
export type OpenAPIExtensionValue = string | number | boolean | object | null;

// Type which supports regular keys
export type SwaggerJSONSchemaProperties = { [key: string]: SwaggerJSONSchema };

// Not the same as @types/json-schema, see https://swagger.io/docs/specification/data-models/keywords/
export interface SwaggerJSONSchema {
    $id?: string; // Unsupported by Swagger but useful for documentation purposes
    type?: 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array' | 'null';

    enum?: string[];
    nullable?: boolean;
    pattern?: string; // a regular expression template for a string value (ECMA 262)
    format?: string; // WARNING: Fastify has limited support for OpenAPI formats, check before using

    // Optional qualifiers for strings
    minLength?: number;
    maxLength?: number;

    // Optional qualifiers for numerics (number or integer)
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: number;
    exclusiveMaximum?: number;

    // Optional qualifiers for arrays
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;

    allOf?: SwaggerJSONSchema[];
    anyOf?: SwaggerJSONSchema[];
    oneOf?: SwaggerJSONSchema[];
    not?: SwaggerJSONSchema;

    required?: string[];
    properties?: SwaggerJSONSchemaProperties;
    additionalProperties?: SwaggerJSONSchema | boolean;
    patternProperties?: SwaggerJSONSchemaProperties;
    items?: SwaggerJSONSchema | SwaggerJSONSchema[];

    description?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    example?: any;
    default?: unknown; // WARNING: Must match with schema type of the definition

    // Allow OpenAPI Extensions
    // WARNING: Fastify may not support any such extension, check before using
    // see https://swagger.io/docs/specification/openapi-extensions
    [key: OpenAPIExtensionKey]: OpenAPIExtensionValue;
}

export type SchemaMimeType = string;

// Optional attributes which extend the built-in Fastify schema type
// to provide useful data for defining a route
export type SchemaExtensions = {
    description?: string;
    consumes?: SchemaMimeType[];
    produces?: SchemaMimeType[];
};

export type ExtendedSchema = FastifySchema & SchemaExtensions;

export interface Endpoint<ServiceContextType> {
    path: string;
    endpoints: (app: DecoratedFastifyInstance<ServiceContextType>) => void;
}

export interface ServerConfigBase<ServiceContextType> {
    /**
     * @description Long name of the service i.e. 'Application Manager'
     */
    name: string;
    /**
     * @description Short name of the service i.e. 'AM'
     */
    shortName: string;
    /**
     * @description Host name (required for remote use of Swagger documentation)
     */
    host: string;
    /**
     * @description Port number that the server will listen on when started
     */
    port: number;
    /**
     * @description Register any additional plugins to the fastify server
     */
    registerAdditionalPlugins?: (fastifyServer: FastifyInstance) => void;
    /**
     * @description Array of Endpoint objects that contain path prefixes and
     * functions setting up endpoint handlers
     */
    endpoints: Endpoint<ServiceContextType>[];
    /**
     * @description Whether the server requires service-to-service
     * authentication on its endpoints
     */
    requireServerAuthentication: boolean;
    /**
     * @description Claim string for defining scope of authentication i.e.
     * 'ukri-tfs/OM-API'. Can pass multiple values delimited by spaces.
     */
    requiredClaimsString: string;
    /**
     * @description Optional: Options for decoding the service-to-service JWT tokens.
     * Used for grabbing the token off the header, decoding, and verifying it.
     */
    isValidJwtOptions?: VerifyJwtMiddlewareOptions;
    /**
     * @description Boolean flag to enable and serve the swagger documentation.
     * Should be disabled on production
     */
    serveApiDocumentation: boolean;
    /**
     * @description Optional: Fastify configuration object for any additional configuration
     * we want to pass to Fastify.
     */
    fastifyOptions?: FastifyServerOptions;
}

export interface ServerConfig<ServiceContextType> extends ServerConfigBase<ServiceContextType> {
    /**
     * @description A DI object containing all services to be used down the
     * stack. Usually for services that facilitate service-to-service calls
     */
    services: ServiceContextType;
    /**
     * @description A service specific logger object
     */
    logger: Logger;
    /**
     * @description function for specifically retrieving a user with a user id,
     * used in the request context middleware.
     *
     * This has been left in since it's used at the middleware level, and should
     * be kept separate from the application services.
     */
    getUserFunction: GetUserFunction;
}

export function getRequiredClaims(requiredClaimsString: string): string[] {
    const delimiter = ' ';
    if (!requiredClaimsString) {
        const errorMessage = 'Required claims must be a space-separated list of claims, it was an empty string.';
        throw new Error(errorMessage);
    }
    return requiredClaimsString.split(delimiter);
}

const restPathV1 = '/api';
const anonRestPathV1 = '/api-anon';

export const isApiRestPath = (url: string | undefined): boolean => {
    return url
        ? url.endsWith(restPathV1) ||
              url.includes(restPathV1 + '/') ||
              url.endsWith(anonRestPathV1) ||
              url.includes(anonRestPathV1 + '/')
        : false;
};

export const isAuthedRestPath = (url: string | undefined): boolean => {
    return url ? url.endsWith(restPathV1) || url.includes(restPathV1 + '/') : false;
};

export type DecoratedRouteShorthandMethod<ServiceContextType> = <
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
>(
    path: string,
    opts: Omit<RouteShorthandOptions, 'version'>,
    handler: DecoratedRouteHandler<ServiceContextType, RouteGeneric>,
) => DecoratedFastifyInstance<ServiceContextType>;

export interface FastifyInstanceDecorations<ServiceContextType> {
    /**
     * @description Function that will return the injected services
     */
    getServices(): ServiceContextType;

    /**
     * @description Function that will return the server config
     */
    getConfig(): ServerConfig<ServiceContextType>;

    get: DecoratedRouteShorthandMethod<ServiceContextType>;
    put: DecoratedRouteShorthandMethod<ServiceContextType>;
    post: DecoratedRouteShorthandMethod<ServiceContextType>;
    patch: DecoratedRouteShorthandMethod<ServiceContextType>;
    delete: DecoratedRouteShorthandMethod<ServiceContextType>;
}

// Combine the FastifyInstance with our decorations, but don't expose the methods used to configure Fastify.
// This helps to ensure any configuration is done up during the creation process, for least surprise.
export type DecoratedFastifyInstance<ServiceContextType> = Omit<
    Omit<FastifyInstance, 'get' | 'put' | 'post' | 'patch' | 'delete'> & FastifyInstanceDecorations<ServiceContextType>,
    'register' | 'decorate' | 'decorateRequest' | 'decorateReply' | 'addHook'
>;

export type DecoratedFastifyRequest<
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
    RawServer extends RawServerBase = RawServerDefault,
> = FastifyRequest<RouteGeneric, RawServer> & { getContext(): RequestContext };

export type DecoratedRouteHandler<
    ServiceContextType,
    RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
    RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
    RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
> = (
    this: DecoratedFastifyInstance<ServiceContextType>,
    request: DecoratedFastifyRequest<RouteGeneric, RawServer>,
    reply: FastifyReply<RawServer, RawRequest, RawReply, RouteGeneric>,
) => void | Promise<RouteGeneric['Reply'] | void>;

export async function createFastifyRestServer<ServiceContextType>(
    serverConfig: ServerConfig<ServiceContextType>,
    httpServer: ServerFactory,
): Promise<DecoratedFastifyInstance<ServiceContextType>> {
    const {
        endpoints,
        fastifyOptions = {},
        isValidJwtOptions,
        logger,
        name,
        host,
        getUserFunction,
        requiredClaimsString,
        requireServerAuthentication,
        services,
        shortName,
        serveApiDocumentation,
        registerAdditionalPlugins,
    } = serverConfig;

    const fastifyServer = fastify({
        serverFactory: handler => httpServer(handler),
        ...fastifyOptions,
    });

    /** Decorators **/
    fastifyServer.decorateRequest('getContext', function (this: FastifyRequest): RequestContext {
        return (this.raw as RequestWithContext).context;
    });

    // TODO: refactor these below two with a 'getConfig'
    fastifyServer.decorate('getServices', (): ServiceContextType => {
        return services;
    });

    fastifyServer.decorate('getConfig', function (): ServerConfig<ServiceContextType> {
        return serverConfig;
    });

    /** Hooks **/
    if (serveApiDocumentation) {
        fastifyServer.register(fastifyOas, getSwaggerDocumentationOptions(name, host));
    }

    /** Middleware **/
    fastifyServer.addHook('onRequest', async (req, res) => {
        if (isApiRestPath(req.raw.url)) {
            return getContextMiddleware({
                shortName,
                logger,
                getUserFunction,
            })(req.raw, res.raw);
        }
    });

    fastifyServer.setErrorHandler(async (error: FastifyError, req: FastifyRequest, reply: FastifyReply) => {
        logUncaughtErrors(error, req);
        reply.send(error);
    });

    if (requireServerAuthentication) {
        // This causes OM and PD services (maybe others) to fail on startup with the error shown.
        // This is due to them not configuring the required settings properly when setting up Fastify config.
        // Once that is done, this error should be re-enabled
        // if (isValidJwtOptions === undefined) {
        //     throw new Error('Config error: isValidJwtOptions is required when requireServerAuthentication is true');
        // }
        fastifyServer.addHook('onRequest', isAuthorizedOnRequestHook(requiredClaimsString, isValidJwtOptions));
    }

    if (registerAdditionalPlugins) {
        registerAdditionalPlugins(fastifyServer);
    }

    endpoints.forEach(endpointSet => {
        fastifyServer.register(endpointSet.endpoints as unknown as (f: FastifyInstance) => void, {
            prefix: endpointSet.path,
        });
    });

    const hasHealthCheck = endpoints.some(endpointSet => endpointSet.path === healthCheckUrl);

    if (!hasHealthCheck) {
        // Allow healthcheck url shouldn't need a version, but also allow it to function with 1.0.0
        fastifyServer.get(healthCheckUrl, { schema: healthCheckSchema }, healthCheck);
        fastifyServer.get(
            healthCheckUrl,
            { schema: healthCheckSchema, constraints: { version: '1.0.0' } },
            healthCheck,
        );
    }

    // keepAliveTimeout needs to be set to a value greater than AWS ALB timeout (currently 60 seconds) and headersTimeout needs to be set to a value greater than keepAliveTimeout
    // to avoid intermittent 502 errors
    fastifyServer.server.keepAliveTimeout = 61 /*seconds*/ * 1000 /*milliseconds*/;
    fastifyServer.server.headersTimeout = 65 /*seconds*/ * 1000 /*milliseconds*/;

    await fastifyServer.register(middie);

    return fastifyServer as unknown as DecoratedFastifyInstance<ServiceContextType>;
}

export const isAuthorizedOnRequestHook = (
    requiredClaimsString: string,
    verifyJwtMiddlewareOptions: VerifyJwtMiddlewareOptions | undefined,
): onRequestAsyncHookHandler => {
    return async (req: FastifyRequest, res: FastifyReply) => {
        const rawRequest = req.raw;
        const rawResponse = res.raw;

        const wellKnownEndpoint = process.env.JWT_WELL_KNOWN_ENDPOINT || '';

        if (isAuthedRestPath(req.raw.url)) {
            try {
                // This initialisation of the JWT options should not occur here, it should be in the
                // calling service to make it easier to initialise without security configuration.
                const jwtValidator = isValidJwt(
                    verifyJwtMiddlewareOptions ||
                        getIsValidJwtOptions(
                            getRequiredClaims(requiredClaimsString),
                            wellKnownEndpoint,
                            retrieveWellKnownEndpointKeys,
                        ),
                );

                await jwtValidator(rawRequest);
            } catch (err) {
                let error: JwtValidationError;

                if (err instanceof JwtValidationError) {
                    error = err;
                } else if (err instanceof Error) {
                    error = new JwtValidationError(err.message || err.name, JwtVerificationErrors.invalidToken);
                } else {
                    error = new JwtValidationError('Unknown authorization error', JwtVerificationErrors.invalidToken);
                }

                onErrorFn(rawRequest, rawResponse, error);
                throw error;
            }
        }
    };
};

export async function start<ServiceContextType>(
    fastifyServer: DecoratedFastifyInstance<ServiceContextType>,
): Promise<DecoratedFastifyInstance<ServiceContextType>> {
    try {
        const port = fastifyServer.getConfig().port;
        await fastifyServer.listen(port, '0.0.0.0');
        // eslint-disable-next-line no-console
        console.log(`REST server listening on port ${port}`);
    } catch (err) {
        console.error(`REST server error: ${err instanceof Error ? err.message : err}`);
        throw err;
    }

    return fastifyServer;
}
