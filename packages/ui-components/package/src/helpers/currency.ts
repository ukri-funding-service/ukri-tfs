const commaRegex = /\B(?=(\d{3})+(?!\d))/g;

export const displayCurrencyWithoutDecimals = (value: number, addPound?: boolean): string => {
    const poundSign = addPound ? '£' : '';
    return `${poundSign}${Math.round(value)}`.replace(commaRegex, ',');
};

export const displayCurrencyWithOptionalDecimals = (value: number | string, addPound?: boolean): string => {
    const numericValue = Number(value);
    if (Number.isInteger(numericValue)) {
        return displayCurrencyWithoutDecimals(numericValue, addPound);
    }
    return displayCurrencyWithDecimals(numericValue, addPound, 2);
};

export const displayCurrencyWithDecimals = (value: number | string, addPound?: boolean, decimal = 2): string => {
    const numericValue = Number(value);
    const poundSign = addPound ? '£' : '';
    return `${poundSign}${Number(numericValue).toFixed(decimal).replace(commaRegex, ',')}`;
};

export const displayCurrency = (value: number, addPound?: boolean): string => {
    const negativeSign = value < 0 ? '-' : '';
    const poundSign = addPound ? '£' : '';
    const amount = Math.abs(value).toFixed(2);
    const abc = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return `${negativeSign}${poundSign}${abc}`;
};
