'use strict';

import { restRequestBuildHeaders, restRequestBuildOptions, restRequest } from '../lib';
import { createPaths } from '../../../shared/lib';
const paths = createPaths();

const variables = require(paths.framework.api.serviceVariables);

export const restRequestWithoutUserID = async (method) => {
    const headers = restRequestBuildHeaders('', 'default');
    const options = restRequestBuildOptions(method, headers, variables.body);
    const response = await restRequest(variables, options);
    return response;
};
