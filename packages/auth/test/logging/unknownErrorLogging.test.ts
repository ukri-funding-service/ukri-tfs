import { expect } from 'chai';
import { LogWithDescription, LogWithError } from '../../src/logging/formats';
import { logUnknownWithError, logUnknownWithMessage } from '../../src/logging/unknownErrorLogging';

describe('packages/auth - logging/unknownErrorLogging', () => {
    describe('logUnknownWithMessage', () => {
        it('Log with an error that is an error', () => {
            let stub = 'unmodified';

            const loggingFunction: LogWithDescription = async (description: string) => {
                stub = description;
            };

            logUnknownWithMessage(loggingFunction, new Error('error with message'));

            expect(stub).to.equal(': error with message');
        });

        it('Log with an error that is an error with a message prefix', () => {
            let stub = 'unmodified';

            const loggingFunction: LogWithDescription = async (description: string) => {
                stub = description;
            };

            logUnknownWithMessage(loggingFunction, new Error('error with message'), 'prefix');

            expect(stub).to.equal('prefix: error with message');
        });

        it('stringifies unknown errors', () => {
            let stub = 'unmodified';

            const loggingFunction: LogWithDescription = async (description: string) => {
                stub = description;
            };

            const unknownThing: unknown = { weirdThingThatIsNotAnError: 'hello' };

            logUnknownWithMessage(loggingFunction, unknownThing, 'prefix');

            expect(stub).to.equal(`{"weirdThingThatIsNotAnError":"hello"}`);
        });
    });

    describe('logUnknownWithError', () => {
        it('Log with an error that is an error', () => {
            let stub = 'unmodified';

            const loggingFunction: LogWithError = async (error: Error) => {
                stub = error.message;
            };

            logUnknownWithError(loggingFunction, new Error('error with message'));

            expect(stub).to.equal('error with message');
        });

        it('stringifies unknown errors', () => {
            let stub = 'unmodified';

            const loggingFunction: LogWithError = async (error: Error) => {
                stub = error.message;
            };

            const unknownThing: unknown = { weirdThingThatIsNotAnError: 'hello' };

            logUnknownWithError(loggingFunction, unknownThing);

            expect(stub).to.equal(`{"weirdThingThatIsNotAnError":"hello"}`);
        });
    });
});
