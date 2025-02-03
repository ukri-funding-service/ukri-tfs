'use strict';

import { restRequestBuildHeaders, restRequestBuildOptions, restRequest } from '../lib';
import { createPaths } from '../../../shared/lib';
const paths = createPaths();

const variables = require(paths.framework.api.serviceVariables);

export const restRequestSpecifyAcceptVersionHeader = async (method, userType, version) => {
    switch (process.env.SERVICE) {
        case 'admin-services':
            if (userType === 'Created') {
                userType = variables.tfsid;
            }
            break;

        case 'application-manager':
            if (!userType.match(variables.guidRegEx)) {
                if (variables.userId === '' && variables.personId === '') {
                    const user = variables.usersList.filter((u) => u.roles[0].name === userType);
                    variables.userId = userType === 'anon' ? 'anon' : user[0].id;
                }
            }
            break;

        case 'opportunity-manager':
            break;

        default:
            throw new Error(
                `Unexpected process.env.SERVICE in restRequestSpecifyAcceptVersionHeader(): ${process.env.SERVICE}`,
            );
    }

    const headers = restRequestBuildHeaders(userType, version);
    const options = restRequestBuildOptions(method, headers, variables.body);
    const response = await restRequest(variables, options);
    return response;
};
