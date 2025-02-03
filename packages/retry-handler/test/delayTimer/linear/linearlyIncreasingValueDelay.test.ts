import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { linearlyIncreasingValueDelayTimerBuilder } from '../../../src/delayTimer/linear/linearlyIncreasingValueDelayTimer';

describe('packages/retry-handler/delayTimer/linear - linearlyIncreasingValueDelayTimer', () => {
    afterEach(() => {
        jest.useRealTimers();
    });

    describe('linearly increasing value', () => {
        it('finishes executing a linearly increasing value delay timer', async () => {
            jest.useFakeTimers();
            const delayTimer = linearlyIncreasingValueDelayTimerBuilder(1);
            jest.advanceTimersToNextTimerAsync();
            const result = await delayTimer(1);

            //checking that the delay timer has finished executing
            //undefined has no special meaning
            expect(result).toBeUndefined();
            jest.useRealTimers();
        });

        it('correct timeout set', async () => {
            const fakeTimeout: typeof setTimeout = jest.fn() as unknown as typeof setTimeout;
            const delayTimer = linearlyIncreasingValueDelayTimerBuilder(0.5, fakeTimeout);

            delayTimer(1);
            expect(fakeTimeout).toHaveBeenCalledWith(expect.any(Function), 500);

            delayTimer(2);
            expect(fakeTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
        });
    });
});
