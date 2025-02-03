import { describe, expect, it } from '@jest/globals';
import { createDictionary, definedValues } from '../../src/array';

describe('array utils', () => {
    describe('definedValues', () => {
        it('should filter to defined values of primitive types', () => {
            const arrayWithUndefinedValues: (number | undefined)[] = [1, 2, undefined, 3, 4, undefined];

            const result = definedValues(arrayWithUndefinedValues);

            expect(result).toEqual([1, 2, 3, 4]);
        });

        it('should filter to defined values of non-primitive types', () => {
            interface NonPrimitive {
                value: string;
            }
            const arrayWithUndefinedValues: (NonPrimitive | undefined)[] = [
                { value: 'ibble' },
                { value: 'obble' },
                undefined,
                { value: 'chocolate' },
                { value: 'bobble' },
                undefined,
            ];

            const result = definedValues(arrayWithUndefinedValues);

            expect(result).toEqual([
                { value: 'ibble' },
                { value: 'obble' },
                { value: 'chocolate' },
                { value: 'bobble' },
            ]);
        });
    });

    describe('create dictionary', () => {
        interface SimpleObject {
            id: number;
            title: string;
            description: string;
        }

        interface SimplerObject {
            title: string;
        }

        it('should create a dictionary', () => {
            const simpleObjectArray: SimpleObject[] = [
                {
                    id: 123,
                    title: 'Item 1',
                    description: 'Lorem ipsum',
                },
                {
                    id: 124,
                    title: 'Item 2',
                    description: 'Lorem ipsum',
                },
                {
                    id: 125,
                    title: 'Item 3',
                    description: 'Lorem ipsum',
                },
                {
                    id: 126,
                    title: 'Item 4',
                    description: 'Lorem ipsum',
                },
                {
                    id: 127,
                    title: 'Item 5',
                    description: 'Lorem ipsum',
                },
            ];

            const dictionary: { [k: number]: SimpleObject } = {
                123: {
                    id: 123,
                    title: 'Item 1',
                    description: 'Lorem ipsum',
                },
                124: {
                    id: 124,
                    title: 'Item 2',
                    description: 'Lorem ipsum',
                },
                125: {
                    id: 125,
                    title: 'Item 3',
                    description: 'Lorem ipsum',
                },
                126: {
                    id: 126,
                    title: 'Item 4',
                    description: 'Lorem ipsum',
                },
                127: {
                    id: 127,
                    title: 'Item 5',
                    description: 'Lorem ipsum',
                },
            };

            const createdDictionary = createDictionary<keyof SimpleObject, SimpleObject>('id', simpleObjectArray);
            expect(createdDictionary).toEqual(dictionary);
        });

        it('should create a dictionary with mapped values', () => {
            const simpleObjectArray: SimpleObject[] = [
                {
                    id: 123,
                    title: 'Item 1',
                    description: 'Lorem ipsum',
                },
                {
                    id: 124,
                    title: 'Item 2',
                    description: 'Lorem ipsum',
                },
                {
                    id: 125,
                    title: 'Item 3',
                    description: 'Lorem ipsum',
                },
                {
                    id: 126,
                    title: 'Item 4',
                    description: 'Lorem ipsum',
                },
                {
                    id: 127,
                    title: 'Item 5',
                    description: 'Lorem ipsum',
                },
            ];

            const dictionary: { [k: number]: { title: string } } = {
                123: {
                    title: 'Item 1 | Lorem ipsum',
                },
                124: {
                    title: 'Item 2 | Lorem ipsum',
                },
                125: {
                    title: 'Item 3 | Lorem ipsum',
                },
                126: {
                    title: 'Item 4 | Lorem ipsum',
                },
                127: {
                    title: 'Item 5 | Lorem ipsum',
                },
            };

            const mapper = (simpleObject: SimpleObject): SimplerObject => {
                return {
                    title: `${simpleObject.title} | ${simpleObject.description}`,
                };
            };

            const createdDictionary = createDictionary('id', simpleObjectArray, mapper);
            expect(createdDictionary).toEqual(dictionary);
        });

        it('should use the latest key element given multiples of key exist', () => {
            const simpleObjectArray: SimpleObject[] = [
                {
                    id: 123,
                    title: 'Item 1',
                    description: 'Lorem ipsum',
                },
                {
                    id: 123,
                    title: 'Item 2',
                    description: 'Lorem ipsum',
                },
                {
                    id: 123,
                    title: 'Item 3',
                    description: 'Lorem ipsum',
                },
                {
                    id: 126,
                    title: 'Item 4',
                    description: 'Lorem ipsum',
                },
            ];

            const dictionary: { [k: number]: SimpleObject } = {
                123: {
                    id: 123,
                    title: 'Item 3',
                    description: 'Lorem ipsum',
                },
                126: {
                    id: 126,
                    title: 'Item 4',
                    description: 'Lorem ipsum',
                },
            };

            const createdDictionary = createDictionary('id', simpleObjectArray);
            expect(createdDictionary).toEqual(dictionary);
        });
    });
});
