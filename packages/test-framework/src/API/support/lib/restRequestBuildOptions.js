'use strict';

export const restRequestBuildOptions = (method, headers, body) => {
    const options = {
        method,
        responseType: 'json',
        https: {
            rejectUnauthorized: false,
        },
    };

    if (typeof headers !== 'undefined' && headers !== '') {
        options.headers = headers;
    }

    if (typeof body === 'undefined' || body === '') body = {};

    if (['POST', 'PUT', 'PATCH'].includes(method)) {
        options['Content-Type'] = 'application/json';
        options.json = body;
    } else {
        options.body = body;
    }

    if (options.body && (method === 'GET' || method === 'DELETE')) delete options.body;

    return options;
};
