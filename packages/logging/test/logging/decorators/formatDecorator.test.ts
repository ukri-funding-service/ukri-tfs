import { describe, it, expect, beforeEach } from '@jest/globals';
import { FormatDecorator, LogFormatter, Logger, NoopLogger } from '../../../src';

describe('logging/decorators - formatDecorator', () => {
    class MockFormatter implements LogFormatter {
        readonly calls = new Array<unknown[]>();

        format(...args: unknown[]): string {
            this.calls.push([args]);
            return args.join('|');
        }
    }

    class MockLogger implements Logger {
        public results = new Array<unknown[]>();

        audit(...args: unknown[]): void {
            this.results.push(['AUDIT', ...args]);
        }
        debug(...args: unknown[]): void {
            this.results.push(['DEBUG', ...args]);
        }
        info(...args: unknown[]): void {
            this.results.push(['INFO', ...args]);
        }
        warn(...args: unknown[]): void {
            this.results.push(['WARN', ...args]);
        }
        error(...args: unknown[]): void {
            this.results.push(['ERROR', ...args]);
        }
    }

    it('can be instantiated', () => {
        const formatter = new MockFormatter();

        expect(new FormatDecorator(formatter)).toBeDefined();
    });

    it('constructs a logger', () => {
        const formatter = new MockFormatter();

        const uut = new FormatDecorator(formatter);

        expect(uut.decorate(new NoopLogger())).toBeDefined();
    });

    it('constructed logger is decorated with the formatter', () => {
        const formatter = new MockFormatter();

        const uut = new FormatDecorator(formatter);

        const logger = uut.decorate(new NoopLogger());
        logger.audit('some', 'data');

        expect(formatter.calls.length).toEqual(1);
    });

    it('constructed logger passes the formatter the expected arguments to format', () => {
        const formatter = new MockFormatter();

        const uut = new FormatDecorator(formatter);

        const logger = uut.decorate(new NoopLogger());
        logger.audit('some', 'data');

        expect(formatter.calls[0]).toContainEqual(['some', 'data']);
    });

    it('delegate logger is called only once for a single decorated logger call', () => {
        const formatter = new MockFormatter();
        const mockLogger = new MockLogger();

        const uut = new FormatDecorator(formatter);

        const logger = uut.decorate(mockLogger);
        logger.audit('some', 'data');

        expect(mockLogger.results.length).toEqual(1);
    });

    it('delegated logger receives the formatted result', () => {
        const formatter = new MockFormatter();
        const mockLogger = new MockLogger();

        const uut = new FormatDecorator(formatter);

        const logger = uut.decorate(mockLogger);
        logger.audit('some', 'data');

        expect(mockLogger.results[0]).toEqual(expect.arrayContaining(['AUDIT', 'some|data']));
    });

    describe('decorated logger implements all logging functions', () => {
        let mockLogger: MockLogger;
        let mockFormatter: MockFormatter;

        beforeEach(() => {
            mockLogger = new MockLogger();
            mockFormatter = new MockFormatter();
        });

        it('audit', () => {
            const uut = new FormatDecorator(mockFormatter);

            const logger = uut.decorate(mockLogger);
            logger.audit('this', 'is', 'a', 'test');

            expect(mockLogger.results.length).toBe(1);
            expect(mockLogger.results[0]).toEqual(expect.arrayContaining(['AUDIT', 'this|is|a|test']));
        });

        it('debug', () => {
            const uut = new FormatDecorator(mockFormatter);

            const logger = uut.decorate(mockLogger);
            logger.debug('this', 'is', 'a', 'test');

            expect(mockLogger.results.length).toBe(1);
            expect(mockLogger.results[0]).toEqual(expect.arrayContaining(['DEBUG', 'this|is|a|test']));
        });

        it('info', () => {
            const uut = new FormatDecorator(mockFormatter);

            const logger = uut.decorate(mockLogger);
            logger.info('this', 'is', 'a', 'test');

            expect(mockLogger.results.length).toBe(1);
            expect(mockLogger.results[0]).toEqual(expect.arrayContaining(['INFO', 'this|is|a|test']));
        });

        it('warn', () => {
            const uut = new FormatDecorator(mockFormatter);

            const logger = uut.decorate(mockLogger);
            logger.warn('this', 'is', 'a', 'test');

            expect(mockLogger.results.length).toBe(1);
            expect(mockLogger.results[0]).toEqual(expect.arrayContaining(['WARN', 'this|is|a|test']));
        });

        it('error', () => {
            const uut = new FormatDecorator(mockFormatter);

            const logger = uut.decorate(mockLogger);
            logger.error('this', 'is', 'a', 'test');

            expect(mockLogger.results.length).toBe(1);
            expect(mockLogger.results[0]).toEqual(expect.arrayContaining(['ERROR', 'this|is|a|test']));
        });
    });
});
