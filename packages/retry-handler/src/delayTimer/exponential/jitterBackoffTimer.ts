import { IDelayTimer, IDelayTimerBuilder } from '../delayTimer';
import { getExponentialBackoffInMilliseconds } from './getExponentialBackoffInMilliseconds';

export const jitterBackoffTimerBuilder: IDelayTimerBuilder = (
    durationInSeconds: number,
    timeoutFunction = setTimeout,
): IDelayTimer => {
    const delayTimer: IDelayTimer = async iteration => {
        const durationInMilliseconds = getExponentialBackoffInMilliseconds(iteration, durationInSeconds);

        const baseDurationInMilliseconds = 0.9 * durationInMilliseconds;
        const durationModifier = Math.random() * 0.2 * durationInMilliseconds;
        const durationInMillisecondsWithModifier = baseDurationInMilliseconds + durationModifier;

        return new Promise<void>(resolve => timeoutFunction(resolve, durationInMillisecondsWithModifier));
    };

    return delayTimer;
};
