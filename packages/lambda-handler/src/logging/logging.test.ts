import { describe, it } from '@jest/globals';
import { NoopLogger } from '@ukri-tfs/logging';
import { generateLogger } from './logging';

describe('logging', () => {
    describe('generateLogger', () => {
        it('should provide a logger that can be called', () => {
            const correlationIds = {
                root: 'someroot',
                current: 'somecurrent',
                parent: 'parent',
            };

            const logger = generateLogger('mylambda', correlationIds, new NoopLogger());

            logger.info('hello');
        });
    });
});
