// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const isBrowser = (process: any, window: Window & typeof globalThis): boolean => {
    return process['browser'] || typeof window !== 'undefined';
};
