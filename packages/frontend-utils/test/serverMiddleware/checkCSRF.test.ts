import 'mocha';
import { expect, should, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';
import { NextApiResponse } from 'next';
import { NextApiHandlerWithContext, NextApiRequestWithContext } from '../../src/serverMiddleware/withApiAuthorisation';
import { checkCSRF } from '../../src/serverMiddleware/checkCSRF';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

describe('checkCSRF tests', () => {
    should();
    use(chaiAsPromised);
    use(sinonChai);

    afterEach(() => sinon.restore());

    let request: NextApiRequestWithContext;
    const handler: NextApiHandlerWithContext<void> = async (_req, res) => {
        res.statusCode = 201;
    };
    beforeEach(() => {
        request = new IncomingMessage(new Socket()) as NextApiRequestWithContext;
        request.method = 'POST';
    });

    it('should return Forbidden if request does not have a CSRF token', async () => {
        const response: NextApiResponse = new ServerResponse(request) as unknown as NextApiResponse;

        const apiHandler = checkCSRF(handler);
        response.status = statusCode => {
            response.statusCode = statusCode;
            return response;
        };
        response['send'] = sinon.stub();

        await apiHandler(request, response as NextApiResponse);

        expect(response['send']).to.be.called;
        expect(response.statusCode).to.equal(403);
    });

    it('should return Method not allowed if request is a GET', async () => {
        request.session = {
            props: {
                csrf: {
                    csrfToken: 'abc123',
                },
            },
        };
        request.headers['XSRF-TOKEN'] = 'abc123';
        request.method = 'GET';
        const response: NextApiResponse = new ServerResponse(request) as unknown as NextApiResponse;
        response.status = statusCode => {
            response.statusCode = statusCode;
            return response;
        };
        response['send'] = sinon.stub();

        const apiHandler = checkCSRF(handler);
        await apiHandler(request, response as NextApiResponse);

        expect(response['send']).to.be.called;
        expect(response.statusCode).to.equal(405);
    });

    it('should respond if request does have a CSRF token - uppercase header', async () => {
        request.session = {
            props: {
                csrf: {
                    csrfToken: 'abc123',
                },
            },
        };
        request.headers['XSRF-TOKEN'] = 'abc123';
        const response: NextApiResponse = new ServerResponse(request) as unknown as NextApiResponse;
        response.status = statusCode => {
            response.statusCode = statusCode;
            return response;
        };
        response['send'] = sinon.stub();

        const apiHandler = checkCSRF(handler);
        await apiHandler(request, response as NextApiResponse);

        expect(response.statusCode).to.equal(201);
    });

    it('should respond if request does have a CSRF token - lowercase header', async () => {
        request.session = {
            props: {
                csrf: {
                    csrfToken: 'abc123',
                },
            },
        };
        request.headers['xsrf-token'] = 'abc123';
        const response: NextApiResponse = new ServerResponse(request) as unknown as NextApiResponse;
        response.status = statusCode => {
            response.statusCode = statusCode;
            return response;
        };
        response['send'] = sinon.stub();

        const apiHandler = checkCSRF(handler);
        await apiHandler(request, response as NextApiResponse);

        expect(response.statusCode).to.equal(201);
    });
});
