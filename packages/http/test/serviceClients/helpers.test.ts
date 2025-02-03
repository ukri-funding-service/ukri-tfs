import { UserContext } from '@ukri-tfs/auth';
import { NoopLogger } from '@ukri-tfs/logging';
import { getCommonClientHeaders, getCommonClientHeadersForUserId } from '../../src/serviceClients';

describe('packages/http - helpers', () => {
    describe('getCommonClientHeaders', () => {
        it('gets the headers when there is no accessTokenProvicer', async () => {
            const userId = 'userId';
            const userContext: UserContext = {
                service: 'service',
                correlationIds: {
                    root: 'root',
                    parent: 'parent',
                    current: 'current',
                },
                userId,
            };
            const acceptVersion = 'acceptVersion';
            const logger = new NoopLogger();

            const headers = await getCommonClientHeaders(userContext, acceptVersion, logger);

            expect(headers).toEqual({
                Authorization: '',
                'accept-version': acceptVersion,
                'x-correlationid': 'current',
                'x-rootcorrelationid': 'root',
                'x-tfsUserId': userId,
            });
        });
    });

    describe('getCommonClientHeadersForUserId', () => {
        it('gets the headers when there is no accessTokenProvicer', async () => {
            const correlationIds = {
                root: 'root',
                parent: 'parent',
                current: 'current',
            };
            const userId = 'userId';
            const acceptVersion = 'acceptVersion';
            const logger = new NoopLogger();

            const headers = await getCommonClientHeadersForUserId(userId, correlationIds, acceptVersion, logger);

            expect(headers).toEqual({
                Authorization: '',
                'accept-version': acceptVersion,
                'x-correlationid': 'current',
                'x-rootcorrelationid': 'root',
                'x-tfsUserId': userId,
            });
        });
    });
});
