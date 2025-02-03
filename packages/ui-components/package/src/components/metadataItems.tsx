import React from 'react';

export interface MetadataItemProps {
    id: string;
    value: number | string;
    description: string;
    className?: string;
    wide?: boolean;
    style?: { [key: string]: string | number };
}

export const MetadataItem: React.FunctionComponent<MetadataItemProps> = (props): JSX.Element => {
    return (
        <div
            id={props.id}
            className={props.wide ? 'application-item__data-item__wide' : 'application-item__data-item'}
            style={props.style}
        >
            <span className="application-item__data-text">
                <dt>{props.description}</dt>
                <dd>
                    <strong>{props.value}</strong>
                </dd>
            </span>
        </div>
    );
};

export const MetadataItems: React.FunctionComponent<{ children: React.ReactNode }> = (props): JSX.Element => {
    return <dl className="application-item__data">{props.children}</dl>;
};
