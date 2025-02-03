import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

import { ConsoleLogger } from '../../../src';
import { SpiedFunction } from 'jest-mock';

describe('logging/loggers - consoleLogger', () => {
    const currentDate = new Date(Date.parse('04 Dec 1995 00:12:00 GMT'));

    let mockLog: SpiedFunction<() => void>;

    beforeEach(() => {
        jest.useFakeTimers({ now: currentDate });
        jest.spyOn(global, 'setTimeout');

        mockLog = jest.spyOn(global.console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.useRealTimers();
        mockLog.mockRestore();
    });

    it('should log warn multiple arguments', () => {
        const logger = new ConsoleLogger(console);

        logger.warn('Hello', 'world!');

        expect(mockLog).toHaveBeenCalledWith('[ warning ] 1995-12-04T00:12:00.000Z: Hello world!');
    });

    it('should log info multiple arguments', () => {
        const logger = new ConsoleLogger(console);

        logger.info('Hello', 'world!');

        expect(mockLog).toHaveBeenCalledWith('[ info ] 1995-12-04T00:12:00.000Z: Hello world!');
    });

    it('should log audit multiple arguments', () => {
        const logger = new ConsoleLogger(console);

        logger.audit('Hello', 'world!');

        expect(mockLog).toHaveBeenCalledWith('[ audit ] 1995-12-04T00:12:00.000Z: Hello world!');
    });

    it('should log debug multiple arguments', () => {
        const logger = new ConsoleLogger(console);

        logger.debug('Hello', 'world!');

        expect(mockLog).toHaveBeenCalledWith('[ debug ] 1995-12-04T00:12:00.000Z: Hello world!');
    });

    it('should log error multiple arguments', () => {
        const logger = new ConsoleLogger(console);

        logger.error('Hello', 'world!');

        expect(mockLog).toHaveBeenCalledWith('[ error ] 1995-12-04T00:12:00.000Z: Hello world!');
    });
});
