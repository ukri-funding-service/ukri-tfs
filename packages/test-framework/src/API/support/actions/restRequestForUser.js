'use strict';

import { createPaths } from '../../../shared/lib';
import { restRequest, restRequestBuildHeaders, restRequestBuildOptions } from '../lib';
const paths = createPaths();

const variables = require(paths.framework.api.serviceVariables);

// eslint-disable-next-line complexity
export const restRequestForUser = async (method, userType) => {
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

        case 'expert-review-manager':
            break;

        case 'file-management-service':
            break;

        case 'invite-service':
            const user = variables.usersList.find((u) => u.roles[0].name === userType);
            if (user) {
                userType = user.tfsId;
            }
            break;

        default:
            throw new Error(`Unexpected process.env.SERVICE in when.js: ${process.env.SERVICE}`);
    }

    const headers = restRequestBuildHeaders(userType, 'default');
    const options = restRequestBuildOptions(method, headers, variables.body);
    const response = await restRequest(variables, options);

    switch (process.env.SERVICE) {
        case 'admin-services':
            if (variables.httpRequestUrl.match(/organisations$/gm) && !variables.httpRequestUrl.includes('person')) {
                variables.orgId = response.body[0].id;
                variables.orgPartyIdentifierType = response.body[0].partyIdentifiers[0].type;
                variables.orgPartyIdentifier = response.body[0].partyIdentifiers[0].identifier;
            }

            if (typeof response.body.tfsId !== 'undefined') {
                variables.personId = response.body.personId;
                variables.tfsid = response.body.tfsId;
            }
            break;

        case 'application-manager':
            switch (variables.queryName) {
                case 'newApplication':
                    variables.applicationId = response.body.id;
                    break;
                case 'newApplicationImage':
                    variables.applicationImageId = response.body.uuid;
                    break;
            }
            break;

        case 'opportunity-manager':
            break;

        case 'expert-review-manager':
            break;

        case 'invite-service':
            break;

        case 'file-management-service':
            break;

        default:
            throw new Error(`Unexpected process.env.SERVICE in restRequestForUser(): ${process.env.SERVICE}`);
    }

    return response;
};
