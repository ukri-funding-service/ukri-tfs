import { boolean, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { GdsErrorMessage } from '../components/errorMessage';

const stories = storiesOf('Components', module);

stories.add('Error message', () => {
    return (
        <GdsErrorMessage
            message={text('Error Message', 'Error')}
            showError={boolean('Show Error', true)}
            name="Error 1"
        />
    );
});
