import { SnsTopic } from '../../../src/awsChannel';
import { expect } from 'chai';
import sinon from 'sinon';
import 'chai-as-promised';
import { SinonStubbedInstance } from 'sinon';
import { AwsChannelWriter } from '../../../src/awsChannel';
import 'mocha';
import 'sinon-chai';

describe('packages/message-handling - awsChannel/inbound/awsChannelWriter', () => {
    afterEach(sinon.restore);

    let snsTopic: SinonStubbedInstance<SnsTopic>;

    beforeEach(() => {
        snsTopic = sinon.createStubInstance(SnsTopic);
    });

    it('can be instantiated', () => {
        expect(new AwsChannelWriter(snsTopic)).to.exist;
    });

    it('can write', async () => {
        const uut = new AwsChannelWriter(snsTopic);
        snsTopic.publish.resolves();

        await expect(uut.write('hello')).to.eventually.be.fulfilled;
    });

    it('can write expected data', async () => {
        const uut = new AwsChannelWriter(snsTopic);
        snsTopic.publish.resolves();

        await uut.write('hello');

        expect(snsTopic.publish).to.have.been.calledOnceWith('hello');
    });
});
