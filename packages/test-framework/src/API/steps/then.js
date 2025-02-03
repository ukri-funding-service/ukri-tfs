'use strict';

const { Then } = require('@cucumber/cucumber');

const { expect, assert } = require('chai');
const get = require('lodash.get');

import { createPaths, findCorrelationID, findLambdaLog } from '../../shared/lib';
import { getInviteStatus } from '../support/actions/inviteChampion';
import { validateAgainstSchema } from '../support/checks';
import { getEmail } from '../support/mailosaur/pollMailosaurInbox';

const paths = createPaths();

const variables = require(paths.framework.api.serviceVariables);

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

let data = [];
let attempts = 10;

async function retry(logMessageRetry, logGroupRetry, tsRetry, main, inverse) {
    if (!data.length > 0 && attempts > 0) {
        --attempts;

        if (attempts !== 9) {
            console.error(`${attempts} Attempts left, found no log. Waiting 10 seconds and retrying.`);
        }
        await delay(10000);
        await main(logMessageRetry, logGroupRetry, tsRetry);
    } else if (attempts === 0) {
        throw new Error(`${logMessageRetry} not found in the log`);
    } else {
        switch (inverse) {
            case 'exist':
                expect(data.length).to.not.equal(0, logMessageRetry + ' not found in ' + logGroupRetry + ' logGroup');
                break;
            case 'not exist':
                expect(data.length).to.equal(0, logMessageRetry + ' not found in ' + logGroupRetry + ' logGroup');
                break;

            default:
                break;
        }
    }
}

Then('the response property {string} contains null', function checkResponseProperty(path) {
    expect(get(this.response.body, path)).to.equals(null, 'value not found');
});

Then('the response property {string} contains not null', function checkResponseProperty(path) {
    expect(get(this.response.body, path)).to.not.equals(null, 'value not found');
});

Then('the response status should be {int}', function checkResponseStatus(status) {
    expect(this.response.statusCode).to.equal(status, this.response.statusMessage);
});

Then('the response body should validate against {word} schema', async function (schemaName) {
    await validateAgainstSchema(this.response.body, schemaName);
});

// The the property "string" will be (only one of these values)
//
// AutoComplete will only complete with the correct VALID options
// This has been done to stop the missuse of this step in API tests.
Then(
    /^the property "([^"]*)?" will be (defined|undefined|present|not present|false|true)/,
    function checkResponseProperty(path, value) {
        switch (value) {
            case 'defined':
                assert.isDefined(get(this.response.body, path), `${path} has not been defined`);
                break;

            case 'undefined':
                assert.isUndefined(get(this.response.body, path), `${path} has been defined`);
                break;

            case 'present':
                assert.exists(get(this.response.body, path), `${path} does not exist`);
                break;

            case 'not present':
                assert.notExists(get(this.response.body, path), `${path} exists in response`);
                break;

            case 'false':
                assert.isFalse(get(this.response.body, path));
                break;

            case 'true':
                assert.isTrue(get(this.response.body, path));
                break;
        }
    },
);

// The the property "string" will be (only one of these values)
//
// AutoComplete will only complete with the correct VALID options
// This has been done to stop the missuse of this step in API tests.
Then(/^the response body property "([^"]*)?" is an (array|object)/, function checkResponseProperty(path, type) {
    switch (type) {
        case 'array':
            assert.isArray(get(this.response.body, path), `${path} is not an array`);
            break;

        case 'object':
            assert.isObject(get(this.response.body, path), `${path} is not an object`);
            break;
    }
});

Then('the response body is an array', function checkResponseProperty() {
    assert.isArray(this.response.body, 'body is not an array');
});

Then('the response body is null', function checkResponseProperty() {
    assert.isNull(this.response.body, 'body is not null');
});

Then('the response property {string} does not exist', function checkResponseProperty(path) {
    expect(get(this.response.body, path)).to.equal(undefined);
});

Then('the response property {string} contains {string}', function checkResponseProperty(path, value) {
    const valueFromResponse = get(this.response.body, path);
    expect(valueFromResponse).to.include(value, `value not found in '${valueFromResponse}'`);
});

Then('the response property {string} matches {string}', function checkResponseProperty(path, regex) {
    expect(get(this.response.body, path)).to.match(RegExp(`${regex}`), 'value not found');
});

Then('the response property {string} is a uuid', function checkResponseProperty(path) {
    const uuidMatcher = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
    expect(get(this.response.body, path)).to.match(uuidMatcher, 'value not a uuid');
});

Then('the response property {string} is {int}', function checkResponseProperty(path, value) {
    expect(get(this.response.body, path)).to.equal(value, 'value not found');
});

Then('the response property {string} is a number', function checkResponseProperty(path) {
    assert.isNumber(get(this.response.body, path));
});

Then('the response property {string} is set to {word}', function checkResponseProperty(path, value) {
    const expectedValue = value === 'true';
    const actualValue = get(this.response.body, path);
    const message = `${path} is ${!expectedValue}`;
    expectedValue ? assert.isTrue(actualValue, message) : assert.isFalse(actualValue, message);
});

Then('the response property {string} contains {string} text', function checkResponseProperty(path, value) {
    const actualValue = get(this.response.body, path);
    expect(actualValue).to.deep.equal(value, 'value not found');
});

Then('the response property {string} contains empty string', function checkResponseProperty(path) {
    expect(get(this.response.body, path)).to.equals('', 'value not found');
});

Then('the response property {string} contains the current date and time', function checkResponseProperty(path) {
    // Converts date / time string supplied in path to milliseconds since epoch.
    // Compares against current milliseconds since epoch and asserts if difference is greater than one second.
    const dateTime = get(this.response.body, path);
    const timeStamp = Date.parse(dateTime);
    const now = Date.now();
    const difference = now - timeStamp;

    assert(difference < 1000, `${path} value ${dateTime} occurred over one second before the current time ${now}`);
});

Then('the response array {string} contains {int} records', function checkResponseProperty(arrayPath, number) {
    const location = get(this.response.body, arrayPath);
    expect(location.length).to.equal(number);
});

Then('the response array contains {int} records', function checkResponseProperty(number) {
    expect(this.response.body.length).to.equal(number);
});

Then('the response record {string} is:', function (recordPath, docString) {
    expect(get(this.response.body, recordPath)).to.be.eql(JSON.parse(docString), 'value not found');
});

Then('the response body is an object', function checkResponseProperty() {
    assert.isObject(this.response.body, 'body is not an object');
});

Then('the response body is true', function checkResponseProperty() {
    assert.isTrue(this.response.body, 'body is not true');
});

Then('the response body is false', function checkResponseProperty() {
    assert.isFalse(this.response.body, 'body is not false');
});

Then('the response body contains {string}', function checkResponse(value) {
    expect(this.response.body).to.contains(value);
});

Then(
    'I expect {string} to {word} in the {string} logGroup',
    {
        timeout: 120000,
    },
    async function (logMessage, inverse, logGroup) {
        const ts = this.response.timeStamp;

        async function main(logMessageMain, logGroupMain, tsMain) {
            data = await findCorrelationID(logMessageMain, logGroupMain, tsMain);
            await retry(logMessageMain, logGroupMain, tsMain);
        }

        await retry(logMessage, logGroup, ts, main, inverse);
    },
);

Then(
    'I expect {string} to {string} in the {string} logGroup with updated parent',
    {
        timeout: 120000,
    },
    async function (logMessage, inverse, logGroup) {
        const ts = this.response.timeStamp;
        logMessage = logMessage + ' Parent:' + variables.currentId;

        async function main(logMessageMain, logGroupMain, tsMain) {
            data = await findCorrelationID(logMessageMain, logGroupMain, tsMain);
            await retry(logMessageMain, logGroupMain, tsMain);
        }

        await retry(logMessage, logGroup, ts, main, inverse);
    },
);

Then(
    'I expect {string} to {word} in the {string} lambda logGroup',
    {
        timeout: 120000,
    },
    async function (logMessage, inverse, logGroup) {
        const ts = this.response.timeStamp;

        async function main(logMessageMain, logGroupMain, tsMain) {
            data = await findLambdaLog(logMessageMain, logGroupMain, tsMain);
            await retry(logMessageMain, logGroupMain, tsMain);
        }

        await retry(logMessage, logGroup, ts, main, inverse);
    },
);

Then(
    'the invitation with hash {string} has status {string}',
    {
        timeout: 120000,
    },
    async (hash, status) => {
        const inviteStatus = await getInviteStatus(hash);
        expect(inviteStatus).to.equals(status, 'Invite status not' + status);
    },
);

Then(
    '{string} receives a notification that {string} {string} submitted {string}: {string}',
    {
        timeout: 120000,
    },
    async (emailAddress, firstName, lastName, applicationNumber, applicationName) => {
        const expectedEmailContent = `${firstName} ${lastName} has sent their application ${applicationNumber}: ${applicationName} to be checked and submitted to UKRI, or returned for editing.`;
        const emailMessage = await getEmail(emailAddress);
        const htmlContent = emailMessage.html.body;
        const textContent = emailMessage.text.body;
        expect(htmlContent).to.include(
            expectedEmailContent,
            `The string "${expectedEmailContent}" not found in html body of application submitted email.`,
        );
        expect(textContent).to.include(
            expectedEmailContent,
            `The string "${expectedEmailContent}" not found in text body of application submitted email.`,
        );
    },
);

Then(
    '{string} receives a notification that {string} {string} - {string} returned {string}: {string}',
    {
        timeout: 120000,
    },
    async (emailAddress, firstName, lastName, championEmail, applicationNumber, applicationName) => {
        const expectedEmailContent = `${firstName} ${lastName} - ${championEmail} - has returned ${applicationNumber}: ${applicationName} for further editing.`;
        const emailMessage = await getEmail(emailAddress);
        const htmlContent = emailMessage.html.body;
        const textContent = emailMessage.text.body;
        expect(htmlContent).to.include(
            expectedEmailContent,
            `The string "${expectedEmailContent}" not found in html body of application submitted email.`,
        );
        expect(textContent).to.include(
            expectedEmailContent,
            `The string "${expectedEmailContent}" not found in text body of application submitted email.`,
        );
    },
);
