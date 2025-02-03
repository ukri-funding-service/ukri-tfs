import { FormatDecorator, Logger } from '@ukri-tfs/logging';
import { RequestContext } from '../auth/context';
import { buildRequestContextEventLogFormatter } from './requestContextEventLogFormatter';

export const buildRequestContextEventLogger = (requestContext: RequestContext, eventId: string): Logger => {
    const requestContextFormatter = buildRequestContextEventLogFormatter(requestContext, eventId);

    return new FormatDecorator(requestContextFormatter).decorate(requestContext.logger);
};
