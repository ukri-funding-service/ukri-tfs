import { LogFormatter } from '@ukri-tfs/logging';
import { RequestContext } from '../auth/context';
import { getUserFromContext } from './formats';
import { buildEventLogFormatter } from './log-formatters';

export const buildRequestContextEventLogFormatter = (requestContext: RequestContext, eventId: string): LogFormatter => {
    return buildEventLogFormatter(
        getUserFromContext(requestContext),
        requestContext.service,
        requestContext.correlationIds,
        eventId,
    );
};
