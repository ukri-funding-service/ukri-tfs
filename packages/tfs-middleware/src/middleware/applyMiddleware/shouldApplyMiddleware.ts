/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type ApplyMiddlewareFn = (req: any, _res: any) => boolean;
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type Middleware = (req: any, res: any, next: () => void) => void;

/**
 * Middleware wrapper that can dynamically apply or omit middleware from routes
 * @param middleware Middleware to apply to the route
 * @param isApplicable Function that decides whether to apply the middlware
 */
export const shouldApplyMiddleware =
    (middleware: Middleware, isApplicable: ApplyMiddlewareFn): Middleware =>
    (req, res, next) => {
        return isApplicable(req, res) ? middleware(req, res, next) : next();
    };
