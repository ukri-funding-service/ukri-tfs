import React from 'react';

interface TfsApplicationContentBodyProps {
    text?: string;
    id?: string;
}

const noContent = <p className="govuk-body serif meta">No content has been added.</p>;

export const TfsApplicationContentBody: React.FunctionComponent<TfsApplicationContentBodyProps> = (
    props,
): JSX.Element => {
    let { text } = props;
    if (text && !!text.trim()) {
        if (!text.includes('<')) {
            // HTMLise plain text
            text =
                '<p class="govuk-body">' +
                text
                    .replace(/\r?\n/g, '<br/>')
                    .replace(/\t/g, '&nbsp;'.repeat(4))
                    .replace(/\s\s+/g, m => `${'&nbsp;'.repeat(m.length - 1)} `) +
                '</p>';
        }
        // add the serif class to any existing classes
        text = text.replace(/class=['"]/gi, '$&serif ');
        return <div dangerouslySetInnerHTML={{ __html: text }} />;
    }
    return noContent;
};
