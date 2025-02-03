'use strict';

import { restRequestBuildHeaders, restRequestBuildOptions, restRequest } from '../lib';
import { createPaths } from '../../../shared/lib';
const paths = createPaths();

const variables = require(paths.framework.api.serviceVariables);

export const restRequestWithSpuriousHeaders = async (method, userType, value) => {
    const headers = restRequestBuildHeaders(userType, 'default');
    const options = restRequestBuildOptions(method, headers, variables.body);

    if (value === 'headers') {
        const spuriousHeader = {
            bobbins: 'true',
        };
        options.headers = {
            ...options.headers,
            ...spuriousHeader,
        };
    }

    if (value === 'query string parameters') variables.httpRequestUrl = `${variables.httpRequestUrl}?bobbins=true`;

    const response = await restRequest(variables, options);
    return response;
};
