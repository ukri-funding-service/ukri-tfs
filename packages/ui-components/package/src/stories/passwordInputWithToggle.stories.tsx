import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, text, select } from '@storybook/addon-knobs';

import { PasswordInputWithToggle } from '../components/passwordInputWithToggle';

const stories = storiesOf('Demo', module);

stories.add(
    'Password Input With Toggle',
    () => {
        return (
            <PasswordInputWithToggle
                name="Password"
                placeholder={text('Placeholder', '')}
                defaultValue={text('Preset value', '')}
                hint={text('Form hint', 'Make sure you include the important bits.')}
                widthSize={select('Select custom size', ['', '20', '10', '7', '5', '4', '3', '2'], '')}
                isError={boolean('Error', false)}
            />
        );
    },
    {
        notes: `Custom component that manages show/hide password functionality`,
    },
);
