const { expect } = require('chai');
require('mocha');
const { getServiceUrl } = require('../../../../src/API/support/messaging/serviceUrl');

describe('packages/test-framework - API/support/messaging/serviceUrl', () => {
    beforeEach(() => {
        delete process.env.SERVICE_URL;
    });

    afterEach(() => {
        delete process.env.SERVICE_URL;
    });

    /* eslint-disable no-restricted-syntax */
    // NOTE: permits valid use of localhost
    it('should return http://127.0.0.1:1234 when SERVICE_URL contains localhost and port is 1234', () => {
        process.env.SERVICE_URL = 'http://localhost';
        expect(getServiceUrl(1234, 'sns')).to.equal('http://127.0.0.1:1234');
    });

    it('should return http://127.0.0.1:1234 when SERVICE_URL contains 127.0.0.1 and port is 1234', () => {
        process.env.SERVICE_URL = 'http://127.0.0.1';
        expect(getServiceUrl(1234, 'sns')).to.equal('http://127.0.0.1:1234');
    });

    it('should return http://sns:1234 when SERVICE_URL does not contain localhost, port is 1234 and service is sns', () => {
        process.env.SERVICE_URL = 'http://nonsense';
        expect(getServiceUrl(1234, 'sns')).to.equal('http://sns:1234');
    });

    it('should return http://sns:1234 when SERVICE_URL does not contain localhost, port is 1234 and service is sqs', () => {
        process.env.SERVICE_URL = 'http://nonsense';
        expect(getServiceUrl(1234, 'sqs')).to.equal('http://sqs:1234');
    });
    /* eslint-enable no-restricted-syntax */

    it('should throw Error if port is undefined', () => {
        expect(() => getServiceUrl(undefined, 'sns')).to.throw(Error);
    });

    it('should throw Error if service is undefined', () => {
        expect(() => getServiceUrl(1234)).to.throw(Error);
    });

    it('should throw Error if port & service is undefined', () => {
        expect(() => getServiceUrl()).to.throw(Error);
    });

    it('should return http://sqs:1234 when no SERVICE_URL is defined, port is 1234 and service is sqs', () => {
        expect(getServiceUrl(1234, 'sqs')).to.equal('http://sqs:1234');
    });

    it('should return http://sns:1234 when no SERVICE_URL is defined, port is 1234 and service is sns', () => {
        expect(getServiceUrl(1234, 'sns')).to.equal('http://sns:1234');
    });
});
