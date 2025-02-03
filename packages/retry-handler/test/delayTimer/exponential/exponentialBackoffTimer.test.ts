import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { exponentionalBackoffTimerBuilder } from '../../../src/delayTimer/exponential/exponentionalBackoffTimer';

describe('packages/retry-handler/delayTimer/exponential - exponentionalBackoffTimer', () => {
    afterEach(() => {
        jest.useRealTimers();
    });

    describe('exponential value', () => {
        it('finishes executing an exponential backoff timer', async () => {
            jest.useFakeTimers();
            const delayTimer = exponentionalBackoffTimerBuilder(0.2);
            jest.advanceTimersToNextTimerAsync();
            const result = await delayTimer(1);

            //checking that the delay timer has finished executing
            //undefined has no special meaning
            expect(result).toBeUndefined();
            jest.useRealTimers();
        });

        it('correct timeout set', async () => {
            const fakeTimeout: typeof setTimeout = jest.fn() as unknown as typeof setTimeout;
            const delayTimer = exponentionalBackoffTimerBuilder(0.2, fakeTimeout);

            delayTimer(1);
            expect(fakeTimeout).toHaveBeenCalledWith(expect.any(Function), 200);

            delayTimer(2);
            expect(fakeTimeout).toHaveBeenCalledWith(expect.any(Function), 400);

            delayTimer(3);
            expect(fakeTimeout).toHaveBeenCalledWith(expect.any(Function), 800);

            delayTimer(4);
            expect(fakeTimeout).toHaveBeenCalledWith(expect.any(Function), 1600);

            delayTimer(5);
            expect(fakeTimeout).toHaveBeenCalledWith(expect.any(Function), 3200);
        });
    });
});
