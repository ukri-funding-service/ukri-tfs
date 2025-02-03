'use strict';

const { expect } = require('chai');

import { setApplicationsToNotSubmitted } from '.';
import { restRequestBuildOptions, restRequest } from '../../../API/support/lib';

export const mockedOpportunityClose = async (opportunityId) => {
    // No 'accept-version' is required in options below as post is to the Mocking Service.
    const options = restRequestBuildOptions('POST', '', '');
    const requestURL = `${process.env['MOCKS_URL']}/admin/api/test-operation/opportunities/{0}/close`;
    const requestVariables = {
        httpRequestUrl: requestURL.replace('{0}', opportunityId),
    };

    const response = await restRequest(requestVariables, options);
    expect(response.statusCode).to.equal(200);

    // would call this for us; but in these tests,
    // we are of course mocking that endpoint, so we have to call this one explicitly as the System user
    // (see ApiMocks/mockData/Person/System.json).
    const notSubmittedResponse = await setApplicationsToNotSubmitted(opportunityId);
    expect(notSubmittedResponse.body).to.have.property('applicationIds');
};
