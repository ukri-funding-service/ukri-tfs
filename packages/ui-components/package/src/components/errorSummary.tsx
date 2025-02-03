import React from 'react';
import focusAndScrollToError from './focusAndScrollToError';

export interface ErrorSummaryProps {
    errors: ErrorSummary[];
}
export interface ErrorSummary {
    fieldName: string;
    message: string;
    additionalFields?: string[];
}

export class GdsErrorSummary extends React.Component<ErrorSummaryProps, {}> {
    constructor(props: ErrorSummaryProps) {
        super(props);
    }

    render(): JSX.Element {
        return this.props.errors.length < 1 ? (
            <></>
        ) : (
            <div
                className="govuk-error-summary"
                aria-labelledby="error-summary-title"
                role="alert"
                data-module="govuk-error-summary"
            >
                <h2 className="govuk-error-summary__title" id="error-summary-title">
                    There is a problem
                </h2>
                <div className="govuk-error-summary__body">
                    <ul className="govuk-list govuk-error-summary__list">{this.renderList(this.props.errors)}</ul>
                </div>
            </div>
        );
    }

    renderList(errors: ErrorSummary[]): JSX.Element[] {
        return errors.map((error: ErrorSummary, index: number): JSX.Element => {
            return (
                <li key={`errorSummaryItem${index}`}>
                    {error.fieldName !== '' ? (
                        <a href={`#${error.fieldName}`} onClick={focusAndScrollToError} target="_self">
                            {error.message}
                        </a>
                    ) : (
                        <span>{error.message}</span>
                    )}
                </li>
            );
        });
    }
}
