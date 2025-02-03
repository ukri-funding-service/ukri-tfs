import { ApplyMiddlewareFn } from '../shouldApplyMiddleware';

/**
 * Returns an ApplyMiddlewareFn function that can be used to dynamically omit middleware from routes
 * @param routes List of routes that should not have middleware applied to them
 */
export const excludeExpressRoutes = (...routes: string[]): ApplyMiddlewareFn => {
    return (req, _res) => !routes.includes(String(req.path));
};
