import { expect } from 'chai';
import sinon from 'sinon';
import { shouldApplyMiddleware } from '../../src/middleware/applyMiddleware';

describe('shouldApplyMiddleware tests', () => {
    beforeEach(sinon.restore);

    it('should apply middleware if isApplicable function returns true', () => {
        // given a middleware function
        const middlewareStub = sinon.stub();
        const req = {};
        const res = {};
        const next = () => null;

        // and all routes are applicable to the middleware
        const resultingMiddleware = shouldApplyMiddleware(middlewareStub, () => true);

        // when the wrapper middleware is called
        resultingMiddleware(req, res, next);

        // then the original middleware is called
        expect(middlewareStub.calledOnce).to.be.true;
    });

    it('should not apply middleware if isApplicable function returns false', () => {
        // given a middleware function
        const middlewareStub = sinon.stub();
        const req = {};
        const res = {};
        const next = () => null;

        // and all routes are excluded from the middleware
        const resultingMiddleware = shouldApplyMiddleware(middlewareStub, () => false);

        // when the wrapper middleware is called
        resultingMiddleware(req, res, next);

        // then the original middleware is not called
        expect(middlewareStub.called).to.be.false;
    });
});
