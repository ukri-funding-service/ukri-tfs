'use strict';

import { restRequestBuildOptions, restRequest } from '../lib';
import { getServiceToServiceAccessToken } from '../../../shared';

export const restRequestWithCorrelationId = async (method, user, url, root, parent, request) => {
    let body;

    if (typeof request !== 'undefined' && typeof request.body !== 'undefined') {
        body = JSON.parse(request.body);
    } else {
        body = {};
    }

    const preTimestamp = Date.now();
    const serviceToServiceAccessToken = await getServiceToServiceAccessToken();
    const headers = {
        Authorization: 'Bearer ' + serviceToServiceAccessToken,
        'x-tfsuserid': user,
        'x-rootcorrelationid': root,
        'x-correlationid': parent,
        'accept-version': '1.x',
    };

    const variables = { httpRequestUrl: url };
    const options = restRequestBuildOptions(method, headers, body);
    const response = await restRequest(variables, options);
    response.timeStamp = preTimestamp;

    return response;
};
