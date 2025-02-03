import React, { CSSProperties } from 'react';
interface ErrorMessageProps {
    name: string;
    message?: string;
    messages?: string[];
    showError: boolean;
    className?: string;
    style?: CSSProperties;
}

export const GdsErrorMessage: React.FunctionComponent<ErrorMessageProps> = (props: ErrorMessageProps): JSX.Element => {
    const spanProps = {
        className: `govuk-error-message ${props.className ?? ''}`.trim(),
        ...(props.name ? { id: `error_${props.name}` } : {}),
        ...(props.style ? { style: props.style } : {}),
    };
    let errorMessages: string[] = [];
    if (props.messages && props.messages.length > 0) {
        errorMessages = [...props.messages];
    } else if (props.message) {
        errorMessages = [props.message];
    }

    return props.showError ? (
        <span {...spanProps}>
            {errorMessages.map(
                (errorMessage, index): JSX.Element => (
                    <React.Fragment key={`errorMessage${index}`}>
                        <span className="govuk-visually-hidden">Error:</span>
                        <span>{errorMessage}</span>
                        {index !== errorMessages.length - 1 ? <br /> : ''}
                    </React.Fragment>
                ),
            )}
        </span>
    ) : (
        <React.Fragment />
    );
};
