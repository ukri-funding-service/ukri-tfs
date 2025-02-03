import { describe, expect, it, jest } from '@jest/globals';
import { NoopLogger } from '@ukri-tfs/logging';
import { retryFunctionHandler } from '../../src/retryHandler/retryHandler';

class ShouldNotRetryError extends Error {}
class ShouldRetryError extends Error {}

describe('retryHandler', () => {
    it("can't run the function fewer than one times", async () => {
        const retryFunction = jest.fn<() => Promise<void>>();
        const myLogger = new NoopLogger();

        const result = () => retryFunctionHandler(retryFunction, myLogger, 0);

        await expect(result).rejects.toThrowError("Bad argument: 'times' must be greater than 0, but 0 was received.");
        expect(retryFunction).toHaveBeenCalledTimes(0);
    });

    it('should run the function given to it', async () => {
        const retryFunction = jest.fn();
        const myLogger = new NoopLogger();

        await retryFunctionHandler(retryFunction, myLogger, 5);

        expect(retryFunction).toHaveBeenCalled();
    });

    it('retries until the failure limit is reached if the function does not succeed', async () => {
        const retryFunction = jest.fn<() => Promise<void>>().mockRejectedValue(new ShouldRetryError('Mock rejection'));
        const myLogger = new NoopLogger();

        const result = () => retryFunctionHandler(retryFunction, myLogger, 5);

        await expect(result).rejects.toThrowError('Mock rejection');
        expect(retryFunction).toHaveBeenCalledTimes(5);
    });

    it('retries until there is a success within the limit', async () => {
        const retryFunction = jest
            .fn<() => Promise<{ id: number }>>()
            .mockRejectedValueOnce(new Error('Mock rejection'))
            .mockRejectedValueOnce(new Error('Mock rejection'))
            .mockResolvedValue({ id: 745 });
        const myLogger = new NoopLogger();

        const result = await retryFunctionHandler(retryFunction, myLogger, 5);

        expect(result).toEqual({ id: 745 });
    });

    it('does not retry falsey error predicates', async () => {
        const retryFunction = jest
            .fn<() => Promise<{ id: number }>>()
            .mockRejectedValueOnce(new ShouldNotRetryError('Mock rejection'))
            .mockResolvedValue({ id: 745 });
        const myLogger = new NoopLogger();

        const result = () =>
            retryFunctionHandler(retryFunction, myLogger, 5, undefined, async err => err instanceof ShouldRetryError);

        await expect(result).rejects.toThrowError('Mock rejection');
    });

    it('retries specified errors until an unspecified error is reached', async () => {
        const retryFunction = jest
            .fn<() => Promise<{ id: number }>>()
            .mockRejectedValueOnce(new ShouldRetryError('Mock rejection'))
            .mockRejectedValueOnce(new ShouldRetryError('Mock rejection'))
            .mockRejectedValueOnce(new ShouldNotRetryError('Error that should not be retried'))
            .mockRejectedValueOnce(new ShouldRetryError('Mock rejection'));

        const myLogger = new NoopLogger();

        const result = () =>
            retryFunctionHandler(retryFunction, myLogger, 5, undefined, async err => err instanceof ShouldRetryError);
        await expect(result).rejects.toThrowError('Error that should not be retried');
        expect(retryFunction).toHaveBeenCalledTimes(3);
    });

    it('retries any errors if no errors are specified', async () => {
        const retryFunction = jest
            .fn<() => Promise<{ id: number }>>()
            .mockRejectedValueOnce(new ShouldRetryError('Mock rejection'))
            .mockRejectedValueOnce(new ShouldRetryError('Mock rejection'))
            .mockRejectedValueOnce(new ShouldNotRetryError('Mock rejection'))
            .mockRejectedValueOnce(new ShouldRetryError('Mock rejection'))
            .mockResolvedValue({ id: 15251 });

        const myLogger = new NoopLogger();

        const result = await retryFunctionHandler(retryFunction, myLogger, 5);

        expect(result).toEqual({ id: 15251 });
    });

    it('executes a callback if specified', async () => {
        const retryFunction = jest
            .fn<() => Promise<{ id: number }>>()
            .mockRejectedValueOnce(new ShouldRetryError('Mock rejection'))
            .mockResolvedValue({ id: 15251 });

        const myLogger = new NoopLogger();
        const fakeDelayTimer = jest.fn<() => Promise<void>>();

        await retryFunctionHandler(retryFunction, myLogger, 5, fakeDelayTimer);

        expect(fakeDelayTimer).toHaveBeenCalledTimes(1);
    });
});
