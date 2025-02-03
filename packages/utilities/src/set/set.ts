export const setsAreTheSame = <T>(setOne: Set<T>, setTwo: Set<T>): boolean => {
    const sameSize = setOne.size === setTwo.size;
    const sameItems = [...setOne].every(setOneItem => setTwo.has(setOneItem));

    return sameSize && sameItems;
};

export const containsSubset = <T>(subset: Set<T>, fullSet: Set<T>): boolean => {
    const containsItems = [...subset].every(subsetItem => fullSet.has(subsetItem));

    return containsItems;
};
