import React, { ReactElement } from 'react';

export const DescriptionText = (props: { text: string }): ReactElement => {
    return (
        <div className="govuk-body-m" data-testid="expenditure-statement-description">
            {props.text}
        </div>
    );
};
