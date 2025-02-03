import newrelic from 'newrelic';
describe('tfs-monitoring/monkeyPatch', () => {
    it('calls the monkey patch library for an async function', async () => {
        const startSegmentStub = jest.fn();
        newrelic.startSegment = startSegmentStub;
        const { patchAsyncFunction } = await import('../../src/monkeyPatch/monkeyPatch');
        patchAsyncFunction('name', () => new Promise(resolve => resolve('')));

        expect(startSegmentStub).toHaveBeenCalledTimes(1);
    });
});
