const chai = require('chai');
const expect = chai.expect;

require('mocha');
const sinonChai = require('sinon-chai');

const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('packages/test-framework- API/stepFunctions/givenFunctions', () => {
    const wipeMailStub = sinon.stub().resolves();

    var wipeMailosaurMailbox = { wipeMailTo: wipeMailStub };

    var givenFunctions = proxyquire('../../../src/API/stepFunctions/givenFunctions.js', {
        '../../shared/mailosaur/wipeMailosaurMailbox.js': wipeMailosaurMailbox,
        '@noCallThru': true,
    });

    before(() => {
        chai.use(chaiAsPromised);
        chai.use(sinonChai);
    });

    afterEach(() => {
        sinon.restore();
        wipeMailStub.reset();
    });

    describe('wipeAllEmailsForEmailAddress', () => {
        it('should be callable', async () => {
            await expect(givenFunctions.wipeAllEmailsForEmailAddress('email', 'server')).to.eventually.be.fulfilled;
        });

        it('should call the wipeMailTo function', async () => {
            await givenFunctions.wipeAllEmailsForEmailAddress('email', 'server');
            await expect(wipeMailStub).to.have.been.calledOnceWithExactly('email', 'server');
        });
    });
});
