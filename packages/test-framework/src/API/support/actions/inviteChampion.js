'use strict';

import { restRequestBuildOptions, restRequest } from '../lib';
const { expect } = require('chai');

export const inviteChampion = async (url, email) => {
    const endpoint = url + '/api/users/job/send-champion-invite-email';

    const body = {
        firstName: 'string',
        lastName: 'string',
        emailAddress: email,
        organisationId: 8,
    };

    const headers = {
        'x-tfsuserid': 'maintainer-a807-11ea-911c-333e061aa004',
        'accept-version': '1.x',
        'Content-Type': 'application/json',
    };

    const variables = { httpRequestUrl: endpoint };
    const options = restRequestBuildOptions('POST', headers, body);
    return restRequest(variables, options);
};

export const getInviteStatus = async (hashValue) => {
    const inviteChampionUrl = process.env.SERVICE_URL + '/api/users/invite/' + hashValue;

    const headers = {
        'x-tfsuserid': 'anon',
        'accept-version': '1.x',
        'Content-Type': 'application/json',
    };

    const variables = { httpRequestUrl: inviteChampionUrl };
    const options = restRequestBuildOptions('GET', headers);
    const response = await restRequest(variables, options);

    expect(response.statusCode).to.equal(200, response.statusMessage);

    return response.body.inviteStatus;
};
