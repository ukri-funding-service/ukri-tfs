import { array } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { GdsErrorSummary } from '../components/errorSummary';

const stories = storiesOf('Demo', module);

stories.add(
    'Error summary',
    () => {
        const errors = array('Error messages', [
            'Please enter your username',
            'Your password must be at least 8 characters long',
        ]);
        const errorArray = errors.map((x, i) => {
            return { message: x, fieldName: i.toString() };
        });
        return <GdsErrorSummary errors={errorArray} />;
    },
    {
        notes: `This should be displayed between the header, or *< Back to* button (if present, which is highly likely) and the page title (usually and H1, maybe with caption)`,
    },
);
