import * as chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import formidable from 'formidable';
import { IncomingMessage } from 'http';
import { Socket } from 'net';
import sinon from 'sinon';
import { collectRequestData } from '../../src/pageFunctions';
import * as csrf from '../../src/pageFunctions/csrf';
import * as multipartFormData from '../../src/pageFunctions/multipartFormData';
import { RequestBuilder } from '../helpers/requestBuilder';

describe('collectRequestData tests', () => {
    chai.should();
    chai.use(chaiAsPromised);

    afterEach(sinon.restore);

    const parsedData = {
        fields: { csrfToken: 'fake' },
        files: {} as unknown as formidable.Files,
    };

    it('should return a 400 Bad Request HttpError given an undefined request', () => {
        const getResult = () => collectRequestData(undefined);

        return expect(getResult()).to.be.rejectedWith('Bad Request').and.eventually.have.property('statusCode', 400);
    });

    it('should return undefined given a GET request', async () => {
        const request = new IncomingMessage(new Socket());
        request.method = 'get';

        const getResult = () => collectRequestData(request);

        return expect(getResult()).to.eventually.be.undefined;
    });

    it('should return a 415 Unsupported Media Type HttpError given request payload of type application/octet-stream', async () => {
        const request = new IncomingMessage(new Socket());
        request.method = 'post';
        request.headers['content-type'] = 'application/octet-stream';

        const getResult = () => collectRequestData(request);

        return expect(getResult())
            .to.be.rejectedWith('Unsupported Media Type')
            .and.eventually.have.property('statusCode', 415);
    });

    it('should return a 403 Forbidden HttpError given request payload of type application/x-www-form-urlencoded without a csrfToken', async () => {
        const request = new IncomingMessage(new Socket());
        request.method = 'post';
        request.headers['content-type'] = 'application/x-www-form-urlencoded';
        request.push(null);

        const getResult = () => collectRequestData(request);

        return expect(getResult()).to.be.rejectedWith('Forbidden').and.eventually.have.property('statusCode', 403);
    });

    it('should return a 403 Forbidden HttpError given request payload of type multipart/form-data without a csrfToken', async () => {
        const request = new IncomingMessage(new Socket());
        request.method = 'post';
        request.headers['content-type'] = 'multipart/form-data';
        request.push(null);

        const getResult = () => collectRequestData(request);

        return expect(getResult()).to.be.rejectedWith('Forbidden').and.eventually.have.property('statusCode', 403);
    });

    it('should return a 403 Forbidden HttpError given request payload of type application/x-www-form-urlencoded with an invalid csrfToken', async () => {
        const request = new IncomingMessage(new Socket());
        request.method = 'post';
        request.headers['content-type'] = 'application/x-www-form-urlencoded';
        request.push('csrfToken=bad');
        request.push(null);

        const getResult = () => collectRequestData(request);

        return expect(getResult()).to.be.rejectedWith('Forbidden').and.eventually.have.property('statusCode', 403);
    });

    it('should return a 403 Forbidden HttpError given request payload of type multipart/form-data with an invalid csrfToken', async () => {
        const request = new IncomingMessage(new Socket());
        request.method = 'post';
        request.headers['content-type'] = 'multipart/form-data';
        request.push('csrfToken=bad');
        request.push(null);

        sinon.stub(multipartFormData, 'parseMultipartFormData').resolves(parsedData);

        const getResult = () => collectRequestData(request);

        return expect(getResult()).to.be.rejectedWith('Forbidden').and.eventually.have.property('statusCode', 403);
    });

    it('should reject with the thrown error if parseMultipartFormData throws', async () => {
        const request = new IncomingMessage(new Socket());
        const expectedError = new Error('Parse failed');
        request.method = 'post';
        request.headers['content-type'] = 'multipart/form-data';

        sinon.stub(multipartFormData, 'parseMultipartFormData').rejects(expectedError);

        const getResult = () => collectRequestData(request);

        return expect(getResult()).to.be.rejectedWith(expectedError);
    });

    it('should return the parsed request body given request payload of type application/x-www-form-urlencoded with a valid csrfToken', async () => {
        const request = new RequestBuilder().withBody([]).build();

        const getResult = () => collectRequestData(request);

        return expect(getResult()).to.eventually.have.property('csrfToken').that.equal('fake');
    });

    it('should return the parsed request body given request payload of type multipart/form-data with a valid csrfToken', async () => {
        const request = new IncomingMessage(new Socket());
        request.method = 'post';
        request.headers['content-type'] = 'multipart/form-data';

        sinon.stub(csrf, 'isCsrfSafe').returns(true);
        sinon.stub(multipartFormData, 'parseMultipartFormData').resolves(parsedData);

        const getResult = () => collectRequestData(request);

        return expect(getResult()).to.eventually.equal(parsedData);
    });
});
