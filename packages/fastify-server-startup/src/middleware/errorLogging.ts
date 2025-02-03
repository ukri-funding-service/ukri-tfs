import { RequestContextLoggerBuilder } from '@ukri-tfs/auth';
import { FastifyError, FastifyRequest } from 'fastify';

export const logUncaughtErrors = (error: FastifyError, req: FastifyRequest): void => {
    const requestContext = req.getContext();
    if (requestContext && requestContext.logger) {
        const apiLogger = new RequestContextLoggerBuilder(requestContext).withOperation(req.routerPath).build();

        if (error instanceof Error) {
            if (error.statusCode && error.statusCode >= 500) {
                apiLogger.warn(
                    `${error.statusCode} exception thrown while handling request: ${error.message} :: ${error.stack}`,
                );
            } else {
                apiLogger.warn(
                    `Uncaught exception without status code thrown while handling request: ${error.message} :: ${error.stack}`,
                );
            }
        } else {
            apiLogger.warn(`Uncaught thrown entity while handling request: ${error}`);
        }
    }
};
