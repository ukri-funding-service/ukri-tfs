import { describe, expect, it } from '@jest/globals';
import { format } from 'winston';
import Transport from 'winston-transport';
import { WinstonAdaptorOptions, WinstonLogger } from '../../../src';
import { LogLevel } from '../../../src/logging/options/winston';

type LogMessage = {
    level: string;
    message: string;
};

class MockTransport extends Transport {
    public logMessages: LogMessage[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(opts: any) {
        super(opts);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    log(info: any, callback: () => void) {
        setImmediate(() => {
            this.emit('logged', info);
        });

        this.logMessages.push({ level: info.level, message: info.message });

        callback();
    }
}

describe('logging/loggers - winstonLogger', () => {
    describe('different ways of building an instance', () => {
        it('should be instantiatable', () => {
            const opts: WinstonAdaptorOptions = {};

            expect(new WinstonLogger(opts)).toBeInstanceOf(WinstonLogger);
        });

        it('should be instantiatable with custom options', () => {
            const opts: WinstonAdaptorOptions = { customOptions: { format: format.colorize() } };

            expect(new WinstonLogger(opts)).toBeInstanceOf(WinstonLogger);
        });

        it('should be instantiatable with custom max logging level', () => {
            const opts: WinstonAdaptorOptions = { customOptions: { level: 'error', format: format.colorize() } };

            expect(new WinstonLogger(opts)).toBeInstanceOf(WinstonLogger);
        });

        it('should be instantiatable with multiple custom transports', () => {
            const transports = new Array<Transport>();
            transports.push(new MockTransport({}));
            transports.push(new MockTransport({}));

            const opts: WinstonAdaptorOptions = { customOptions: { transports, format: format.colorize() } };

            expect(new WinstonLogger(opts)).toBeInstanceOf(WinstonLogger);
        });

        it('should be instantiatable with isLocal true', () => {
            const opts: WinstonAdaptorOptions = { isLocal: true };

            expect(new WinstonLogger(opts)).toBeInstanceOf(WinstonLogger);
        });

        it('should be instantiatable with custom options and isLocal true', () => {
            const opts: WinstonAdaptorOptions = { customOptions: { format: format.colorize() }, isLocal: true };

            expect(new WinstonLogger(opts)).toBeInstanceOf(WinstonLogger);
        });
    });

    describe('logs correctly at each level', () => {
        it('logs debug message when debug is max level', () => {
            const mockTransport = new MockTransport({});
            const maxLevel: LogLevel = 'debug'; // Needs to be overridden as normally stops at audit so debug is omitted
            const opts: WinstonAdaptorOptions = { customOptions: { transports: mockTransport, level: maxLevel } };

            const uut = new WinstonLogger(opts);

            uut.debug('this', 'is', 'a', 'max level', 'test');

            expect(mockTransport.logMessages[0].message).toEqual('this is a max level test');
        });

        it('logs complete debug messages when debug is max level', () => {
            const mockTransport = new MockTransport({});
            const maxLevel: LogLevel = 'debug'; // Needs to be overridden as normally stops at audit so debug is omitted
            const opts: WinstonAdaptorOptions = { customOptions: { transports: mockTransport, level: maxLevel } };

            const uut = new WinstonLogger(opts);

            uut.debug('this', 'is', 'a', 'test');

            expect(mockTransport.logMessages[0].level).toEqual('debug');
        });

        it('does not log debug message when default max level is used', () => {
            const mockTransport = new MockTransport({});
            const opts: WinstonAdaptorOptions = { customOptions: { transports: mockTransport } };

            const uut = new WinstonLogger(opts);

            uut.debug('this', 'is', 'a', 'test');

            expect(mockTransport.logMessages.length).toEqual(0);
        });

        it('does not log low level messages when max level is set to error', () => {
            const mockTransport = new MockTransport({});
            const opts: WinstonAdaptorOptions = { customOptions: { transports: mockTransport, level: 'error' } };

            const uut = new WinstonLogger(opts);

            uut.debug('this', 'is', 'a', 'test');
            uut.info('this', 'is', 'a', 'test');
            uut.warn('this', 'is', 'a', 'test');

            expect(mockTransport.logMessages.length).toEqual(0);
        });

        describe('level=debug', () => {
            it('logs debug as level=debug', () => {
                const mockTransport = new MockTransport({});
                const maxLevel: LogLevel = 'debug'; // Needs to be overridden as normally stops at audit so debug is omitted
                const opts: WinstonAdaptorOptions = { customOptions: { transports: mockTransport, level: maxLevel } };

                const uut = new WinstonLogger(opts);

                uut.debug();

                expect(mockTransport.logMessages[0].level).toEqual('debug');
            });

            it('logs debug message content as concatenated string', () => {
                const mockTransport = new MockTransport({});
                const maxLevel: LogLevel = 'debug'; // Needs to be overridden as normally stops at audit so debug is omitted
                const opts: WinstonAdaptorOptions = { customOptions: { transports: mockTransport, level: maxLevel } };

                const uut = new WinstonLogger(opts);

                uut.debug('this', 'is', 'a', 'debug', 'test');

                expect(mockTransport.logMessages[0].message).toEqual('this is a debug test');
            });
        });

        describe('level=audit', () => {
            it('logs audit as level=audit', () => {
                const mockTransport = new MockTransport({});
                const opts: WinstonAdaptorOptions = { customOptions: { transports: mockTransport } };

                const uut = new WinstonLogger(opts);

                uut.audit();

                expect(mockTransport.logMessages[0].level).toEqual('audit');
            });

            it('logs audit message content as concatenated string', () => {
                const mockTransport = new MockTransport({});
                const opts: WinstonAdaptorOptions = { customOptions: { transports: mockTransport } };

                const uut = new WinstonLogger(opts);

                uut.info('this', 'is', 'an', 'audit', 'test');

                expect(mockTransport.logMessages[0].message).toEqual('this is an audit test');
            });
        });

        describe('level=info', () => {
            it('logs info as level=info', () => {
                const mockTransport = new MockTransport({});
                const opts: WinstonAdaptorOptions = { customOptions: { transports: mockTransport } };

                const uut = new WinstonLogger(opts);

                uut.info();

                expect(mockTransport.logMessages[0].level).toEqual('info');
            });

            it('logs info message content as concatenated string', () => {
                const mockTransport = new MockTransport({});
                const opts: WinstonAdaptorOptions = { customOptions: { transports: mockTransport } };

                const uut = new WinstonLogger(opts);

                uut.info('this', 'is', 'an', 'info', 'test');

                expect(mockTransport.logMessages[0].message).toEqual('this is an info test');
            });
        });

        describe('level=warn', () => {
            it('logs warn as level=warn', () => {
                const mockTransport = new MockTransport({});
                const opts: WinstonAdaptorOptions = { customOptions: { transports: mockTransport } };

                const uut = new WinstonLogger(opts);

                uut.warn('this', 'is', 'a', 'test');

                expect(mockTransport.logMessages[0].level).toEqual('warn');
            });

            it('logs warn message content as concatenated string', () => {
                const mockTransport = new MockTransport({});
                const opts: WinstonAdaptorOptions = { customOptions: { transports: mockTransport } };

                const uut = new WinstonLogger(opts);

                uut.warn('this', 'is', 'a', 'warn', 'test');

                expect(mockTransport.logMessages[0].message).toEqual('this is a warn test');
            });
        });

        describe('level=error', () => {
            it('logs error with level=error', () => {
                const mockTransport = new MockTransport({});
                const opts: WinstonAdaptorOptions = { customOptions: { transports: mockTransport } };

                const uut = new WinstonLogger(opts);

                uut.error('this', 'is', 'a', 'test');

                expect(mockTransport.logMessages[0].level).toEqual('error');
            });

            it('logs error message content as concatenated string', () => {
                const mockTransport = new MockTransport({});
                const maxLevel: LogLevel = 'error';
                const opts: WinstonAdaptorOptions = { customOptions: { transports: mockTransport, level: maxLevel } };

                const uut = new WinstonLogger(opts);

                uut.error('this', 'is', 'a', 'test');

                expect(mockTransport.logMessages[0].message).toEqual('this is a test');
            });
        });
    });
});
