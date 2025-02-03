'use strict';

import { restRequestBuildHeaders, restRequestBuildOptions, restRequest } from '../../../API/support/lib';

export const setApplicationsToNotSubmitted = async (opportunityDisplayId) => {
    const opportunityId = Number(opportunityDisplayId.replace('OPP', ''));
    const userId = '5f28cbf1-2e31-4f7b-9dbf-2af650fac50e';

    const variables = {
        httpRequestUrl: `${process.env['SERVICE_URL']}/api/applications/job/set-to-not-submitted`,
    };

    const body = {
        opportunityIds: [opportunityId],
    };

    const headers = restRequestBuildHeaders(userId, 'default');
    const options = restRequestBuildOptions('POST', headers, body);

    const response = await restRequest(variables, options);
    return Promise.resolve(response);
};
