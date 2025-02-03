import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, text } from '@storybook/addon-knobs';

import { TableCheckbox } from '../components/index';

const stories = storiesOf('Components', module);

stories.add('Table Checkbox', () => (
    <TableCheckbox
        value={text('Checkbox Value', 'my-value')}
        name={text('Checkbox Name', 'my-checkbox')}
        hiddenLabel={text('Hidden Label', 'My hidden label')}
        disabled={boolean('Disabled', false)}
        checked={boolean('Checked', false)}
    />
));
