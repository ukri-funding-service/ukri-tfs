import React from 'react';

interface WarningProps {
    text: string | JSX.Element;
}

export const Warning: React.FunctionComponent<WarningProps> = props => {
    const { text } = props;

    return (
        <div className="govuk-warning-text">
            <span className="govuk-warning-text__icon" aria-hidden="true">
                !
            </span>
            <strong className="govuk-warning-text__text">
                <span className="govuk-warning-text__assistive">Warning</span>
                {text}
            </strong>
        </div>
    );
};
