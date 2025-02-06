import { storiesOf } from '@storybook/react';
import React from 'react';
import { ExpenditureStatement, ExpenditureStatementFundHeading, ExpenditureTableForm } from '../tfs';

const fundHeading1: ExpenditureStatementFundHeading = {
    amountSpent: 0,
    category: 'Directly allocated',
    fecAmount: 1024.8,
    fecPercentage: 80,
    id: 1,
    paidToDate: 0,
    subcategory: 'Estates',
};
const fundHeading2: ExpenditureStatementFundHeading = {
    amountSpent: 0,
    category: 'Directly allocated',
    fecAmount: 424.8,
    fecPercentage: 60,
    id: 2,
    paidToDate: 0,
    subcategory: 'Staff',
};
const expenditureStatement: ExpenditureStatement = {
    fundHeadings: [fundHeading1, fundHeading2],
    id: 1,
    issuedAt: '2023-07-26T14:09:24.892Z',
    status: 'Submitted',
    type: 'Final',
    activityLog: [],
    deadline: '2023-08-24T14:09:24.892Z',
};

const stories = storiesOf('TFS Components', module);

stories.add('ExpenditureTableForm', () => {
    return (
        <ExpenditureTableForm
            expenditureStatement={expenditureStatement}
            descriptionText={'Here is some decription text'}
            errorMessages={[]}
            editable={true}
        />
    );
});
