/* eslint-disable @typescript-eslint/no-explicit-any */
import { Email, EmailService, MockSendStrategy, MockSendStrategyOptions } from '../src';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

before(() => {
    chai.use(sinonChai);
});

describe('EmailService', () => {
    beforeEach(() => {
        sinon.restore();
    });

    it('should call the send strategy with the strategy specifc email', async () => {
        // given
        const options: MockSendStrategyOptions<any, any> = {
            convert: sinon.stub().returnsArg(0),
            send: sinon.stub().returns(Promise.resolve(true)),
        };
        const mockSendStrategy = new MockSendStrategy(options);
        const emailService = new EmailService(mockSendStrategy);

        const fakeEmail: Email = {
            sourceEmail: '',
            sourceDisplayName: '',

            // to
            toAddresses: [''],
            ccAddresses: [''],
            bccAddresses: [''],
            text: 'bar',

            // content
            subject: '',
            html: '',

            // reply
            replyToAddresses: [''],
        };

        // when
        await emailService.send(fakeEmail);

        // then
        expect(options.convert).calledWith(fakeEmail);
        expect(options.send).calledWith(fakeEmail);
    });
});
