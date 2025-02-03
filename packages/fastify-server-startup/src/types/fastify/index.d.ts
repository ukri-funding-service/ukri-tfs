import { RequestContext } from '@ukri-tfs/auth';

declare module 'fastify' {
    export interface FastifyRequest {
        getContext(): RequestContext;
    }
}
