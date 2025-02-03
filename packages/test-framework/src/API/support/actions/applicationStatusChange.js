'use strict';

import { restRequestBuildOptions, restRequest } from '../lib';

export const applicationReturnToApplicant = async (
    url,
    firstName,
    lastName,
    championEmail,
    applicationName,
    applicationNumber,
    email,
) => {
    const endpoint = url + '/api/application/job/send-status-change-notifications/return-to-applicant';

    const body = {
        applicantEmail: email,
        applicantFirstName: 'Applicant',
        applicantLastName: 'ToReceiveReturnToApplicantNotification',
        championFirstName: firstName,
        championLastName: lastName,
        championEmail: championEmail,
        applicationNumber: applicationNumber,
        applicationName: applicationName,
        opportunityCloseTime: '17:30 21 February 2031',
    };

    const headers = {
        // Tfs id for user with Champion role
        'x-tfsuserid': '38cea135-2705-4pe4-91w4-cd33429afj5f',
        'accept-version': '1.x',
        'Content-Type': 'application/json',
    };

    const variables = { httpRequestUrl: endpoint };
    const options = restRequestBuildOptions('POST', headers, body);
    await restRequest(variables, options);
};
