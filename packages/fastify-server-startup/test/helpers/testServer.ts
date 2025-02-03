import { GetUserFunction, RoleType, User } from '@ukri-tfs/auth';
import { getHtmlCleanMiddleware } from '@ukri-tfs/html-utils';
import { httpServerFactory } from '@ukri-tfs/http';
import { NoopLogger } from '@ukri-tfs/logging';
import { FastifyInstance } from 'fastify';
import { createFastifyRestServer, ServerConfig } from '../../src';

export interface TestServiceContext {
    userService?: {
        getUserByUserId: GetUserFunction;
    };
}

export const testUser: User = {
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

export const createTestServer = async (
    config: Partial<ServerConfig<TestServiceContext>> = {},
): Promise<FastifyInstance> => {
    const serverConfig: ServerConfig<TestServiceContext> = {
        name: 'Test',
        shortName: 'TEST',
        requireServerAuthentication: false,
        // Anything passed on here comes out with `app.getServices`
        services: {
            ...config.services,
        },
        endpoints: [],
        logger: new NoopLogger(),
        getUserFunction: async () => testUser,
        requiredClaimsString: '',
        serveApiDocumentation: false,
        host: '127.0.0.1:1000',
        port: 1000,
        ...config,
    };

    const fastifyServer = (await createFastifyRestServer(
        serverConfig,
        httpServerFactory,
    )) as unknown as FastifyInstance;

    fastifyServer.addHook(
        'preValidation',
        getHtmlCleanMiddleware({
            fieldsToLeaveUnSanitized: ['password'],
            richTextEditorFields: [/^variables\.questionset\.questions\[\d+]\.guidanceNotesContent$/],
        }),
    );

    return fastifyServer.ready().then(() => fastifyServer);
};
