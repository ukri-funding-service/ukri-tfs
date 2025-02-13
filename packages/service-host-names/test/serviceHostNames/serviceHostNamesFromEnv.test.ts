import { ServiceHostNamesFromEnv } from '../../src/serviceHostNamesFromEnv';

enum TestVarNamesEnum {
    XYZ_SERVICE_API = 'XYZ_SERVICE_API',
}

type TestVarNames = `${TestVarNamesEnum}`;

describe('serviceHostNamesFromEnv', () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeAll(() => {
        originalEnv = { ...process.env };
    });

    afterEach(() => {
        process.env = { ...originalEnv };
    });

    it('returns an env var', () => {
        process.env.XYZ_SERVICE_API = 'https://xyz.example.com';

        const serviceHostNames = new ServiceHostNamesFromEnv<TestVarNames>();
        const url = serviceHostNames.getUrl('XYZ_SERVICE_API');
        expect(url.toString()).toEqual('https://xyz.example.com/');
    });

    it('throws if it cannot construct a valid url', () => {
        process.env = {};
        const serviceHostNames = new ServiceHostNamesFromEnv<TestVarNames>();

        try {
            serviceHostNames.getUrl('XYZ_SERVICE_API');
        } catch (e) {
            expect(e).toEqual(new Error('TypeError: Invalid URL var name=XYZ_SERVICE_API, value='));
        }
    });
});
