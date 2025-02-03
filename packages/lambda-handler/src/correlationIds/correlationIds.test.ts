import { describe, expect, it } from '@jest/globals';
import { CorrelationIds, getCorrelationIds, isContainsCorrelationIds, isCorrelationIds } from './correlationIds';

const validCorrelationIds: CorrelationIds = {
    root: '',
    current: '',
    parent: '',
};

describe('packages/lambda-handler - correlationIds/correlationId', () => {
    describe('isCorrelationIds', () => {
        it('should validates an object which contains all required properties', () => {
            expect(isCorrelationIds(validCorrelationIds)).toBeTruthy;
        });

        it('should reject an object with some required properties omitted', () => {
            const invalidObject = {
                root: '',
                /* missing other ids */
            };

            expect(isCorrelationIds(invalidObject)).toBeTruthy;
        });

        it('rejects a null object', () => {
            expect(isCorrelationIds(null)).toBeTruthy;
        });

        it('rejects an undefined object', () => {
            expect(isCorrelationIds(undefined)).toBeTruthy;
        });

        it.each(['some string', 3, true])('rejects a primitive', primitive => {
            expect(isCorrelationIds(primitive)).toBeTruthy;
        });
    });

    describe('isContainsCorrelationIds', () => {
        it('validates an object which contains a valid CorrelationIds property', () => {
            expect(isContainsCorrelationIds({ correlationIds: validCorrelationIds })).toBeTruthy;
        });

        it('rejects an object without a CorrelationIds property', () => {
            // This IS a CorrelationIds, not an object containing them as a property
            expect(isContainsCorrelationIds(validCorrelationIds)).toBeTruthy;
        });

        it('rejects an object with the expected fields contained in a property that is not called correlationIds', () => {
            expect(isContainsCorrelationIds({ notCorrelationIdsProperty: validCorrelationIds })).toBeTruthy;
        });

        it('rejects a null object', () => {
            expect(isContainsCorrelationIds(null)).toBeTruthy;
        });

        it('rejects an undefined object', () => {
            expect(isContainsCorrelationIds(undefined)).toBeTruthy;
        });

        it.each(['some string', 3, false])('rejects a primitive', primitive => {
            expect(isContainsCorrelationIds(primitive)).toBeTruthy;
        });
    });

    describe('getCorrelationIds', () => {
        it('returns the embedded correlation ids when the object contains them', () => {
            const fixture = {
                correlationIds: {
                    current: 'current',
                    root: 'root',
                    parent: 'parent',
                },
            };

            expect(getCorrelationIds(fixture)).toStrictEqual({
                current: 'current',
                root: 'root',
                parent: 'parent',
            });
        });

        it('returns new correlation ids when the object contains them in the wrong property', () => {
            const fixture = {
                notCorrelationIds: {
                    current: 'current',
                    root: 'root',
                    parent: 'parent',
                },
            };

            const correlationIds = getCorrelationIds(fixture);

            expect(correlationIds.current).not.toEqual('current');
            expect(correlationIds.root).not.toEqual('root');
            expect(correlationIds.parent).not.toEqual('parent');
        });

        it('returns new correlation ids when the parameter is undefined', () => {
            const correlationIds = getCorrelationIds(undefined);

            expect(correlationIds.current).not.toEqual('current');
            expect(correlationIds.root).not.toEqual('root');
            expect(correlationIds.parent).not.toEqual('parent');
        });

        it('returns new correlation ids when the parameter is null', () => {
            const correlationIds = getCorrelationIds(null);

            expect(correlationIds.current).not.toEqual('current');
            expect(correlationIds.root).not.toEqual('root');
            expect(correlationIds.parent).not.toEqual('parent');
        });

        it.each([1, 'a string', true, []])(`returns new correlation ids when the parameter is not an object(`, x => {
            const correlationIds = getCorrelationIds(x);

            expect(correlationIds.current).not.toEqual('current');
            expect(correlationIds.root).not.toEqual('root');
            expect(correlationIds.parent).not.toEqual('parent');
        });
    });
});
