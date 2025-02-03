import React from 'react';

interface RelatedItemsProps {
    children: React.ReactNode;
    includeBar?: boolean;
}

export const GdsRelatedItems: React.FunctionComponent<RelatedItemsProps> = (props): JSX.Element => {
    let classes = 'govuk-related-items govuk-related-items--flush';
    if (!props.includeBar) {
        classes += ' --no-bar';
    }
    return (
        <div className={classes} role="complementary">
            {props.children}
        </div>
    );
};
