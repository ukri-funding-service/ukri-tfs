/* eslint @typescript-eslint/no-explicit-any: 0 */
/* disabled to allow switching eslint warnings to errors */
import { describe, expect, it } from '@jest/globals';
import { getCorrelationIds, getParentCorrelationId, getRootCorrelationId } from '../../src/request/getCorrelationIds';
import { IncomingMessage } from 'http';

describe('getParentCorrelationId tests', () => {
    it('should get a parent correlation ID from the request', () => {
        // given
        const req = {
            headers: {
                'x-correlationid': 'foo',
            },
        } as unknown as IncomingMessage;

        // when
        const correlationId = getParentCorrelationId(req);

        // then
        expect(correlationId).toEqual('foo');
    });

    it('should return undefined if no parent correlation ID exists on the request', () => {
        // given
        const req = {
            headers: {
                'x-somethingElse': 'bar',
            },
        } as any;

        // when
        const correlationId = getParentCorrelationId(req);

        // then
        expect(correlationId).toBeUndefined();
    });
});

describe('getRootCorrelationId tests', () => {
    it('should get a root correlation ID from the request', () => {
        // given
        const req = {
            headers: {
                'x-rootcorrelationid': 'bar',
            },
        } as unknown as IncomingMessage;

        // when
        const correlationId = getRootCorrelationId(req);

        // then
        expect(correlationId).toEqual('bar');
    });

    it('should return undefined if no root correlation ID exists on the request', () => {
        // given
        const req = {
            headers: {
                'x-somethingElse': 'bar',
            },
        } as unknown as IncomingMessage;

        // when
        const correlationId = getRootCorrelationId(req);

        // then
        expect(correlationId).toBeUndefined();
    });
});

describe('getCorrelationIds tests', () => {
    it('should get all correlation IDs from the request and provide current ID', () => {
        // given
        const req = {
            headers: {
                'x-rootcorrelationid': 'foo',
                'x-correlationid': 'bar',
            },
        } as unknown as IncomingMessage;

        // when
        const correlationIds = getCorrelationIds(req);

        // then
        expect(correlationIds.root).toEqual('foo');
        expect(correlationIds.parent).toEqual('bar');
        expect(correlationIds.current).not.toEqual('foo');
        expect(correlationIds.current).not.toEqual('bar');
    });

    it('should get new correlation IDs when no correlation ids exist on the request', () => {
        // given
        const req = {
            headers: {
                'x-somethingElse': 'foo',
                'x-notPartOfThis': 'bar',
            },
        } as unknown as IncomingMessage;

        // when
        const correlationIds = getCorrelationIds(req);

        // then
        expect(correlationIds.root).not.toEqual('foo');
        expect(correlationIds.root).not.toEqual('bar');

        expect(correlationIds.parent).not.toEqual('foo');
        expect(correlationIds.parent).not.toEqual('bar');

        expect(correlationIds.current).not.toEqual('foo');
        expect(correlationIds.current).not.toEqual('bar');

        // and
        const correlationIdsSet = new Set([correlationIds.current, correlationIds.parent, correlationIds.root]);
        expect(correlationIdsSet.size).toEqual(1);
    });

    it('should throw if root correlation ID exists but parent correlation ID does not', () => {
        // given
        const req = {
            headers: {
                'x-rootcorrelationid': 'foo',
                'x-correlationid': '',
            },
        } as unknown as IncomingMessage;

        // then
        expect(() => getCorrelationIds(req)).toThrow(
            new Error('Inbound request contains x-rootcorrelationid header but x-correlationid header is missing'),
        );
    });

    // TODO: rework once GraphQL is removed and getCorrelationIds is updated.
    it('should not throw if parent correlation ID exists but root correlation ID does not', () => {
        // given
        const req = {
            headers: {
                'x-rootcorrelationid': '',
                'x-correlationid': 'bar',
            },
        } as unknown as IncomingMessage;

        // when
        const result = getCorrelationIds(req);

        // then
        expect(result.parent).toEqual('bar');
        expect(result.root).toEqual('[CORRELATION ID NOT FOUND]');
    });
});
