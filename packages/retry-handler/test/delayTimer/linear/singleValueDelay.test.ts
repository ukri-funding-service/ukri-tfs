import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { singleValueDelayTimerBuilder } from '../../../src/delayTimer/linear/singleValueDelayTimer';

describe('packages/retry-handler/delayTimer/linear - singleValueDelayTimer', () => {
    afterEach(() => {
        jest.useRealTimers();
    });
    describe('single value', () => {
        it('finishes executing a single value delay timer', async () => {
            jest.useFakeTimers();
            const delayTimer = singleValueDelayTimerBuilder(123);
            jest.advanceTimersToNextTimerAsync();
            const result = await delayTimer(1);

            //checking that the delay timer has finished executing
            //undefined has no special meaning
            expect(result).toBeUndefined();
            jest.useRealTimers();
        });

        it('correct timeout set', async () => {
            const fakeTimeout: typeof setTimeout = jest.fn() as unknown as typeof setTimeout;
            const delayTimer = singleValueDelayTimerBuilder(123, fakeTimeout);

            delayTimer(1);
            expect(fakeTimeout).toHaveBeenCalledWith(expect.any(Function), 123000);

            delayTimer(2);
            expect(fakeTimeout).toHaveBeenCalledWith(expect.any(Function), 123000);
        });
    });
});
