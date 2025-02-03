import { LogFormatter, Logger } from '@ukri-tfs/logging';
import { RequestContext } from '../auth/context';
import { DebugStackTraceLogFormatDecorator } from './debugStackTraceLogFormatDecorator';
import { buildRequestContextApiFormatter } from './requestContextApiFormatter';

export const buildRequestContextApiLogger = (requestContext: RequestContext, operation?: string): Logger => {
    let formatter: LogFormatter;

    if (operation === undefined) {
        formatter = buildRequestContextApiFormatter(requestContext);
    } else {
        formatter = buildRequestContextApiFormatter(requestContext, operation);
    }

    return new DebugStackTraceLogFormatDecorator(formatter).decorate(requestContext.logger);
};

export class RequestContextLoggerBuilder {
    private operation?: string;

    constructor(private readonly requestContext: RequestContext) {}

    build(): Logger {
        return buildRequestContextApiLogger(this.requestContext, this.operation);
    }

    getOperation(): string | undefined {
        return this.operation;
    }

    withOperation(operation: string | undefined): RequestContextLoggerBuilder {
        if (operation !== undefined) {
            this.operation = operation;
        }

        return this;
    }
}
