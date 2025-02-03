'use strict';

const { expect } = require('chai');

import { restRequest, restRequestBuildHeaders, restRequestBuildOptions } from '../../../API/support/lib';
import { opportunityManagerRestEndpoints, OpportunityManagerRestVariables } from '../../../API/support/queries';

export const opportunitiesClose = async () => {
    const endpoint = opportunityManagerRestEndpoints['close'];
    OpportunityManagerRestVariables.httpRequestUrl = endpoint.replace('{0}', process.env.REST_SERVICE_URL);

    const headers = restRequestBuildHeaders(OpportunityManagerRestVariables.validSystemUserId, 'default');
    const options = restRequestBuildOptions('POST', headers);

    const response = await restRequest(OpportunityManagerRestVariables, options);
    expect(response.statusCode).to.equal(200);
};
