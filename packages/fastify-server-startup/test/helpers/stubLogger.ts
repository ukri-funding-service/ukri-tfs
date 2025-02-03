import { SinonSandbox } from 'sinon';
import { Logger } from '@ukri-tfs/logging';

export const getStubLogger = (sinon: SinonSandbox): Logger => {
    return {
        audit: sinon.stub(),
        debug: sinon.stub(),
        error: sinon.stub(),
        info: sinon.stub(),
        warn: sinon.stub(),
    };
};
