'use strict';

const { expect } = require('chai');

import { graphQLRequest } from '../../../API/support/lib';
import { opportunityManagerGraphQLQueries } from '../../../API/support/queries';

export const setApplicationDates = async (openingDateTime, closingDateTime) => {
    const id = browser.applicationId;

    const variables = {
        id,
        openingDateTime,
        closingDateTime,
    };

    const query = opportunityManagerGraphQLQueries['updateApplicationWorkflowComponent'].replace(
        '{0} {1} ',
        'id openingDateTime closingDateTime',
    );

    const body = {
        query,
        variables: JSON.stringify(variables),
    };

    const response = await graphQLRequest(body.query, body.variables);

    expect(response.status).to.equal(200);

    browser.openingDateTime = openingDateTime;
    browser.closingDateTime = closingDateTime;
};
