import { Logger } from '@ukri-tfs/logging';
import { CorrelationIds } from '../correlationIds/correlationIds';

export type StandardHeaders = {
    'x-tfsuserid': string;
    'x-rootcorrelationid': string;
    'x-correlationid': string;
    Authorization?: string;
};

export const generateStandardHeaders = (
    correlationIds: CorrelationIds,
    authorization: string | undefined,
    logger: Logger,
): StandardHeaders => {
    const headerData: StandardHeaders = {
        'x-tfsuserid': 'anon',
        'x-rootcorrelationid': correlationIds.root,
        'x-correlationid': correlationIds.current,
    };

    if (authorization !== undefined && authorization !== null && authorization.length !== 0) {
        headerData.Authorization = authorization;
    } else {
        logger.debug('*** NO AUTHORIZATION: Authorization header is omitted ***');
    }

    return headerData;
};

export class Builder {
    private correlationIds: CorrelationIds | undefined;
    private authorization: string | undefined;
    constructor(private readonly logger: Logger) {}

    withCorrelationIds(correlationIds: CorrelationIds): Builder {
        this.correlationIds = correlationIds;
        return this;
    }

    withAuthorization(authorization: string): Builder {
        if (authorization.length === 0) {
            this.logger.debug('Authorization was zero-length, Authentication header will be omitted');
            this.authorization = undefined;
        } else {
            this.authorization = authorization;
        }

        return this;
    }

    build(): StandardHeaders {
        if (this.correlationIds === undefined) {
            throw new Error('CorrelationIds are a required property');
        }

        return generateStandardHeaders(this.correlationIds, this.authorization, this.logger);
    }
}
