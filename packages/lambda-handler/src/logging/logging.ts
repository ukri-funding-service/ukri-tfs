import { createInternalRequestContextWithCorrelationIds, RequestContextLoggerBuilder } from '@ukri-tfs/auth';
import { Logger } from '@ukri-tfs/logging';
import { type CorrelationIds } from '../correlationIds/correlationIds';

export const generateLogger = (lambdaName: string, correlationIds: CorrelationIds, rootLogger: Logger): Logger => {
    const requestContext = createInternalRequestContextWithCorrelationIds(lambdaName, correlationIds, rootLogger);

    return new RequestContextLoggerBuilder(requestContext).build();
};
