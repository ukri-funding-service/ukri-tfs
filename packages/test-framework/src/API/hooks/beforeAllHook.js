import { getApplicationManagerTfsUserId } from '../support/lib';
import { createPaths } from '../../shared/lib';
const paths = createPaths();

const variables = require(paths.framework.api.serviceVariables);
const usersList = require('../../shared/data/tfsUsers.json').users;

const beforeAllFunction = function () {
    require('../support/lib/common');

    switch (process.env.SERVICE) {
        case 'admin-services':
            break;

        case 'application-manager':
            variables.usersList = getApplicationManagerTfsUserId();
            break;

        case 'invite-service':
            variables.usersList = usersList;
            break;

        case 'opportunity-manager':
            variables.validTestUserId = usersList[0].tfsId;
            variables.validApplicantUserId = usersList[1].tfsId;
            variables.validSystemUserId = usersList[2].tfsId;
            break;

        case 'expert-review-manager':
        case 'file-management-service':
            break;
        default:
            throw new Error(`Unexpected process.env.SERVICE in hooks.js: ${process.env.SERVICE}`);
    }
};

export { beforeAllFunction as beforeAllHook };
