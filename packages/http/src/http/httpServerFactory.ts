import http, { RequestListener } from 'http';

export const httpServerFactory = (handler: RequestListener): http.Server => {
    return http.createServer(handler);
};
