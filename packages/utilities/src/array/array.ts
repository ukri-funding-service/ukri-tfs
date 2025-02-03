// Filters out the undefined values of an array
export const definedValues = <T>(array: (T | undefined)[]): T[] => {
    return array.filter((item: T | undefined): item is T => item !== undefined);
};

export function createDictionary<K extends keyof Input, Input>(key: K, items: Input[]): Record<string, Input>;
export function createDictionary<K extends keyof Input, Input, Output>(
    key: K,
    items: Input[],
    mapperFn: (input: Input) => Output,
): Record<string, Output>;
/**
 * **createDictionary** takes an array of Input[] type
 * and turns it into a dictionary (hashtable of keys, values)
 * made up the Input object assigned to
 * a chosen key from Input (e.g. Input->id).
 * Takes an optional mapper function to map the dictionary
 * values to desired output value
 *
 * @param {string} key - a key from Input type
 * @param {Input[]} items - array of Input type items
 * @param {(input: Input) => Output} mapperFn - an optional mapper function that will take an Input object and map it to an Output Object
 */
export function createDictionary<K extends keyof Input, Input, Output = Input>(
    key: K,
    items: Input[],
    mapperFn?: (input: Input) => Output,
): Record<string, Input | Output> {
    return items.reduce((dictionary: Record<string, Input | Output>, item: Input) => {
        const currentKey = String(item[key]);

        const mappedItem = mapperFn !== undefined ? mapperFn(item) : item;

        return {
            ...dictionary,
            [currentKey]: mappedItem,
        };
    }, {});
}
