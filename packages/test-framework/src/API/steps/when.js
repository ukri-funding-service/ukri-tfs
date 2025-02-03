'use strict';

const { When } = require('@cucumber/cucumber');

import {
    databaseConnectionWithoutSsl,
    restRequestAnyUrl,
    restRequestForUser,
    restRequestSpecifyAcceptVersionHeader,
    restRequestWithCorrelationId,
    restRequestWithoutUserID,
    restRequestWithSpuriousHeaders,
} from '../support/actions';

import { invokeLambda } from '../../shared/lib';
import { inviteChampion } from '../support/actions/inviteChampion';
import { applicationReturnToApplicant } from '../support/actions/applicationStatusChange';

When(
    'I make a {word} request for "{word}" user',
    {
        timeout: 60 * 1000,
    },
    async function (method, userType) {
        this.response = await restRequestForUser(method, userType);
    },
);

When(
    'I make a {word} request without specifying a User ID',
    {
        timeout: 60 * 1000,
    },
    async function (method) {
        this.response = await restRequestWithoutUserID(method);
    },
);

When(
    'I make a {word} request for "{word}" user where spurious {} are added',
    {
        timeout: 60 * 1000,
    },
    async function (method, userType, value) {
        this.response = await restRequestWithSpuriousHeaders(method, userType, value);
    },
);

When(
    'I make a {word} request without specifying a User ID and where spurious {} are added',
    {
        timeout: 60 * 1000,
    },
    async function (method, value) {
        this.response = await restRequestWithSpuriousHeaders(method, '', value);
    },
);

When(
    'I make a {word} request for "{word}" user with accept-version header as {string}',
    {
        timeout: 60 * 1000,
    },
    async function (method, userType, version) {
        this.response = await restRequestSpecifyAcceptVersionHeader(method, userType, version);
    },
);

When(
    'I make a {word} request to {string}',
    {
        timeout: 60 * 1000,
    },
    async function (method, url) {
        this.response = await restRequestAnyUrl(method, url, this.request);
    },
);

When(
    'I make a {word} request to the service',
    {
        timeout: 60 * 1000,
    },
    async function (method) {
        this.response = await restRequestAnyUrl(method, process.env.SERVICE_URL, this.request);
    },
);

When(
    'I make a {word} request as user {string} to {string} with Root correlation id {string} and the Parent id {string}',
    {
        timeout: 60 * 1000,
    },
    async function (method, user, url, root, parent) {
        this.response = await restRequestWithCorrelationId(method, user, url, root, parent, this.request);
    },
);

When('I invoke the {string} lambda - API', function (lambdaName) {
    this.response = { timeStamp: Date.now() };
    invokeLambda(lambdaName);
});

When(
    /^I attempt to connect to the (Admin Services|Application Manager|Opportunity Manager) database without using SSL$/,
    {
        timeout: 60 * 1000,
    },
    async function (database) {
        this.response = await databaseConnectionWithoutSsl(database);
    },
);

When(
    'I invite a champion {string}',
    {
        timeout: 60 * 1000,
    },
    async function (email) {
        this.response = await inviteChampion(process.env.SERVICE_URL, email);
    },
);

When(
    '{string} {string} - {string} returns an application {string}: {string} to {string}',
    {
        timeout: 60 * 1000,
    },
    async function (firstName, lastName, championEmail, applicationNumber, applicationName, email) {
        await applicationReturnToApplicant(
            process.env.SERVICE_URL,
            firstName,
            lastName,
            championEmail,
            applicationName,
            applicationNumber,
            email,
        );
    },
);
