'use strict';

import { restRequestBuildOptions, restRequest } from '../lib';

export const restRequestAnyUrl = async (method, url, request) => {
    let body;

    if (typeof request !== 'undefined' && typeof request.body !== 'undefined') {
        body = JSON.parse(request.body);
    } else {
        body = {};
    }

    const headers = {
        'accept-version': '1.x',
    };

    const variables = { httpRequestUrl: url };
    const options = restRequestBuildOptions(method, headers, body);
    const response = await restRequest(variables, options);

    return response;
};
