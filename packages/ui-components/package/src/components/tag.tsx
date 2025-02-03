import React from 'react';

export type Colour =
    | 'SOLID'
    | 'GREY'
    | 'GREEN'
    | 'TURQUOISE'
    | 'BLUE'
    | 'LIGHT-BLUE'
    | 'PURPLE'
    | 'PINK'
    | 'RED'
    | 'ORANGE'
    | 'YELLOW';

const colourToClass = (colour: Colour, solid = false) => {
    const solidClass = solid ? 'solid-' : '';

    return `govuk-tag--${solidClass}${colour.toLowerCase()}`;
};

export interface TagProps {
    children: React.ReactNode;
    backgroundColor?: Colour;
    tint?: Colour;
    testId?: string;
    as?: unknown;
    forwardedAs?: unknown;
    theme?: unknown;
    useSolidBackgroundColor?: boolean;
}

export const Tag = (props: TagProps): JSX.Element => {
    const className = ['govuk-tag'];

    if (props.tint && props.tint !== 'SOLID') {
        className.push(colourToClass(props.tint));
    }

    if (props.backgroundColor && props.backgroundColor !== 'SOLID') {
        if (props.useSolidBackgroundColor === false) {
            className.push(colourToClass(props.backgroundColor, false));
        } else {
            className.push(colourToClass(props.backgroundColor, true));
        }
    }

    return (
        <strong className={className.join(' ')} data-testid={props.testId}>
            {props.children}
        </strong>
    );
};
