import React from 'react';

const addLineBreak = (value: string, index: number, id?: string): JSX.Element => (
    <React.Fragment key={`textWithLineBreaks-${id}-line${index}`}>
        {index === 0 ? null : <br />}
        {value.trim()}
    </React.Fragment>
);

const linesOf = (text: string): string[] =>
    text
        .trim()
        .replace(/(\r\n|\n\r|&lt;br\s*\/?&gt;)/gi, '\n')
        .replace(/[\r]/g, '\n')
        .split('\n');

export const textWithLineBreaks = (text: string, id?: string): JSX.Element => (
    <React.Fragment>{linesOf(text).map((value, index) => addLineBreak(value, index, id))}</React.Fragment>
);
