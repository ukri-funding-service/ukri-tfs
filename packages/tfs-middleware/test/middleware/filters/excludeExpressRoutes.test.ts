/* eslint @typescript-eslint/no-explicit-any: 0 */
/* disabled to allow switching eslint warnings to errors */
import { expect } from 'chai';
import sinon from 'sinon';
import { excludeExpressRoutes, shouldApplyMiddleware } from '../../../src/middleware/applyMiddleware';

describe('excludeExpressRoutes tests', () => {
    beforeEach(sinon.reset);

    it('should return a function that returns false if the first string equals the second string', () => {
        // given a request to a route
        const req = {
            path: '/test-route',
        };
        const res = sinon.stub();

        // and this route is an excluded route
        const routeMatcher = excludeExpressRoutes('/test-route');

        // when the request is checked
        const result = routeMatcher(req, res);

        // then it is excluded
        expect(result).to.be.false;
    });

    it('should return a function that returns true if the first string does not equal the second string', () => {
        // given a request to a route
        const req = {
            path: '/some-other-route',
        };
        const res = sinon.stub();

        // and a different route is an excluded route
        const routeMatcher = excludeExpressRoutes('/test-route');

        // when the request is checked
        const result = routeMatcher(req, res);

        // then it is not excluded
        expect(result).to.be.true;
    });

    it('should return a function that returns true if none of the first strings equal the second string', () => {
        // given a request to a route
        const req = {
            path: '/incoming-route',
        };
        const res = sinon.stub();

        // and a different set of routes are excluded routes
        const routeMatcher = excludeExpressRoutes('/test-route', '/test-endpoint', '/health');

        // when the request is checked
        const result = routeMatcher(req, res);

        // then it is not excluded
        expect(result).to.be.true;
    });

    it('should return a function that returns false if any of the first strings equal the second string', () => {
        // given a request to a route
        const req = {
            path: '/health',
        };
        const res = sinon.stub();

        // and its one of the excluded routes
        const routeMatcher = excludeExpressRoutes('/test-route', '/test-endpoint', '/health');

        // when the request is checked
        const result = routeMatcher(req, res);

        // then it is excluded
        expect(result).to.be.false;
    });

    it('should return a function that returns true to any route if no exclusion routes were passed into excludeExpressRoutes', () => {
        // given a request to a route
        const req = {
            path: '/any-route',
        };
        const res = sinon.stub();

        // and no routes are excluded
        const routeMatcher = excludeExpressRoutes();

        // when the request is checked
        const result = routeMatcher(req, res);

        // then the request is not excluded
        expect(result).to.be.true;
    });

    it('should return a function that returns true to any route if "null" is passed into excludeExpressRoutes', () => {
        // given a request to a route
        const req = {
            path: '/any-route',
        };
        const res = sinon.stub();

        // and null routes are excluded
        const routeMatcher = excludeExpressRoutes(null as any);

        // when the request is checked
        const result = routeMatcher(req, res);

        // then the request is not excluded
        expect(result).to.be.true;
    });
});

describe('shouldApplyMiddleware using excludeExpressRoutes tests', () => {
    beforeEach(sinon.reset);

    it("should apply middleware if the '/test' endpoint is not passed into excludeExpressRoutes", () => {
        // given a request to a route
        const middlewareStub = sinon.stub();
        const req = {
            path: '/test',
        };
        const res = sinon.stub();
        const next = () => null;

        // and a different route is excluded from applying middleware
        const resultingMiddleware = shouldApplyMiddleware(middlewareStub, excludeExpressRoutes('/some-other-endpont'));

        // when the wrapper middleware is called with the request
        resultingMiddleware(req, res, next);

        // then the original middleware is called
        expect(middlewareStub.calledOnce).to.be.true;
    });

    it("should not apply middleware if the '/test' endpoint is passed into excludeExpressRoutes", () => {
        // given a request to a route
        const middlewareStub = sinon.stub();
        const req = {
            path: '/test',
        };
        const res = sinon.stub();
        const next = () => null;

        // and it is excluded from applying middleware
        const resultingMiddleware = shouldApplyMiddleware(middlewareStub, excludeExpressRoutes('/test'));

        // when the wrapper middleware is called with the request
        resultingMiddleware(req, res, next);

        // then the original middleware is not called
        expect(middlewareStub.called).to.be.false;
    });
});
