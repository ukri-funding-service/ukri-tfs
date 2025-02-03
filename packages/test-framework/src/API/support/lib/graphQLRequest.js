'use strict';

const { GraphQLClient } = require('graphql-request');
const get = require('lodash.get');

import { getOpportunityManagerTfsUserId } from '.';
import { logError, logGraphQLRequest, logGraphQLResponse } from '../logging';

export const graphQLRequest = async function (query, variables) {
    let response;

    const headers = {
        'x-tfsuserid': getOpportunityManagerTfsUserId(),
    };

    const client = new GraphQLClient(process.env.SERVICE_URL, { headers });
    logGraphQLRequest(process.env.SERVICE_URL, headers, query, variables);

    try {
        response = await client.request(query, variables);
        // Manually set response.status as 200 as this is not returned within a successful request.
        response.status = 200;
        logGraphQLResponse(response);
    } catch (err) {
        logError(err);

        if (typeof err.response === 'object') {
            response = {
                status: err.response.status,
                body: get(err.response, `errors[0].message`),
                errno: 'Error',
            };
            // If an error has occurred but the status is 200, update to 500 so error can be caught.
            if (response.status === 200) response.status = 500;
        } else {
            response = {
                status: 500,
                body: err.message,
                errno: err.errno,
            };
        }
    }

    return response;
};
