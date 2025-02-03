import { describe, it } from 'mocha';
import sinon from 'sinon';
import { AppRequest } from '../../src/pageFunctions';
import { FlashStore, FlashServiceInterface } from '../../src/pageFunctions/flashStore';
import { expect } from 'chai';

interface ExampleData {
    count: number;
    name: string;
}

class ExampleStore extends FlashStore<ExampleData> {
    constructor(req: AppRequest, flashService: FlashServiceInterface) {
        super(req, flashService, 'example');
    }
}

describe('Flash store', () => {
    it('should return empty object if flash is empty', () => {
        const request = {} as AppRequest;

        const getFlash = sinon.stub().returns([]);
        const sendFlash = sinon.stub();
        const store = new ExampleStore(request, { sendFlash, getFlash });
        expect(store.data).to.eql({});
    });

    it('should return the last entry if flash has multiple entries', () => {
        const request = {} as AppRequest;

        const getFlash = sinon.stub(() => [
            JSON.stringify({ count: 1 }),
            JSON.stringify({
                count: 2,
                name: 'hello',
            }),
        ]) as FlashServiceInterface['getFlash'];

        const sendFlash = sinon.stub() as FlashServiceInterface['sendFlash'];

        const store = new ExampleStore(request, { sendFlash, getFlash });

        const expectedData = {
            count: 2,
            name: 'hello',
        };
        expect(store.data).to.eql(expectedData);

        expect(sendFlash).to.have.been.calledWith(request, 'example', JSON.stringify(expectedData));
    });

    it('should save updates by merging with existing data', () => {
        const request = {} as AppRequest;

        const getFlash = sinon.stub(() => [
            JSON.stringify({ name: 'test', count: 2 }),
        ]) as FlashServiceInterface['getFlash'];
        const sendFlash = sinon.stub();

        const store = new ExampleStore(request, { sendFlash, getFlash });

        store.save({ count: 3 });
        expect(sendFlash).to.have.been.calledWith(request, 'example', JSON.stringify({ name: 'test', count: 3 }));

        expect(store.data).to.eql({ name: 'test', count: 3 });
    });

    it('should clear data on clear', () => {
        const request = {} as AppRequest;

        const getFlash = sinon.stub(() => [
            JSON.stringify({ name: 'test', count: 2 }),
        ]) as FlashServiceInterface['getFlash'];
        const sendFlash = sinon.stub();

        const store = new ExampleStore(request, { sendFlash, getFlash });

        store.clear();

        expect(sendFlash).to.have.been.calledWith(request, 'example', '{}');

        expect(store.data).to.eql({});
    });
});
