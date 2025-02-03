import { FastifyPluginOptions, FastifyRegisterOptions } from 'fastify';

export const getSwaggerDocumentationOptions = (
    apiServiceName: string,
    host: string,
): FastifyRegisterOptions<FastifyPluginOptions> => ({
    swagger: {
        info: {
            title: `${apiServiceName} API Documentation (Dev)`,
            description: `Development documentation for the ${apiServiceName}. Content from all endpoints may contain mark-up and clients should treat the responses with care. Dangerous tags have been stripped from input before persisting to the data store.`,
            version: '0.16.0',
        },
        host,
        schemes: ['https'],
        consumes: ['application/json', 'multipart/form-data'],
        produces: ['application/json'],
    },
    exposeRoute: true,
});
