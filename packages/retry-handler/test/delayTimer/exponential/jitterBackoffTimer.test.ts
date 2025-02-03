import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { jitterBackoffTimerBuilder } from '../../../src/delayTimer/exponential/jitterBackoffTimer';

describe('packages/retry-handler/delayTimer/exponential - jitterBackoffTimer', () => {
    afterEach(() => {
        jest.useRealTimers();
    });

    describe('jitter value', () => {
        it('finishes executing a jitter backoff timer', async () => {
            jest.useFakeTimers();
            const delayTimer = jitterBackoffTimerBuilder(0.2);
            jest.advanceTimersToNextTimerAsync();
            const result = await delayTimer(1);

            //checking that the delay timer has finished executing
            //undefined has no special meaning
            expect(result).toBeUndefined();
            jest.useRealTimers();
        });

        it('correct timeout set', async () => {
            const fakeTimeout: typeof setTimeout = jest.fn() as unknown as typeof setTimeout;
            const delayTimer = jitterBackoffTimerBuilder(0.2, fakeTimeout);
            jest.spyOn(Math, 'random')
                .mockImplementationOnce(() => 0.75) //naughtToTenPercentModifier
                .mockImplementationOnce(() => 0.45) //naughtToTenPercentModifier
                .mockImplementationOnce(() => 0.5); //naughtToTenPercentModifier

            delayTimer(1);
            expect(fakeTimeout).toHaveBeenCalledWith(expect.any(Function), 210);

            delayTimer(2);
            expect(fakeTimeout).toHaveBeenCalledWith(expect.any(Function), 396);

            delayTimer(3);
            expect(fakeTimeout).toHaveBeenCalledWith(expect.any(Function), 800);
        });
    });
});
