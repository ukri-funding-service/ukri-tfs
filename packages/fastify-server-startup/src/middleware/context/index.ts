import { createRequestContext, GetUserFunction, RequestWithContext } from '@ukri-tfs/auth';
import { Logger } from '@ukri-tfs/logging';
import { getCorrelationIds } from '@ukri-tfs/tfs-request';
import { IncomingMessage, ServerResponse } from 'http';

interface ContextMiddlewareOptions {
    shortName: string;
    getUserFunction: GetUserFunction;
    logger: Logger;
}

export const getContextMiddleware = (opts: ContextMiddlewareOptions) => {
    return async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
        try {
            let correlationIds;
            try {
                correlationIds = getCorrelationIds(req);
            } catch (err) {
                res.statusCode = 400;
                throw err as Error;
            }

            const decoratedRequest = req as RequestWithContext;

            // Use logger from server context if one is available. Typically passed in via a test.
            decoratedRequest.context = await createRequestContext(
                req,
                opts.shortName,
                correlationIds,
                opts.logger,
                opts.getUserFunction,
            );
        } catch (err) {
            res.statusCode = 403;
            throw err as Error;
        }
    };
};
