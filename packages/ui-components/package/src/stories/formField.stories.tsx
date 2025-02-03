import React from 'react';
import { storiesOf } from '@storybook/react';

import { FormField } from '../components/index';

const stories = storiesOf('Demo', module);

// Update this to be more robust
stories.add('Form Field', () => {
    return (
        <FormField title="Guidance" name="sup" labelHint="hind here">
            <input type="text" />
        </FormField>
    );
});
