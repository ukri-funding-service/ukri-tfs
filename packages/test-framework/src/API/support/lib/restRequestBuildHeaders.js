'use strict';

const fs = require('fs');
const path = require('path');

const ApplicationManagerRestVariables = require('../queries/ApplicationManagerRestVariables');

export const restRequestBuildHeaders = (userType, version) => {
    let tfsUserId;

    const acceptVersion = version === 'default' ? '1.x' : version;

    if (userType === '') {
        return {
            'accept-version': acceptVersion,
        };
    }

    switch (process.env.SERVICE) {
        case 'admin-services':
            const userMappingsFile = path.join(__dirname, '../../../shared/data/adminServicesUserMappings.json');
            const userMappings = fs.readFileSync(userMappingsFile).toString();
            const users = JSON.parse(userMappings);
            const user = users.filter((u) => u.user_role === userType);
            tfsUserId = user.length === 0 ? userType : user[0].tfs_id;
            break;

        case 'application-manager':
            if (userType.match(ApplicationManagerRestVariables.guidRegEx)) {
                tfsUserId = userType;
            } else {
                const amUser = ApplicationManagerRestVariables.usersList.filter(
                    (u) =>
                        u.id === (ApplicationManagerRestVariables.userId || ApplicationManagerRestVariables.personId),
                );
                tfsUserId = userType !== 'anon' ? amUser[0].tfsId : userType;
            }
            break;

        case 'opportunity-manager':
            tfsUserId = userType;
            break;

        case 'expert-review-manager':
            tfsUserId = userType;
            break;

        case 'invite-service':
            tfsUserId = userType;
            break;

        case 'file-management-service':
            tfsUserId = userType;
            break;

        default:
            throw new Error(`Unexpected process.env.SERVICE in restRequestBuildHeaders(): ${process.env.SERVICE}`);
    }

    return {
        'accept-version': acceptVersion,
        'x-tfsuserid': tfsUserId,
    };
};
