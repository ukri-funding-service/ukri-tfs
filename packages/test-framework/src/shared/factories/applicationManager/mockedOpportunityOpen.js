'use strict';

const { expect } = require('chai');

import { restRequestBuildOptions, restRequest } from '../../../API/support/lib';

export const mockedOpportunityOpen = async (opportunityId) => {
    // No 'accept-version' is required in options below as post is to the Mocking Service.
    const options = restRequestBuildOptions('POST', '', '');
    const requestURL = `${process.env['MOCKS_URL']}/admin/api/test-operation/opportunities/{0}/open`;
    const requestVariables = {
        httpRequestUrl: requestURL.replace('{0}', opportunityId),
    };

    const response = await restRequest(requestVariables, options);
    expect(response.body.code).to.equal(200);
};
