import React from 'react';
import { Columns } from './columns';

export enum PositionSpacing {
    ONE_THIRD = 'one-third',
    TWO_THIRDS = 'two-thirds',
    ONE_QUARTER = 'one-quarter',
    THREE_QUARTERS = 'three-quarters',
    HALF = 'half',
    FULL = 'full',
}

interface PositionProps {
    spacing: PositionSpacing;
    alignRight?: boolean;
    children: React.ReactNode;
    offset?: number;
}

export const Position = (props: PositionProps): JSX.Element => {
    let className = 'column is-' + props.spacing;
    if (props.offset) {
        className += ` is-offset-${props.offset}`;
    }
    if (props.alignRight) {
        className += ' u-align-right';
    }
    return <div className={className}>{props.children}</div>;
};

export const positionField = (formField: JSX.Element, spacing: PositionSpacing = PositionSpacing.FULL): JSX.Element => (
    <div className="container">
        <Columns>
            <Position spacing={spacing}>{formField}</Position>
        </Columns>
    </div>
);
