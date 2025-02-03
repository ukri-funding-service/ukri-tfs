import { IDelayTimer, IDelayTimerBuilder } from '../delayTimer';

export const singleValueDelayTimerBuilder: IDelayTimerBuilder = (
    durationInSeconds: number,
    timeoutFunction = setTimeout,
): IDelayTimer => {
    const delayTimer: IDelayTimer = async () => {
        return new Promise<void>(resolve => timeoutFunction(resolve, durationInSeconds * 1000));
    };

    return delayTimer;
};
