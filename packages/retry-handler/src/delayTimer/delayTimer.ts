export type IDelayTimer = (iteration: number) => Promise<void>;
export type IDelayTimerBuilder = (durationInSeconds: number, timeoutFunction?: typeof setTimeout) => IDelayTimer;
