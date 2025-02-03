import React, { ReactElement } from 'react';

export type TagSize = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingSize = 'xl' | 'l' | 'm' | 's' | 'xs' | 'no-size-tag';
interface HeadingTextProps {
    text: string | JSX.Element;
    caption?: string;
    size: HeadingSize;
    tag: TagSize;
    className?: string;
    elementName?: string;
    statusLabel?: ReactElement;
    id?: string;
    ['data-testid']?: string;
}

export const HeadingText: React.FunctionComponent<HeadingTextProps> = props => {
    const HeaderTag = props.tag;
    const captioned = props.caption && !(props.size === 's' || props.size === 'xs');
    const headingClass = props.size === 'no-size-tag' ? '' : `govuk-heading-${props.size}`;
    const className = props.className ? `${props.className} ${headingClass}` : headingClass;
    const statusLabel = props.statusLabel;

    return (
        <div>
            {captioned && (
                <span id="header-caption" className={`govuk-caption-${props.size}`}>
                    {props.caption}
                </span>
            )}
            <HeaderTag
                data-name={props.elementName}
                className={className}
                id={props.id}
                data-testid={props['data-testid']}
            >
                {props.text}
                {statusLabel && <span className="govuk-heading--has-tag">{statusLabel}</span>}
            </HeaderTag>
        </div>
    );
};
