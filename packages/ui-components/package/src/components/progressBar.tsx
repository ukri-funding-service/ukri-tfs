import React from 'react';

interface ProgressBarProps {
    prependedHiddenAccessibilityText?: string;
    percentComplete?: number;
    appendedText?: string;
    displayPercentage: boolean;
    id?: string;
    label?: string;
}

export const ProgressBar: React.FunctionComponent<ProgressBarProps> = props => {
    const percentComplete = Math.max(0, Math.min(Math.floor(props.percentComplete || 0), 100));
    const insetStyle = `inset(0% ${100 - percentComplete}% 0% 0%)`;
    const hiddenText = `${props.prependedHiddenAccessibilityText || ''} `.trimLeft();
    const content = props.displayPercentage
        ? `${percentComplete}% ${props.appendedText || ''}`.trim()
        : props.appendedText;

    const customStyling: React.CSSProperties = {
        clipPath: insetStyle,
    };

    const id = props.id ?? 'progress-bar';
    const label = props.label ?? 'Progress bar';
    const labelId = id + '-label';

    return (
        <>
            <div className="progress-meter__text--top" aria-label={content}>
                {content}
            </div>
            <div className="progress-meter" id={id}>
                <label className="govuk-visually-hidden" id={labelId}>
                    {label}
                </label>
                <div
                    className="progress-meter__text progress-meter__text--back"
                    role="progressbar"
                    aria-labelledby={labelId}
                >
                    <span className="govuk-visually-hidden progress-meter__text-back-content-hidden">{hiddenText}</span>
                    <span className="progress-meter__text-back-content">{content}</span>
                </div>
                <div className="progress-meter__clipper" aria-hidden="true" style={customStyling}>
                    <div className="progress-meter__text progress-meter__text--front"> </div>
                </div>
            </div>
        </>
    );
};
