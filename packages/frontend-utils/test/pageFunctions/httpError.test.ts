import { expect } from 'chai';
import { ForbiddenError, HttpError, MethodNotAllowedError, NotFoundError } from '../../src/pageFunctions';

describe('HttpError tests', () => {
    describe('isError() tests', () => {
        it('should return false given a statusCode of 200', () => {
            expect(HttpError.isError(200)).to.be.false;
        });

        it('should return true given a statusCode of 403', () => {
            expect(HttpError.isError(403)).to.be.true;
        });
    });

    describe('instanceof tests', () => {
        it('should be an instanceof HttpError given a new HttpError', () => {
            const error = new HttpError(403, "I'm afraid I can't do that.");
            expect(error).to.be.an.instanceof(HttpError);
        });

        it('should be an instanceof NotFoundError given a new NotFoundError', () => {
            const error = new NotFoundError("I can't find that.");
            expect(error).to.be.an.instanceof(NotFoundError);
        });

        it('should be an instanceof ForbiddenError given a new ForbiddenError', () => {
            const error = new ForbiddenError("You can't see that.");
            expect(error).to.be.an.instanceof(ForbiddenError);
        });

        it('should be an instanceof MethodNotAllowedError given a new MethodNotAllowedError', () => {
            const message = `You can't use that method`;
            const error = new MethodNotAllowedError(message);
            expect(error).to.be.an.instanceof(MethodNotAllowedError);
            expect(error.statusCode).to.eql(405);
            expect(error.message).that.eql(message);
        });
    });
});
