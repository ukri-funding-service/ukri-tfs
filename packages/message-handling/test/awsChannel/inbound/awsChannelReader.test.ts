import { expect } from 'chai';
import sinon from 'sinon';
import 'chai-as-promised';
import { SinonStubbedInstance } from 'sinon';
import { SqsQueue } from '../../../src/awsChannel';
import { AwsChannelReader } from '../../../src/awsChannel';

describe('packages/message-handling - awsChannel/inbound/awsChannelReader', () => {
    afterEach(sinon.restore);

    let sqsQueue: SinonStubbedInstance<SqsQueue>;

    beforeEach(() => {
        sqsQueue = sinon.createStubInstance(SqsQueue);
    });

    it('can be instantiated', () => {
        expect(new AwsChannelReader(sqsQueue)).to.exist;
    });

    it('can be read when data is available', async () => {
        const uut = new AwsChannelReader(sqsQueue);
        sqsQueue.receiveAndDecode.resolves(['some data']);

        await expect(uut.read()).to.eventually.be.fulfilled;
    });

    it('can be read when data is not available', async () => {
        const uut = new AwsChannelReader(sqsQueue);
        sqsQueue.receiveAndDecode.resolves([]);

        await expect(uut.read()).to.eventually.be.fulfilled;
    });

    it('can read expected data', async () => {
        const uut = new AwsChannelReader(sqsQueue);
        sqsQueue.receiveAndDecode.resolves(['some data', 'some more data']);

        const result = await uut.read();

        expect(result).to.include.members(['some data', 'some more data']);
    });

    it('returns empty set if no data is available', async () => {
        const uut = new AwsChannelReader(sqsQueue);
        sqsQueue.receiveAndDecode.resolves([]);

        const result = await uut.read();

        expect(result.length).to.equal(0);
    });
});
