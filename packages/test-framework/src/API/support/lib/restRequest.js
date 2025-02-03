'use strict';

const got = require('got');

import { logError, logRequest, logResponse, logLine } from '../logging';

export const restRequest = async (requestVariables, options) => {
    logRequest(requestVariables, options);

    let returnResponse = {};

    logLine('Options:', options);

    try {
        returnResponse = await got(requestVariables.httpRequestUrl, options);

        logResponse(returnResponse);
    } catch (error) {
        logLine('Error Code:', error.code);

        if (typeof error.response !== 'undefined') {
            returnResponse = error.response;
        } else {
            returnResponse = error;
        }

        if (typeof returnResponse.body === 'string' && returnResponse.body.substring(0, 1) === '{') {
            returnResponse.body = JSON.parse(returnResponse.body);
        }

        logError(returnResponse);
    }

    return returnResponse;
};
