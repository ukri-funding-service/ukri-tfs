import React from 'react';

export interface ParagraphProps {
    children: React.ReactNode;
    id?: string;
    shouldUseDangerouslySetInnerHTML?: boolean;
    className?: string;
    testId?: string;
}

export const Paragraph = ({
    children,
    id,
    shouldUseDangerouslySetInnerHTML = false,
    className = '',
    testId,
}: ParagraphProps): React.ReactElement => {
    const defaultClassName = 'govuk-body';
    const usedClassName = className.startsWith(defaultClassName) ? className : `${defaultClassName} ${className}`;
    if (typeof children === 'string' && shouldUseDangerouslySetInnerHTML) {
        return (
            <p
                id={id}
                data-testid={testId}
                className={usedClassName}
                dangerouslySetInnerHTML={{ __html: children || '' }}
            />
        );
    }

    return (
        <p id={id} data-testid={testId} className={usedClassName}>
            {children}
        </p>
    );
};
