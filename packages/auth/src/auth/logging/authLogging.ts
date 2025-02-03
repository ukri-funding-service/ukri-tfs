import { formatCorrelationIds, LogWithRequestAndDescription, serviceFormat } from '../../logging/formats';
import { RequestContext } from '../context';

export const apiLogAuthAudit = async (context: RequestContext): Promise<void> => {
    context.logger.audit(
        `${serviceFormat(context.service, 'API')} CorrelationID ${formatCorrelationIds(
            context,
        )}: verifying service token for request made by user ${context.userData.userId}`,
    );
};

export const apiLogAuthDebug: LogWithRequestAndDescription = async (
    context: RequestContext,
    message: string,
): Promise<void> => {
    context.logger.debug(
        `${serviceFormat(context.service, 'API')} CorrelationID ${formatCorrelationIds(
            context,
        )}: verifying service token for request made by user ${context.userData.userId} - ${message}.`,
    );
};

export const apiLogAuthError: LogWithRequestAndDescription = async (
    context: RequestContext,
    message: string,
): Promise<void> => {
    context.logger.error(
        `${serviceFormat(context.service, 'API')} CorrelationID ${formatCorrelationIds(
            context,
        )}: failed to verify service token for request made by user ${context.userData.userId} - ${message}.`,
    );
};
