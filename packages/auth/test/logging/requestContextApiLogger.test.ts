/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger } from '@ukri-tfs/logging';
import { expect } from 'chai';
import { RequestContext } from '../../src/auth/context';
import { buildRequestContextApiLogger, RequestContextLoggerBuilder } from '../../src/logging';

describe('packages/auth - logging', () => {
    class StubLogger implements Logger {
        public logEntries: string[] = [];

        audit(...args: any[]): void {
            this.logEntries.push(JSON.stringify(args));
        }
        error(...args: any[]): void {
            this.logEntries.push(JSON.stringify(args));
        }
        warn(...args: any[]): void {
            this.logEntries.push(JSON.stringify(args));
        }
        info(...args: any[]): void {
            this.logEntries.push(JSON.stringify(args));
        }
        debug(...args: any[]): void {
            this.logEntries.push(JSON.stringify(args));
        }

        reset(): void {
            this.logEntries.slice(0);
        }
    }

    const stubLogger = new StubLogger();

    const context = {
        correlationIds: {
            current: '1234',
            parent: '5678',
            root: '7890',
        },
        service: 'TEST',
        userData: {
            user: Promise.resolve(undefined),
            userId: '1234-4567-7890',
        },
        logger: stubLogger,
    } as RequestContext;

    beforeEach(() => {
        stubLogger.reset();
    });

    describe('buildRequestContextApiLogger', () => {
        it('should build a logger', () => {
            expect(buildRequestContextApiLogger(context)).to.exist;
        });

        it('should build a logger when an operation is provided', () => {
            expect(buildRequestContextApiLogger(context, 'someOperation')).to.exist;
        });

        it('should build a logger when an operation is undefined', () => {
            expect(buildRequestContextApiLogger(context, undefined)).to.exist;
        });
    });

    describe('RequestContextLoggerBuilder', () => {
        it('should be instantiatable', () => {
            expect(new RequestContextLoggerBuilder(context)).to.exist;
        });

        it('should be possible to add an operation', () => {
            const builder = new RequestContextLoggerBuilder(context);
            builder.withOperation('someOperation');

            expect(builder.getOperation()).to.equal('someOperation');
        });

        it('should ignore an operation which is undefined', () => {
            const builder = new RequestContextLoggerBuilder(context);
            builder.withOperation(undefined);

            expect(builder.getOperation()).to.be.undefined;
        });

        it('should build a logger with no other parameters', () => {
            const builder = new RequestContextLoggerBuilder(context);
            expect(builder.build()).to.exist;
        });

        it('should build a logger with an operation', () => {
            const builder = new RequestContextLoggerBuilder(context);
            builder.withOperation('someOperation');
            const logger = builder.build();
            logger.audit('some message');

            expect(stubLogger.logEntries).to.have.length(1);
            expect(stubLogger.logEntries[0]).to.contain(':someOperation');
        });
    });
});
