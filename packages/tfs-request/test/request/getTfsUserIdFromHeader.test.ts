import { describe, expect, it } from '@jest/globals';
import { IncomingMessage } from 'http';
import { Socket } from 'net';
import { getTfsUserIdFromHeader } from '../../src/request';

describe('Get TFS User ID from Header tests', () => {
    it('should return undefined given an undefined header', () => {
        const req = new IncomingMessage(new Socket());
        const result = getTfsUserIdFromHeader(req);
        expect(result).toBeUndefined();
    });

    it('should return the argument given a header containing a string value', () => {
        const req = new IncomingMessage(new Socket());
        req.headers['x-tfsuserid'] = 'test';
        const result = getTfsUserIdFromHeader(req);
        expect(result).toEqual('test');
    });

    it('should return undefined given a header containing an empty array value', () => {
        const req = new IncomingMessage(new Socket());
        req.headers['x-tfsuserid'] = [];
        const result = getTfsUserIdFromHeader(req);
        expect(result).toBeUndefined();
    });

    it('should return the first array item given a header value containing a single array item', () => {
        const req = new IncomingMessage(new Socket());
        req.headers['x-tfsuserid'] = ['test'];
        const result = getTfsUserIdFromHeader(req);
        expect(result).toEqual('test');
    });

    it('should return the first array item given a header value containing multiple array items', () => {
        const req = new IncomingMessage(new Socket());
        req.headers['x-tfsuserid'] = ['test', 'again'];
        const result = getTfsUserIdFromHeader(req);
        expect(result).toEqual('test');
    });
});
