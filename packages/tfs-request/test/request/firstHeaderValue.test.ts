import { describe, expect, it } from '@jest/globals';
import { IncomingMessage } from 'http';
import { Socket } from 'net';
import { firstHeaderValue } from '../../src/request';

describe('First header value tests', () => {
    it('should return undefined given an undefined header', () => {
        const req = new IncomingMessage(new Socket());
        const result = firstHeaderValue(req, 'x-test-header');
        expect(result).toBeUndefined();
    });

    it('should return the argument given a header containing a string value', () => {
        const req = new IncomingMessage(new Socket());
        req.headers['x-test-header'] = 'test';
        const result = firstHeaderValue(req, 'x-test-header');
        expect(result).toEqual('test');
    });

    it('should return undefined given a header containing an empty array value', () => {
        const req = new IncomingMessage(new Socket());
        req.headers['x-test-header'] = [];
        const result = firstHeaderValue(req, 'x-test-header');
        expect(result).toBeUndefined();
    });

    it('should return the first array item given a header value containing a single array item', () => {
        const req = new IncomingMessage(new Socket());
        req.headers['x-test-header'] = ['test'];
        const result = firstHeaderValue(req, 'x-test-header');
        expect(result).toEqual('test');
    });

    it('should return the first array item given a header value containing multiple array items', () => {
        const req = new IncomingMessage(new Socket());
        req.headers['x-test-header'] = ['test', 'again'];
        const result = firstHeaderValue(req, 'x-test-header');
        expect(result).toEqual('test');
    });
});
