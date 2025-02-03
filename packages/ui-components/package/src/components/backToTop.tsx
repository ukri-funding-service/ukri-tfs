import React from 'react';

export interface BackToTopProps {
    target: string;
    text?: string;
    isSticky?: boolean;
}

export const BackToTop = (props: BackToTopProps): JSX.Element => {
    const className = 'govuk-link govuk-link--no-visited-state back-to-top' + (props.isSticky ? '--sticky' : '');

    return (
        <a href={props.target} className={className}>
            <svg
                className="back-to-top__icon"
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="17"
                viewBox="0 0 13 17"
                aria-hidden="true"
                focusable="false"
            >
                <path fill="currentColor" d="M6.5 0L0 6.5 1.4 8l4-4v12.7h2V4l4.3 4L13 6.4z"></path>
            </svg>
            {props.text || 'Back to top'}
        </a>
    );
};
