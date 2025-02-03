import { LogFormatter } from '@ukri-tfs/logging';
import { anonymousUser, RequestContext } from '../auth/context';
import { getUserFromContext } from './formats';
import { ApiLogFormatter } from './log-formatters';

export const buildRequestContextApiFormatter = (requestContext: RequestContext, operation?: string): LogFormatter => {
    const user = getUserFromContext(requestContext) || anonymousUser;
    return new ApiLogFormatter(requestContext.service, requestContext.correlationIds, user, operation);
};
